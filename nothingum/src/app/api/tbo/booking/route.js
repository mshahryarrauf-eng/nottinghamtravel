import { tboFetch } from '@/app/utils/tboClient';

export async function POST(req) {
  try {
    const data = await tboFetch('Book', { req });
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
