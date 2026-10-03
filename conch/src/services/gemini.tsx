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
    mode: string,
    count: number,
    difficulty: string
): Promise<QuizQuestion[]> {
    const difficultyRules =
        difficulty === 'easy'
        ? 'Target beginners: basic definitions, fundamental facts, and obvious correct answers. Distractors (wrong choices) must be clearly incorrect and easy to eliminate.'
        : difficulty === 'normal'
        ? 'Target intermediate learners: core concepts, practical scenarios, and standard principles. Distractors must be plausible alternatives that require working knowledge to rule out.'
        : difficulty === 'hard'
        ? 'Target advanced experts: subtle edge cases, technical depth, analytical reasoning, and obscure trivia. Distractors must be believable traps closely related to the answer.'
        : 'Standard core concepts and practical questions with plausible distractors.'

        const rules =
        '- MC: 4 options, 1 correct answer.\n' +
        '- True/False: statement with "True"/"False" choices.\n' +
        '- Checkbox: 3-5 options, multiple correct answers (select all that apply).\n' +
        '- Fill-in: sentence with "______" and the missing answer.';

        const questionMode =
        mode === 'mc'
            ? `Generate only Multiple Choice questions:\n${rules.split('\n')[0]}`
            : mode === 'true/false'
            ? `Generate only True/False questions:\n${rules.split('\n')[1]}`
            : mode === 'checkbox'
            ? `Generate only Checkbox questions:\n${rules.split('\n')[2]}`
            : mode === 'fill-in'
            ? `Generate only Fill-in questions:\n${rules.split('\n')[3]}`
            : `Generate a balanced mix using these formats:\n${rules}`;
    
    const prompt = `Generate a ${count}-question quiz about "${topic}".
    Difficulty level: ${difficulty.toUpperCase()}
    Criteria to follow: ${difficultyRules}
    Mode of test: ${questionMode}

    Strict requirements:
    1. Ensure the question and distractors accurately match the requested difficulty criteria.
    2. The correct answer must be included inside the "choices" array.
    3. Shuffle the position of the correct answer across the "choices" array (do not always make it the first option).
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
            temperature: 0.8,
            topP: 0.95,
        },
    })

    const text = response.text
    if(!text) throw new Error(`No response from AI`)

    return JSON.parse(text) as QuizQuestion[]
}