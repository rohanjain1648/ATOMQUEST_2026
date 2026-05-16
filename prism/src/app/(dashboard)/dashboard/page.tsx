import Link from 'next/link';
import { Target, TrendingUp, AlertCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Welcome back, Rohan</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Here is your performance overview for FY 2026-27.</p>
        </div>
        <Link href="/goals/create" className="btn btn-primary">
          + Create Goal Sheet
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-md" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card">
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Goal Submission Status</div>
            <div className="icon-btn" style={{ width: '32px', height: '32px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', border: 'none' }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>Pending</h2>
          <div className="flex items-center gap-xs" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            <Clock size={12} />
            Due in 14 days
          </div>
        </div>

        <div className="glass-card">
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Overall Progress</div>
            <div className="icon-btn" style={{ width: '32px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', border: 'none' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>0%</h2>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: '0%' }}></div>
          </div>
        </div>

        <div className="glass-card" style={{ background: 'var(--gradient-primary)', borderColor: 'rgba(255,255,255,0.2)' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Active Cycle</div>
            <Target size={16} color="white" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>FY 26-27</h2>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
            Goal setting window closes May 30
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-md)' }}>Action Required</h3>
        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: 'var(--radius-md)', 
          padding: 'var(--space-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div className="flex items-center gap-md">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Target size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Submit your Goal Sheet for FY 2026-27</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>You must define and submit your goals for manager approval.</div>
            </div>
          </div>
          <Link href="/goals/create" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Start Now
          </Link>
        </div>
      </div>
    </div>
  );
}
