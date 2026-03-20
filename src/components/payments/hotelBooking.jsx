'use client';
import { useState } from 'react';
import { FaMinusCircle, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { showAlert } from '../common/mixin';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Booking() {
  return (
    <Elements stripe={stripePromise}>
      <BookingForm />
    </Elements>
  );
}

function BookingForm() {
  const [guests, setGuests] = useState([{ title: '', firstName: '', lastName: '', type: 'Adult' }]);
  const [contact, setContact] = useState({ email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const addGuest = () =>
    setGuests([...guests, { title: '', firstName: '', lastName: '', type: 'Adult' }]);
  const removeGuest = i => setGuests(guests.filter((_, idx) => idx !== i));

  const handleGuestChange = (i, f, v) => {
    const updated = [...guests];
    updated[i][f] = v;
    setGuests(updated);
    setErrors(prev => ({ ...prev, [`guest_${i}_${f}`]: '' }));
  };

  const handleContactChange = (f, v) => {
    setContact({ ...contact, [f]: v });
    setErrors(prev => ({ ...prev, [f]: '' }));
  };

  const validateForm = () => {
    const e = {};
    guests.forEach((g, i) => {
      if (!g.title) e[`guest_${i}_title`] = 'Please select a title.';
      if (!g.firstName.trim()) e[`guest_${i}_firstName`] = 'First name is required.';
      if (!g.lastName.trim()) e[`guest_${i}_lastName`] = 'Last name is required.';
    });
    if (!contact.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) e.email = 'Enter a valid email.';
    if (!contact.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\d{10,15}$/.test(contact.phone)) e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const storedRoom = sessionStorage.getItem('bookingDetails');
    const roomData = JSON.parse(storedRoom);
    const room = roomData?.HotelResult?.[0]?.Rooms?.[0];
    const Currency = roomData?.HotelResult?.[0]?.Currency || 'USD';
    if (!storedRoom || !room) {
      console.warn('No room data found!');
      return;
    }

    const payload = {
      BookingCode: room.BookingCode || '',
      TBOReferenceId: room.BookingReferenceId || null,
      OurReferenceId: `OUR-${Date.now()}`,
      Status: 'Pending',
      BookingType: 'Voucher',
      PaymentMode: 'Limit',
      PhoneNumber: contact.phone,
      Email: contact.email,
      Pricing: {
        TotalTBOFare: room.TotalFare || 0,
        TotalTBOTax: room.TotalTax || 0,
        OurMarkupPrice: room.FinalPrice || 0,
        FinalPrice: (room.FinalPrice || 0) + (room.TotalTax || 0),
        Currency: Currency || 'USD',
      },
      CustomerDetails: guests.map(g => ({
        Title: g.title,
        FirstName: g.firstName,
        LastName: g.lastName,
        Type: g.type,
      })),
    };

    setLoading(true);
    try {
      const res = await fetch('/api/payments/hotel-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const { clientSecret } = await res.json();

      if (paymentMethod === 'card' && stripe && elements) {
        const card = elements.getElement(CardNumberElement);
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: `${guests[0].firstName} ${guests[0].lastName}`,
              email: contact.email,
            },
          },
        });

        if (result.error) {
          showAlert('error', result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          const tboBookingPayload = {
            BookingCode: payload.BookingCode,
            CustomerDetails: payload.CustomerDetails.map(g => ({
              CustomerNames: [
                {
                  Title: g.Title,
                  FirstName: g.FirstName,
                  LastName: g.LastName,
                  Type: g.Type,
                },
              ],
            })),
            ClientReferenceId: payload.OurReferenceId,
            ...(payload.TBOReferenceId && { BookingReferenceId: payload.TBOReferenceId }),
            TotalFare: payload.Pricing.TotalTBOFare + payload.Pricing.TotalTBOTax,
            EmailId: payload.Email,
            PhoneNumber: payload.PhoneNumber,
            BookingType: payload.BookingType,
            PaymentMode: payload.PaymentMode,
          };

          console.log('TBO Booking Payload:', tboBookingPayload);
          try {
            const tboRes = await fetch('/api/tbo/booking', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(tboBookingPayload),
            });

            const tboResult = await tboRes.json();
            console.log('TBO Result:', tboResult);
            if (tboRes.ok) {
              showAlert('success', ' booking completed successfully!');
              console.log('TBO Response:', tboResult);
            } else {
              showAlert('error', ` booking failed: ${tboResult.error}`);
              console.error('TBO Error:', tboResult);
            }
          } catch (err) {
            showAlert('error', 'Error while calling TBO API.');
            console.error(' API Error:', err);
          }
        }
      }
    } catch (err) {
      showAlert('error', 'Something went wrong.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-8 rounded-lg text-gray-800"
      noValidate
    >
      {/* ✅ Guest Section (same as before) */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Who's staying?</h2>
        <button
          type="button"
          onClick={addGuest}
          className="text-blue-600 text-sm hover:underline transition-all"
        >
          + Add New Guest
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Guest names must match the valid ID which will be used at check-in.
      </p>

      {guests.map((guest, i) => (
        <div key={i} className="mb-8 border-b border-gray-100 pb-4 last:border-none">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800">Guest {i + 1}</h3>
            {guests.length > 1 && (
              <button type="button" onClick={() => removeGuest(i)}>
                <FaMinusCircle className="text-gray-400 hover:text-red-500 text-lg transition-colors" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Title */}
            <div className="relative">
              <select
                value={guest.title}
                onChange={e => handleGuestChange(i, 'title', e.target.value)}
                className={`peer w-full border ${
                  errors[`guest_${i}_title`] ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-transparent focus:border-blue-500 focus:outline-none py-2 px-3 text-sm`}
              >
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
              <label className="absolute left-3 -top-3 bg-white text-xs text-blue-600 px-1">
                Title *
              </label>
              {errors[`guest_${i}_title`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`guest_${i}_title`]}</p>
              )}
            </div>

            {/* First Name */}
            <div className="relative">
              <input
                type="text"
                value={guest.firstName}
                onChange={e => handleGuestChange(i, 'firstName', e.target.value)}
                className={`peer w-full border ${
                  errors[`guest_${i}_firstName`] ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-transparent focus:border-blue-500 focus:outline-none py-2 px-3 text-sm`}
              />
              <label className="absolute left-3 -top-3 bg-white text-xs text-blue-600 px-1">
                First Name *
              </label>
              {errors[`guest_${i}_firstName`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`guest_${i}_firstName`]}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="relative">
              <input
                type="text"
                value={guest.lastName}
                onChange={e => handleGuestChange(i, 'lastName', e.target.value)}
                className={`peer w-full border ${
                  errors[`guest_${i}_lastName`] ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-transparent focus:border-blue-500 focus:outline-none py-2 px-3 text-sm`}
              />
              <label className="absolute left-3 -top-3 bg-white text-xs text-blue-600 px-1">
                Last Name *
              </label>
              {errors[`guest_${i}_lastName`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`guest_${i}_lastName`]}</p>
              )}
            </div>

            {/* Type */}
            <div className="relative">
              <select
                value={guest.type}
                onChange={e => handleGuestChange(i, 'type', e.target.value)}
                className="peer w-full border border-gray-300 rounded-md bg-transparent focus:border-blue-500 focus:outline-none py-2 px-3 text-sm"
              >
                <option value="">Select</option>
                <option value="Adult">Adult</option>
                <option value="Child">Child</option>
              </select>
              <label className="absolute left-3 -top-3 bg-white text-xs text-blue-600 px-1">
                Type *
              </label>
            </div>
          </div>
        </div>
      ))}

      {/* ✅ Contact Info (same) */}
      <div className="mt-8">
        <h3 className="font-semibold text-gray-800 mb-4">Contact Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative">
            <input
              type="email"
              value={contact.email}
              onChange={e => handleContactChange('email', e.target.value)}
              className={`peer w-full border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md bg-transparent focus:border-blue-500 focus:outline-none py-2 px-3 text-sm`}
            />
            <label className="absolute left-3 -top-3 bg-white text-xs text-blue-600 px-1">
              Email *
            </label>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <input
              type="tel"
              value={contact.phone}
              onChange={e => handleContactChange('phone', e.target.value)}
              className={`peer w-full border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded-md bg-transparent focus:border-blue-500 focus:outline-none py-2 px-3 text-sm`}
            />
            <label className="absolute left-3 -top-3 bg-white text-xs text-blue-600 px-1">
              Phone Number *
            </label>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* ✅ Stripe Payment */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-5">Payment Method</h3>

        <div
          className={`p-4 border rounded-md ${
            paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <input type="radio" checked readOnly />
            <span className="font-medium text-gray-800">Credit/Debit Card</span>
            <FaCcVisa className="text-blue-600 text-xl" />
            <FaCcMastercard className="text-red-500 text-xl" />
          </div>
          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className="border border-gray-300 rounded-md p-3 bg-white">
                <CardNumberElement
                  className="StripeElement"
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#32325d',
                        '::placeholder': { color: '#a0aec0' },
                      },
                      invalid: { color: '#fa755a' },
                    },
                  }}
                />
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <div className="border border-gray-300 rounded-md p-3 bg-white">
                <CardExpiryElement
                  className="StripeElement"
                  options={{
                    style: {
                      base: { fontSize: '16px', color: '#32325d' },
                      invalid: { color: '#fa755a' },
                    },
                  }}
                />
              </div>
            </div>

            {/* CVC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <div className="border border-gray-300 rounded-md p-3 bg-white">
                <CardCvcElement
                  className="StripeElement"
                  options={{
                    style: {
                      base: { fontSize: '16px', color: '#32325d' },
                      invalid: { color: '#fa755a' },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-3 transition"
        >
          {loading ? 'Processing...' : 'Book now'}
        </button>
      </div>
    </form>
  );
}
