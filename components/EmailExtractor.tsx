import React, { useState } from 'react';
import { FileText, Copy, ArrowRight, Trash2, Check, Search } from 'lucide-react';

interface EmailExtractorProps {
    isDarkMode: boolean;
    onNavigateToValidate: (emails: string[]) => void;
}

const EmailExtractor: React.FC<EmailExtractorProps> = ({ isDarkMode, onNavigateToValidate }) => {
    const [inputText, setInputText] = useState('');
    const [extractedEmails, setExtractedEmails] = useState<string[]>([]);
    const [isCopied, setIsCopied] = useState(false);

    const extractEmails = () => {
        if (!inputText) return;
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = inputText.match(emailRegex) || [];
        const uniqueEmails = Array.from(new Set(matches.map(email => email.toLowerCase().trim())));
        const cleanedEmails = uniqueEmails.map(email => email.replace(/[.,;!?]+$/, ''));
        const finalEmails = Array.from(new Set(cleanedEmails));
        setExtractedEmails(finalEmails);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(extractedEmails.join('\n'));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`p-8 rounded-3xl border transition-colors duration-300 shadow-sm flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                <Search size={20} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                    Raw Text Input
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                    Paste any text containing emails
                                </p>
                            </div>
                        </div>
                        {inputText && (
                            <button
                                onClick={() => { setInputText(''); setExtractedEmails([]); }}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <textarea
                        className={`flex-1 w-full p-4 rounded-2xl outline-none transition-all resize-none font-mono text-sm leading-relaxed border mb-4 ${isDarkMode
                            ? 'bg-slate-950 border-slate-800 text-slate-300 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-4 focus:ring-purple-100 focus:border-purple-500'
                            }`}
                        placeholder="Paste unstructured text here...&#10;Example: Contact us at support@example.com or sales@example.com."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        style={{ minHeight: '300px' }}
                    />

                    <button
                        onClick={extractEmails}
                        disabled={!inputText}
                        className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                    >
                        Extract Emails
                    </button>
                </div>

                <div className={`p-8 rounded-3xl border transition-colors duration-300 shadow-sm flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                    Extracted List
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                    {extractedEmails.length} unique emails found
                                </p>
                            </div>
                        </div>
                        {extractedEmails.length > 0 && (
                            <button
                                onClick={copyToClipboard}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isCopied
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                        )}
                    </div>

                    <div className={`flex-1 rounded-2xl border overflow-hidden relative ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        {extractedEmails.length > 0 ? (
                            <div className="absolute inset-0 overflow-y-auto p-4 custom-scrollbar">
                                {extractedEmails.map((email, idx) => (
                                    <div key={idx} className={`py-2 px-3 border-b last:border-0 font-mono text-sm ${isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                                        {email}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 opacity-50">
                                <Search size={48} className="mb-2" />
                                <p>No emails extracted yet</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={() => onNavigateToValidate(extractedEmails)}
                            disabled={extractedEmails.length === 0}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            Validate This List <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailExtractor;
