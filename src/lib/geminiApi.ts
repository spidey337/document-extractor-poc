import { GoogleGenerativeAI } from '@google/generative-ai'

export interface GeminiModel {
  id: string
  name: string
  description: string
}

export const GEMINI_MODELS: GeminiModel[] = [
  {
    id: 'gemini-2.5-flash-preview-05-20',
    name: 'Gemini 2.5 Flash Preview',
    description: 'Most advanced with adaptive thinking and cost efficiency'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Latest stable with enhanced performance and speed'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and versatile performance across diverse tasks'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Complex reasoning tasks requiring more intelligence'
  },
  {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash-8B',
    description: 'High volume and cost-effective processing'
  }
]

export interface ProcessDocumentParams {
  apiKey: string
  model: string
  file: File
  prompt: string
  outputFormat: string
}

export interface ProcessDocumentResponse {
  success: boolean
  data?: unknown
  error?: string
}

export async function processDocument(params: ProcessDocumentParams): Promise<ProcessDocumentResponse> {
  try {
    if (!params.apiKey) {
      throw new Error('API key is required')
    }

    if (!params.file) {
      throw new Error('File is required')
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(params.apiKey)
    const model = genAI.getGenerativeModel({ model: params.model })

    // Convert file to base64
    const fileData = await fileToGenerativePart(params.file)

    // Construct the full prompt
    const fullPrompt = `${params.prompt}

Please analyze the provided document and return the information in the following JSON format:
${params.outputFormat}

Important:
- Return ONLY valid JSON without any additional text or formatting
- Ensure all fields are properly filled based on the document content
- Use null for any information not found in the document
- Maintain high accuracy and attention to detail`

    // Generate content
    const result = await model.generateContent([fullPrompt, fileData])
    const response = await result.response
    const text = response.text()

    // Try to parse as JSON
    let parsedData
    try {
      // Clean the response text (remove markdown formatting if present)
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
      parsedData = JSON.parse(cleanedText)
    } catch (parseError) {
      console.warn('Failed to parse as JSON, returning raw text:', parseError)
      parsedData = { rawResponse: text }
    }

    return {
      success: true,
      data: parsedData
    }

  } catch (error: unknown) {
    console.error('Error processing document:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return {
      success: false,
      error: errorMessage
    }
  }
}

async function fileToGenerativePart(file: File) {
  const base64EncodedData = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.readAsDataURL(file)
  })

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type
    }
  }
}