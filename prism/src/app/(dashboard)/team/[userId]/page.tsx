'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Edit3, Lock, TrendingUp, AlertCircle } from 'lucide-react';

type ReviewGoal = {
  id: string;
  thrustArea: string;
  title: string;
  uom: string;
  target: number;
  weightage: number;
  isEditing: boolean;
};

const MOCK_REVIEW_GOALS: ReviewGoal[] = [
  { id: '1', thrustArea: 'Revenue', title: 'Achieve quarterly sales target of ₹50L', uom: 'MIN_NUMERIC', target: 50, weightage: 30, isEditing: false },
  { id: '2', thrustArea: 'Quality', title: 'Reduce bug count per release to < 5', uom: 'MAX_NUMERIC', target: 5, weightage: 25, isEditing: false },
  { id: '3', thrustArea: 'People', title: 'Mentor 2 junior developers', uom: 'MIN_NUMERIC', target: 2, weightage: 15, isEditing: false },
  { id: '4', thrustArea: 'Safety', title: 'Zero data breach incidents', uom: 'ZERO', target: 0, weightage: 20, isEditing: false },
  { id: '5', thrustArea: 'Cost', title: 'Optimize CI/CD pipeline costs by 15%', uom: 'MIN_PERCENT', target: 15, weightage: 10, isEditing: false },
];

const thrustColors: Record<string, string> = {
  Revenue: '#6366f1', Quality: '#06b6d4', People: '#a855f7', Safety: '#10b981', Cost: '#ec4899',
};

export default function ReviewGoalSheet({ params }: { params: { userId: string } }) {
  const [goals, setGoals] = useState<ReviewGoal[]>(MOCK_REVIEW_GOALS);
  const [returnComment, setReturnComment] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [approved, setApproved] = useState(false);
  const [returned, setReturned] = useState(false);

  const totalWeightage = goals.reduce((s, g) => s + g.weightage, 0);

  const toggleEdit = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, isEditing: !g.isEditing } : g));
  };

  const updateGoal = (id: string, field: 'target' | 'weightage', value: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handleApprove = () => {
    setApproved(true);
  };

  const handleReturn = () => {
    setReturned(true);
    setShowReturnModal(false);
  };

  if (approved) {
    return (
      <div className="flex flex-col items-center justify-center animate-fade-in-up" style={{ minHeight: '60vh' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-success)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
              <Lock size={40} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>Goals Approved & Locked</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-xl)' }}>
            Neha Gupta&apos;s goal sheet has been approved and locked. The employee has been notified.
          </p>
          <Link href="/team" className="btn btn-secondary">Return to Team</Link>
        </div>
      </div>
    );
  }

  if (returned) {
    return (
      <div className="flex flex-col items-center justify-center animate-fade-in-up" style={{ minHeight: '60vh' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)' }}>
              <AlertCircle size={40} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>Returned for Rework</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-xl)' }}>
            The goal sheet has been sent back to the employee with your comments for revision.
          </p>
          <Link href="/team" className="btn btn-secondary">Return to Team</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="flex items-center gap-md">
          <Link href="/team" className="icon-btn" style={{ width: '36px', height: '36px' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-xs)' }}>Review: Neha Gupta</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>QA Lead • {goals.length} goals submitted • Total: {totalWeightage}%</p>
          </div>
        </div>
        <div className="flex gap-sm">
          <button onClick={() => setShowReturnModal(true)} className="btn btn-danger" style={{ padding: '10px 20px' }}>
            <XCircle size={16} /> Return for Rework
          </button>
          <button onClick={handleApprove} className="btn btn-primary" style={{ padding: '10px 20px' }} disabled={totalWeightage !== 100}>
            <CheckCircle2 size={16} /> Approve & Lock
          </button>
        </div>
      </div>

      {/* Goals Table */}
      <div className="flex flex-col gap-md">
        {goals.map((goal, i) => {
          const tc = thrustColors[goal.thrustArea] || '#6366f1';
          return (
            <div key={goal.id} className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-sm)' }}>
                <div className="flex items-center gap-md">
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${tc}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tc, fontSize: '0.85rem', fontWeight: 700 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{goal.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      <span style={{ color: tc }}>{goal.thrustArea}</span> • {goal.uom.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <button onClick={() => toggleEdit(goal.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <Edit3 size={14} /> {goal.isEditing ? 'Done' : 'Edit Inline'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-md mt-sm">
                <div>
                  <label className="form-label">Target</label>
                  {goal.isEditing ? (
                    <input type="number" className="form-control" value={goal.target} onChange={(e) => updateGoal(goal.id, 'target', parseFloat(e.target.value) || 0)} />
                  ) : (
                    <div className="glass-card" style={{ padding: '12px 16px', fontWeight: 600 }}>{goal.target}{goal.uom.includes('PERCENT') ? '%' : ''}</div>
                  )}
                </div>
                <div>
                  <label className="form-label">Weightage (%)</label>
                  {goal.isEditing ? (
                    <input type="number" className="form-control" value={goal.weightage} onChange={(e) => updateGoal(goal.id, 'weightage', parseInt(e.target.value) || 0)} />
                  ) : (
                    <div className="glass-card" style={{ padding: '12px 16px', fontWeight: 600 }}>{goal.weightage}%</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-fade-in-up" style={{ maxWidth: '500px', width: '90%' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Return for Rework</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
              Provide a reason or feedback for the employee to revise their goals.
            </p>
            <textarea className="form-control" rows={4} placeholder="e.g., Please revise the weightage distribution..." value={returnComment} onChange={(e) => setReturnComment(e.target.value)} style={{ resize: 'none', marginBottom: 'var(--space-lg)' }} />
            <div className="flex justify-between">
              <button onClick={() => setShowReturnModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleReturn} className="btn btn-danger" disabled={!returnComment.trim()}>Return to Employee</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
