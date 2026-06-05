// Creates the 4 missing custom fields on Compliance_Review__c
// using the Salesforce Tooling API — bypasses SFDX entirely.
// Run with: node create-sf-fields.js

require('dotenv').config();
const axios = require('axios');

const FIELDS = [
  {
    FullName: 'Compliance_Review__c.Security_Score__c',
    Metadata: {
      type: 'Number',
      label: 'Security Score',
      precision: 3,
      scale: 0,
      unique: false,
    },
  },
  {
    FullName: 'Compliance_Review__c.Risk_Status__c',
    Metadata: {
      type: 'Picklist',
      label: 'Risk Status',
      valueSet: {
        restricted: true,
        valueSetDefinition: {
          sorted: false,
          value: [
            { fullName: 'Approved',              default: false, label: 'Approved' },
            { fullName: 'Pending Human Review',  default: false, label: 'Pending Human Review' },
          ],
        },
      },
    },
  },
  {
    FullName: 'Compliance_Review__c.AI_Audit_Summary__c',
    Metadata: {
      type: 'LongTextArea',
      label: 'AI Audit Summary',
      length: 32768,
      visibleLines: 10,
    },
  },
  {
    FullName: 'Compliance_Review__c.Contact_Email__c',
    Metadata: {
      type: 'Email',
      label: 'Contact Email',
      unique: false,
    },
  },
];

(async () => {
  // Authenticate
  const params = new URLSearchParams({
    grant_type:    'password',
    client_id:     process.env.SF_CLIENT_ID,
    client_secret: process.env.SF_CLIENT_SECRET,
    username:      process.env.SF_USERNAME,
    password:      process.env.SF_PASSWORD + (process.env.SF_SECURITY_TOKEN || ''),
  });

  const auth = await axios.post(
    `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
    params.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  const { access_token, instance_url } = auth.data;
  console.log('Authenticated to:', instance_url);

  const headers = {
    Authorization:  `Bearer ${access_token}`,
    'Content-Type': 'application/json',
  };

  for (const field of FIELDS) {
    try {
      const res = await axios.post(
        `${instance_url}/services/data/v60.0/tooling/sobjects/CustomField`,
        field,
        { headers }
      );
      console.log(`✅ Created: ${field.FullName} (id: ${res.data.id})`);
    } catch (err) {
      const detail = err.response?.data;
      // Already exists = success for our purposes
      if (JSON.stringify(detail).includes('duplicate')) {
        console.log(`⚪ Already exists: ${field.FullName}`);
      } else {
        console.error(`❌ Failed: ${field.FullName}`, JSON.stringify(detail));
      }
    }
  }
})();
