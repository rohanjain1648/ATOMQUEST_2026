'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, ChevronRight, CheckCircle2, Clock, AlertCircle, TrendingUp, MessageSquare } from 'lucide-react';

type TeamMember = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  goalCount: number;
  sheetStatus: 'SUBMITTED' | 'APPROVED' | 'LOCKED' | 'DRAFT';
  weightedScore: number;
  checkinDone: boolean;
  goalsOnTrack: number;
  goalsCompleted: number;
  goalsNotStarted: number;
};

const MOCK_TEAM: TeamMember[] = [
  { id: 'u1', name: 'Priya Sharma', initials: 'PS', role: 'Frontend Developer', department: 'Engineering', goalCount: 5, sheetStatus: 'LOCKED', weightedScore: 68, checkinDone: false, goalsOnTrack: 3, goalsCompleted: 1, goalsNotStarted: 1 },
  { id: 'u2', name: 'Amit Patel', initials: 'AP', role: 'Backend Developer', department: 'Engineering', goalCount: 6, sheetStatus: 'LOCKED', weightedScore: 82, checkinDone: true, goalsOnTrack: 2, goalsCompleted: 3, goalsNotStarted: 1 },
  { id: 'u3', name: 'Neha Gupta', initials: 'NG', role: 'QA Lead', department: 'Engineering', goalCount: 4, sheetStatus: 'SUBMITTED', weightedScore: 0, checkinDone: false, goalsOnTrack: 0, goalsCompleted: 0, goalsNotStarted: 4 },
  { id: 'u4', name: 'Ravi Kumar', initials: 'RK', role: 'DevOps Engineer', department: 'Engineering', goalCount: 5, sheetStatus: 'LOCKED', weightedScore: 55, checkinDone: false, goalsOnTrack: 4, goalsCompleted: 0, goalsNotStarted: 1 },
  { id: 'u5', name: 'Sneha Reddy', initials: 'SR', role: 'UI/UX Designer', department: 'Design', goalCount: 3, sheetStatus: 'DRAFT', weightedScore: 0, checkinDone: false, goalsOnTrack: 0, goalsCompleted: 0, goalsNotStarted: 3 },
];

const statusBadgeConfig: Record<string, { label: string; bg: string; color: string }> = {
  DRAFT: { label: 'Draft', bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' },
  SUBMITTED: { label: 'Pending Review', bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  APPROVED: { label: 'Approved', bg: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' },
  LOCKED: { label: 'Locked', bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' },
};

const avatarGradients = [
  'linear-gradient(135deg, #6366f1, #a855f7)',
  'linear-gradient(135deg, #06b6d4, #6366f1)',
  'linear-gradient(135deg, #ec4899, #a855f7)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #ec4899)',
];

export default function TeamDashboard() {
  const pending = MOCK_TEAM.filter(m => m.sheetStatus === 'SUBMITTED').length;
  const checkinsDone = MOCK_TEAM.filter(m => m.checkinDone).length;
  const avgScore = MOCK_TEAM.filter(m => m.weightedScore > 0).reduce((s, m) => s + m.weightedScore, 0) / Math.max(MOCK_TEAM.filter(m => m.weightedScore > 0).length, 1);

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>My Team</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Manager Dashboard • {MOCK_TEAM.length} Direct Reports</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-md" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Pending Approvals</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, color: pending > 0 ? '#f59e0b' : 'var(--accent-success)' }}>
            {pending}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-xs)' }}>
            {pending > 0 ? 'Needs your attention' : 'All clear'}
          </div>
        </div>
        <div className="glass-card">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Q1 Check-ins</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
            <span className="text-gradient">{checkinsDone}/{MOCK_TEAM.length}</span>
          </div>
          <div className="progress-container mt-sm">
            <div className="progress-bar" style={{ width: `${(checkinsDone / MOCK_TEAM.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="glass-card">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Avg. Team Score</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
            <span className="text-gradient-info">{avgScore.toFixed(0)}%</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-xs)' }}>Weighted average</div>
        </div>
      </div>

      {/* Team Members */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Team Members</h3>

        <div className="flex flex-col gap-sm">
          {MOCK_TEAM.map((member, i) => {
            const sb = statusBadgeConfig[member.sheetStatus];
            return (
              <div key={member.id} className="glass-card flex justify-between items-center" style={{ padding: '16px 20px' }}>
                <div className="flex items-center gap-md" style={{ flex: 1 }}>
                  <div style={{ 
                    width: '44px', height: '44px', borderRadius: '50%', 
                    background: avatarGradients[i % avatarGradients.length], 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 700, fontSize: '0.9rem', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)', 
                    border: '2px solid rgba(255,255,255,0.2)' 
                  }}>
                    {member.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>{member.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{member.role} • {member.goalCount} goals</div>
                  </div>
                </div>

                <div className="flex items-center gap-lg">
                  {/* Mini Goal Breakdown */}
                  {member.sheetStatus === 'LOCKED' && (
                    <div className="flex gap-xs" style={{ fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--accent-success)', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '10px' }}>✓{member.goalsCompleted}</span>
                      <span style={{ color: 'var(--accent-info)', background: 'rgba(6,182,212,0.1)', padding: '2px 8px', borderRadius: '10px' }}>↗{member.goalsOnTrack}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>○{member.goalsNotStarted}</span>
                    </div>
                  )}

                  {/* Score */}
                  {member.weightedScore > 0 && (
                    <div style={{ 
                      textAlign: 'center', minWidth: '50px', fontWeight: 700, fontSize: '1.1rem',
                      color: member.weightedScore >= 80 ? 'var(--accent-success)' : member.weightedScore >= 50 ? 'var(--accent-info)' : '#f59e0b'
                    }}>
                      {member.weightedScore}%
                    </div>
                  )}

                  {/* Status */}
                  <div style={{ background: sb.bg, color: sb.color, padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, minWidth: '110px', textAlign: 'center', border: `1px solid ${sb.color}22` }}>
                    {sb.label}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-xs">
                    {member.sheetStatus === 'SUBMITTED' && (
                      <Link href={`/team/${member.id}`} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        Review
                      </Link>
                    )}
                    {member.sheetStatus === 'LOCKED' && !member.checkinDone && (
                      <Link href={`/team/checkin/${member.id}`} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        <MessageSquare size={14} /> Check-in
                      </Link>
                    )}
                    {member.checkinDone && (
                      <div style={{ color: 'var(--accent-success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Done
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
