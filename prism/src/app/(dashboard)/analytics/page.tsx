'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Target, TrendingUp, AlertTriangle, ShieldCheck, Download, Filter } from 'lucide-react';

const PERFORMANCE_TREND = [
  { month: 'Jul', score: 65, target: 70 },
  { month: 'Aug', score: 72, target: 75 },
  { month: 'Sep', score: 78, target: 80 },
  { month: 'Oct', score: 85, target: 85 },
  { month: 'Nov', score: 82, target: 88 },
  { month: 'Dec', score: 90, target: 92 },
];

const THRUST_DISTRIBUTION = [
  { name: 'Revenue', value: 35, color: '#6366f1' },
  { name: 'Quality', value: 25, color: '#06b6d4' },
  { name: 'Safety', value: 20, color: '#10b981' },
  { name: 'People', value: 15, color: '#a855f7' },
  { name: 'Cost', value: 5, color: '#ec4899' },
];

const DEPARTMENT_SCORES = [
  { name: 'Engineering', score: 88 },
  { name: 'Sales', score: 92 },
  { name: 'Marketing', score: 78 },
  { name: 'HR', score: 85 },
  { name: 'Finance', score: 90 },
];

const MOCK_ESCALATIONS = [
  { id: '1', level: 'L2', employee: 'Neha Gupta', manager: 'Rohan Jain', reason: 'Goal Sheet Pending > 7 Days', status: 'Active', daysOverdue: 9 },
  { id: '2', level: 'L3', employee: 'Priya Sharma', manager: 'Amit Patel', reason: 'Q1 Check-in Not Started', status: 'Resolved', daysOverdue: 15 },
  { id: '3', level: 'L1', employee: 'Sneha Reddy', manager: 'Rahul Verma', reason: 'Goals < 100% Weightage', status: 'Active', daysOverdue: 3 },
];

const MOCK_AUDIT = [
  { id: 'a1', action: 'SYSTEM_ESCALATION', user: 'System (Cron)', details: 'Triggered L2 escalation for Neha Gupta to Sr. Manager.', time: '2 hours ago' },
  { id: 'a2', action: 'GOAL_LOCKED', user: 'Rohan Jain', details: 'Approved and locked goal sheet for Amit Patel.', time: '5 hours ago' },
  { id: 'a3', action: 'SCORE_COMPUTED', user: 'System (Engine)', details: 'Recomputed Q1 aggregate scores. Org average: 85.2%.', time: '1 day ago' },
];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'governance'>('overview');

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Organization Analytics</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Insights, Reporting & Governance Engine</p>
        </div>
        <div className="flex gap-md">
          <button className="btn btn-secondary">
            <Filter size={16} /> Filters
          </button>
          <button className="btn btn-primary">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-md" style={{ marginBottom: 'var(--space-xl)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{ background: 'none', border: 'none', color: activeTab === 'overview' ? 'white' : 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', position: 'relative' }}
        >
          Performance Overview
          {activeTab === 'overview' && <div style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: 'var(--gradient-primary)', borderRadius: '3px' }}></div>}
        </button>
        <button 
          onClick={() => setActiveTab('governance')}
          style={{ background: 'none', border: 'none', color: activeTab === 'governance' ? 'white' : 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', position: 'relative' }}
        >
          Governance & Audit
          {activeTab === 'governance' && <div style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: 'var(--gradient-primary)', borderRadius: '3px' }}></div>}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="animate-fade-in-up">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-md" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="glass-card">
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Overall Goal Attainment</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }} className="text-gradient-success">85.2%</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(16,185,129,0.8)', marginTop: 'var(--space-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={12} /> +2.4% vs last quarter</div>
            </div>
            <div className="glass-card">
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Goals Locked</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>92%</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-xs)' }}>4,102 / 4,450 Employees</div>
            </div>
            <div className="glass-card">
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Q1 Check-ins Completed</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }} className="text-gradient-info">78%</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-xs)' }}>820 Pending</div>
            </div>
            <div className="glass-card">
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Active Escalations</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, color: '#ef4444' }}>14</div>
              <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: 'var(--space-xs)' }}>Requires HR attention</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Trend Chart */}
            <div className="glass-panel col-span-8">
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Org Performance Trend</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_TREND} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} domain={[0, 100]} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(10, 13, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }} itemStyle={{ color: 'white' }} />
                    <Legend />
                    <Area type="monotone" dataKey="score" name="Actual Score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    <Area type="monotone" dataKey="target" name="Target Trajectory" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Thrust Distribution */}
            <div className="glass-panel col-span-4">
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Thrust Area Focus</h3>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={THRUST_DISTRIBUTION} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {THRUST_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(10, 13, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: 'white' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-xs mt-md">
                {THRUST_DISTRIBUTION.map((item, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ fontSize: '0.85rem' }}>
                    <div className="flex items-center gap-sm">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></div>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Bar Chart */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Departmental Performance</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPARTMENT_SCORES} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.8)" axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(10, 13, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="score" name="Avg Score" fill="url(#colorScore)" radius={[0, 4, 4, 0]}>
                    {DEPARTMENT_SCORES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 90 ? '#10b981' : entry.score >= 80 ? '#6366f1' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="animate-fade-in-up flex flex-col gap-lg">
          
          {/* Escalation Engine */}
          <div className="glass-panel">
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} color="var(--accent-warning)" /> Automated Escalation Engine
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>Multi-level cron jobs tracking delayed compliance.</p>
              </div>
              <span className="badge badge-locked" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                System Active
              </span>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr', gap: 'var(--space-md)', padding: '0 var(--space-md) var(--space-sm)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>
              <div>Level</div>
              <div>Employee</div>
              <div>Reason</div>
              <div>Overdue</div>
              <div>Status</div>
            </div>

            <div className="flex flex-col gap-sm">
              {MOCK_ESCALATIONS.map((esc) => (
                <div key={esc.id} className="grid glass-card items-center" style={{ gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr', gap: 'var(--space-md)', padding: '12px var(--space-md)' }}>
                  <div>
                    <span style={{ 
                      background: esc.level === 'L3' ? 'rgba(239, 68, 68, 0.2)' : esc.level === 'L2' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      color: esc.level === 'L3' ? '#ef4444' : esc.level === 'L2' ? '#f59e0b' : '#6366f1',
                      padding: '4px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem'
                    }}>{esc.level}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{esc.employee}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Mgr: {esc.manager}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>{esc.reason}</div>
                  <div style={{ color: '#ef4444', fontWeight: 600 }}>{esc.daysOverdue} Days</div>
                  <div>
                    <span className={`badge ${esc.status === 'Active' ? 'badge-draft' : 'badge-active'}`} style={{ borderColor: esc.status === 'Active' ? '#ef4444' : '' }}>{esc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="glass-panel">
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="var(--accent-success)" /> Tamper-Proof Audit Logs
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>Immutable ledger of all critical system actions.</p>
              </div>
            </div>

            <div className="flex flex-col gap-md">
              {MOCK_AUDIT.map((log) => (
                <div key={log.id} style={{ display: 'flex', gap: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={16} color="rgba(255,255,255,0.5)" />
                  </div>
                  <div>
                    <div className="flex items-center gap-sm">
                      <span style={{ fontWeight: 600 }}>{log.action}</span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>by {log.user}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-info)' }}>• {log.time}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                      {log.details}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn btn-secondary mt-md" style={{ width: '100%' }}>Load More Logs</button>
          </div>
        </div>
      )}
    </div>
  );
}
