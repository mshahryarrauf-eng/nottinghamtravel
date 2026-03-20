// app/utils/tboClient.js
export async function tboFetch(endpoint, body = {}, method = "POST") {
  const username = process.env.TBO_USERNAME;
  const password = process.env.TBO_PASSWORD;

  const basicAuth = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": basicAuth,
    },
  };

  // Agar POST hai tabhi body add karo
  if (method === "POST") {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`http://api.tbotechnology.in/TBOHolidays_HotelAPI/${endpoint}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TBO API Error: ${text}`);
  }

  return res.json();
}
