import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, Info, AlertOctagon } from 'lucide-react';

interface SpamCheckerProps {
    isDarkMode: boolean;
}

type RiskLevel = 'high' | 'medium' | 'low';

interface SpamTrigger {
    word: string;
    weight: number;
    category: string;
}

const SPAM_TRIGGERS: SpamTrigger[] = [
    { word: 'free money', weight: 10, category: 'Financial' },
    { word: 'instant cash', weight: 10, category: 'Financial' },
    { word: 'guaranteed income', weight: 10, category: 'Financial' },
    { word: 'get rich', weight: 10, category: 'Financial' },
    { word: 'passive income', weight: 9, category: 'Financial' },
    { word: 'quick profit', weight: 9, category: 'Financial' },
    { word: 'unlimited earnings', weight: 9, category: 'Financial' },
    { word: 'double your money', weight: 10, category: 'Financial' },
    { word: 'risk-free', weight: 9, category: 'Financial' },
    { word: 'no risk', weight: 9, category: 'Financial' },
    { word: 'fast cash', weight: 10, category: 'Financial' },
    { word: 'financial freedom', weight: 9, category: 'Financial' },
    { word: 'millionaire secrets', weight: 9, category: 'Financial' },
    { word: 'wealth system', weight: 9, category: 'Financial' },
    { word: 'earn extra', weight: 5, category: 'Financial' },
    { word: 'side income', weight: 5, category: 'Financial' },
    { word: 'make money online', weight: 6, category: 'Financial' },
    { word: 'extra cash', weight: 5, category: 'Financial' },
    { word: 'profit today', weight: 6, category: 'Financial' },
    { word: 'income opportunity', weight: 6, category: 'Financial' },
    { word: 'business opportunity', weight: 5, category: 'Financial' },
    { word: 'act now', weight: 8, category: 'Urgency' },
    { word: 'urgent', weight: 8, category: 'Urgency' },
    { word: 'immediate action', weight: 8, category: 'Urgency' },
    { word: 'last chance', weight: 8, category: 'Urgency' },
    { word: 'final notice', weight: 8, category: 'Urgency' },
    { word: 'expires today', weight: 8, category: 'Urgency' },
    { word: 'offer ends', weight: 8, category: 'Urgency' },
    { word: 'limited time', weight: 7, category: 'Urgency' },
    { word: 'do it now', weight: 7, category: 'Urgency' },
    { word: 'don’t delay', weight: 7, category: 'Urgency' },
    { word: 'hurry', weight: 5, category: 'Urgency' },
    { word: 'deadline approaching', weight: 5, category: 'Urgency' },
    { word: 'closing soon', weight: 5, category: 'Urgency' },
    { word: 'only today', weight: 6, category: 'Urgency' },
    { word: 'few spots left', weight: 5, category: 'Urgency' },
    { word: 'buy now', weight: 8, category: 'Sales' },
    { word: 'order now', weight: 8, category: 'Sales' },
    { word: 'click below', weight: 8, category: 'Sales' },
    { word: 'special promotion', weight: 7, category: 'Sales' },
    { word: 'exclusive deal', weight: 7, category: 'Sales' },
    { word: 'free trial', weight: 8, category: 'Sales' },
    { word: 'discount', weight: 6, category: 'Sales' },
    { word: 'save big', weight: 7, category: 'Sales' },
    { word: 'lowest price', weight: 7, category: 'Sales' },
    { word: 'best deal', weight: 7, category: 'Sales' },
    { word: 'limited offer', weight: 5, category: 'Sales' },
    { word: 'special price', weight: 5, category: 'Sales' },
    { word: 'bonus included', weight: 5, category: 'Sales' },
    { word: 'promotional offer', weight: 5, category: 'Sales' },
    { word: 'deal inside', weight: 5, category: 'Sales' },
    { word: '100% free', weight: 10, category: 'Free Abuse' },
    { word: 'totally free', weight: 10, category: 'Free Abuse' },
    { word: 'free gift', weight: 10, category: 'Free Abuse' },
    { word: 'free access', weight: 10, category: 'Free Abuse' },
    { word: 'free download', weight: 10, category: 'Free Abuse' },
    { word: 'free offer', weight: 10, category: 'Free Abuse' },
    { word: 'no cost', weight: 9, category: 'Free Abuse' },
    { word: 'free bonus', weight: 8, category: 'Free Abuse' },
    { word: 'free membership', weight: 8, category: 'Free Abuse' },
    { word: 'free consultation', weight: 6, category: 'Free Abuse' },
    { word: 'guaranteed', weight: 8, category: 'Manipulative' },
    { word: 'no obligation', weight: 8, category: 'Manipulative' },
    { word: 'no catch', weight: 8, category: 'Manipulative' },
    { word: 'no strings attached', weight: 8, category: 'Manipulative' },
    { word: 'no credit check', weight: 9, category: 'Manipulative' },
    { word: 'no hidden fees', weight: 7, category: 'Manipulative' },
    { word: 'once in a lifetime', weight: 8, category: 'Manipulative' },
    { word: 'secret method', weight: 9, category: 'Manipulative' },
    { word: 'insider secrets', weight: 9, category: 'Manipulative' },
    { word: 'proven system', weight: 8, category: 'Manipulative' },
    { word: 'bad credit', weight: 10, category: 'Finance/Loans' },
    { word: 'credit repair', weight: 10, category: 'Finance/Loans' },
    { word: 'instant approval', weight: 10, category: 'Finance/Loans' },
    { word: 'no credit required', weight: 10, category: 'Finance/Loans' },
    { word: 'guaranteed approval', weight: 10, category: 'Finance/Loans' },
    { word: 'payday loan', weight: 10, category: 'Finance/Loans' },
    { word: 'fast loan', weight: 10, category: 'Finance/Loans' },
    { word: 'debt relief', weight: 10, category: 'Finance/Loans' },
    { word: 'debt free', weight: 9, category: 'Finance/Loans' },
    { word: 'consolidate debt', weight: 9, category: 'Finance/Loans' },
    { word: 'personal loan', weight: 5, category: 'Finance/Loans' },
    { word: 'credit score', weight: 5, category: 'Finance/Loans' },
    { word: 'refinancing', weight: 5, category: 'Finance/Loans' },
    { word: 'crypto profits', weight: 10, category: 'Crypto/Gambling' },
    { word: 'guaranteed returns', weight: 10, category: 'Crypto/Gambling' },
    { word: 'bitcoin giveaway', weight: 10, category: 'Crypto/Gambling' },
    { word: 'double your crypto', weight: 10, category: 'Crypto/Gambling' },
    { word: 'nft profits', weight: 10, category: 'Crypto/Gambling' },
    { word: 'trading signals', weight: 9, category: 'Crypto/Gambling' },
    { word: 'forex profits', weight: 9, category: 'Crypto/Gambling' },
    { word: 'betting tips', weight: 10, category: 'Crypto/Gambling' },
    { word: 'casino bonus', weight: 10, category: 'Crypto/Gambling' },
    { word: 'jackpot', weight: 10, category: 'Crypto/Gambling' },
    { word: 'miracle cure', weight: 10, category: 'Health' },
    { word: 'instant results', weight: 10, category: 'Health' },
    { word: 'lose weight fast', weight: 10, category: 'Health' },
    { word: 'rapid weight loss', weight: 10, category: 'Health' },
    { word: 'burn fat', weight: 9, category: 'Health' },
    { word: 'exclude fat', weight: 9, category: 'Health' },
    { word: 'fat burner', weight: 9, category: 'Health' },
    { word: 'anti-aging', weight: 8, category: 'Health' },
    { word: 'reverse aging', weight: 9, category: 'Health' },
    { word: 'cure cancer', weight: 10, category: 'Health' },
    { word: 'detox', weight: 8, category: 'Health' },
    { word: 'keto pills', weight: 6, category: 'Health' },
    { word: 'supplements', weight: 4, category: 'Health' },
    { word: 'muscle gain', weight: 5, category: 'Health' },
    { word: 'xxx', weight: 10, category: 'Adult' },
    { word: 'adult content', weight: 10, category: 'Adult' },
    { word: 'explicit', weight: 8, category: 'Adult' },
    { word: 'webcam girls', weight: 10, category: 'Adult' },
    { word: 'hot singles', weight: 10, category: 'Adult' },
    { word: 'meet singles', weight: 9, category: 'Adult' },
    { word: 'sexual performance', weight: 10, category: 'Adult' },
    { word: 'enhancement pills', weight: 10, category: 'Adult' },
    { word: 'work from home', weight: 8, category: 'Jobs' },
    { word: 'no experience required', weight: 8, category: 'Jobs' },
    { word: 'earn daily', weight: 9, category: 'Jobs' },
    { word: 'easy work', weight: 9, category: 'Jobs' },
    { word: 'guaranteed job', weight: 10, category: 'Jobs' },
    { word: 'instant hiring', weight: 9, category: 'Jobs' },
    { word: 'lawsuit', weight: 9, category: 'Legal/Threat' },
    { word: 'legal action', weight: 9, category: 'Legal/Threat' },
    { word: 'final warning', weight: 9, category: 'Legal/Threat' },
    { word: 'account suspended', weight: 10, category: 'Legal/Threat' },
    { word: 'compliance failure', weight: 8, category: 'Legal/Threat' },
    { word: 'tax violation', weight: 9, category: 'Legal/Threat' },
    { word: 'verify your account', weight: 10, category: 'Phishing' },
    { word: 'login immediately', weight: 10, category: 'Phishing' },
    { word: 'password reset', weight: 8, category: 'Phishing' },
    { word: 'suspicious activity', weight: 9, category: 'Phishing' },
    { word: 'unauthorized access', weight: 9, category: 'Phishing' },
    { word: 'confirm identity', weight: 9, category: 'Phishing' },
    { word: 'security alert', weight: 8, category: 'Phishing' },
    { word: 'you’ve won', weight: 10, category: 'Prizes' },
    { word: 'winner', weight: 9, category: 'Prizes' },
    { word: 'claim your prize', weight: 10, category: 'Prizes' },
    { word: 'lottery', weight: 10, category: 'Prizes' },
    { word: 'sweepstakes', weight: 9, category: 'Prizes' },
    { word: 'prize notification', weight: 9, category: 'Prizes' },
    { word: 'congratulations', weight: 6, category: 'Prizes' },
    { word: 'fr.ee', weight: 10, category: 'Obfuscation' },
    { word: 'm0ney', weight: 10, category: 'Obfuscation' },
    { word: 'c@sh', weight: 10, category: 'Obfuscation' },
    { word: 'pr!ze', weight: 10, category: 'Obfuscation' },
    { word: 'gu@ranteed', weight: 10, category: 'Obfuscation' },
    { word: 'f.r.e.e', weight: 10, category: 'Obfuscation' },
    { word: 'free', weight: 1, category: 'Common' },
    { word: 'cash', weight: 6, category: 'Common' },
    { word: 'bonus', weight: 5, category: 'Common' },
];

