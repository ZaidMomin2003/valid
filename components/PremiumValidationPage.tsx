import React from 'react';
import { ShieldCheck, Zap, Server, Terminal, AlertTriangle, CheckCircle2, Globe, Cpu, Link2, Code2 } from 'lucide-react';

interface PremiumValidationPageProps {
    isDarkMode: boolean;
}

const PremiumValidationPage: React.FC<PremiumValidationPageProps> = ({ isDarkMode }) => {
    const smtpSteps = [
        {
            title: "infrastructure Requirements",
            desc: "Browser-based tools cannot perform pure SMTP handshakes due to security restrictions. You need a dedicated VPS with Port 25 open.",
            icon: <Server className="text-blue-500" />
        },
        {
            title: "SMTP Handshake Process",
            desc: "Communicate directly with the recipient mail server to verify if an inbox exists without sending an email.",
            icon: <Zap className="text-yellow-500" />
        },
        {
            title: "Bypass Catch-All",
            desc: "Advanced logic to detect domains that accept all mail to prevent invalid results.",
            icon: <ShieldCheck className="text-emerald-500" />
        }
    ];

    const setupInstructions = [
        "Provision an Ubuntu 22.04 VPS from providers like DigitalOcean or Hetzner.",
        "Ensure Port 25 (Outbound) is unblocked by the provider.",
        "Set up a Node.js backend using 'smtplib' or 'net' sockets.",
        "Implement a REST API endpoint that receives an email and returns the SMTP status code (e.g., 250 for success, 550 for failure)."
    ];

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className={`p-12 rounded-3xl mb-12 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-400/30 text-yellow-500 mb-6 font-bold text-sm">
                        <Zap size={16} /> Premium Enterprise Feature
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Deep SMTP Handshake Validation</h1>
                    <p className="text-xl text-blue-100 max-w-3xl leading-relaxed">
                        The ultimate way to achieve 99.9% accuracy. Unlike basic syntax or DNS checks, SMTP handshakes talk directly to the mail server to confirm the user's existence.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {smtpSteps.map((step, idx) => (
                    <div key={idx} className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            {step.icon}
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                <div className={`p-10 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <h2 className={`text-2xl font-black mb-8 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Terminal className="text-blue-500" /> Infrastructure Setup
                    </h2>
                    <div className="space-y-6">
                        {setupInstructions.map((step, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                    {idx + 1}
                                </div>
                                <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`p-10 rounded-3xl border border-rose-500/20 bg-rose-500/5`}>
                    <h2 className={`text-2xl font-black mb-6 flex items-center gap-3 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                        <AlertTriangle /> Important Precautions
                    </h2>
                    <div className="space-y-4">
                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h4 className="font-bold flex items-center gap-2 mb-2"><Globe size={16} className="text-blue-500" /> Use a Trusted IP</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Your VPS IP must have a good reputation. If you use a blacklisted IP (like some from AWS/GCP), servers will reject your handshakes immediately.</p>
                        </div>
                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h4 className="font-bold flex items-center gap-2 mb-2"><Cpu size={16} className="text-purple-500" /> RDNS & PTR Configuration</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Ensure your Reverse DNS (PTR) record is set to your hostname. Without this, major providers like Gmail will treat you as a bot.</p>
                        </div>
                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h4 className="font-bold flex items-center gap-2 mb-2"><CheckCircle2 size={16} className="text-emerald-500" /> Throttle Your Requests</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Pinging the same mail server too many times in a minute will get your IP banned. Implement a queue system with random delays.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-12 rounded-3xl border text-center relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="relative z-10">
                    <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-xl ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-600 text-white'}`}>
                        <Code2 size={40} />
                    </div>
                    <h3 className={`text-3xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Need a custom SMTP Backend?</h3>
                    <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Skip the manual server setup. Our team specializes in deploying enterprise-grade SMTP infrastructure that handles millions of handshakes reliably.
                    </p>
                    <button
                        onClick={() => window.open('https://api.whatsapp.com/send?phone=918431326909&text=Hello,%20I%20am%20interested%20in%20the%20Premium%20SMTP%20Infrastructure%20setup.', '_blank')}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-xl shadow-blue-900/20"
                    >
                        Contact via WhatsApp <Link2 size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PremiumValidationPage;
