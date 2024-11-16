import { NextResponse } from 'next/server';

// GET handler for Next.js App Router API route
export async function GET() {
  return NextResponse.json({ message: 'Hello from AI command route!' });
}

// POST handler for Next.js App Router API route 
export async function POST(request: Request) {
  try {
    const data = await request.json();
    return NextResponse.json({ message: 'Success', data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 400 }
    );
  }
}
