import React from 'react';
import { ExternalLink, Github, Twitter, Globe, MessageCircle, MapPin, Code2, Coffee, Heart, Instagram, Linkedin, ShieldCheck, Zap } from 'lucide-react';

interface DeveloperPageProps {
    isDarkMode: boolean;
}

const DeveloperPage: React.FC<DeveloperPageProps> = ({ isDarkMode }) => {
    const projects = [
        {
            name: "Cleanmails Online",
            url: "https://cleanmails.online/",
            description: "Enterprise-grade premium email validator and lead extraction engine.",
            color: "from-blue-600 to-indigo-600",
            icon: <ShieldCheck size={24} />
        },
        {
            name: "Wisdom is Fun",
            url: "https://wisdomis.fun",
            description: "AI study app which generates notes, flashcards and quizzes.",
            color: "from-blue-500 to-cyan-500",
            icon: <Coffee size={24} />
        },
        {
            name: "Talxify",
            url: "https://talxify.space",
            description: "AI Interview practicing and coding practicing app.",
            color: "from-purple-500 to-pink-500",
            icon: <Globe size={24} />
        }
    ];

    const skills = ["React", "TypeScript", "Node.js", "System Architecture", "Software Integration", "UI/UX Design"];

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-slate-900"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Code2 size={400} />
                </div>

                <div className="relative z-10 p-12 flex flex-col md:flex-row items-center gap-12 text-white">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-500 to-purple-500 p-1 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-500">
                            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                                <Code2 size={64} className="text-blue-400" />
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-xs font-bold px-4 py-2 rounded-xl border-4 border-slate-900 shadow-xl">
                            Available for hire
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Zaid
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 font-medium text-lg mb-6">
                            <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                                <MapPin size={16} className="text-purple-400" /> India
                            </div>
                            <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                                <Code2 size={16} className="text-blue-400" /> Full Stack Dev
                            </div>
                        </div>
                        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                            Crafting exceptional digital experiences with modern web technologies.
                            Passionate about clean code, beautiful UI, and solving complex problems.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className={`p-8 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            <Code2 className="text-blue-500" /> Featured Projects
                        </h2>
                        <div className="grid gap-6">
                            {projects.map((project, idx) => (
                                <a
                                    key={idx}
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group relative overflow-hidden rounded-2xl border p-6 transition-all hover:shadow-lg ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                                >
                                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${project.color}`}></div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${project.color} text-white shadow-lg`}>
                                                {project.icon}
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold mb-1 group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {project.name}
                                                </h3>
                                                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                        <ExternalLink className={`opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 group-hover:-translate-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className={`p-8 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>About Me</h2>
                        <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            I specialize in React, Node.js, and modern web technologies. My philosophy is simple: build things that are not only functional but also visually stunning and intuitive to use.
                            Whether it's a productivity tool like Cleanmails or a community platform like Wisdom is Fun, I focus on every detail.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                                <span key={idx} className={`px-4 py-2 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-blue-600'
                                    }`}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`font-bold mb-4 uppercase text-xs tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Connect</h3>
                        <div className="space-y-3">
                            <a href="https://www.instagram.com/fallen_zaid/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                                <Instagram size={20} className="text-pink-500" /> <span>Instagram</span>
                            </a>
                            <a href="https://www.linkedin.com/in/arshad-momin-a3139b21b/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                                <Linkedin size={20} className="text-blue-600" /> <span>LinkedIn</span>
                            </a>
                            <a href="https://api.whatsapp.com/send?phone=918431326909" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                                <MessageCircle size={20} className="text-emerald-500" /> <span>Chat on WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="text-center">
                            <Heart className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-rose-500' : 'text-rose-500'}`} fill="currentColor" />
                            <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Support & Customization</h3>
                            <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Need help or want a tailor-made feature for your business?
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="https://api.whatsapp.com/send?phone=918431326909&text=Hello!%20I%20need%20support%20with%20Cleanmails."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 active:scale-95 text-sm"
                                >
                                    <MessageCircle size={18} /> Contact for Support
                                </a>
                                <a
                                    href="https://api.whatsapp.com/send?phone=918431326909&text=Hello!%20I%20have%20a%20feature%20request%20for%20Cleanmails."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition-all border shadow-sm active:scale-95 text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    <Zap size={18} /> Request New Feature
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeveloperPage;
