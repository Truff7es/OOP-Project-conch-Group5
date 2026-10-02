import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
})

export interface QuizQuestion{
    id: number
    question: string
    choices: string[]
    answer: string
}

export async function generateQuiz(
    topic: string,
    count: number,
    difficulty: string
): Promise<QuizQuestion[]> {
    const prompt =
    `Generate a ${count}-question quiz about "${topic}" with difficulty level "${difficulty}".
    Format the response strictly as a JSON array of objects with this exact schema:
    [
        {
            "id": 1,
            "question": "Question text here",
            "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
            "answer": "Choice 1"
        }
    ]`

    const response = await ai.models.generateContent({
        model: `gemini-3.5-flash-lite`,
        contents: prompt,
        config: {
            responseMimeType: `application/json`,
        },
    })

    const text = response.text
    if(!text) throw new Error(`No response from AI`)

    return JSON.parse(text) as QuizQuestion[]
}