/**
 * LinkSentinel Frontend Security & Sanitization Utilities
 * Protects against XSS, DOM injection, dangerous protocol execution,
 * and provides comprehensive heuristic classification rules.
 */

// HTML Entity encoder to prevent XSS in rendered text
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strips dangerous URI schemes (javascript:, data:, vbscript:, blob:)
 * and ensures safe scheme format.
 */
export function sanitizeUrlString(rawInput: string): {
  sanitized: string;
  isValid: boolean;
  error?: string;
  parsedUrl?: URL;
} {
  if (!rawInput || typeof rawInput !== 'string') {
    return { sanitized: '', isValid: false, error: 'Please enter a valid URL to analyze.' };
  }

  // Trim and remove control characters
  let cleanInput = rawInput.trim().replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '');

  // Disallow explicitly dangerous protocols
  const lower = cleanInput.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return {
      sanitized: '',
      isValid: false,
      error: 'Dangerous URI scheme detected. Analysis blocked for security.',
    };
  }

  // Auto-prepend https:// if no protocol provided
  if (!/^https?:\/\//i.test(cleanInput)) {
    cleanInput = 'https://' + cleanInput;
  }

  try {
    const parsed = new URL(cleanInput);

    // Basic domain validation
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return {
        sanitized: cleanInput,
        isValid: false,
        error: 'Invalid hostname detected. Domain must be at least 3 characters.',
      };
    }

    // Ensure valid TLD or IPv4/IPv6 structure
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname) || parsed.hostname.includes(':');
    const hasValidTld = parsed.hostname.includes('.') && parsed.hostname.split('.').pop()!.length >= 2;

    if (!isIp && !hasValidTld) {
      return {
        sanitized: cleanInput,
        isValid: false,
        error: 'Incomplete domain name. Missing a valid top-level domain (e.g. .com, .org, .io).',
      };
    }

    return {
      sanitized: parsed.href,
      isValid: true,
      parsedUrl: parsed,
    };
  } catch {
    return {
      sanitized: cleanInput,
      isValid: false,
      error: 'Malformed URL format. Please check syntax and try again.',
    };
  }
}

/**
 * Calculates Shannon entropy for a given string.
 * High entropy (> 3.5 on short strings) often indicates DGA (Domain Generation Algorithms)
 * or obfuscated phishing paths.
 */
export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const frequencies: Record<string, number> = {};
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }

  return parseFloat(entropy.toFixed(2));
}

/**
 * Comprehensive high-risk keyword taxonomy commonly utilized in cyber attack lures & phishing campaigns
 */
export const SUSPICIOUS_KEYWORDS = [
  // Authentication & Credentials
  'login', 'signin', 'sign-in', 'log-in', 'verify', 'verification', 'authenticate', 'authentication',
  'auth', 'update', 'secure', 'security', 'security-alert', 'checkpoint', 'confirm', 'confirmation',
  'validate', 'validation', 'recover', 'recovery', 'reset', 'password', 'passcode', 'unlock', 'unblock',
  'suspended', 'restricted', 'reactivate', 'unusual-activity', 'session', 'kyc', 'portal', 'webmail',
  'account', 'myaccount', 'client', 'member', 'service-desk', 'helpdesk',
  
  // Banking & Financial Gateways
  'bank', 'banking', 'onlinebanking', 'chase', 'wellsfargo', 'bankofamerica', 'citibank', 'barclays',
  'hsbc', 'paypal', 'paypa1', 'venmo', 'zelle', 'cashapp', 'stripe', 'billing', 'invoice', 'payment',
  'refund', 'tax-refund', 'overdue', 'wire', 'transfer', 'statement', 'card-verification',
  
  // High-Value Tech / Brands
  'appleid', 'icloud-verify', 'microsoft-verify', 'office365', 'sharepoint-auth', 'onedrive-share',
  'google-docs', 'gmail-alert', 'dropbox-download', 'adobe-verify', 'netflix-billing', 'spotify-premium',
  'amazon-order', 'steam-gift', 'discord-nitro', 'free-nitro', 'roblox-robux', 'telegram-code',
  
  // Web3, Crypto & Wallet Drainers
  'wallet', 'walletconnect', 'metamask', 'trustwallet', 'coinbase', 'binance', 'ledger', 'trezor',
  'phantom', 'solana', 'airdrop', 'claim', 'drainer', 'mint', 'token', 'presale', 'seedphrase',
  'privatekey', 'private-key', 'mnemonic', 'dapp', 'staking', 'swap', 'pancakeswap', 'uniswap',
  
  // Social Engineering, Parcels & Urgency
  'delivery', 'dhl', 'fedex', 'usps', 'ups', 'shipment', 'parcel', 'tracking', 'package-hold',
  'customs-fee', 'lottery', 'winner', 'bonus', 'giftcard', 'reward', 'giveaway', 'urgent',
  'action-required', 'account-closure', 'immediate-action', 'notice-id'
];

/**
 * Recognizes known URL Shortener domains that disguise final landing endpoints
 */
export const KNOWN_URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly', 'rb.gy', 
  't.me', 'goo.gl', 'v.gd', 'tr.im', 'rebrand.ly', 'tiny.cc', 'shorturl.at', 'clck.ru', 
  'shorte.st', 'adf.ly', 'bc.vc', 'lnkd.in', 'qr.ae', 'trib.al', 'smarturl.it', 'soo.gd', 
  's.id', 'rotf.lol', 'freeurlshortener.net', 'hyperlink.co'
];

/**
 * Suspicious Query String & Redirect parameters
 */
export const SUSPICIOUS_PARAMS = [
  'redirect', 'redirect_uri', 'redirect_url', 'url', 'dest', 'destination', 'target', 
  'next', 'return', 'return_url', 'goto', 'link', 'r', 'token', 'session', 'auth_token', 
  'jwt', 'key', 'secret', 'seed', 'phrase', 'private_key', 'wallet', 'claim', 'email'
];

/**
 * Dangerous file extensions
 */
export const DANGEROUS_EXTENSIONS = [
  '.exe', '.scr', '.bat', '.cmd', '.vbs', '.vbe', '.js', '.jse', '.wsf', '.wsh', 
  '.ps1', '.apk', '.dmg', '.pkg', '.iso', '.img', '.hta', '.msi', '.bin', '.jar', 
  '.docm', '.xlsm', '.pptm'
];

/**
 * High-Risk / Heavily Abused Top-Level Domains (TLDs)
 */
export const HIGH_RISK_TLDS = [
  'xyz', 'top', 'click', 'loan', 'work', 'buzz', 'icu', 'fit', 'rest', 'tk', 'ml', 
  'ga', 'cf', 'gq', 'club', 'vip', 'live', 'support', 'link', 'cam', 'guru', 'online', 
  'site', 'fun', 'space', 'monster', 'quest', 'beauty', 'hair', 'skin', 'store', 
  'website', 'shop', 'lat', 'press', 'host', 'pw', 'cc', 'ws', 'info', 'bid', 'date', 
  'trade', 'racing', 'download', 'stream', 'win', 'surf', 'rocks', 'kim', 'pub', 
  'pro', 'moe', 'casa', 'center', 'today', 'solutions', 'world', 'zip', 'mov', 'ph', 
  'su', 'ru', 'cn', 'to', 'st', 'gq', 'cf', 'cc'
];

export function findSuspiciousKeywords(urlStr: string): string[] {
  const lower = urlStr.toLowerCase();
  const matched = new Set<string>();
  for (const keyword of SUSPICIOUS_KEYWORDS) {
    if (lower.includes(keyword)) {
      matched.add(keyword);
    }
  }
  return Array.from(matched);
}

