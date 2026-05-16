'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle2, TrendingUp, AlertCircle, Clock } from 'lucide-react';

type GoalTrack = {
  id: string;
  thrustArea: string;
  title: string;
  uom: string;
  target: number;
  weightage: number;
  actual: number;
  status: 'NOT_STARTED' | 'ON_TRACK' | 'COMPLETED';
  score: number | null;
};

function computeScore(uom: string, target: number, actual: number): number {
  switch (uom) {
    case 'MIN_NUMERIC':
    case 'MIN_PERCENT':
      return target === 0 ? 0 : Math.min((actual / target) * 100, 100);
    case 'MAX_NUMERIC':
    case 'MAX_PERCENT':
      return actual === 0 ? 100 : Math.min((target / actual) * 100, 100);
    case 'TIMELINE':
      return actual <= target ? 100 : Math.max(0, 100 - ((actual - target) / target) * 100);
    case 'ZERO':
      return actual === 0 ? 100 : 0;
    default:
      return 0;
  }
}

const INITIAL_GOALS: GoalTrack[] = [
  { id: '1', thrustArea: 'Revenue', title: 'Increase Q2 software sales by 15%', uom: 'MIN_PERCENT', target: 15, weightage: 30, actual: 0, status: 'NOT_STARTED', score: null },
  { id: '2', thrustArea: 'Quality', title: 'Reduce production defects to below 2%', uom: 'MAX_PERCENT', target: 2, weightage: 25, actual: 0, status: 'NOT_STARTED', score: null },
  { id: '3', thrustArea: 'People', title: 'Complete leadership training program', uom: 'TIMELINE', target: 100, weightage: 15, actual: 0, status: 'NOT_STARTED', score: null },
  { id: '4', thrustArea: 'Safety', title: 'Zero workplace safety incidents', uom: 'ZERO', target: 0, weightage: 20, actual: 0, status: 'NOT_STARTED', score: null },
  { id: '5', thrustArea: 'Cost', title: 'Reduce operational costs by 10%', uom: 'MIN_PERCENT', target: 10, weightage: 10, actual: 0, status: 'NOT_STARTED', score: null },
];

const statusOptions = [
  { value: 'NOT_STARTED', label: 'Not Started', color: 'rgba(255,255,255,0.5)', icon: <Clock size={14} /> },
  { value: 'ON_TRACK', label: 'On Track', color: 'var(--accent-info)', icon: <TrendingUp size={14} /> },
  { value: 'COMPLETED', label: 'Completed', color: 'var(--accent-success)', icon: <CheckCircle2 size={14} /> },
];

const uomLabels: Record<string, string> = {
  MIN_NUMERIC: 'Numeric (↑ better)',
  MIN_PERCENT: '% (↑ better)',
  MAX_NUMERIC: 'Numeric (↓ better)',
  MAX_PERCENT: '% (↓ better)',
  TIMELINE: 'Timeline',
  ZERO: 'Zero = Success',
};

const thrustColors: Record<string, string> = {
  Revenue: '#6366f1',
  Quality: '#06b6d4',
  People: '#a855f7',
  Safety: '#10b981',
  Cost: '#ec4899',
};

