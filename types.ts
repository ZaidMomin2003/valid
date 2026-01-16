
export enum EmailStatus {
  GOOD = 'GOOD',
  RISKY = 'RISKY',
  BAD = 'BAD'
}

export interface EmailRecord {
  email: string;
  status: EmailStatus;
  reason: string;
  confidence: number;
  checks?: {
    syntax: boolean;
    dns: boolean;
    mx: boolean;
    disposable: boolean;
    social: boolean;
    role: boolean;
    blacklist: boolean;
  };
  [key: string]: any;
}

export interface ValidationSummary {
  total: number;
  good: number;
  risky: number;
  bad: number;
}

export type ViewType = 'dashboard' | 'validate' | 'extractor' | 'spam-check' | 'cleaner' | 'developer' | 'full-setup' | 'tutorials' | 'premium-validation';
