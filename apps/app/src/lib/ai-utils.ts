'use server';

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

/**
 * Generates a summary of the provided text using AI
 */
export async function generateSummary(text: string): Promise<string> {
  try {
    // Truncate text if it's too long to fit in the context window
    const truncatedText =
      text.length > 10000 ? `${text.substring(0, 10000)}...` : text;

    const { text: summary } = await generateText({
      model: openai('gpt-4o'),
      system:
        'You are a helpful assistant that generates concise, informative summaries of documents. Focus on the key points and main ideas.',
      prompt: `Please summarize the following text in a clear, structured format:

${truncatedText}

Your summary should:
1. Capture the main ideas and key points
2. Be well-structured with sections if appropriate
3. Be comprehensive yet concise
4. Include any important conclusions or findings`,
    });

    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Failed to generate summary. Please try again.';
  }
}

/**
 * Asks a question about the document and returns an AI-generated answer
 */
export async function askDocumentQuestion(
  documentText: string,
  question: string
): Promise<string> {
  try {
    // Truncate document text if it's too long
    const truncatedText =
      documentText.length > 10000
        ? `${documentText.substring(0, 10000)}...`
        : documentText;

    const { text: answer } = await generateText({
      model: openai('gpt-4o'),
      system: `You are a helpful assistant that answers questions about documents. 
You have access to the document text and should provide accurate, helpful responses based solely on the information in the document.
If the answer cannot be found in the document, politely state that the information is not available in the provided document.`,
      prompt: `Document text:
${truncatedText}

User question: ${question}

Please provide a helpful, accurate answer based on the document content.`,
    });

    return answer;
  } catch (error) {
    console.error('Error generating answer:', error);
    return "I'm sorry, I encountered an error while processing your question. Please try again.";
  }
}

/**
 * Generates an insightful reflection on a journal entry, including emotional analysis,
 * patterns recognition, and thoughtful suggestions
 */
export async function generateJournalReflection(
  journalContent: string
): Promise<string> {
  try {
    // Truncate text if it's too long to fit in the context window
    const truncatedContent =
      journalContent.length > 10000
        ? `${journalContent.substring(0, 10000)}...`
        : journalContent;

    const { text: reflection } = await generateText({
      model: openai('gpt-4o'),
      system: `You are an empathetic and insightful journaling assistant that helps users gain deeper understanding from their journal entries.
Your reflections should be thoughtful, personal, and help the user develop greater self-awareness.
Always maintain a supportive, non-judgmental tone.`,
      prompt: `Please provide a thoughtful reflection on the following journal entry:

${truncatedContent}

In your reflection, please include:
1. A brief summary of key themes or topics discussed
2. Analysis of any emotional patterns or states expressed in the entry
3. Noteworthy insights or perspectives the writer might consider
4. 1-2 gentle questions that might help the writer explore their thoughts further
5. If appropriate, a small actionable suggestion related to the journal content

Format your response with clear sections and make it personal to the writer. Be empathetic but also honest and constructive.`,
    });

    return reflection;
  } catch (error) {
    console.error('Error generating journal reflection:', error);
    return 'Failed to generate reflection. Please try again.';
  }
}
