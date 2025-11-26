import OpenAI from 'openai';
import logger from '../lib/logger.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const callLLM = async (prompt, options = {}) => {
    try {
        const response = await openai.chat.completions.create({
            model: options.model || process.env.OPENAI_MODEL || 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: options.systemPrompt || 'You are a helpful assistant.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: options.maxTokens || parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
            temperature: options.temperature || 0.7,
        });

        const result = response.choices[0].message.content;
        logger.info('LLM call successful', { promptLength: prompt.length, responseLength: result.length });

        return result;
    } catch (error) {
        logger.error('LLM call failed:', error);
        throw new Error(`LLM call failed: ${error.message}`);
    }
};

export const parseWorkflowFromNL = async (naturalLanguageInput) => {
    const systemPrompt = `You are an expert automation assistant. Parse the user's natural-language workflow request into a canonical JSON schema with nodes and edges. 

Nodes can be types: http_fetch, http_post, llm, transform, email, slack, notion_create, sheets_append, file_upload.

Output only valid JSON that conforms to this schema:
{
  "name": "workflow name",
  "trigger": {"type": "cron|webhook|manual", "cron": "cron expression if applicable"},
  "nodes": [{"id": "n1", "type": "node_type", "name": "Node Name", "config": {}}],
  "edges": [["n1", "n2"]]
}

Include reasoned assumptions in metadata.assumptions when needed.`;

    const result = await callLLM(naturalLanguageInput, {
        systemPrompt,
        maxTokens: 3000,
    });

    try {
        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = result.trim();
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }

        const parsed = JSON.parse(jsonStr);
        return parsed;
    } catch (error) {
        logger.error('Failed to parse LLM response as JSON:', result);
        throw new Error('Failed to parse workflow from natural language');
    }
};

export default { callLLM, parseWorkflowFromNL };
