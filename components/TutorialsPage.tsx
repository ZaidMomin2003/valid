import React from 'react';
import { BookOpen, CheckCircle2, Github, Globe, Server, Terminal, ArrowRight, Mail, FileText, Search, ShieldAlert, FileSpreadsheet, Zap } from 'lucide-react';

interface TutorialsPageProps {
    isDarkMode: boolean;
}

const TutorialsPage: React.FC<TutorialsPageProps> = ({ isDarkMode }) => {
    const usageSteps = [
        {
            title: "Validation",
            icon: <Mail className="text-blue-500" />,
            steps: [
                "Enter emails manually in the text area or upload a CSV/XLSX file.",
                "The system automatically identifies syntax, disposable domains, and role-based accounts.",
                "Click 'Start Validation' to perform deep DNS and MX checks.",
                "Export your clean list as a CSV or Excel file."
            ]
        },
        {
            title: "Email Extractor",
            icon: <Search className="text-purple-500" />,
            steps: [
                "Paste any raw text (emails from websites, documents, or logs).",
                "Click 'Extract' to pull all valid email addresses.",
                "Review the deduplicated list and click 'Validate This List' to move it to the validator."
            ]
        },
        {
            title: "List Cleaner",
            icon: <FileSpreadsheet className="text-emerald-500" />,
            steps: [
                "Upload a messy spreadsheet where multiple emails might be in one cell.",
                "The system expands rows so each email gets its own record with all original data.",
                "Deduplicate your list instantly to save on sending costs."
            ]
        }
    ];

    const hostingSteps = [
        {
            platform: "Vercel",
            icon: <Globe className="text-black dark:text-white" />,
            steps: [
                "Push your code to a GitHub repository.",
                "Log in to Vercel and click 'Add New' > 'Project'.",
                "Import your repository.",
                "In 'Environment Variables', add `GEMINI_API_KEY` (optional for advanced features).",
                "Click 'Deploy'. Vercel automatically detects Vite and builds the project."
            ]
        },
        {
            platform: "Coolify (Self-Hose)",
            icon: <Server className="text-blue-600" />,
            steps: [
                "Set up a VPS (Ubuntu recommended) and install Coolify.",
                "Connect your GitHub account to Coolify.",
                "Create a new 'Application' and select your project repo.",
                "Set the build command to `npm run build` and publish directory to `dist`.",
                "Coolify will handle the Dockerization and SSL certificate automatically."
            ]
        }
    ];

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className={`p-12 rounded-3xl mb-12 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-blue-600'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">App Tutorials</h1>
                    <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
                        Master Cleanmails with our step-by-step guides. From basic validation to enterprise self-hosting.
                    </p>
                </div>
            </div>

            <div className="mb-16">
                <h2 className={`text-3xl font-black mb-8 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Zap className="text-yellow-500" /> Feature Guides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {usageSteps.map((feature, idx) => (
                        <div key={idx} className={`p-8 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    {feature.icon}
                                </div>
                                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{feature.title}</h3>
                            </div>
                            <div className="space-y-4">
                                {feature.steps.map((step, sIdx) => (
                                    <div key={sIdx} className="flex gap-3">
                                        <div className="mt-1.5 shrink-0">
                                            <CheckCircle2 size={14} className="text-blue-500" />
                                        </div>
                                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-16">
                <h2 className={`text-3xl font-black mb-8 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Terminal className="text-blue-500" /> Self-Hosting Guide
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {hostingSteps.map((host, idx) => (
                        <div key={idx} className={`p-10 rounded-3xl border relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        {host.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Deploy on</p>
                                        <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{host.platform}</h3>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {host.steps.map((step, sIdx) => (
                                        <div key={sIdx} className="flex gap-4">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                                {sIdx + 1}
                                            </div>
                                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 pt-8 border-t border-slate-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <Github size={14} /> GitHub Required
                                    </div>
                                    <ArrowRight className="text-blue-500" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`p-12 rounded-3xl border text-center ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`text-2xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Need advanced help?</h3>
                <p className={`mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    If you're looking for high-volume enterprise setup support, our team is available for custom configurations.
                </p>
                <button
                    onClick={() => window.location.hash = '#full-setup'}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                >
                    View Full Setup Service <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default TutorialsPage;
