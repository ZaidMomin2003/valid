
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { EmailRecord, EmailStatus } from '../types.ts';
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, Search } from 'lucide-react';

interface DashboardProps {
  results: EmailRecord[];
  onNavigate: () => void;
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ results, onNavigate, isDarkMode }) => {
  const stats = {
    total: results.length,
    good: results.filter(r => r.status === EmailStatus.GOOD).length,
    risky: results.filter(r => r.status === EmailStatus.RISKY).length,
    bad: results.filter(r => r.status === EmailStatus.BAD).length,
  };

  const chartData = [
    { name: 'Good', value: stats.good, color: '#10b981' },
    { name: 'Risky', value: stats.risky, color: '#f59e0b' },
    { name: 'Bad', value: stats.bad, color: '#ef4444' },
  ].filter(d => stats.total > 0 ? true : d.value > 0);

  // Calculate confidence distribution for Line Chart
  const confidenceData = Array.from({ length: 10 }, (_, i) => {
    const rangeStart = i * 10;
    const rangeEnd = (i + 1) * 10;
    const count = results.filter(r => {
      const percentage = r.confidence * 100;
      return percentage >= rangeStart && percentage < rangeEnd;
    }).length;
    return { range: `${rangeStart}-${rangeEnd}%`, count };
  });

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-pulse ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
          <Search size={40} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>No Validation Data Yet</h2>
        <p className={`max-w-md mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Upload your email list to get a detailed breakdown of your list quality and deliverability metrics.
        </p>
        <button
          onClick={onNavigate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
        >
          Start New Validation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Scanned"
          value={stats.total}
          icon={<TrendingUp size={20} />}
          color={isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Good Emails"
          value={stats.good}
          icon={<CheckCircle2 size={20} />}
          color={isDarkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-600"}
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Risky Emails"
          value={stats.risky}
          icon={<AlertTriangle size={20} />}
          color={isDarkMode ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-600"}
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Bad Emails"
          value={stats.bad}
          icon={<XCircle size={20} />}
          color={isDarkMode ? "bg-rose-900/30 text-rose-400" : "bg-rose-100 text-rose-600"}
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-1 p-6 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
          }`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    color: isDarkMode ? '#f1f5f9' : '#1e293b'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {chartData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{item.name}</span>
                </div>
                <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {stats.total > 0 ? ((item.value / stats.total) * 100).toFixed(1) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`lg:col-span-2 p-6 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
          }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Confidence Distribution</h3>
            <button className="text-blue-500 text-sm font-semibold hover:underline">View Report</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                <XAxis
                  dataKey="range"
                  stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ stroke: isDarkMode ? '#475569' : '#cbd5e1', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: isDarkMode ? '#0f172a' : '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string; isDarkMode: boolean }> = ({ title, value, icon, color, isDarkMode }) => (
  <div className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
    }`}>
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{title}</p>
        <h4 className={`text-3xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{value.toLocaleString()}</h4>
      </div>
      <div className={`p-3 rounded-2xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;
