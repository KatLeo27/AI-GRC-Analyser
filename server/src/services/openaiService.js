'use strict';

const OpenAI = require('openai');
const { ComplianceSchema } = require('../schemas/complianceSchema');
const config = require('../config');
const logger  = require('../utils/logger');

const clientOptions = { apiKey: config.OPENAI_API_KEY };
if (config.AI_PROVIDER === 'ollama') {
  clientOptions.baseURL = config.OLLAMA_BASE_URL;
}
const client = new OpenAI(clientOptions);
logger.info('AI client initialised', { provider: config.AI_PROVIDER, model: config.AI_MODEL });

function buildSystemPrompt(policies) {
  const { regionalFrameworks, customPolicies } = policies;

  let prompt = `You are a Chief Information Security Officer (CISO) reviewing a vendor compliance document.\n\n`;
  prompt += `Respond with ONLY a valid JSON object — no markdown fences, no explanation outside the JSON.\n\n`;

  prompt += `The JSON must contain exactly these fields:\n`;
  prompt += `- security_score: integer 1-100 (100 = perfect). Score based on how well the vendor satisfies all policies listed below.\n`;
  prompt += `- risk_status: exactly "Approved" if score >= 80, else exactly "Pending Human Review"\n`;
  prompt += `- ai_audit_summary: concise paragraph (max 1500 chars) covering strengths, gaps, recommendations\n`;
  prompt += `- policy_results: array with one entry per policy listed below. Each entry must have:\n`;
  prompt += `    policy_name (string, exact name from the list below)\n`;
  prompt += `    source ("regional" for regulatory frameworks, "custom" for admin policies)\n`;
  prompt += `    status ("pass" / "fail" / "partial" / "not_assessed")\n`;
  prompt += `    note (one sentence explaining the assessment)\n\n`;

  if (regionalFrameworks.length === 0) {
    prompt += `REGIONAL POLICIES: None configured.\n\n`;
  } else {
    prompt += `REGIONAL POLICIES (source: "regional"):\n`;
    for (const fw of regionalFrameworks) {
      prompt += `[${fw.name}]\n`;
      for (const req of fw.requirements) {
        prompt += `- ${req}\n`;
      }
    }
    prompt += `\n`;
  }

  if (customPolicies.length === 0) {
    prompt += `CUSTOM POLICIES: None configured.\n`;
  } else {
    prompt += `CUSTOM POLICIES (source: "custom"):\n`;
    for (const cp of customPolicies) {
      prompt += `[${cp.name}] ${cp.description}\n`;
    }
  }

  return prompt;
}

async function analyzeCompliance(extractedText, policies) {
  const totalPolicies =
    policies.regionalFrameworks.length + policies.customPolicies.length;

  // Cap text for small models when policy list is large
  const textLimit = totalPolicies > 15 ? 4_000 : 80_000;
  const safeText = extractedText.slice(0, textLimit);

  logger.info('AI: sending request', {
    model: config.AI_MODEL,
    textChars: safeText.length,
    frameworks: policies.regionalFrameworks.length,
    customPolicies: policies.customPolicies.length,
  });

  const systemPrompt = buildSystemPrompt(policies);

  let response;
  try {
    response = await client.chat.completions.create({
      model: config.AI_MODEL,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Vendor compliance document:\n\n${safeText}` },
      ],
    });
  } catch (e) {
    const err = new Error(`OpenAI API call failed: ${e.message}`);
    err.code = 'OPENAI_ERROR';
    throw err;
  }

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    const err = new Error('OpenAI returned an empty response.');
    err.code = 'OPENAI_ERROR';
    throw err;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const err = new Error('OpenAI response was not valid JSON.');
    err.code = 'OPENAI_ERROR';
    throw err;
  }

  try {
    return ComplianceSchema.parse(parsed);
  } catch (e) {
    const err = new Error(`OpenAI response did not match expected schema: ${e.message}`);
    err.code = 'OPENAI_ERROR';
    throw err;
  }
}

module.exports = { analyzeCompliance, buildSystemPrompt };
