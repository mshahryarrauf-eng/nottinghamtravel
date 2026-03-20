let cachedToken = null;
let tokenExpiry = null;

// Named export
export async function getSabreToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(`${process.env.SABRE_BASE_URL}/v2/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SABRE_CLIENT_ID}:${process.env.SABRE_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return cachedToken;
}
