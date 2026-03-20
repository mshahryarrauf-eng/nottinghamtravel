export const metadata = {
  title: 'Hotel Details | Nothingham Travel',
  description:
    'Explore complete hotel details including room types, amenities, location, and prices. Book your stay easily with Nothingham Travel for the best experience.',
  keywords: [
    'Nothingham Travel',
    'hotel details',
    'hotel amenities',
    'room information',
    'hotel photos',
    'hotel reviews',
    'book hotels online',
    'hotel location map',
    'luxury hotels',
    'budget hotels',
  ],
  alternates: {
    canonical: 'https://nothinghamtravel.com/hotel-details',
  },
  openGraph: {
    title: 'Hotel Details | Nothingham Travel',
    description:
      'View detailed hotel information — rooms, amenities, photos, and prices. Book your perfect stay with Nothingham Travel today.',
    url: 'https://nothinghamtravel.com/hotel-details',
    siteName: 'Nothingham Travel',
    type: 'website',
    images: [
      {
        url: 'https://nothinghamtravel.com/images/hotel-details-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Hotel details banner - Nothingham Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Details | Nothingham Travel',
    description:
      'Discover hotel amenities, rooms, and exclusive offers with Nothingham Travel. Book your stay easily online.',
    images: ['https://nothinghamtravel.com/images/hotel-details-banner.jpg'],
  },
};
import { HotelDetails } from '@/components'
export default function HotelsDetails() {
  return  <> <HotelDetails /></>;
}
