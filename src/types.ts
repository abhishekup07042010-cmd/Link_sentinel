export type VerdictLevel = 'safe' | 'suspicious' | 'malicious';

export type ClassificationType = 
  | 'Safe Domain' 
  | 'Suspicious Activity' 
  | 'Phishing Link' 
  | 'Malware Distribution' 
  | 'Typosquatting Spoof' 
  | 'Credential Harvester' 
  | 'C2 Beacon / Botnet';

export interface SourceFeed {
  name: string;
  category: string;
  status: 'Clean' | 'Flagged' | 'Blacklisted' | 'Unverified';
  confidence: number; // 0 - 100
  detail: string;
  lastUpdated: string;
}

export interface SecurityFlag {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  category: 'Domain' | 'Network' | 'Content' | 'Heuristics' | 'Certificate';
  description: string;
}

export interface DomainReputation {
  domain: string;
  trustScore: number; // 0 - 100
  domainAge: string;
  creationDate: string;
  registrar: string;
  dnsStatus: 'Active & Verified' | 'Newly Registered' | 'Suspicious NS Records' | 'Sinkholed';
  isNewDomain: boolean;
  whoisPrivacy: boolean;
  tldRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
}

export interface IPReputation {
  ip: string;
  asn: string;
  organization: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  blacklisted: boolean;
  abuseConfidenceScore: number; // 0 - 100
  openPorts: number[];
  reverseDns: string;
}

export interface SSLAnalysis {
  valid: boolean;
  issuer: string;
  protocol: string;
  expiresDays: number;
  subjectAltNamesCount: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'F' | 'Invalid';
}

export interface URLBreakdown {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  entropyScore: number;
  subdomainCount: number;
  isIpAddress: boolean;
  containsSuspiciousKeywords: boolean;
  characterCount: number;
}

export interface ThreatReport {
  id: string;
  rawInput: string;
  sanitizedUrl: string;
  hostname: string;
  threatScore: number; // 0 - 100
  verdictLevel: VerdictLevel;
  classification: ClassificationType;
  summary: string;
  recommendedAction: string;
  domainRep: DomainReputation;
  ipRep: IPReputation;
  sslAnalysis: SSLAnalysis;
  urlBreakdown: URLBreakdown;
  sourceFeeds: SourceFeed[];
  securityFlags: SecurityFlag[];
  scannedAt: string;
  scanDurationMs: number;
  fromCache: boolean;
}

export interface CacheStats {
  totalEntries: number;
  hits: number;
  misses: number;
  lastHitUrl?: string;
  hitRatioPercentage: number;
}

export interface ThreatPreset {
  label: string;
  url: string;
  type: 'safe' | 'suspicious' | 'malicious';
  badge: string;
  description: string;
}
