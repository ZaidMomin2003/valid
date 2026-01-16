import React, { useState } from 'react';
import { Rocket, Server, Mail, ShieldCheck, Zap, Clock, CheckCircle2, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

interface FullSetupPageProps {
    isDarkMode: boolean;
}

const FullSetupPage: React.FC<FullSetupPageProps> = ({ isDarkMode }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const features = [
        {
            id: 1,
            title: "Dedicated SMTP Server",
            desc: "High-performance private SMTP server configured for maximum deliverability and speed.",
            icon: <Server size={24} />
        },
        {
            id: 2,
            title: "50 Warmed Mailboxes",
            desc: "Ready-to-use email addresses that have been properly warmed up to avoid spam folders.",
            icon: <Mail size={24} />
        },
        {
            id: 3,
            title: "Self-Hosted Infrastructure",
            desc: "Complete control over your data with self-hosted mailboxes and sender scripts.",
            icon: <ShieldCheck size={24} />
        },
        {
            id: 4,
            title: "100k+ Daily Capacity",
            desc: "Enterprise-grade infrastructure capable of sending over 100,000 emails every single day.",
            icon: <Zap size={24} />
        }
    ];

    const faqs = [
        {
            question: "Is there any monthly fee?",
            answer: "No, this is a one-time setup fee. We believe in providing freedom, not subscriptions."
        },
        {
            question: "Do you provide hosting infrastructure?",
            answer: "Yes, we provide 1 year of free infrastructure hosting as part of the package to get you started immediately."
        },
        {
            question: "How long does the setup take?",
            answer: "Our team typically completes the full configuration within 7 business days. Mailbox warming may take 2-3 weeks so by the end of 2 weeks you will get 50 warmed mailboxes."
        },
        {
            question: "What is your refund policy?",
            answer: "We offer an 80% refund policy within the first 60 days if you are not satisfied with the setup performance."
        },
        {
            question: "Can I use my own domain?",
            answer: "Absolutely. We can set everything up on your existing domains or help you register new ones."
        }
    ];

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className={`relative mb-12 rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-blue-600'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 p-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 mb-6 font-medium text-sm">
                        <CheckCircle2 size={16} className="text-emerald-400" /> 2-Month Money Back Guarantee
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Complete Email Infrastructure <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Ready in 1 Week</span>
                    </h1>

                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop worrying about limits and bans. Get a fully warmed, dedicated, and self-hosted email setup
                        designed for high-volume cold outreach.
                    </p>

                    <button
                        onClick={() => window.open('https://api.whatsapp.com/send?phone=918431326909&text=Hello,%20I%20am%20interested%20in%20the%20Full%20Email%20Setup%20service.', '_blank')}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                        <Rocket size={24} className="group-hover:-translate-y-1 transition-transform" />
                        Get Started for $1199
                    </button>
                    <p className="mt-4 text-xs text-blue-200 opacity-60">One-time fee • No monthly subscriptions</p>
                </div>
            </div>

            <div className="mb-12">
                <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    <Zap size={24} className="text-yellow-500" />
                    What's Included
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <div key={feature.id} className={`relative p-6 rounded-2xl border h-full ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                            }`}>
                            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-lg text-sm">
                                {idx + 1}
                            </div>

                            <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                                }`}>
                                {feature.icon}
                            </div>

                            <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {feature.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                                }`}
                        >
                            <button
                                className="w-full px-6 py-4 flex items-center justify-between text-left"
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            >
                                <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{faq.question}</span>
                                {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openFaq === index && (
                                <div className="px-6 pb-4">
                                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                        <DollarSign size={24} />
                    </div>
                    <h3 className={`font-bold text-xl mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>80% Refund Guarantee</h3>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-emerald-500/80' : 'text-emerald-700'}`}>
                        We are confident in our setup. If you are not satisfied with the results within the first 2 months, we will refund 80% of your investment. No questions asked.
                    </p>
                </div>

                <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-blue-950/20 border-blue-900/50' : 'bg-blue-50 border-blue-100'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                        <Clock size={24} />
                    </div>
                    <h3 className={`font-bold text-xl mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>Rapid Deployment</h3>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-blue-500/80' : 'text-blue-700'}`}>
                        Time is money. Our team works around the clock to ensure your complete infrastructure is up, running, and warmed within just 7 days.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FullSetupPage;
