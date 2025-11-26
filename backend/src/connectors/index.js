import axios from 'axios';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { callLLM } from '../llm/index.js';
import logger from '../lib/logger.js';

// HTTP Fetch Connector
export const httpFetch = async (config, context) => {
    const url = Handlebars.compile(config.url)(context);
    const headers = config.headers || {};

    logger.info(`HTTP Fetch: ${url}`);

    const response = await axios.get(url, {
        headers,
        timeout: 30000,
    });

    return response.data;
};

// HTTP Post Connector
export const httpPost = async (config, context) => {
    const url = Handlebars.compile(config.url)(context);
    const body = config.body ? JSON.parse(Handlebars.compile(JSON.stringify(config.body))(context)) : {};
    const headers = config.headers || {};

    logger.info(`HTTP Post: ${url}`);

    const response = await axios.post(url, body, {
        headers,
        timeout: 30000,
    });

    return response.data;
};

// LLM Connector
export const llmNode = async (config, context) => {
    const prompt = Handlebars.compile(config.prompt || config.prompt_template || '')(context);

    logger.info(`LLM Node: Calling with prompt length ${prompt.length}`);

    const result = await callLLM(prompt, {
        systemPrompt: config.system_prompt,
        maxTokens: config.max_tokens,
    });

    return result;
};

// Email Connector
export const emailNode = async (config, context) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const to = Handlebars.compile(config.to)(context);
    const subject = Handlebars.compile(config.subject)(context);
    const body = Handlebars.compile(config.body)(context);

    logger.info(`Email: Sending to ${to}`);

    const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text: body,
        html: config.html ? Handlebars.compile(config.html)(context) : undefined,
    });

    return { messageId: info.messageId, accepted: info.accepted };
};

// Transform Connector (JavaScript evaluation - use with caution)
export const transformNode = async (config, context) => {
    const script = config.script || 'return input;';

    logger.info('Transform: Executing transformation');

    // Simple transformation using Function constructor
    // In production, use a proper sandbox like vm2
    const fn = new Function('context', script);
    const result = fn(context);

    return result;
};

// Connector registry
const connectors = {
    http_fetch: httpFetch,
    http_post: httpPost,
    llm: llmNode,
    email: emailNode,
    transform: transformNode,
};

export const executeNode = async (node, context) => {
    const connector = connectors[node.type];

    if (!connector) {
        throw new Error(`Unknown node type: ${node.type}`);
    }

    try {
        const result = await connector(node.config, context);
        return result;
    } catch (error) {
        logger.error(`Connector ${node.type} failed:`, error);
        throw error;
    }
};

export default { executeNode, httpFetch, httpPost, llmNode, emailNode, transformNode };
