import Constants from 'expo-constants';

const GOOGLE_VISION_API_KEY = Constants.expoConfig?.extra?.googleVisionApiKey;
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

export interface VisionApiResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      locale?: string;
    }>;
    error?: {
      code: number;
      message: string;
    };
  }>;
}

/**
 * Extracts text from an image using Google Cloud Vision API
 * @param base64Image - Base64 encoded image string
 * @returns Full text extracted from the image
 */
export async function detectTextInImage(base64Image: string): Promise<string> {
  if (!GOOGLE_VISION_API_KEY) {
    throw new Error('Google Vision API key not found. Please add GOOGLE_VISION_API_KEY to your .env file.');
  }

  try {
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${VISION_API_URL}?key=${GOOGLE_VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Vision API error: ${errorData.error?.message || response.statusText}`);
    }

    const data: VisionApiResponse = await response.json();
    const result = data.responses[0];

    if (result.error) {
      throw new Error(`Vision API error: ${result.error.message}`);
    }

    // The first textAnnotation contains the full text detected
    const fullText = result.textAnnotations?.[0]?.description || '';

    return fullText;
  } catch (error) {
    console.error('Error calling Google Vision API:', error);
    throw error;
  }
}

/**
 * Parses yarn label information from extracted text
 * This uses simple heuristics to extract common yarn label fields
 * @param text - Raw text extracted from the label
 * @returns Parsed yarn information
 */
export function parseYarnLabelText(text: string): {
  name: string;
  material: string;
  weight: string;
  length: string;
  rawText: string;
} {
  const lines = text.split('\n').map((line) => line.trim());

  // Extract name (usually first 1-2 lines)
  const name = lines.slice(0, 2).join(' ');

  // Look for material patterns (e.g., "100% Cotton", "50% Wool 50% Acrylic")
  const materialRegex = /(\d+%\s*[A-Za-z]+(?:\s*,?\s*\d+%\s*[A-Za-z]+)*)/i;
  const materialMatch = text.match(materialRegex);
  const material = materialMatch ? materialMatch[1] : '';

  // Look for weight (e.g., "100g", "50g", "3.5 oz")
  const weightRegex = /(\d+(?:\.\d+)?\s*(?:g|oz|gram|ounce)s?)/i;
  const weightMatch = text.match(weightRegex);
  const weight = weightMatch ? weightMatch[1] : '';

  // Look for length (e.g., "200m", "150 yards", "100 yds")
  const lengthRegex = /(\d+(?:\.\d+)?\s*(?:m|meter|yard|yd)s?)/i;
  const lengthMatch = text.match(lengthRegex);
  const length = lengthMatch ? lengthMatch[1] : '';

  return {
    name,
    material,
    weight,
    length,
    rawText: text,
  };
}

export async function parseYarnLabel(base64Image: string) {
  try {
    const extractedText = await detectTextInImage(base64Image);
    const parsedData = parseYarnLabelText(extractedText);

    return parsedData;
  } catch (error) {
    console.error('Error parsing yarn label:', error);
    throw error;
  }
}
