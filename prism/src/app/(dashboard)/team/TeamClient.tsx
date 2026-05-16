'use client';

import { useState } from 'react';
import { Users, Target, ArrowRight, MessageSquare, Share2, Plus, CheckCircle2, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type TeamMember = {
  id: string;
  name: string;
  department: string;
  goals: any[];
  weightedScore: number;
  checkinDone: boolean;
  onTrack: number;
  completed: number;
  notStarted: number;
  sheet: any;
};

export default function TeamClient({ teamData }: { teamData: TeamMember[] }) {
  const [showSharedGoalModal, setShowSharedGoalModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [sharedGoal, setSharedGoal] = useState({
    thrustArea: 'Revenue',
    title: '',
    uom: 'MIN_NUMERIC',
    target: 0,
    weightage: 10,
  });
  const [pushing, setPushing] = useState(false);
  const [pushed, setPushed] = useState(false);
  const [pushResults, setPushResults] = useState<any[]>([]);

  const thrustColors: Record<string, string> = { Revenue: '#6366f1', Quality: '#06b6d4', Safety: '#10b981', People: '#a855f7', Cost: '#ec4899' };
  const gradients = ['linear-gradient(135deg, #6366f1, #a855f7)', 'linear-gradient(135deg, #06b6d4, #10b981)', 'linear-gradient(135deg, #ec4899, #f59e0b)', 'linear-gradient(135deg, #10b981, #06b6d4)'];

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handlePushGoal = async () => {
    if (!sharedGoal.title || !sharedGoal.target || selectedEmployees.length === 0) return;
    setPushing(true);
    try {
      const res = await fetch('/api/shared-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          managerId: 'mgr-rohan',
          employeeIds: selectedEmployees,
          ...sharedGoal,
        }),
      });
      const data = await res.json();
      setPushResults(data.results || []);
      setPushed(true);
    } catch (e) {
      console.error('Push failed', e);
    }
    setPushing(false);
  };

  const resetModal = () => {
    setShowSharedGoalModal(false);
    setPushed(false);
    setPushResults([]);
    setSelectedEmployees([]);
    setSharedGoal({ thrustArea: 'Revenue', title: '', uom: 'MIN_NUMERIC', target: 0, weightage: 10 });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>My Team</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>{teamData.length} Direct Reports • FY 2026-27</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowSharedGoalModal(true)}>
          <Share2 size={16} /> Push Shared Goal
        </button>
      </div>

      <div className="flex flex-col gap-lg">
        {teamData.map((member, i) => {
          const initials = member.name.split(' ').map(n => n[0]).join('');
          return (
            <div key={member.id} className="glass-panel">
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                <div className="flex items-center gap-md">
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: gradients[i % gradients.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>{initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{member.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{member.department} • {member.goals.length} Goals</div>
                  </div>
                </div>
                <div className="flex gap-sm">
                  <span className={`badge ${member.sheet?.status === 'LOCKED' ? 'badge-locked' : member.sheet?.status === 'SUBMITTED' ? 'badge-active' : 'badge-draft'}`}>
                    {member.sheet?.status || 'NO SHEET'}
                  </span>
                </div>
              </div>

              <div className="flex gap-sm" style={{ marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
                {member.goals.map((goal: any) => {
                  const ach = goal.achievements?.find((a: any) => a.quarter === 'Q1');
                  return (
                    <span key={goal.id} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${thrustColors[goal.thrustArea]}33`, color: thrustColors[goal.thrustArea] }}>
                      {ach?.status === 'COMPLETED' ? '✓' : ach?.status === 'ON_TRACK' ? '↗' : '○'} {goal.thrustArea}
                      {goal.isShared && <span style={{ marginLeft: '4px', opacity: 0.6 }}>🔗</span>}
                    </span>
                  );
                })}
              </div>

              <div className="flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 'var(--space-md)' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  Weighted Score: <strong style={{ color: 'white' }}>{member.weightedScore.toFixed(1)}%</strong>
                  {member.checkinDone && <span style={{ marginLeft: '12px', color: 'var(--accent-success)' }}>✓ Check-in Complete</span>}
                </div>
                <div className="flex gap-sm">
                  {member.sheet?.status === 'SUBMITTED' && (
                    <Link href={`/team/${member.id}`} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>Review <ArrowRight size={14} /></Link>
                  )}
                  {member.sheet?.status === 'LOCKED' && !member.checkinDone && (
                    <Link href={`/team/checkin/${member.id}`} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 16px' }}><MessageSquare size={14} /> Check-in</Link>
                  )}
                  {member.sheet?.status === 'LOCKED' && member.checkinDone && (
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Reviewed ✓</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared Goal Modal — BRD Section 2.1 */}
      {showSharedGoalModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-fade-in-up" style={{ maxWidth: '600px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
            
            {pushed ? (
              <div className="text-center" style={{ padding: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-success)' }}>
                    <CheckCircle2 size={32} />
                  </div>
                </div>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>Shared Goal Pushed!</h3>
                <div className="flex flex-col gap-sm" style={{ textAlign: 'left', marginBottom: 'var(--space-lg)' }}>
                  {pushResults.map((r: any, i: number) => (
                    <div key={i} className="glass-card flex justify-between items-center" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                      <span>{teamData.find(m => m.id === r.employeeId)?.name || r.employeeId}</span>
                      <span className={`badge ${r.status === 'ADDED' ? 'badge-active' : 'badge-draft'}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
                <button onClick={resetModal} className="btn btn-secondary">Close</button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Share2 size={20} color="var(--accent-primary)" /> Push Shared Goal (KPI)
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>
                      Push a departmental KPI to selected employees. Title and Target will be read-only for them.
                    </p>
                  </div>
                  <button onClick={resetModal} className="icon-btn" style={{ width: '32px', height: '32px' }}>
                    <X size={16} />
                  </button>
                </div>

                {/* Goal Definition */}
                <div className="flex flex-col gap-md" style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="grid grid-cols-2 gap-md">
                    <div className="form-group">
                      <label className="form-label">Thrust Area</label>
                      <select className="form-control" value={sharedGoal.thrustArea} onChange={e => setSharedGoal({ ...sharedGoal, thrustArea: e.target.value })}>
                        <option value="Revenue">Revenue Growth</option>
                        <option value="Cost">Cost Optimization</option>
                        <option value="Quality">Quality & Delivery</option>
                        <option value="Safety">Safety & Compliance</option>
                        <option value="People">People & Culture</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">UoM</label>
                      <select className="form-control" value={sharedGoal.uom} onChange={e => setSharedGoal({ ...sharedGoal, uom: e.target.value })}>
                        <option value="MIN_NUMERIC">Numeric (Higher better)</option>
                        <option value="MIN_PERCENT">% (Higher better)</option>
                        <option value="MAX_NUMERIC">Numeric (Lower better)</option>
                        <option value="TIMELINE">Timeline</option>
                        <option value="ZERO">Zero-based</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Goal Title (Read-only for recipients)</label>
                    <input type="text" className="form-control" placeholder="e.g., Achieve 95% SLA compliance across department" value={sharedGoal.title} onChange={e => setSharedGoal({ ...sharedGoal, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div className="form-group">
                      <label className="form-label">Target (Read-only for recipients)</label>
                      <input type="number" className="form-control" value={sharedGoal.target || ''} onChange={e => setSharedGoal({ ...sharedGoal, target: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Default Weightage (%)</label>
                      <input type="number" className="form-control" value={sharedGoal.weightage || ''} onChange={e => setSharedGoal({ ...sharedGoal, weightage: parseInt(e.target.value) || 0 })} />
                      {sharedGoal.weightage > 0 && sharedGoal.weightage < 10 && (
                        <div className="flex items-center gap-xs text-danger" style={{ marginTop: '4px', fontSize: '0.75rem' }}>
                          <AlertCircle size={12} /> Min 10%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employee Selection */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>Select Recipients</label>
                  <div className="flex flex-col gap-sm">
                    {teamData.map((member) => {
                      const isSelected = selectedEmployees.includes(member.id);
                      const isLocked = member.sheet?.status === 'LOCKED';
                      return (
                        <button
                          key={member.id}
                          onClick={() => !isLocked && toggleEmployee(member.id)}
                          className="glass-card flex items-center justify-between"
                          style={{
                            padding: '10px var(--space-md)',
                            cursor: isLocked ? 'not-allowed' : 'pointer',
                            opacity: isLocked ? 0.4 : 1,
                            border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                            background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                            textAlign: 'left',
                            width: '100%',
                            color: 'white',
                          }}
                        >
                          <div className="flex items-center gap-sm">
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isSelected ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                              {isSelected ? '✓' : member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{member.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{member.department} • {member.goals.length} goals</div>
                            </div>
                          </div>
                          {isLocked && <span className="badge badge-locked" style={{ fontSize: '0.65rem' }}>LOCKED</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={resetModal} className="btn btn-secondary">Cancel</button>
                  <button
                    onClick={handlePushGoal}
                    className="btn btn-primary"
                    disabled={pushing || !sharedGoal.title || !sharedGoal.target || selectedEmployees.length === 0 || sharedGoal.weightage < 10}
                  >
                    {pushing ? 'Pushing...' : `Push to ${selectedEmployees.length} Employee${selectedEmployees.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
