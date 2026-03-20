export const metadata = {
  title: "Tailor-Made Travel Query | Customize Your Dream Trip",
  description:
    "Create your perfect holiday with our Tailor-Made Travel Query form. Customize destinations, hotels, flights, and activities — our experts will craft a personalized travel plan just for you.",
  keywords: [
    "tailor made travel",
    "custom travel planning",
    "personalized holiday packages",
    "custom tour request",
    "bespoke travel services",
    "travel customization form",
    "build your own trip",
    "tailor made holiday enquiry",
    "custom itinerary planning",
    "personalized trip request",
  ],
  openGraph: {
    title: "Tailor-Made Travel | Personalized Trip Planning",
    description:
      "Plan your journey your way. Submit a Tailor-Made Query and get a custom travel itinerary designed by experts — hotels, flights, and experiences your way.",
    url: "https://yourdomain.com/tailor-made-query",
    siteName: "YourTravelSite",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "https://yourdomain.com/images/tailor-made-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Tailor-made travel planning banner",
      },
    ],
  },
  alternates: {
    canonical: "https://yourdomain.com/tailor-made-query",
  },
};

import { TailorMade } from "@/components";

const TailorMadeQuery = () => {
  return <TailorMade />;
};

export default TailorMadeQuery;
