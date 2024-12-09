import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Ensure the API key is defined
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined');
}

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const { prompt, type, image } = await req.json();

    // Choose the appropriate model based on whether there's an image
    // const modelName = image ? 'gemini-exp-1114'; 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002",});

    let result;
    
    if (image) {
      // Handle image analysis
      const imageParts = [
        {
          inlineData: {
            data: image.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
            mimeType: 'image/jpeg',
          },
        },
      ];
      
      result = await model.generateContent([prompt, ...imageParts]);
    } else {
      // Handle text-only prompts
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });

      result = await chat.sendMessage(prompt);
    }

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      text,
      type,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}