import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RequestBody } from '@/app/types/global';

// Initialize Google AI with environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { prompt, type, image }: RequestBody = await request.json();

    // Select model based on type
    const modelName = type === 'Med Lookup' ? 'gemini-pro-vision' : 'gemini-pro';
    const model = genAI.getGenerativeModel({ model: modelName });

    let result;
    
    if (type === 'Med Lookup' && image) {
      // Handle image analysis for medication lookup
      const imageParts = [
        {
          inlineData: {
            data: image.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
            mimeType: 'image/jpeg',
          },
        },
      ];

      result = await model.generateContent([prompt, ...imageParts]);
    } else if (type === 'Mental & Behavioral Health') {
      // Add specific system prompt for mental health queries
      const systemPrompt = `You are a licensed mental health professional with expertise in child psychology, 
        family therapy, and maternal mental health. Provide empathetic, evidence-based responses while maintaining 
        appropriate professional boundaries. Always include disclaimers about seeking professional help when necessary.`;
      
      result = await model.generateContent([systemPrompt, prompt]);
    } else {
      // Regular queries
      result = await model.generateContent(prompt);
    }

    // Wait for the response and get the text
    const response = await result.response;
    const text = response.text();

    // For now, return an empty array for sources since safetyRatings isn't available
    return NextResponse.json({ 
      text,
      sources: [], // We'll implement proper source tracking in a future update
      type 
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 