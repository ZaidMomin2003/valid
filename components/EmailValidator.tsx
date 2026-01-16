import React, { useState, useEffect, useRef } from 'react';
import { EmailStatus, EmailRecord } from '../types.ts';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download, Trash2, Zap, Search, Filter, ShieldCheck, Mail, Globe, User, ShieldAlert, Ban, XCircle, Server } from 'lucide-react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { validateEmailDeep } from '../utils/validationEngine.ts';

interface EmailValidatorProps {
  onComplete: (results: EmailRecord[]) => void;
  isDarkMode: boolean;
  initialEmails?: string[];
  initialData?: any[];
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const EmailValidator: React.FC<EmailValidatorProps> = ({ onComplete, isDarkMode, initialEmails, initialData }) => {
  const [inputText, setInputText] = useState('');
  const isBatchModeRef = useRef(false);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      isBatchModeRef.current = true;
      processEmails(initialData);
    } else if (initialEmails && initialEmails.length > 0) {
      setInputText(initialEmails.join('\n'));
    }
  }, [initialEmails, initialData]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLiveValidating, setIsLiveValidating] = useState(false);
  const [results, setResults] = useState<EmailRecord[]>([]);
  const [activeTab, setActiveTab] = useState<EmailStatus | 'ALL'>('ALL');
  const [progress, setProgress] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [currentlyProcessed, setCurrentlyProcessed] = useState(0);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('cleanmails_last_results');
    const savedInput = localStorage.getItem('cleanmails_last_input');

    if (savedResults) {
      try {
        const parsed = JSON.parse(savedResults);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setResults(parsed);
        }
      } catch (e) {
        console.error("Failed to load saved results", e);
      }
    }

    if (savedInput) {
      setInputText(savedInput);
    }
  }, []);

  // Persist state to localStorage on change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem('cleanmails_last_results', JSON.stringify(results));
    } else {
      localStorage.removeItem('cleanmails_last_results');
    }
  }, [results]);

  useEffect(() => {
    localStorage.setItem('cleanmails_last_input', inputText);
  }, [inputText]);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parseEmails = (text: string) => {
    return Array.from(new Set(text.split(/[\n,\r\s]+/).filter(e => e.includes('@')).map(e => e.trim())));
  };

  const validateBatchDeeply = async (emails: string[]): Promise<EmailRecord[]> => {
    const results: EmailRecord[] = [];
    for (const email of emails) {
      results.push(await validateEmailDeep(email));
    }
    return results;
  };

  useEffect(() => {
    const emails = parseEmails(inputText);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (emails.length === 0) {
      if (results.length > 0 && !isProcessing && !isBatchModeRef.current) setResults([]);
      return;
    }
    isBatchModeRef.current = false;

    const localCheckResults: EmailRecord[] = emails.map(email => {
      const existing = results.find(r => r.email === email);
      if (existing) return existing;
      const isValidSyntax = EMAIL_REGEX.test(email);
      return {
        email,
        status: isValidSyntax ? EmailStatus.GOOD : EmailStatus.BAD,
        reason: isValidSyntax ? 'Pending validation...' : 'Invalid syntax',
        confidence: isValidSyntax ? 0.5 : 0.0,
      };
    });

    setResults(prev => {
      const prevEmails = prev.map(p => p.email).join(',');
      const currentEmails = localCheckResults.map(c => c.email).join(',');
      return prevEmails !== currentEmails ? localCheckResults : prev;
    });

    debounceTimerRef.current = setTimeout(async () => {
      setIsLiveValidating(true);
      const emailsToVerify = emails.slice(0, 10); // Check fewer live to keep it fast
      const verifiedResults = await validateBatchDeeply(emailsToVerify);
      setResults(prev => {
        const merged = [...prev];
        verifiedResults.forEach(v => {
          const idx = merged.findIndex(m => m.email === v.email);
          if (idx !== -1) merged[idx] = v;
          else merged.push(v);
        });
        return [...merged];
      });
      setIsLiveValidating(false);
    }, 1500); // Increased debounce to prevent heavy re-renders during manual typing

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText]);

  const processEmails = async (inputs: any[]) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProgress(0);

    // Normalize inputs to objects that keep track of original row and target email
    const normalized = inputs.map(input => {
      let email = '';
      let originalRow = {};

      if (typeof input === 'string') {
        email = input.trim();
        originalRow = { email };
      } else if (Array.isArray(input)) {
        // Handle array from header:1
        email = input.find(cell => typeof cell === 'string' && EMAIL_REGEX.test(cell)) || '';
        originalRow = { ...input };
      } else {
        originalRow = input;
        const emailKey = Object.keys(input).find(k => k.toLowerCase() === 'email') ||
          Object.keys(input).find(k => typeof input[k] === 'string' && EMAIL_REGEX.test(input[k]));
        email = emailKey ? String(input[emailKey]).trim() : '';
      }
      return { email, originalRow };
    }).filter(item => item.email && item.email.includes('@'));

    if (normalized.length === 0) {
      setIsProcessing(false);
      return;
    }

    setTotalToProcess(normalized.length);
    setCurrentlyProcessed(0);

    const uniqueEmails = Array.from(new Set(normalized.map(n => n.email.toLowerCase())));
    const validationMap = new Map<string, EmailRecord>();

    const batchSize = 5;
    for (let i = 0; i < uniqueEmails.length; i += batchSize) {
      const batch = uniqueEmails.slice(i, i + batchSize);
      try {
        const batchResults = await validateBatchDeeply(batch);
        batchResults.forEach(res => {
          validationMap.set(res.email.toLowerCase(), res);
        });
      } catch (err) {
        console.error("Batch validation failed", err);
      }

      // Show progress based on original row count
      const processedUniqueCount = i + batch.length;
      const processedUniqueSlice = uniqueEmails.slice(0, processedUniqueCount);
      const processedOriginalCount = normalized.filter(n =>
        processedUniqueSlice.includes(n.email.toLowerCase())
      ).length;

      setCurrentlyProcessed(processedOriginalCount);
      setProgress(Math.round((processedOriginalCount / normalized.length) * 100));
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const finalResults = normalized.map(n => {
      const validationResult = validationMap.get(n.email.toLowerCase());
      return {
        ...n.originalRow,
        ...(validationResult || { email: n.email, status: EmailStatus.BAD, reason: 'Validation failed', confidence: 0 })
      };
    });

    setResults(finalResults);
    onComplete(finalResults);
    setIsProcessing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      let inputs: any[] = [];
      if (file.name.endsWith('.txt')) {
        inputs = parseEmails(data as string);
      } else {
        isBatchModeRef.current = true;
        const workbook = XLSX.read(data, {
          type: file.name.endsWith('.csv') ? 'string' : 'binary'
        });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        inputs = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        if (inputs.length === 0) {
          const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          inputs = (raw as any[]).map(row => (Array.isArray(row) ? { ...row } : row));
        }
      }
      processEmails(inputs);
    };

    if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const filteredResults = activeTab === 'ALL'
    ? results
    : results.filter(r => r.status === activeTab);

  const downloadResults = (format: 'xlsx' | 'csv') => {
    const dataToExport = (activeTab === 'ALL' ? results : filteredResults).map(record => {
      const { checks, ...rest } = record;
      const flattened: any = { ...rest };
      if (checks) {
        flattened.check_syntax = checks.syntax ? 'PASS' : 'FAIL';
        flattened.check_dns = checks.dns ? 'PASS' : 'FAIL';
        flattened.check_mx = checks.mx ? 'PASS' : 'FAIL';
        flattened.check_disposable = checks.disposable ? 'PASS' : 'FAIL';
        flattened.check_social = checks.social ? 'PASS' : 'FAIL';
        flattened.check_role = checks.role ? 'PASS' : 'FAIL';
        flattened.check_blacklist = checks.blacklist ? 'PASS' : 'FAIL';
      }
      return flattened;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Verified Emails");

    if (format === 'csv') {
      XLSX.writeFile(wb, `email_validation_${activeTab.toLowerCase()}.csv`, { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, `email_validation_${activeTab.toLowerCase()}.xlsx`, { bookType: 'xlsx' });
    }
  };

  const getStatusColor = (status: EmailStatus | 'ALL') => {
    switch (status) {
      case EmailStatus.GOOD: return 'emerald';
      case EmailStatus.RISKY: return 'amber';
      case EmailStatus.BAD: return 'rose';
      default: return 'slate';
    }
  };

  const getCounts = () => {
    const counts: Record<string, number> = { ALL: results.length };
    counts[EmailStatus.GOOD] = results.filter(r => r.status === EmailStatus.GOOD).length;
    counts[EmailStatus.RISKY] = results.filter(r => r.status === EmailStatus.RISKY).length;
    counts[EmailStatus.BAD] = results.filter(r => r.status === EmailStatus.BAD).length;
    return counts;
  };

  const counts = getCounts();

  const CheckItem = ({ success, label, icon: Icon }: { success?: boolean, label: string, icon: any }) => (
    <div className="flex flex-col items-center gap-1 group/item relative">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${success === true ? 'bg-emerald-500/10 text-emerald-500' :
        success === false ? 'bg-rose-500/10 text-rose-500' :
          'bg-slate-800/10 text-slate-400'
        }`}>
        {success === true ? <CheckCircle2 size={14} /> : success === false ? <XCircle size={14} /> : <Icon size={14} />}
      </div>
      <span className="text-[8px] font-bold uppercase tracking-tighter opacity-40 group-hover/item:opacity-100 transition-opacity whitespace-nowrap text-slate-500">{label}</span>
      <div className={`absolute -top-10 scale-0 group-hover/item:scale-100 transition-all p-2 rounded-lg bg-slate-900 text-white text-[10px] whitespace-nowrap z-[60] border border-slate-700 shadow-xl pointer-events-none uppercase font-black`}>
        {label}: {success === true ? 'Passed' : success === false ? 'Failed' : 'Testing...'}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        <div className={`lg:col-span-2 p-8 rounded-3xl border transition-colors duration-300 shadow-sm space-y-6 flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <Zap size={20} className={isLiveValidating ? "animate-pulse" : ""} />
              </div>
              <div>
                <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  Validation Engine
                  {isLiveValidating && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wider">Deep Scan</span>}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Enter emails for multi-layered verification</p>
              </div>
            </div>
            {inputText.length > 0 && (
              <button
                onClick={() => setInputText('')}
                className={`transition-colors p-2 rounded-lg ${isDarkMode ? 'text-slate-600 hover:text-rose-400 hover:bg-rose-400/10' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'}`}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <div className="relative flex-1 group">
            <textarea
              className={`w-full h-80 p-6 rounded-2xl outline-none transition-all resize-none font-mono text-sm leading-relaxed border ${isDarkMode
                ? 'bg-slate-950 border-slate-800 text-slate-300 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
                }`}
              placeholder="Enter emails here...&#10;user@example.com&#10;test@invalid-domain&#10;support@google.com"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            {!inputText && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                <FileText size={48} className={isDarkMode ? 'text-slate-800' : 'text-slate-300'} />
                <span className={isDarkMode ? 'text-slate-700' : 'text-slate-400'}>Waiting for input...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => processEmails(parseEmails(inputText))}
              disabled={isProcessing || !inputText.trim()}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 active:scale-95"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Process List & Export'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`p-8 rounded-3xl border-dashed border-2 transition-colors flex flex-col items-center justify-center text-center space-y-4 group relative overflow-hidden h-48 ${isDarkMode
            ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50'
            : 'bg-white border-slate-200 hover:border-blue-400'
            }`}>
            <div className={`absolute inset-0 transition-opacity pointer-events-none ${isDarkMode ? 'bg-blue-500/5 opacity-0 group-hover:opacity-100' : 'bg-blue-50 opacity-0 group-hover:opacity-100'}`} />
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 z-10 ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Upload size={24} />
            </div>
            <div className="z-10">
              <h3 className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Upload List</h3>
              <p className="text-slate-500 text-xs">Bulk processing enabled</p>
            </div>
            <label className="z-10 cursor-pointer text-blue-500 text-sm font-bold hover:underline">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls,.txt"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
            </label>
          </div>

          <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h4 className={`font-bold text-sm uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-800'}`}>Verification Stream</h4>
            <div className="space-y-3 max-h-[20rem] overflow-y-auto pr-2 custom-scrollbar">
              {results.length === 0 ? (
                <div className="text-center py-10">
                  <Search className={`mx-auto mb-2 ${isDarkMode ? 'text-slate-800' : 'text-slate-200'}`} size={32} />
                  <p className="text-slate-500 text-xs italic">Awaiting data</p>
                </div>
              ) : (
                results.slice(0, 50).map((record, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border animate-in slide-in-from-right-2 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${record.status === EmailStatus.GOOD ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                      record.status === EmailStatus.RISKY ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                        'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{record.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className={`p-10 rounded-[2.5rem] border shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30 ring-4 ring-blue-100/10">
                  <ShieldCheck size={32} className="animate-pulse" />
                </div>
                <div>
                  <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Deep Analysis Engine</h3>
                  <p className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Performing multi-layered checks on your email list.</p>
                </div>
              </div>
              <div className={`px-6 py-3 rounded-2xl border flex flex-col items-center ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-blue-50 border-blue-100'}`}>
                <span className="text-4xl font-black text-blue-500 leading-none">{progress}%</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Status</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Processing: {currentlyProcessed.toLocaleString()} / {totalToProcess.toLocaleString()}
                </span>
              </div>
              <div className={`w-full h-4 rounded-full overflow-hidden p-1 border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100'}`}>
                <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className={`p-8 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Detailed Testing Report</h3>
              <div className="flex items-center gap-2">
                {(['ALL', EmailStatus.GOOD, EmailStatus.RISKY, EmailStatus.BAD] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {tab} ({counts[tab]})
                  </button>
                ))}
                <div className="relative group/export ml-4">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 shadow-lg"
                  >
                    <Download size={14} /> EXPORT
                  </button>
                  <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-xl bg-white border border-slate-200 p-2 opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-[100] dark:bg-slate-900 dark:border-slate-800">
                    <button
                      onClick={() => downloadResults('xlsx')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Excel (.xlsx)
                    </button>
                    <button
                      onClick={() => downloadResults('csv')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      CSV (.csv)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800/50">
              <table className="w-full text-left border-collapse">
                <thead className={isDarkMode ? 'bg-slate-950 font-black' : 'bg-slate-50'}>
                  <tr>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-slate-500">Email Address</th>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-slate-500">Verdict</th>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-slate-500 text-center">Security & Compliance Checks</th>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-slate-500 text-right">Confidence Score</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {filteredResults.map((record, idx) => (
                    <tr key={`${record.email}-${idx}`} className={`transition-colors h-24 ${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{record.email}</span>
                          <span className="text-[10px] text-slate-500 mt-1">{record.reason}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black inline-block ${record.status === EmailStatus.GOOD ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          record.status === EmailStatus.RISKY ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          }`}>
                          {record.status}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <CheckItem label="Syntax" success={record.checks?.syntax} icon={Mail} />
                          <CheckItem label="DNS" success={record.checks?.dns} icon={Globe} />
                          <CheckItem label="MX" success={record.checks?.mx} icon={Server} />
                          <CheckItem label="No-Disp" success={record.checks?.disposable} icon={ShieldAlert} />
                          <CheckItem label="Social" success={record.checks?.social} icon={User} />
                          <CheckItem label="Person" success={record.checks?.role} icon={Ban} />
                          <CheckItem label="Safe" success={record.checks?.blacklist} icon={Ban} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex flex-col items-end gap-1">
                          <span className={`text-xl font-black ${record.confidence > 0.8 ? 'text-emerald-500' :
                            record.confidence > 0.5 ? 'text-amber-500' : 'text-rose-500'
                            }`}>
                            {(record.confidence * 100).toFixed(0)}%
                          </span>
                          <div className={`w-16 h-1 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div
                              className={`h-full ${record.confidence > 0.8 ? 'bg-emerald-500' : record.confidence > 0.5 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${record.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${isDarkMode ? '#334155' : '#cbd5e1'};
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default EmailValidator;
