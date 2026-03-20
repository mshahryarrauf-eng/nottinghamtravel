
import React from 'react';

export const metadata = {
  title: "Religious Stones | Premium Spiritual & Healing Stones",
  description:
    "Explore our collection of authentic religious stones, crafted for spiritual healing, blessings, and cultural traditions. Discover high-quality stones used for rituals, worship, and meditation.",
  keywords: [
    "religious stones",
    "spiritual stones",
    "healing stones",
    "worship stones",
    "ritual stones",
    "blessing stones",
    "sacred stones",
    "meditation stones",
    "energy stones",
    "natural spiritual stones",
  ],
  openGraph: {
    title: "Religious Stones | Premium Spiritual & Healing Stones",
    description:
      "Shop premium religious and spiritual stones used in blessings, healing, meditation, and traditional rituals. Authentic, natural, and culturally significant stones.",
    url: "https://yourdomain.com/religious-stones",
    siteName: "YourTravelSite",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "https://yourdomain.com/images/religious-stones-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Religious stones collection banner",
      },
    ],
  },
  alternates: {
    canonical: "https://yourdomain.com/religious-stones",
  },
};

import { ReligiousTones } from '@/components'
const ReligiousTone = () => {
    return <ReligiousTones />;
};

export default ReligiousTone;


