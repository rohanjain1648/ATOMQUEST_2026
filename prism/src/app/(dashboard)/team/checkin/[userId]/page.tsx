'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle2, TrendingUp, Clock, Target } from 'lucide-react';

type GoalReview = {
  id: string;
  thrustArea: string;
  title: string;
  uom: string;
  target: number;
  weightage: number;
  actual: number;
  status: string;
  score: number;
};

const MOCK_GOALS: GoalReview[] = [
  { id: '1', thrustArea: 'Revenue', title: 'Achieve quarterly sales target of ₹50L', uom: 'MIN_NUMERIC', target: 50, weightage: 30, actual: 38, status: 'ON_TRACK', score: 76 },
  { id: '2', thrustArea: 'Quality', title: 'Reduce bug count per release to < 5', uom: 'MAX_NUMERIC', target: 5, weightage: 25, actual: 4, status: 'ON_TRACK', score: 100 },
  { id: '3', thrustArea: 'People', title: 'Mentor 2 junior developers', uom: 'MIN_NUMERIC', target: 2, weightage: 15, actual: 1, status: 'ON_TRACK', score: 50 },
  { id: '4', thrustArea: 'Safety', title: 'Zero data breach incidents', uom: 'ZERO', target: 0, weightage: 20, actual: 0, status: 'COMPLETED', score: 100 },
  { id: '5', thrustArea: 'Cost', title: 'Optimize CI/CD pipeline costs by 15%', uom: 'MIN_PERCENT', target: 15, weightage: 10, actual: 5, status: 'NOT_STARTED', score: 33 },
];

const thrustColors: Record<string, string> = {
  Revenue: '#6366f1', Quality: '#06b6d4', People: '#a855f7', Safety: '#10b981', Cost: '#ec4899',
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  NOT_STARTED: { label: 'Not Started', color: 'rgba(255,255,255,0.5)', icon: <Clock size={12} /> },
  ON_TRACK: { label: 'On Track', color: 'var(--accent-info)', icon: <TrendingUp size={12} /> },
  COMPLETED: { label: 'Completed', color: 'var(--accent-success)', icon: <CheckCircle2 size={12} /> },
};

export default function CheckInPage({ params }: { params: { userId: string } }) {
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const weightedScore = MOCK_GOALS.reduce((sum, g) => sum + (g.score * g.weightage / 100), 0);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center animate-fade-in-up" style={{ minHeight: '60vh' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-success)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle2 size={40} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>Check-in Complete</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-xl)' }}>
            Q1 check-in for Priya Sharma has been recorded. Your feedback has been logged.
          </p>
          <Link href="/team" className="btn btn-secondary">Return to Team</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="flex items-center gap-md">
          <Link href="/team" className="icon-btn" style={{ width: '36px', height: '36px' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-xs)' }}>Q1 Check-in: Priya Sharma</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Frontend Developer • Review planned vs. actual achievement</p>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="glass-panel" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
        <div style={{ position: 'relative', width: '90px', height: '90px' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
              stroke={weightedScore >= 80 ? 'var(--accent-success)' : weightedScore >= 50 ? 'var(--accent-info)' : 'var(--accent-primary)'}
              strokeWidth="2.5" strokeDasharray={`${Math.min(weightedScore, 100)}, 100`} strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{weightedScore.toFixed(0)}</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Score</div>
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: 'var(--space-xs)' }}>Q1 Weighted Progress</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Aggregated score from all {MOCK_GOALS.length} goals based on BRD formulas.</p>
        </div>
      </div>

      {/* Planned vs Actual Table */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Planned vs. Achievement</h3>

        {/* Table Header */}
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 'var(--space-md)', padding: '0 var(--space-md) var(--space-sm)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div>Goal</div>
          <div style={{ textAlign: 'center' }}>Target</div>
          <div style={{ textAlign: 'center' }}>Actual</div>
          <div style={{ textAlign: 'center' }}>Score</div>
          <div style={{ textAlign: 'center' }}>Status</div>
        </div>

        <div className="flex flex-col gap-sm">
          {MOCK_GOALS.map((goal) => {
            const tc = thrustColors[goal.thrustArea] || '#6366f1';
            const sc = statusConfig[goal.status];
            return (
              <div key={goal.id} className="grid glass-card" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 'var(--space-md)', padding: '14px var(--space-md)', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{goal.title}</div>
                  <div style={{ fontSize: '0.75rem', color: tc }}>{goal.thrustArea} • {goal.weightage}% weight</div>
                </div>
                <div style={{ textAlign: 'center', fontWeight: 600 }}>
                  {goal.target}{goal.uom.includes('PERCENT') ? '%' : ''}
                </div>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: goal.actual >= goal.target ? 'var(--accent-success)' : 'var(--accent-info)' }}>
                  {goal.actual}{goal.uom.includes('PERCENT') ? '%' : ''}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: goal.score >= 80 ? 'var(--accent-success)' : goal.score >= 50 ? 'var(--accent-info)' : '#f59e0b' }}>{goal.score}%</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: `${sc.color}18`, color: sc.color, padding: '3px 8px', borderRadius: '16px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {sc.icon} {sc.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Check-in Comment */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-sm)' }}>Check-in Feedback</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}>
          Document key discussion points, blockers, and development areas from the check-in conversation.
        </p>
        <textarea
          className="form-control"
          rows={5}
          placeholder="Share your feedback on progress, blockers, and areas for improvement..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ resize: 'none', marginBottom: 'var(--space-lg)' }}
        />
        <div className="flex justify-between items-center">
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            This will be visible to the employee and logged for audit purposes.
          </div>
          <button onClick={handleSubmit} className="btn btn-primary" disabled={!comment.trim() || submitting}>
            <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Check-in'}
          </button>
        </div>
      </div>
    </div>
  );
}
