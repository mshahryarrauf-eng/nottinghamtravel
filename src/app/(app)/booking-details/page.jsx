export const metadata = {
  title: 'Booking Details | Nothingham Travel',
  description:
    'Review guest and contact details, and confirm your hotel booking easily with Nothingham Travel.',
  keywords: [
    'Nothingham Travel',
    'hotel booking',
    'guest details',
    'travel booking',
    'room reservation',
    'holiday deals',
  ],
  alternates: {
    canonical: 'https://nothinghamtravel.com/booking-details',
  },
  openGraph: {
    title: 'Booking Details | Nothingham Travel',
    description:
      'Complete your hotel booking securely with Nothingham Travel. Review guest details and contact info before confirmation.',
    url: 'https://nothinghamtravel.com/booking-details',
    siteName: 'Nothingham Travel',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Booking Details | Nothingham Travel',
    description:
      'Review guest and contact information before confirming your booking on Nothingham Travel.',
  },
};
import {RoomDetails , HotelBooking} from '@/components';

export default function BookingDetails() {
  return (
    <div className="w-full px-6 py-4 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-2">
      <>
        <HotelBooking />
      </>
      <div className=" rounded-lg  p-2  border border-gray-200  overflow-y-auto max-h-[115vh]">
        <RoomDetails />
      </div>
    </div>
  );
}
