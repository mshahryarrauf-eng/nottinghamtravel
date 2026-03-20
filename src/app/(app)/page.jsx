
export const metadata = {
  title: "Hotels in Nottingham | Book Luxury & Budget Stays Online",
  description:
    "Find and book the best hotels in Nottingham. Compare prices for luxury, budget, and family-friendly stays with free Wi-Fi and exclusive discounts.",
  keywords: [
    "Nottingham hotels",
    "Hotels in Nottingham",
    "Luxury hotels Nottingham",
    "Cheap hotels Nottingham",
    "Book Nottingham accommodation",
    "Hotel deals Nottingham",
    "Family hotels Nottingham",
    "Nottingham city centre hotels",
    "Best hotels near Nottingham University",
    "Online hotel booking Nottingham",
  ],
  openGraph: {
    title: "Best Hotels in Nottingham | Book Online and Save",
    description:
      "Explore top-rated hotels in Nottingham. Get the best deals on luxury, boutique, and budget hotels with instant online booking.",
    url: "https://yourdomain.com/nottingham",
    siteName: "YourTravelSite",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "https://yourdomain.com/images/nottingham-hotels-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Hotels in Nottingham city centre",
      },
    ],
  },
  alternates: {
    canonical: "https://yourdomain.com/nottingham",
  },
};
import {
  WhyUs,
  AirLines,
  AirlinesOffer,
  CountryOffers,
  SearchQueries,
} from "../../components";
const Home = () => {
  return (
    <>
      <SearchQueries />
      <AirLines />
      <WhyUs />
      <AirlinesOffer />
      <CountryOffers />
    </>
  );
};





export default Home;
