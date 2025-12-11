import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  // Mock handler: log and return success
  console.info('Contact submission', data);

  return NextResponse.json(
    {
      status: 'ok',
      message: 'Мы получили вашу заявку. Ответим в течение рабочего дня.',
    },
    { status: 200 }
  );
}
