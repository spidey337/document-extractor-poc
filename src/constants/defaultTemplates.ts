import type { Template } from '../store/useAppStore'

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'invoice-extractor',
    name: 'Invoice Data Extractor',
    description: 'Extract key information from invoices and receipts',
    prompt: `You are an expert at extracting structured data from invoices and receipts. Analyze the provided document and extract all relevant information with high accuracy. Pay special attention to:

- Invoice/receipt number and date
- Vendor/company information
- Line items with descriptions, quantities, and prices
- Tax information and totals
- Payment terms and methods

Ensure all monetary values are properly formatted and categorized.`,
    outputFormat: `{
  "documentType": "invoice|receipt",
  "invoiceNumber": "string",
  "date": "YYYY-MM-DD",
  "vendor": {
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string"
  },
  "billTo": {
    "name": "string",
    "address": "string"
  },
  "lineItems": [
    {
      "description": "string",
      "quantity": "number",
      "unitPrice": "number",
      "total": "number"
    }
  ],
  "subtotal": "number",
  "tax": "number",
  "total": "number",
  "currency": "string",
  "paymentTerms": "string"
}`
  },
  {
    id: 'resume-parser',
    name: 'Resume Parser',
    description: 'Extract structured information from resumes and CVs',
    prompt: `You are an expert HR system that parses resumes and CVs. Extract all relevant professional information from the provided document with high accuracy. Focus on:

- Personal and contact information
- Professional summary and objective
- Work experience with dates, companies, and responsibilities
- Education and certifications
- Skills and competencies
- Languages and proficiency levels

Organize the information in a structured format suitable for HR systems.`,
    outputFormat: `{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "linkedIn": "string",
    "website": "string"
  },
  "summary": "string",
  "experience": [
    {
      "jobTitle": "string",
      "company": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM|Present",
      "responsibilities": ["string"],
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "graduationDate": "YYYY",
      "gpa": "string"
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "tools": ["string"]
  },
  "certifications": ["string"],
  "languages": [
    {
      "language": "string",
      "proficiency": "Native|Fluent|Conversational|Basic"
    }
  ]
}`
  },
  {
    id: 'contract-analyzer',
    name: 'Contract Analyzer',
    description: 'Analyze contracts and legal documents for key terms',
    prompt: `You are a legal document analyzer specializing in contract review. Examine the provided contract and extract key terms, clauses, and important information. Focus on:

- Parties involved and their roles
- Contract type and purpose
- Key dates (execution, effective, expiration)
- Financial terms and payment schedules
- Important clauses and conditions
- Obligations and responsibilities
- Termination and renewal terms

Provide a comprehensive analysis while maintaining legal accuracy.`,
    outputFormat: `{
  "contractType": "string",
  "parties": [
    {
      "name": "string",
      "role": "client|vendor|contractor|etc",
      "address": "string"
    }
  ],
  "keyDates": {
    "executionDate": "YYYY-MM-DD",
    "effectiveDate": "YYYY-MM-DD",
    "expirationDate": "YYYY-MM-DD"
  },
  "financialTerms": {
    "totalValue": "number",
    "currency": "string",
    "paymentSchedule": "string",
    "paymentTerms": "string"
  },
  "keyProvisions": {
    "scope": "string",
    "deliverables": ["string"],
    "obligations": {
      "party1": ["string"],
      "party2": ["string"]
    }
  },
  "importantClauses": [
    {
      "type": "string",
      "description": "string"
    }
  ],
  "terminationClause": "string",
  "renewalTerms": "string"
}`
  },
  {
    id: 'receipt-parser',
    name: 'Receipt Parser',
    description: 'Extract information from receipts for expense tracking',
    prompt: `You are an expense tracking system that processes receipts. Extract all relevant information from the provided receipt for accurate expense categorization and reporting. Focus on:

- Merchant information and location
- Purchase date and time
- Itemized purchases with categories
- Payment method and transaction details
- Tax information
- Receipt totals

Categorize expenses appropriately for business accounting.`,
    outputFormat: `{
  "merchant": {
    "name": "string",
    "address": "string",
    "phone": "string"
  },
  "transactionInfo": {
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "receiptNumber": "string",
    "transactionId": "string"
  },
  "items": [
    {
      "description": "string",
      "category": "food|office|travel|entertainment|other",
      "quantity": "number",
      "unitPrice": "number",
      "total": "number"
    }
  ],
  "subtotal": "number",
  "tax": "number",
  "tip": "number",
  "total": "number",
  "currency": "string",
  "paymentMethod": "cash|credit|debit|mobile",
  "expenseCategory": "meals|office_supplies|travel|entertainment|other"
}`
  },
  {
    id: 'id-document-parser',
    name: 'ID Document Parser',
    description: 'Extract information from identification documents',
    prompt: `You are a secure document verification system that extracts information from identification documents. Process the provided ID document with high accuracy while maintaining data privacy. Extract:

- Document type and issuing authority
- Personal identification information
- Document numbers and security features
- Validity dates
- Additional document-specific fields

Handle various ID types including passports, driver's licenses, national IDs, etc.`,
    outputFormat: `{
  "documentType": "passport|drivers_license|national_id|other",
  "issuingAuthority": "string",
  "issuingCountry": "string",
  "personalInfo": {
    "fullName": "string",
    "dateOfBirth": "YYYY-MM-DD",
    "placeOfBirth": "string",
    "nationality": "string",
    "gender": "M|F|X"
  },
  "documentInfo": {
    "documentNumber": "string",
    "issueDate": "YYYY-MM-DD",
    "expirationDate": "YYYY-MM-DD",
    "issuingOffice": "string"
  },
  "additionalInfo": {
    "address": "string",
    "height": "string",
    "eyeColor": "string",
    "restrictions": "string"
  },
  "securityFeatures": ["string"]
}`
  }
]