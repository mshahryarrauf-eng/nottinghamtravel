export default function FlightResults({ data }) {
  if (!data) return null;

  const itineraries =
    data?.groupedItineraryResponse?.itineraryGroups?.[0]?.itineraries || [];

  return (
    <div>
      {itineraries.map((f, i) => (
        <div key={i} style={{ border: "1px solid #ddd", margin: 10, padding: 10 }}>
          <p>Price: {f.pricingInformation[0].fare.totalFare.totalPrice}</p>
          <p>
            Airline:{" "}
            {f.legs[0].schedules[0].carrier.marketing}
          </p>
        </div>
      ))}
    </div>
  );
}
