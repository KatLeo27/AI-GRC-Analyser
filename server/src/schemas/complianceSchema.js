const { z } = require('zod');

const PolicyResultSchema = z.object({
  policy_name: z.string().min(1),
  source: z.enum(['regional', 'custom']),
  status: z.enum(['pass', 'fail', 'partial', 'not_assessed']),
  note: z.string(),
});

const ComplianceSchema = z.object({
  security_score: z.number().int().min(1).max(100),
  risk_status: z.enum(['Approved', 'Pending Human Review']),
  ai_audit_summary: z.string().min(1),
  policy_results: z.array(PolicyResultSchema),
});

module.exports = { ComplianceSchema, PolicyResultSchema };
