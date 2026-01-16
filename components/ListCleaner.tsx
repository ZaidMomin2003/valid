import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Download, ArrowRight, Trash2, CheckCircle2, RefreshCw, Table as TableIcon } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ListCleanerProps {
    isDarkMode: boolean;
    onNavigateToValidate: (data: any[]) => void;
}

const ListCleaner: React.FC<ListCleanerProps> = ({ isDarkMode, onNavigateToValidate }) => {
    const [rawFile, setRawFile] = useState<File | null>(null);
    const [cleanedRows, setCleanedRows] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [stats, setStats] = useState({ total: 0, duplicates: 0, invalid: 0 });
    const [isProcessing, setIsProcessing] = useState(false);

    const extractEmails = (text: string): string[] => {
        if (!text || typeof text !== 'string') return [];
        const matches = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
        return matches ? matches.map(e => e.toLowerCase().trim()) : [];
    };

    const processFile = async (file: File) => {
        setIsProcessing(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = e.target?.result;
            let workbook;

            try {
                if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                    workbook = XLSX.read(data, { type: 'binary' });
                } else {
                    workbook = XLSX.read(data, { type: 'string' });
                }

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                if (rawData.length === 0) {
                    setIsProcessing(false);
                    return;
                }

                const fileHeaders = Object.keys(rawData[0] as object);
                setHeaders(fileHeaders);

                const processedRows: any[] = [];
                const uniqueEmailSet = new Set<string>();
                let invalidCount = 0;

                rawData.forEach((row: any) => {
                    let rowEmails: { email: string, key: string }[] = [];

                    fileHeaders.forEach(key => {
                        const cellValue = row[key];
                        const emails = extractEmails(String(cellValue));
                        if (emails.length > 0) {
                            emails.forEach(email => {
                                rowEmails.push({ email, key });
                            });
                        }
                    });

                    if (rowEmails.length > 0) {
                        rowEmails.forEach(({ email, key }) => {
                            if (!uniqueEmailSet.has(email)) {
                                uniqueEmailSet.add(email);
                                const newRow = { ...row };
                                newRow[key] = email;
                                processedRows.push(newRow);
                            }
                        });
                    } else {
                        invalidCount++;
                    }
                });

                setStats({
                    total: rawData.length,
                    duplicates: 0,
                    invalid: invalidCount
                });

                setCleanedRows(processedRows);
            } catch (error) {
                console.error("Error processing file:", error);
            } finally {
                setIsProcessing(false);
            }
        };

        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsText(file);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRawFile(file);
            processFile(file);
        }
    };

    const downloadCleaned = () => {
        const ws = XLSX.utils.json_to_sheet(cleanedRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cleaned List");
        XLSX.writeFile(wb, "cleaned_email_list.csv");
    };

    const handleNavigate = () => {
        onNavigateToValidate(cleanedRows);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 gap-8">
                <div className={`p-8 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>List Cleaner</h2>
                            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Upload messy CSVs or spreadsheets. Rows with multiple emails will be expanded.</p>
                        </div>
                    </div>

                    {!rawFile ? (
                        <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors ${isDarkMode ? 'border-slate-700 hover:border-blue-500/50 bg-slate-950' : 'border-slate-300 hover:border-blue-400 bg-slate-50'}`}>
                            <Upload size={48} className={`mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                            <p className={`font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                Drag & Drop or Click to Upload
                            </p>
                            <p className="text-xs text-slate-500 mb-6">Supports CSV, Excel</p>
                            <label className="cursor-pointer">
                                <span className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                                    Select File
                                </span>
                                <input type="file" className="hidden" accept=".csv,.xlsx,.xls,.txt" onChange={handleFileUpload} />
                            </label>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <FileSpreadsheet className="text-blue-500" />
                                <span className="font-mono text-sm">{rawFile.name}</span>
                            </div>
                            <button onClick={() => { setRawFile(null); setCleanedRows([]); }} className="text-rose-500 hover:bg-rose-100 p-2 rounded-lg transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {cleanedRows.length > 0 && (
                    <div className={`p-8 rounded-3xl border shadow-sm flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Preview Cleaned Data</h3>
                            <div className="flex gap-4">
                                <div className={`px-4 py-2 rounded-lg font-bold text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    Total Rows: {cleanedRows.length}
                                </div>
                            </div>
                        </div>

                        <div className={`flex-1 rounded-xl border overflow-hidden relative mb-6 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="overflow-x-auto max-h-[500px]">
                                <table className={`w-full text-sm text-left ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                    <thead className={`text-xs uppercase font-bold sticky top-0 z-10 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                        <tr>
                                            {headers.map((header, idx) => (
                                                <th key={idx} className="px-6 py-3 border-b dark:border-slate-800 whitespace-nowrap">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cleanedRows.slice(0, 100).map((row, rowIdx) => (
                                            <tr key={rowIdx} className={`border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                                {headers.map((header, colIdx) => (
                                                    <td key={colIdx} className="px-6 py-3 whitespace-nowrap max-w-xs truncate">
                                                        {row[header]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {cleanedRows.length > 100 && (
                                    <div className={`p-4 text-center text-xs border-t ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                                        Showing first 100 rows of {cleanedRows.length}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={downloadCleaned}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-colors border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <Download size={18} /> Download Full CSV
                            </button>
                            <button
                                onClick={handleNavigate}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20"
                            >
                                Validate Emails <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {isProcessing && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <RefreshCw size={48} className="animate-spin mb-4 text-blue-500" />
                        <p className="font-bold">Processing your file...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListCleaner;
