'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import LeazyLoading from '@/components/common/lazyLoading';
import { showAlert } from '@/components/common/mixin';
export default function TravelQueryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async data => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tailor-made-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert('success', 'Your query has been submitted successfully!');
        reset();
      } else {
        showAlert('error', `Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error(error);
      showAlert('error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-12 text-center rounded-b-3xl">
        <h1 className="text-4xl font-bold mb-2">Tailor Made Holiday Packages</h1>
        <p className="text-lg">Making Your Dream Holiday Come True...</p>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <LeazyLoading />
        </div>
      )}
      {/* Form Section */}
      {!isLoading && (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-[-2rem] p-8 mb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">First Name</label>
                <input
                  type="text"
                  {...register('firstName', { required: true })}
                  className={`w-full p-3 border rounded ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">First name required</span>
                )}
              </div>
              <div>
                <label className="block font-medium">Last Name</label>
                <input
                  type="text"
                  {...register('lastName', { required: true })}
                  className={`w-full p-3 border rounded ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">Last name required</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Contact Number</label>
                <input
                  type="text"
                  {...register('contact', { required: true })}
                  className={`w-full p-3 border rounded ${
                    errors.contact ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contact && (
                  <span className="text-red-500 text-sm">Contact number required</span>
                )}
              </div>
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className={`w-full p-3 border rounded ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <span className="text-red-500 text-sm">Email required</span>}
              </div>
            </div>

            <div>
              <label className="block font-medium">What Are You Looking For?</label>
              <div className="flex gap-4 mt-2">
                {['Flight Only', 'Hotel Only', 'Package'].map(option => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={option}
                      {...register('lookingFor', {
                        validate: value =>
                          (value && value.length > 0) || 'Select at least one option',
                      })}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.lookingFor && (
                <span className="text-red-500 text-sm">{errors.lookingFor.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Departure Date</label>
                <input
                  type="date"
                  {...register('departureDate', { required: true })}
                  className={`w-full p-3 border rounded ${
                    errors.departureDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.departureDate && (
                  <span className="text-red-500 text-sm">Departure Date is required</span>
                )}
              </div>
              <div>
                <label className="block font-medium">Return Date</label>
                <input
                  type="date"
                  {...register('returnDate')}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Leaving From</label>
                <input
                  type="text"
                  {...register('leavingFrom', { required: true })}
                  className={`w-full p-3 border rounded ${
                    errors.leavingFrom ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.leavingFrom && (
                  <span className="text-red-500 text-sm">Leaving From is required</span>
                )}
              </div>
              <div>
                <label className="block font-medium">Destination</label>
                <input
                  type="text"
                  {...register('destination', { required: true })}
                  className={`w-full p-3 border rounded ${
                    errors.destination ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.destination && (
                  <span className="text-red-500 text-sm">Destination is required</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Preferred Hotel Star Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  {...register('hotelRating')}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Transfers</label>
                <input
                  type="text"
                  {...register('transfers')}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium">Your Message</label>
              <textarea
                {...register('message', { required: true })}
                className={`w-full p-3 border rounded ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
              />
              {errors.message && <span className="text-red-500 text-sm">Message is required</span>}
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded mt-4"
            >
              Send Your Message
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
