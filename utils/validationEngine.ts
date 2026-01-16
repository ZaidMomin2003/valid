import { EmailRecord, EmailStatus } from '../types';

const CONTROL_CHARS = /[\x00-\x1F\x7F]/;
const ATOM_REGEX = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+$/;

const MAJOR_PROVIDERS = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
    'aol.com', 'protonmail.com', 'zoho.com', 'yandex.com', 'mail.com', 'me.com', 'live.com', 'msn.com'
];
 
const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'throwawaymail.com', 'mailinator.com', 'guerrillamail.com', 'yopmail.com',
    '10minutemail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com', 'temp-mail.org',
    'maildrop.cc', 'fakeinbox.com', 'temp-mail.io', 'emailondeck.com', 'moakt.com'
]);

const ROLE_ACCOUNTS = new Set([
    'admin', 'support', 'info', 'sales', 'contact', 'webmaster', 'billing', 'jobs', 'noreply',
    'help', 'marketing', 'office', 'team', 'hello', 'mail', 'staff', 'accounts', 'orders',
    'shipping', 'hr', 'dev', 'test', 'tech'
]);

const HIGH_RISK_TLDS = new Set(['.top', '.xyz', '.stream', '.win', '.biz', '.icu', '.buzz', '.casa', '.surf', '.zip', '.click']);

// MD5 implementation for Gravatar
const hex_chr = '0123456789abcdef';
function md5Cycle(x: any, k: any) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586); c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426); c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417); c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101); c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632); c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083); c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690); c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784); c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463); c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353); c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222); c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835); c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415); c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894946606); c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744); c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379); c = ii(c, d, a, b, k[2], 15, 718787280); b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
}
function cmn(q: any, a: any, b: any, x: any, s: any, t: any) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
function ff(a: any, b: any, c: any, d: any, x: any, s: any, t: any) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
function gg(a: any, b: any, c: any, d: any, x: any, s: any, t: any) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
function hh(a: any, b: any, c: any, d: any, x: any, s: any, t: any) { return cmn(b ^ c ^ d, a, b, x, s, t); }
function ii(a: any, b: any, c: any, d: any, x: any, s: any, t: any) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
function add32(a: any, b: any) { return (a + b) & 0xFFFFFFFF; }
function md5(s: string) {
    var txt = ''; var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) { md5Cycle(state, md5blk(s.substring(i - 64, i))); }
    s = s.substring(i - 64); var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) { md5Cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; }
    tail[14] = n * 8; md5Cycle(state, tail);
    for (i = 0; i < 4; i++) { for (var j = 0; j < 4; j++) { txt += hex_chr.charAt((state[i] >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((state[i] >> (j * 8)) & 0x0F); } }
    return txt;
}
function md5blk(s: string) { var md5blks = [], i; for (i = 0; i < 64; i += 4) { md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24); } return md5blks; }

function levenshteinDistance(s1: string, s2: string): number {
    const len1 = s1.length; const len2 = s2.length;
    const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
    }
    return matrix[len1][len2];
}

function calculateEntropy(str: string): number {
    const frequencies: Record<string, number> = {};
    for (const char of str) { frequencies[char] = (frequencies[char] || 0) + 1; }
    return Object.values(frequencies).reduce((sum, freq) => {
        const p = freq / str.length;
        return sum - p * Math.log2(p);
    }, 0);
}

function validateSyntax(email: string): { isValid: boolean; error?: string } {
    if (!email) return { isValid: false, error: "Empty email" };
    if (email.length > 254) return { isValid: false, error: "Exceeds 254 chars" };
    if (CONTROL_CHARS.test(email)) return { isValid: false, error: "Control chars found" };
    const lastAtPos = email.lastIndexOf('@');
    if (lastAtPos === -1) return { isValid: false, error: "Missing @" };
    const localPart = email.substring(0, lastAtPos);
    const domain = email.substring(lastAtPos + 1);
    if (localPart.length > 64) return { isValid: false, error: "Local part too long" };
    if (localPart.startsWith('.') || localPart.endsWith('.')) return { isValid: false, error: "Leading/trailing dot" };
    if (!/^[a-zA-Z0-9.-]+$/.test(domain)) return { isValid: false, error: "Invalid domain" };
    return { isValid: true };
}