SPAM_TRIGGERS.sort((a, b) => b.word.length - a.word.length);

const SpamChecker: React.FC<SpamCheckerProps> = ({ isDarkMode }) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [score, setScore] = useState<number>(0);
    const [flaggedWords, setFlaggedWords] = useState<{ word: string, weight: number, category: string }[]>([]);
    const [patternsDetected, setPatternsDetected] = useState<string[]>([]);

    const backdropRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        analyzeSpam();
    }, [subject, body]);

    const analyzeSpam = () => {
        const text = (subject + ' ' + body);
        const lowerText = text.toLowerCase();
        const found: { word: string, weight: number, category: string }[] = [];
        const foundSet = new Set<string>();

        SPAM_TRIGGERS.forEach(trigger => {
            const regex = new RegExp(`\\b${trigger.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (regex.test(lowerText)) {
                if (!foundSet.has(trigger.word)) {
                    found.push(trigger);
                    foundSet.add(trigger.word);
                }
            }
        });

        setFlaggedWords(found);

        const patterns: string[] = [];
        let patternScore = 0;

        const allCapsMatches = text.match(/\b[A-Z]{4,}\b/g);
        if (allCapsMatches && allCapsMatches.length > 2) {
            patterns.push('Excessive ALL CAPS usage');
            patternScore += 10;
        }

        if ((text.match(/[!?]{2,}/g) || []).length > 2) {
            patterns.push('Excessive punctuation (!!! or ???)');
            patternScore += 5;
        }

        if ((text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length > 3) {
            patterns.push('Multiple emojis detected');
            patternScore += 5;
        }

        if ((text.match(/[$€£₹]{2,}/g) || []).length > 0) {
            patterns.push('Repeated currency symbols ($$$, ₹₹₹)');
            patternScore += 8;
        }

        if (/^(re:|fwd:)/i.test(subject.trim())) {
            patterns.push('Fake reply/forward prefix');
            patternScore += 10;
        }

        if (/bit\.ly|tinyurl\.com|goo\.gl|t\.co|is\.gd|cli\.gs|yfrog\.com|migre\.me|ff\.im|tiny\.cc/i.test(text)) {
            patterns.push('Shortened URL detected (High Risk)');
            patternScore += 15;
        }

        if ((text.match(/http/gi) || []).length > 2) {
            patterns.push('Excessive links detected');
            patternScore += 5;
        }

        setPatternsDetected(patterns);

        let calculatedScore = 0;
        found.forEach(item => {
            calculatedScore += item.weight;
        });
        calculatedScore += patternScore;

        const subjectLower = subject.toLowerCase();
        const bodyLower = body.toLowerCase();
        const inSubject = found.some(f => subjectLower.includes(f.word));
        const inBody = found.some(f => bodyLower.includes(f.word));

        if (inSubject && inBody) {
            calculatedScore *= 1.2;
        }

        if (found.length > 5) {
            calculatedScore *= 1.2;
        }

        setScore(Math.min(100, Math.round(calculatedScore)));
    };

    const getRiskLevel = (score: number) => {
        if (score < 20) return { label: 'Low Risk', color: 'text-emerald-500', bg: 'bg-emerald-500' };
        if (score < 50) return { label: 'Medium Risk', color: 'text-amber-500', bg: 'bg-amber-500' };
        return { label: 'High Risk', color: 'text-rose-500', bg: 'bg-rose-500' };
    };

    const handleScroll = () => {
        if (textareaRef.current && backdropRef.current) {
            backdropRef.current.scrollTop = textareaRef.current.scrollTop;
            backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    const renderHighlightedText = (text: string) => {
        if (!text) return null;
        const escapedText = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        const pattern = SPAM_TRIGGERS.map(t => t.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
        const html = escapedText.replace(regex, (match) => {
            const trigger = SPAM_TRIGGERS.find(t => t.word === match.toLowerCase());
            if (!trigger) return match;
            const colorClass =
                trigger.weight >= 8 ? 'bg-rose-500/40 border-b-2 border-rose-500' :
                    trigger.weight >= 5 ? 'bg-amber-500/40 border-b-2 border-amber-500' :
                        'bg-blue-500/30 border-b-2 border-blue-500';
            return `<mark class="${colorClass} text-transparent rounded-sm px-0.5">${match}</mark>`;
        });
        const finalHtml = html.replace(/\n/g, "<br/>") + (text.endsWith('\n') ? "<br/>" : "");
        return <div dangerouslySetInnerHTML={{ __html: finalHtml }} />;
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className={`p-8 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Spam Word Analysis</h2>
                                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Advanced detection with weighted scoring and pattern recognition.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email Subject</label>
                                <input
                                    type="text"
                                    className={`w-full p-4 rounded-xl outline-none border transition-all ${isDarkMode
                                        ? 'bg-slate-950 border-slate-800 text-slate-300 focus:border-rose-500/50'
                                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-500'
                                        }`}
                                    placeholder="e.g., URGENT: Claim your prize now!"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email Body</label>
                                <div className="relative h-96">
                                    <div
                                        ref={backdropRef}
                                        className="absolute inset-0 p-4 rounded-xl whitespace-pre-wrap break-words overflow-auto pointer-events-none font-sans text-base leading-normal text-transparent"
                                        aria-hidden="true"
                                    >
                                        {renderHighlightedText(body)}
                                    </div>

                                    <textarea
                                        ref={textareaRef}
                                        className={`absolute inset-0 w-full h-full p-4 rounded-xl outline-none border transition-all resize-none bg-transparent font-sans text-base leading-normal ${isDarkMode
                                            ? 'border-slate-800 text-slate-300 focus:border-rose-500/50'
                                            : 'border-slate-200 text-slate-800 focus:border-rose-500'
                                            }`}
                                        placeholder="Paste your email content here to check for spam triggers..."
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        onScroll={handleScroll}
                                        spellCheck={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`p-6 rounded-3xl border shadow-lg sticky top-24 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Spam Score</h3>
                        <div className="flex flex-col items-center justify-center mb-8">
                            <div className={`w-40 h-40 rounded-full flex items-center justify-center border-[12px] transition-all duration-500 ${score < 20 ? 'border-emerald-500/20 text-emerald-500' : score < 50 ? 'border-amber-500/20 text-amber-500' : 'border-rose-500/20 text-rose-500'}`}>
                                <div className="text-center">
                                    <div className="text-5xl font-black">{score}</div>
                                    <div className="text-xs font-bold uppercase tracking-wider opacity-70">/ 100</div>
                                </div>
                            </div>
                            <div className={`mt-4 px-4 py-2 rounded-full font-bold text-sm ${score < 20 ? 'bg-emerald-100 text-emerald-700' : score < 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                {getRiskLevel(score).label}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {patternsDetected.length > 0 && (
                                <div>
                                    <h4 className={`font-bold text-sm uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Formatting Issues</h4>
                                    <div className="space-y-2">
                                        {patternsDetected.map((pattern, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-rose-500 font-medium">
                                                <AlertOctagon size={14} /> {pattern}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className={`font-bold text-sm uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Keyword Triggers</h4>
                                {flaggedWords.length > 0 ? (
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                        {flaggedWords.map((item, idx) => (
                                            <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                                <div className="flex flex-col">
                                                    <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.word}</span>
                                                    <span className="text-[10px] opacity-60">{item.category}</span>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${item.weight >= 8 ? 'bg-rose-100 text-rose-700' :
                                                    item.weight >= 5 ? 'bg-amber-100 text-amber-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {item.weight >= 8 ? 'High' : item.weight >= 5 ? 'Med' : 'Low'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`text-center py-8 border-2 border-dashed rounded-xl ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                                        <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No triggers detected</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`mt-6 p-4 rounded-xl text-xs leading-relaxed ${isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                            <div className="flex items-center gap-2 mb-2 font-bold">
                                <Info size={14} /> Recommendation
                            </div>
                            {score < 20
                                ? "Your content looks good! Low risk of being marked as spam."
                                : score < 50
                                    ? "Exercise caution. Remove some medium-risk words to improve deliverability."
                                    : "High risk! Significant changes recommended to avoid spam folders."}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SpamChecker;
