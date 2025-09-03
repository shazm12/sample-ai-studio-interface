'use server'

import { revalidatePath } from 'next/cache';

export interface GenerateImageRequest {
  prompt: string;
  style: string;
}

export interface GenerateImageResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
  status: 'success' | 'error';
  message?: string;
  statusCode: number;  // Add HTTP status code
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Simulate image generation
export async function generateImage(data: GenerateImageRequest): Promise<GenerateImageResponse> {
  try {
    const processingTime = Math.random() * 2000 + 1000;
    await delay(processingTime);

    // Simulate 20% error rate
    if (Math.random() < 0.2) {
      throw new Error('Model overloaded');
    }

    const mockImageUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
    
    const response: GenerateImageResponse = {
      id: generateId(),
      imageUrl: mockImageUrl,
      prompt: data.prompt,
      style: data.style,
      createdAt: new Date().toISOString(),
      status: 'success',
      statusCode: 200  // Success status code
    };

    // Revalidate the page to show new data
    revalidatePath('/');
    
    return response;

  } catch (error) {
    const errorResponse: GenerateImageResponse = {
      id: generateId(),
      imageUrl: '',
      prompt: data.prompt,
      style: data.style,
      createdAt: new Date().toISOString(),
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      statusCode: 500 
    };

    return errorResponse;
  }
}

export async function generateImageWithRetry(
  data: GenerateImageRequest, 
  maxRetries: number = 3
): Promise<GenerateImageResponse> {
  let lastError: string = '';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateImage(data);
      
      if (result.status === 'success') {
        return result;
      }
      
      lastError = result.message || 'Generation failed';
      
      // Exponential backoff: wait longer between retries
      if (attempt < maxRetries) {
        const backoffTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await delay(backoffTime);
      }
      
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      
      if (attempt < maxRetries) {
        const backoffTime = Math.pow(2, attempt) * 1000;
        await delay(backoffTime);
      }
    }
  }
  
  // All retries failed
  return {
    id: generateId(),
    imageUrl: '',
    prompt: data.prompt,
    style: data.style,
    createdAt: new Date().toISOString(),
    status: 'error',
    message: `Failed after ${maxRetries} attempts. Last error: ${lastError}`,
    statusCode: 500  // Internal server error after all retries
  };
}
