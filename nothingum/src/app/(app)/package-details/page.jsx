export const metadata = {
  title: 'Package Details | Nothingham Travel',
  description:
    'Explore complete travel package details including destinations, itinerary, inclusions, prices, and availability. Book your perfect trip easily with Nothingham Travel.',
  keywords: [
    'Nothingham Travel',
    'travel package details',
    'package itinerary',
    'package inclusions',
    'package photos',
    'book travel packages online',
    'destination packages',
    'luxury travel packages',
    'budget travel packages',
  ],
  alternates: {
    canonical: 'https://nothinghamtravel.com/package-details',
  },
  openGraph: {
    title: 'Package Details | Nothingham Travel',
    description:
      'View detailed travel package information — destinations, itinerary, inclusions, photos, and prices. Book your perfect trip with Nothingham Travel today.',
    url: 'https://nothinghamtravel.com/package-details',
    siteName: 'Nothingham Travel',
    type: 'website',
    images: [
      {
        url: 'https://nothinghamtravel.com/images/package-details-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Package details banner - Nothingham Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Package Details | Nothingham Travel',
    description:
      'Discover travel package itineraries, inclusions, destinations, and exclusive offers with Nothingham Travel. Book your trip easily online.',
    images: ['https://nothinghamtravel.com/images/package-details-banner.jpg'],
  },
};

import { PackageDetails } from '@/components';

export default function PackagesDetails() {
  return <><PackageDetails /></>;
}
