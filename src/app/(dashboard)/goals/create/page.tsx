'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Goal = {
  id: string;
  thrustArea: string;
  title: string;
  uom: string;
  target: number;
  weightage: number;
};

export default function CreateGoalSheet() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', thrustArea: 'Revenue', title: '', uom: 'MIN_NUMERIC', target: 0, weightage: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalWeightage = goals.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0);
  const isWeightValid = totalWeightage === 100;
  const isMaxGoalsReached = goals.length >= 8;
  const allGoalsValid = goals.every(g => 
    g.title.trim() !== '' && 
    g.target > 0 && 
    g.weightage >= 10
  );

  const addGoal = () => {
    if (!isMaxGoalsReached) {
      setGoals([...goals, { 
        id: Math.random().toString(), 
        thrustArea: 'Revenue', 
        title: '', 
        uom: 'MIN_NUMERIC', 
        target: 0, 
        weightage: 0 
      }]);
    }
  };

  const removeGoal = (id: string) => {
    if (goals.length > 1) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const updateGoal = (id: string, field: keyof Goal, value: string | number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handleSubmit = async () => {
    if (!isWeightValid || !allGoalsValid) return;
    
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center animate-fade-in-up" style={{ minHeight: '60vh' }}>
        <div className="glass-panel text-center" style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-success)', boxShadow: 'var(--glow-success)' }}>
              <CheckCircle2 size={40} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>Goal Sheet Submitted!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-xl)' }}>
            Your goals for FY 2026-27 have been sent to your manager for approval. You will be notified once they are reviewed.
          </p>
          <Link href="/dashboard" className="btn btn-secondary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Goal Setting</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Define your objectives for FY 2026-27</p>
        </div>
        
        {/* Progress Tracker */}
        <div className="glass-card flex items-center gap-md" style={{ padding: '12px 20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Total Weightage</div>
            <div className={`text-gradient${isWeightValid ? '-success' : ''}`} style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {totalWeightage}%
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', position: 'relative' }}>
            <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={isWeightValid ? "var(--accent-success)" : "var(--accent-primary)"} strokeWidth="3" strokeDasharray={`${Math.min(totalWeightage, 100)}, 100`} style={{ transition: 'stroke-dasharray 0.5s ease' }} />
            </svg>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Define Goals</h3>
          <span className="badge badge-draft">Draft Mode</span>
        </div>

        <div className="flex flex-col gap-md">
          {goals.map((goal, index) => (
            <div key={goal.id} className="glass-card flex flex-col gap-sm" style={{ position: 'relative', overflow: 'visible' }}>
              
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-sm)' }}>
                <div className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Goal {index + 1}</div>
                {goals.length > 1 && (
                  <button onClick={() => removeGoal(goal.id)} className="icon-btn" style={{ width: '28px', height: '28px', color: 'var(--accent-danger)' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-12 gap-md items-end">
                <div className="col-span-3">
                  <label className="form-label">Thrust Area</label>
                  <select 
                    className="form-control"
                    value={goal.thrustArea}
                    onChange={(e) => updateGoal(goal.id, 'thrustArea', e.target.value)}
                  >
                    <option value="Revenue">Revenue Growth</option>
                    <option value="Cost">Cost Optimization</option>
                    <option value="Quality">Quality & Delivery</option>
                    <option value="Safety">Safety & Compliance</option>
                    <option value="People">People & Culture</option>
                  </select>
                </div>

                <div className="col-span-9">
                  <label className="form-label">Goal Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Increase Q2 software sales by 15%"
                    value={goal.title}
                    onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-md items-end mt-sm">
                <div className="col-span-4">
                  <label className="form-label">Unit of Measurement (UoM)</label>
                  <select 
                    className="form-control"
                    value={goal.uom}
                    onChange={(e) => updateGoal(goal.id, 'uom', e.target.value)}
                  >
                    <option value="MIN_NUMERIC">Numeric (Higher is better)</option>
                    <option value="MIN_PERCENT">Percentage (Higher is better)</option>
                    <option value="MAX_NUMERIC">Numeric (Lower is better)</option>
                    <option value="TIMELINE">Timeline (Date)</option>
                    <option value="ZERO">Zero-based</option>
                  </select>
                </div>

                <div className="col-span-4">
                  <label className="form-label">Target</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Value"
                    value={goal.target || ''}
                    onChange={(e) => updateGoal(goal.id, 'target', parseFloat(e.target.value))}
                  />
                </div>

                <div className="col-span-4 relative">
                  <label className="form-label flex justify-between">
                    <span>Weightage (%)</span>
                    {goal.weightage > 0 && goal.weightage < 10 && (
                      <span className="text-danger flex items-center gap-xs" style={{ fontSize: '0.7rem' }}>
                        <AlertCircle size={10} /> Min 10%
                      </span>
                    )}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="number" 
                      className={`form-control ${goal.weightage > 0 && goal.weightage < 10 ? 'border-danger' : ''}`} 
                      placeholder="e.g. 25"
                      value={goal.weightage || ''}
                      onChange={(e) => updateGoal(goal.id, 'weightage', parseInt(e.target.value))}
                    />
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}>%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addGoal}
          disabled={isMaxGoalsReached}
          className="btn btn-secondary mt-lg" 
          style={{ width: '100%', borderStyle: 'dashed', padding: '16px', opacity: isMaxGoalsReached ? 0.5 : 1 }}
        >
          <Plus size={18} />
          {isMaxGoalsReached ? 'Maximum of 8 goals reached' : 'Add Another Goal'}
        </button>

      </div>

      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {!isWeightValid ? (
            <div className="flex items-center gap-sm text-danger">
              <AlertCircle size={18} />
              <span>Total weightage must be exactly 100%. Currently at {totalWeightage}%.</span>
            </div>
          ) : !allGoalsValid ? (
            <div className="flex items-center gap-sm text-danger">
              <AlertCircle size={18} />
              <span>Please fill all required fields and ensure min 10% weightage per goal.</span>
            </div>
          ) : (
            <div className="flex items-center gap-sm text-gradient-success">
              <CheckCircle2 size={18} />
              <span>All validation rules passed. Ready to submit.</span>
            </div>
          )}
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={!isWeightValid || !allGoalsValid || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit to Manager'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>

    </div>
  );
}
