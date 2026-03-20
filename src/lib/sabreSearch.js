import { getSabreToken } from "./sabreAuth";

export async function searchFlightsFromSabre(body) {
  const token = await getSabreToken();
console.log(token)
  const originDestinations = [
    {
      DepartureDateTime: body.departureDate,
      OriginLocation: { LocationCode: body.origin },
      DestinationLocation: { LocationCode: body.destination },
    },
  ];

  if (body.tripType === "round" && body.returnDate) {
    originDestinations.push({
      DepartureDateTime: body.returnDate,
      OriginLocation: { LocationCode: body.destination },
      DestinationLocation: { LocationCode: body.origin },
    });
  }

  const res = await fetch(`${process.env.SABRE_BASE_URL}/v5/offers/shop`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      OriginDestinationInformation: originDestinations,
      TravelerInfoSummary: {
        AirTravelerAvail: [
          {
            PassengerTypeQuantity: [
              { Code: "ADT", Quantity: body.passengers.ADT || 1 },
              { Code: "CHD", Quantity: body.passengers.CHD || 0 },
              { Code: "INF", Quantity: body.passengers.INF || 0 },
            ],
          },
        ],
      },
      TravelPreferences: {
        CabinPref: [{ Cabin: body.cabinClass }],
      },
    }),
  });

  return await res.json();
}
