'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Target, TrendingUp, AlertTriangle, ShieldCheck, Download, Filter, FileSpreadsheet, X, Check, ChevronDown } from 'lucide-react';

export default function AnalyticsClient({ data: initialData }: { data: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'governance'>('overview');
  const [exporting, setExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [selectedThrust, setSelectedThrust] = useState<string>('All Thrust Areas');

  const departments = useMemo(() => {
    const depts = new Set<string>();
    initialData.rawEmployees.forEach((e: any) => depts.add(e.department || 'Unknown'));
    return ['All Departments', ...Array.from(depts)];
  }, [initialData.rawEmployees]);

  const thrustAreas = ['All Thrust Areas', 'Revenue', 'Quality', 'Safety', 'People', 'Cost'];

  // Re-calculate everything based on filters
  const filteredData = useMemo(() => {
    let employees = initialData.rawEmployees;
    
    // 1. Filter by Department
    if (selectedDept !== 'All Departments') {
      employees = employees.filter((e: any) => (e.department || 'Unknown') === selectedDept);
    }

    let totalScoreSum = 0;
    let employeesWithScores = 0;
    let lockedSheets = 0;
    const statusCount = { COMPLETED: 0, ON_TRACK: 0, NOT_STARTED: 0 };
    const thrustAttainmentMap = new Map<string, { actual: number; target: number; count: number }>();

    employees.forEach((emp: any) => {
      const sheet = emp.goalSheets[0];
      if (sheet?.status === 'LOCKED') lockedSheets++;

      let empScore = 0;
      if (sheet) {
        sheet.goals.forEach((goal: any) => {
          // 2. Filter by Thrust Area (for some aggregations)
          if (selectedThrust !== 'All Thrust Areas' && goal.thrustArea !== selectedThrust) return;

          if (!thrustAttainmentMap.has(goal.thrustArea)) {
            thrustAttainmentMap.set(goal.thrustArea, { actual: 0, target: 100, count: 0 });
          }
          const tData = thrustAttainmentMap.get(goal.thrustArea)!;
          tData.count++;

          const ach = goal.achievements.find((a: any) => a.quarter === 'Q1');
          if (ach) {
            if (ach.status === 'COMPLETED') statusCount.COMPLETED++;
            else if (ach.status === 'ON_TRACK') statusCount.ON_TRACK++;
            else statusCount.NOT_STARTED++;

            if (ach.score) {
              empScore += (ach.score * goal.weightage) / 100;
              tData.actual += ach.score;
            }
          } else {
            statusCount.NOT_STARTED++;
          }
        });
      }

      if (empScore > 0) {
        totalScoreSum += empScore;
        employeesWithScores++;
      }
    });

    const attainment = employeesWithScores > 0 ? (totalScoreSum / employeesWithScores) : 0;
    
    return {
      kpis: {
        attainment: attainment.toFixed(1),
        lockedPercent: employees.length > 0 ? Math.round((lockedSheets / employees.length) * 100) : 0,
        lockedSheets,
        totalEmployees: employees.length,
        activeEscalations: initialData.kpis.activeEscalations // Keep global for context
      },
      statusDistribution: [
        { name: 'Completed', value: statusCount.COMPLETED, fill: '#10b981' },
        { name: 'On Track', value: statusCount.ON_TRACK, fill: '#6366f1' },
        { name: 'Not Started', value: statusCount.NOT_STARTED, fill: '#ef4444' },
      ],
      thrustRadar: Array.from(thrustAttainmentMap.entries()).map(([subject, data]) => ({
        subject,
        A: data.count > 0 ? Math.round(data.actual / data.count) : 0,
        fullMark: 100,
      }))
    };
  }, [initialData, selectedDept, selectedThrust]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PRISM_Achievement_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
    setExporting(false);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Organization Analytics</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Insights, Reporting & Governance Engine</p>
        </div>
        <div className="flex gap-md" style={{ position: 'relative' }}>
          <button className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} /> Filters
            {(selectedDept !== 'All Departments' || selectedThrust !== 'All Thrust Areas') && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-dark)' }}></span>
            )}
          </button>
          
          {showFilters && (
            <div className="glass-panel animate-fade-in-up" style={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              marginTop: '10px', 
              width: '280px', 
              zIndex: 100,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              padding: 'var(--space-md)'
            }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dashboard Filters</span>
                <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={16} /></button>
              </div>

              <div className="flex flex-col gap-md">
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Department</label>
                  <select className="form-control" style={{ fontSize: '0.85rem', padding: '8px' }} value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Thrust Area</label>
                  <select className="form-control" style={{ fontSize: '0.85rem', padding: '8px' }} value={selectedThrust} onChange={(e) => setSelectedThrust(e.target.value)}>
                    {thrustAreas.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.8rem', marginTop: '4px' }}
                  onClick={() => { setSelectedDept('All Departments'); setSelectedThrust('All Thrust Areas'); }}
                >
                  Reset All
                </button>
              </div>
            </div>
          )}

          <button className="btn btn-secondary" onClick={handleExportCSV} disabled={exporting}>
            <FileSpreadsheet size={16} /> {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button className="btn btn-primary">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedDept !== 'All Departments' || selectedThrust !== 'All Thrust Areas') && (
        <div className="flex gap-sm" style={{ marginBottom: 'var(--space-lg)' }}>
          {selectedDept !== 'All Departments' && (
            <span className="badge badge-locked" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}>
              Dept: {selectedDept} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedDept('All Departments')} />
            </span>
          )}
          {selectedThrust !== 'All Thrust Areas' && (
            <span className="badge badge-locked" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}>
              Area: {selectedThrust} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedThrust('All Thrust Areas')} />
            </span>
          )}
        </div>
      )}

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
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }} className="text-gradient-success">{filteredData.kpis.attainment}%</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(16,185,129,0.8)', marginTop: 'var(--space-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={12} /> +2.4% vs last quarter</div>
            </div>
            <div className="glass-card">
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Goals Locked</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{filteredData.kpis.lockedPercent}%</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-xs)' }}>{filteredData.kpis.lockedSheets} / {filteredData.kpis.totalEmployees} Employees</div>
            </div>
            <div className="glass-card">
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Q1 Check-ins Completed</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }} className="text-gradient-info">{initialData.kpis.checkinsCompletedPercent}%</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-xs)' }}>{initialData.kpis.pendingCheckins} Pending</div>
            </div>
            <div className="glass-card">
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Active Escalations</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, color: '#ef4444' }}>{filteredData.kpis.activeEscalations}</div>
              <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: 'var(--space-xs)' }}>Requires HR attention</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Trend Chart */}
            <div className="glass-panel col-span-12 lg-col-span-8" style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Org Performance Trend (QoQ)</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={initialData.performanceTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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

            {/* Status Distribution (Stacked Bar) */}
            <div className="glass-panel col-span-12 lg-col-span-4 flex flex-col justify-between" style={{ minWidth: 0 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Goal Status Heatmap</h3>
                <div style={{ height: '220px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData.statusDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.8)" axisLine={false} tickLine={false} width={100} />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(10, 13, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {filteredData.statusDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Thrust Radar Chart */}
            <div className="glass-panel col-span-12 lg-col-span-4" style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Thrust Area Attainment (Radar)</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={filteredData.thrustRadar}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Attainment" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.5} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(10, 13, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Manager Effectiveness */}
            <div className="glass-panel col-span-12 lg-col-span-8" style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Manager Effectiveness Dashboard</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={initialData.managerEffectiveness} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="manager" stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} domain={[0, 100]} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(10, 13, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Legend />
                    <Bar dataKey="checkins" name="Check-in Completion %" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="approvals" name="On-Time Approvals %" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
              {initialData.escalations.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No active escalations.</div>
              ) : initialData.escalations.map((esc: any) => (
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
              {initialData.auditLogs.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No audit logs found.</div>
              ) : initialData.auditLogs.map((log: any) => (
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
          </div>
        </div>
      )}
    </div>
  );
}
