import { demoVictimDetection } from '../data/roverControlData';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

const PROMPT = `You are an AI assistant analyzing a rescue rover camera frame from an underground mine or emergency site.
Analyze any visible people in the frame:
1. Count the number of visible people.
2. Flag any individuals who appear to be in distress, such as lying down, unconscious, immobile, trapped, or incapacitated.
3. Label them strictly as "Possible Injured" or "Possible Victims" without claiming medical diagnosis.
4. Estimate an overall confidence percentage.

Respond with ONLY valid JSON with this exact schema:
{
  "peopleDetected": <integer>,
  "possibleInjured": <integer>,
  "confidence": "<percentage string, e.g. 92%>"
}`;

function getGeminiApiKey() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env['\uFEFFVITE_GEMINI_API_KEY'];
  return (apiKey || '').replace(/^["']|["']$/g, '').trim();
}

/**
 * Extracts base64 payload from an HTMLImageElement, data URL, or remote URL.
 */
async function extractImagePayload(imageSource) {
  if (!imageSource) return null;

  // 1. Data URL
  if (typeof imageSource === 'string' && imageSource.startsWith('data:image')) {
    const match = imageSource.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) return { mimeType: match[1], data: match[2] };
  }

  // 2. HTMLImageElement via canvas
  if (typeof HTMLImageElement !== 'undefined' && imageSource instanceof HTMLImageElement) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = imageSource.naturalWidth || imageSource.width || 640;
      canvas.height = imageSource.naturalHeight || imageSource.height || 360;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageSource, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) return { mimeType: match[1], data: match[2] };
    } catch {
      // Canvas reading restricted (e.g. cross-origin)
    }
  }

  // 3. Remote URL via fetch
  if (typeof imageSource === 'string') {
    try {
      const res = await fetch(imageSource, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const match = (reader.result || '').match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
            resolve(match ? { mimeType: match[1], data: match[2] } : null);
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      }
    } catch {
      // Remote fetch restricted
    }
  }

  return null;
}

/**
 * Analyzes a camera frame using Gemini Vision API with demo fallback.
 * @param {HTMLImageElement|string} imageSource
 * @returns {Promise<{peopleDetected: number, possibleInjured: number, confidence: string, isFallback: boolean}>}
 */
export async function analyzeFrame(imageSource) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY is not configured. Using demo fallback data.');
    return { ...demoVictimDetection, isFallback: true };
  }

  try {
    const payload = await extractImagePayload(imageSource);

    if (!payload) {
      console.warn('Unable to extract image frame data. Using demo fallback.');
      return { ...demoVictimDetection, isFallback: true };
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT },
              {
                inlineData: {
                  mimeType: payload.mimeType,
                  data: payload.data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}: ${response.statusText}`);
    }

    const resultData = await response.json();
    const candidateParts = resultData.candidates?.[0]?.content?.parts || [];
    const textPart = candidateParts.find((p) => p.text && !p.thought) || candidateParts.find((p) => p.text);
    const rawText = textPart?.text;
    if (!rawText) {
      throw new Error('No content received from Gemini Vision');
    }

    const parsed = JSON.parse(rawText);

    return {
      peopleDetected: Number(parsed.peopleDetected) || 0,
      possibleInjured: Number(parsed.possibleInjured) || 0,
      confidence: parsed.confidence || '90%',
      isFallback: false,
    };
  } catch (error) {
    console.error('Gemini Vision analysis failed, using demo fallback:', error);
    return { ...demoVictimDetection, isFallback: true };
  }
}


/**
 * Sends a text request to the AI Safety Agent.
 * Uses the same Gemini API key as victim detection.
 */
export async function askSafetyAgent(message, context = {}) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      text: 'AI key is not configured. Add VITE_GEMINI_API_KEY to .env.local and restart the Vite server.',
      isFallback: true,
    };
  }

  const contextText = [
    context.ch4 != null ? `CH4: ${context.ch4}` : null,
    context.co != null ? `CO: ${context.co}` : null,
    context.temperature != null ? `Temperature: ${context.temperature}` : null,
    context.humidity != null ? `Humidity: ${context.humidity}` : null,
    context.battery != null ? `Battery: ${context.battery}` : null,
    context.speed != null ? `Speed: ${context.speed}` : null,
    context.obstacleDistance != null ? `Obstacle distance: ${context.obstacleDistance}` : null,
  ].filter(Boolean).join(', ');

  const prompt = `You are the AI Safety Agent for a mine rescue rover dashboard.
Give concise, operationally useful responses. Do not claim that you have physically verified anything.
Current telemetry: ${contextText || 'not available'}.
Operator request: ${message}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const resultData = await response.json();
    const candidateParts = resultData.candidates?.[0]?.content?.parts || [];
    const textPart = candidateParts.find((p) => p.text && !p.thought) || candidateParts.find((p) => p.text);
    const text = textPart?.text?.trim();

    if (!text) throw new Error('No AI response received');

    return { text, isFallback: false };
  } catch (error) {
    console.error('AI Safety Agent request failed:', error);
    return {
      text: 'AI service is temporarily unavailable. Check the API key, network connection, and browser console.',
      isFallback: true,
    };
  }
}
