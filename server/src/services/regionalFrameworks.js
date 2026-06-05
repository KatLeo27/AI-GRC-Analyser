'use strict';

const REGIONAL_FRAMEWORKS = {
  India: [
    {
      name: 'DPDP Act 2023',
      requirements: [
        'Documented lawful basis for processing personal data',
        'Data Principal consent records maintained',
        'Grievance redressal mechanism in place',
        'Data retention and erasure policy defined',
      ],
    },
    {
      name: 'IT Act 2000 / SPDI Rules',
      requirements: [
        'Sensitive personal data protected per SPDI Rules',
        'Privacy policy published and accessible',
        'Security practices compliant with IS/ISO 27001',
      ],
    },
    {
      name: 'RBI Cybersecurity Framework',
      requirements: [
        'Cyber Security Policy approved by board',
        'SOC with 24x7 monitoring operational',
        'Annual cyber risk assessment conducted',
        'Incident reporting to RBI within prescribed timelines',
      ],
    },
    {
      name: 'CERT-In Guidelines 2022',
      requirements: [
        'Incidents reported to CERT-In within 6 hours',
        'Logs retained for 180 days',
        'Vulnerability disclosure process documented',
      ],
    },
  ],

  USA: [
    {
      name: 'HIPAA',
      requirements: [
        'PHI encrypted at rest and in transit',
        'Access controls and audit logs for PHI systems',
        'Business Associate Agreements in place',
        'Breach notification procedure documented',
      ],
    },
    {
      name: 'SOC 2',
      requirements: [
        'Trust Service Criteria addressed (Security, Availability)',
        'Change management process documented',
        'Vendor risk management program exists',
      ],
    },
    {
      name: 'NIST CSF',
      requirements: [
        'Asset inventory maintained',
        'Access control and security awareness training in place',
        'Anomaly and event monitoring active',
        'Incident response plan tested annually',
      ],
    },
    {
      name: 'CCPA',
      requirements: [
        'Consumer data rights (access, deletion) supported',
        'Privacy policy discloses data sale practices',
        'Opt-out mechanism for data sale provided',
      ],
    },
    {
      name: 'PCI-DSS',
      requirements: [
        'Cardholder data encrypted with strong cryptography',
        'Network segmentation isolates cardholder environment',
        'Quarterly vulnerability scans conducted',
        'Access to cardholder data restricted by need-to-know',
      ],
    },
  ],

  EU: [
    {
      name: 'GDPR',
      requirements: [
        'Lawful basis for each processing activity documented',
        'Data subject rights (access, erasure, portability) supported',
        'DPA appointed where required',
        'Data breach notification within 72 hours',
        'Data Protection Impact Assessments for high-risk processing',
      ],
    },
    {
      name: 'NIS2 Directive',
      requirements: [
        'Risk management measures implemented',
        'Supply chain security assessed',
        'Incident handling and reporting procedures in place',
        'Business continuity and crisis management plans tested',
      ],
    },
  ],

  UK: [
    {
      name: 'UK GDPR',
      requirements: [
        'Lawful basis documented per UK GDPR Article 6',
        'ICO breach notification within 72 hours',
        'Data subject rights mechanism operational',
        'Data Protection Officer appointed where required',
      ],
    },
    {
      name: 'Cyber Essentials',
      requirements: [
        'Boundary firewalls and internet gateways configured',
        'Secure configuration applied to all devices',
        'Access control and administrative privilege management',
        'Malware protection deployed',
        'Patch management: software updated within 14 days',
      ],
    },
  ],

  Singapore: [
    {
      name: 'PDPA',
      requirements: [
        'Consent obtained for personal data collection',
        'Data Protection Officer designated',
        'Do Not Call Registry compliance where applicable',
        'Data breach notification within 3 days to PDPC',
      ],
    },
    {
      name: 'MAS TRM Guidelines',
      requirements: [
        'Technology risk governance framework established',
        'Critical system resilience and recovery tested',
        'Third-party IT vendor risk assessed',
        'Cyber surveillance monitoring in place',
      ],
    },
  ],

  Global: [
    {
      name: 'ISO 27001',
      requirements: [
        'ISMS scope and policy defined',
        'Risk assessment and treatment plan documented',
        'Security controls from Annex A implemented',
        'Internal audit and management review conducted',
      ],
    },
    {
      name: 'SOC 2 Type II',
      requirements: [
        'Controls operating effectively over audit period (min 6 months)',
        'Availability and confidentiality criteria addressed',
        'Vendor management controls documented',
      ],
    },
  ],
};

module.exports = { REGIONAL_FRAMEWORKS };
