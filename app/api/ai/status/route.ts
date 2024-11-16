import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace this URL with your actual Gemini API health check endpoint
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro?key=' + process.env.GEMINI_API_KEY, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({ status: 'active' });
    } else if (response.status === 429) {
      return NextResponse.json({ status: 'busy' });
    } else {
      return NextResponse.json({ status: 'inactive' });
    }
  } catch {
    return NextResponse.json({ status: 'unavailable' });
  }
}