export const metadata = {
  title: "Special Travel Offers | Exclusive Holiday Deals",
  description:
    "Discover our exclusive travel offers and holiday deals. Save on flights, hotels, and vacation packages — handpicked for your next adventure.",
  keywords: [
    "special travel offers",
    "holiday deals",
    "vacation discounts",
    "exclusive travel packages",
    "limited time offers",
    "flight deals",
    "hotel discounts",
    "travel promotions",
    "holiday packages",
    "special discounts on travel",
  ],
  openGraph: {
    title: "Special Travel Offers | Exclusive Holiday Deals",
    description:
      "Check out our latest special offers and discounted travel packages. Enjoy savings on flights, hotels, and all-inclusive vacations tailored for you.",
    url: "https://yourdomain.com/special-offers",
    siteName: "YourTravelSite",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "https://yourdomain.com/images/special-offers-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Special travel offers banner",
      },
    ],
  },
  alternates: {
    canonical: "https://yourdomain.com/special-offers",
  },
};

import { OfferDetails } from "@/components";

const OfferDetail = () => {
  return <OfferDetails />;
};

export default OfferDetail;
