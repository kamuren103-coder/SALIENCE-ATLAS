import { PromptRegistry } from './backend/ai-runtime/registry/prompt-registry';
import { DatabaseCore } from './backend/database/db-core';

async function seed() {
  const db = DatabaseCore.getInstance();
  await db.runMigrations();

  console.log('Seeding Prompt Registry...');

  await PromptRegistry.register({
    name: 'procurement-analysis',
    version: 1,
    content: 'Analyze the following procurement document for compliance with PPADA 2015 regulations: {{documentText}}. Highlight any potential risk factors.',
    systemInstruction: 'You are a senior procurement auditor. Be precise, legalistic, and thorough.',
    status: 'ACTIVE'
  });

  await PromptRegistry.register({
    name: 'contract-risk-summary',
    version: 1,
    content: 'Summarize the risk profile for this contract: {{contractDetails}}. Focus on penalty clauses and indemnity caps.',
    systemInstruction: 'You are an enterprise legal risk advisor. Focus on financial liabilities.',
    status: 'ACTIVE'
  });

  await PromptRegistry.register({
    name: 'digital-twin-simulation',
    version: 1,
    content: 'Simulate a {{disruptionType}} disruption on the {{entityName}} asset. What are the secondary effects on the Suswa interconnect?',
    systemInstruction: 'You are a predictive digital twin simulator. Provide probabilistic outcomes.',
    status: 'ACTIVE'
  });

  console.log('Prompt Registry seeded successfully.');
}

seed().catch(console.error);
