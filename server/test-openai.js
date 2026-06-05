// Quick smoke test — run with: node test-openai.js
// Tests the full AI pipeline including policy-driven scoring

const { analyzeCompliance, buildSystemPrompt } = require('./src/services/openaiService');
const { REGIONAL_FRAMEWORKS } = require('./src/services/regionalFrameworks');

const SAMPLE_TEXT = `
TechVendor Inc. Security Policy v3.2

Data Encryption:
All data at rest is encrypted using AES-256-GCM. Data in transit is protected
exclusively via TLS 1.3. Legacy protocols (TLS 1.0, 1.1, SSL) are disabled.

Authentication:
All employee and customer-facing systems enforce Multi-Factor Authentication (MFA)
via TOTP. Single sign-on (SSO) is implemented via SAML 2.0.

Access Control:
Role-based access control (RBAC) is enforced. Privileged access is reviewed quarterly.
Least-privilege principle is applied to all service accounts.

Incident Response:
The company maintains a documented incident response plan with a 4-hour initial
response SLA. Post-incident reviews are conducted for all Severity 1 events.

Gaps:
Firewall configuration documentation is incomplete. Third-party penetration testing
was last conducted 18 months ago (overdue by 6 months per policy).
`;

const policies = {
  regionalFrameworks: REGIONAL_FRAMEWORKS.India,
  customPolicies: [
    { id: 'cp_1', name: 'ISO 27001 Required', description: 'All vendors must hold a valid ISO 27001 certification' },
  ],
};

(async () => {
  console.log('--- System Prompt Preview ---');
  console.log(buildSystemPrompt(policies));
  console.log('\n--- Sending to AI ---\n');

  try {
    const result = await analyzeCompliance(SAMPLE_TEXT, policies);
    console.log('Result:\n', JSON.stringify(result, null, 2));
    console.log(`\nPolicy results: ${result.policy_results.length} entries`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
