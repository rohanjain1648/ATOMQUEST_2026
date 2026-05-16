'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Target, ChevronRight, Lock, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

type GoalData = {
  id: string;
  thrustArea: string;
  title: string;
  uom: string;
  target: number;
  weightage: number;
  status: 'NOT_STARTED' | 'ON_TRACK' | 'COMPLETED';
  achievements: {
    quarter: string;
    actual: number;
    score: number;
  }[];
};

const MOCK_GOALS: GoalData[] = [
  {
    id: '1', thrustArea: 'Revenue', title: 'Increase Q2 software sales by 15%',
    uom: 'MIN_PERCENT', target: 15, weightage: 30, status: 'ON_TRACK',
    achievements: [{ quarter: 'Q1', actual: 8, score: 53 }],
  },
  {
    id: '2', thrustArea: 'Quality', title: 'Reduce production defects to below 2%',
    uom: 'MAX_PERCENT', target: 2, weightage: 25, status: 'ON_TRACK',
    achievements: [{ quarter: 'Q1', actual: 3, score: 67 }],
  },
  {
    id: '3', thrustArea: 'People', title: 'Complete leadership training program',
    uom: 'TIMELINE', target: 100, weightage: 15, status: 'NOT_STARTED',
    achievements: [],
  },
  {
    id: '4', thrustArea: 'Safety', title: 'Zero workplace safety incidents',
    uom: 'ZERO', target: 0, weightage: 20, status: 'ON_TRACK',
    achievements: [{ quarter: 'Q1', actual: 0, score: 100 }],
  },
  {
    id: '5', thrustArea: 'Cost', title: 'Reduce operational costs by 10%',
    uom: 'MIN_PERCENT', target: 10, weightage: 10, status: 'NOT_STARTED',
    achievements: [],
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  NOT_STARTED: { label: 'Not Started', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', icon: <Clock size={12} /> },
  ON_TRACK: { label: 'On Track', color: 'var(--accent-info)', bg: 'rgba(6, 182, 212, 0.1)', icon: <TrendingUp size={12} /> },
  COMPLETED: { label: 'Completed', color: 'var(--accent-success)', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={12} /> },
};

const thrustColors: Record<string, string> = {
  Revenue: 'var(--accent-primary)',
  Quality: 'var(--accent-info)',
  People: 'var(--accent-secondary)',
  Safety: 'var(--accent-success)',
  Cost: 'var(--accent-tertiary)',
};

export default function MyGoals() {
  const weightedScore = MOCK_GOALS.reduce((sum, g) => {
    const latestAch = g.achievements[g.achievements.length - 1];
    return sum + ((latestAch?.score ?? 0) * g.weightage / 100);
  }, 0);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>My Goals</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>FY 2026-27 • <span className="badge badge-locked" style={{ verticalAlign: 'middle' }}><Lock size={10} style={{ marginRight: '4px', display: 'inline' }} />Locked</span></p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-3 gap-md" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Weighted Score</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
            <span className="text-gradient">{weightedScore.toFixed(1)}%</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-xs)' }}>Based on Q1 actuals</div>
        </div>
        <div className="glass-card">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Goals Defined</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{MOCK_GOALS.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-xs)' }}>Max 8 allowed</div>
        </div>
        <div className="glass-card">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Current Quarter</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
            <span className="text-gradient-info">Q1</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-xs)' }}>Window open: July</div>
        </div>
      </div>

      {/* Goal List */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Goal Breakdown</h3>
          <Link href="/goals/track" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <TrendingUp size={16} /> Log Q1 Achievement
          </Link>
        </div>

        <div className="flex flex-col gap-sm">
          {MOCK_GOALS.map((goal) => {
            const sc = statusConfig[goal.status];
            const latestAch = goal.achievements[goal.achievements.length - 1];
            const thrustColor = thrustColors[goal.thrustArea] || 'var(--accent-primary)';

            return (
              <Link href={`/goals/${goal.id}`} key={goal.id} className="glass-card flex justify-between items-center" style={{ textDecoration: 'none', padding: '16px 20px' }}>
                <div className="flex items-center gap-md" style={{ flex: 1 }}>
                  {/* Thrust Color Bar */}
                  <div style={{ width: '4px', height: '48px', borderRadius: '4px', background: thrustColor, boxShadow: `0 0 10px ${thrustColor}` }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-sm" style={{ marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{goal.title}</span>
                    </div>
                    <div className="flex items-center gap-md" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                      <span>{goal.thrustArea}</span>
                      <span>•</span>
                      <span>Target: {goal.target}{goal.uom.includes('PERCENT') ? '%' : ''}</span>
                      <span>•</span>
                      <span>Weight: {goal.weightage}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-lg">
                  {/* Progress circle */}
                  {latestAch && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: latestAch.score >= 80 ? 'var(--accent-success)' : latestAch.score >= 50 ? 'var(--accent-info)' : 'var(--accent-danger)' }}>
                        {latestAch.score}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Q1 Score</div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div style={{ background: sc.bg, color: sc.color, padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${sc.color}22`, minWidth: '100px', justifyContent: 'center' }}>
                    {sc.icon} {sc.label}
                  </div>

                  <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