export default function TrackAchievements() {
  const [goals, setGoals] = useState<GoalTrack[]>(INITIAL_GOALS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const currentQuarter = 'Q1';

  const updateGoal = (id: string, field: 'actual' | 'status', value: number | string) => {
    setGoals(goals.map(g => {
      if (g.id !== id) return g;
      const updated = { ...g, [field]: value };
      // Auto-compute score when actual changes
      if (field === 'actual') {
        updated.score = computeScore(g.uom, g.target, value as number);
      }
      return updated;
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 1200);
  };

  const weightedScore = goals.reduce((sum, g) => {
    return sum + ((g.score ?? 0) * g.weightage / 100);
  }, 0);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="flex items-center gap-md">
          <Link href="/goals" className="icon-btn" style={{ width: '36px', height: '36px' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-xs)' }}>
              {currentQuarter} Achievement Update
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              Log your actual achievement against planned targets
            </p>
          </div>
        </div>
        <div className="flex items-center gap-md">
          {saved && (
            <div className="flex items-center gap-xs" style={{ color: 'var(--accent-success)', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> Saved
            </div>
          )}
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Progress'}
          </button>
        </div>
      </div>

      {/* Computed Overall Score Card */}
      <div className="glass-panel" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
              stroke={weightedScore >= 80 ? 'var(--accent-success)' : weightedScore >= 50 ? 'var(--accent-info)' : 'var(--accent-primary)'}
              strokeWidth="2.5"
              strokeDasharray={`${Math.min(weightedScore, 100)}, 100`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.4s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{weightedScore.toFixed(0)}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Score</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Weighted Progress Score</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: 'var(--space-sm)' }}>
            System-computed based on {currentQuarter} actuals across all goals using the BRD formula.
          </p>
          <div className="flex gap-lg" style={{ fontSize: '0.8rem' }}>
            <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Goals tracked: </span><strong>{goals.filter(g => g.score !== null && g.score > 0).length}/{goals.length}</strong></div>
            <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Quarter: </span><strong>{currentQuarter}</strong></div>
          </div>
        </div>

        {/* Score Formula Legend */}
        <div className="glass-card" style={{ padding: 'var(--space-md)', fontSize: '0.75rem', minWidth: '200px' }}>
          <div style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'rgba(255,255,255,0.7)' }}>Score Formulas</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            Min: Actual ÷ Target<br />
            Max: Target ÷ Actual<br />
            Timeline: On-time = 100%<br />
            Zero: 0 = 100%, else 0%
          </div>
        </div>
      </div>

      {/* Goal-by-Goal Tracker */}
      <div className="flex flex-col gap-md">
        {goals.map((goal, i) => {
          const tc = thrustColors[goal.thrustArea] || '#6366f1';
          return (
            <div key={goal.id} className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                <div className="flex items-center gap-md">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${tc}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tc, border: `1px solid ${tc}33` }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{goal.title}</div>
                    <div className="flex items-center gap-sm" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      <span style={{ color: tc }}>{goal.thrustArea}</span>
                      <span>•</span>
                      <span>{uomLabels[goal.uom]}</span>
                      <span>•</span>
                      <span>Weight: {goal.weightage}%</span>
                    </div>
                  </div>
                </div>
                {goal.score !== null && (
                  <div style={{ textAlign: 'center', minWidth: '70px' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: goal.score >= 80 ? 'var(--accent-success)' : goal.score >= 50 ? 'var(--accent-info)' : goal.score > 0 ? 'var(--accent-warning)' : 'var(--accent-danger)' }}>
                      {goal.score.toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Score</div>
                  </div>
                )}
              </div>

              {/* Planned vs Actual Row */}
              <div className="grid grid-cols-3 gap-md">
                <div className="glass-card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 'var(--space-xs)' }}>Planned Target</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {goal.target}{goal.uom.includes('PERCENT') ? '%' : ''}
                  </div>
                </div>

                <div style={{ padding: 'var(--space-md)' }}>
                  <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>Actual Achievement</label>
                  <input
                    type="number"
                    className="form-control"
                    style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 600 }}
                    placeholder="Enter actual"
                    value={goal.actual || ''}
                    onChange={(e) => updateGoal(goal.id, 'actual', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div style={{ padding: 'var(--space-md)' }}>
                  <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>Status</label>
                  <select
                    className="form-control"
                    value={goal.status}
                    onChange={(e) => updateGoal(goal.id, 'status', e.target.value)}
                    style={{ textAlign: 'center', fontWeight: 600, color: statusOptions.find(s => s.value === goal.status)?.color }}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: 'var(--space-md)' }}>
                <div className="progress-container" style={{ height: '4px' }}>
                  <div className="progress-bar" style={{
                    width: `${Math.min(goal.score ?? 0, 100)}%`,
                    background: (goal.score ?? 0) >= 80 ? 'var(--gradient-success)' : (goal.score ?? 0) >= 50 ? 'var(--gradient-info)' : 'var(--gradient-primary)'
                  }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