async function checkDNS(domain: string): Promise<{ exists: boolean; hasMX: boolean; isBlacklisted: boolean }> {
    try {
        const mxRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, { headers: { 'accept': 'application/dns-json' } });
        const mxJson = await mxRes.json();
        const hasMX = !!(mxJson.Answer && mxJson.Answer.some((r: any) => r.type === 15));

        const aRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, { headers: { 'accept': 'application/dns-json' } });
        const aJson = await aRes.json();
        const hasA = !!(aJson.Answer && aJson.Answer.some((r: any) => r.type === 1));

        const txtRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`, { headers: { 'accept': 'application/dns-json' } });
        const txtJson = await txtRes.json();
        const isBlacklisted = !!(txtJson.Answer && JSON.stringify(txtJson.Answer).toLowerCase().includes('blocked'));

        return { exists: hasMX || hasA, hasMX, isBlacklisted };
    } catch {
        return { exists: true, hasMX: false, isBlacklisted: false };
    }
}

async function checkGravatar(email: string): Promise<boolean> {
    try {
        const hash = md5(email.trim().toLowerCase());
        const response = await fetch(`https://www.gravatar.com/avatar/${hash}?d=404`, { method: 'HEAD' });
        return response.status === 200;
    } catch { return false; }
}

export async function validateEmailDeep(email: string): Promise<EmailRecord> {
    const normalized = email.trim().toLowerCase();
    const syntax = validateSyntax(normalized);
    const checks = { syntax: syntax.isValid, dns: false, mx: false, disposable: true, social: false, role: true, blacklist: true };

    if (!syntax.isValid) {
        return { email: normalized, status: EmailStatus.BAD, reason: syntax.error || "Syntax Error", confidence: 0, checks };
    }

    const [local, domain] = normalized.split('@');
    const tld = domain.substring(domain.lastIndexOf('.'));
    const dns = await checkDNS(domain);
    checks.dns = dns.exists;
    checks.mx = dns.hasMX;
    checks.blacklist = !dns.isBlacklisted;

    if (!dns.exists) {
        return { email: normalized, status: EmailStatus.BAD, reason: "Domain does not exist", confidence: 0, checks };
    }

    const hasSocial = await checkGravatar(normalized);
    checks.social = hasSocial;
    if (hasSocial) {
        return { email: normalized, status: EmailStatus.GOOD, reason: "Verified via Social Profile", confidence: 1.0, checks: { ...checks, social: true, role: true, disposable: true } };
    }

    const isDisposable = DISPOSABLE_DOMAINS.has(domain);
    checks.disposable = !isDisposable;
    if (isDisposable) {
        return { email: normalized, status: EmailStatus.BAD, reason: "Disposable email detected", confidence: 0.1, checks };
    }

    const isRole = ROLE_ACCOUNTS.has(local);
    checks.role = !isRole;
    if (isRole) {
        return { email: normalized, status: EmailStatus.RISKY, reason: "Role-based email (Risky for outreach)", confidence: 0.4, checks };
    }

    let score = 1.0;
    let reason = "Valid and deliverable";

    if (!dns.hasMX) { score -= 0.5; reason = "No MX records found"; }
    if (dns.isBlacklisted) { score -= 0.6; reason = "Domain is blacklisted"; }
    if (HIGH_RISK_TLDS.has(tld)) { score -= 0.3; reason = "High-risk TLD detected"; }

    // Robotic detection (Entropy)
    const entropy = calculateEntropy(local);
    if (entropy > 4.5 && local.length > 10) { score -= 0.4; reason = "Possible robotic address"; }

    // Typo detection
    for (const provider of MAJOR_PROVIDERS) {
        if (domain !== provider && levenshteinDistance(domain, provider) === 1) {
            return { email: normalized, status: EmailStatus.RISKY, reason: `Possible typo of @${provider}`, confidence: 0.3, checks };
        }
    }

    const status = score > 0.8 ? EmailStatus.GOOD : (score > 0.4 ? EmailStatus.RISKY : EmailStatus.BAD);
    return { email: normalized, status, reason, confidence: Math.max(0, Math.min(1, score)), checks };
}
