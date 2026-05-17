'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, TrendingUp, CheckCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [ssoStep, setSsoStep] = useState(0); // 0: email, 1: password/MFA, 2: success

  const handleMockSSO = (e: React.FormEvent) => {
    e.preventDefault();
    if (ssoStep === 0) {
      setSsoStep(1);
    } else if (ssoStep === 1) {
      setSsoStep(2);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  };

  return (
    <>
      {/* Background Ambience */}
      <div className="ambient-bg"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="grid-overlay"></div>

      {/* Main Container */}
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md)' }}>
        
        {/* Floating Badges */}
        <div className="floating-badge delay-100" style={{ top: '15%', left: '10%' }}>
          <div className="floating-icon" style={{ background: 'var(--accent-primary)' }}>
            <Target size={14} color="white" />
          </div>
          Align Goals
        </div>
        <div className="floating-badge delay-200" style={{ bottom: '20%', left: '15%', animationDuration: '7s' }}>
          <div className="floating-icon" style={{ background: 'var(--accent-info)' }}>
            <TrendingUp size={14} color="white" />
          </div>
          Track Progress
        </div>
        <div className="floating-badge delay-300" style={{ top: '25%', right: '12%', animationDuration: '8s' }}>
          <div className="floating-icon" style={{ background: 'var(--accent-success)' }}>
            <CheckCircle size={14} color="white" />
          </div>
          Quarterly Check-ins
        </div>

        {/* Central Login Card */}
        <div className="glass-panel animate-fade-in-up" style={{ 
          maxWidth: '480px', 
          width: '100%', 
          padding: 'var(--space-2xl) var(--space-xl)',
          textAlign: 'center',
          zIndex: 20
        }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'var(--gradient-primary)', marginBottom: 'var(--space-md)', boxShadow: 'var(--glow-primary)' }}>
            <Target size={32} color="white" />
          </div>

          <h1 className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 'var(--space-xs)' }}>
            PRISM
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem', marginBottom: 'var(--space-xl)' }}>
            Performance, Recognition, Insights, Strategy & Metrics
          </p>

          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Enterprise Access
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem', justifyContent: 'space-between' }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => setShowSSOModal(true)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg viewBox="0 0 23 23" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#f3f3f3" d="M0 0h11v11H0z"/>
                  <path fill="#f3f3f3" d="M12 0h11v11H12z"/>
                  <path fill="#f3f3f3" d="M0 12h11v11H0z"/>
                  <path fill="#f3f3f3" d="M12 12h11v11H12z"/>
                </svg>
                Sign in with Entra ID
              </div>
              <ArrowRight size={20} style={{ transform: isHovering ? 'translateX(4px)' : 'none', transition: 'transform 0.3s' }} />
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            AtomQuest Hackathon 1.0 Submission<br/>
            Secure, scalable, and beautifully engineered.
          </div>
        </div>
      </main>

      {/* Mock Azure AD Modal */}
      {showSSOModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in-up" style={{ background: '#ffffff', color: '#1b1b1b', width: '100%', maxWidth: '440px', padding: '40px', borderRadius: '4px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
              <svg viewBox="0 0 23 23" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#f25022" d="M0 0h11v11H0z"/>
                <path fill="#7fba00" d="M12 0h11v11H12z"/>
                <path fill="#00a4ef" d="M0 12h11v11H0z"/>
                <path fill="#ffb900" d="M12 12h11v11H12z"/>
              </svg>
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#737373' }}>Microsoft</span>
            </div>

            <form onSubmit={handleMockSSO}>
              {ssoStep === 0 && (
                <div className="animate-fade-in-up">
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Sign in</h2>
                  <input 
                    type="email" 
                    placeholder="Email, phone, or Skype" 
                    required
                    defaultValue="rohan.jain@company.com"
                    style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid #000', fontSize: '1rem', marginBottom: '24px', outline: 'none' }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#0067b8', marginBottom: '32px', cursor: 'pointer' }}>Can&apos;t access your account?</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" style={{ background: '#0067b8', color: 'white', border: 'none', padding: '8px 32px', fontSize: '1rem', cursor: 'pointer' }}>Next</button>
                  </div>
                </div>
              )}

              {ssoStep === 1 && (
                <div className="animate-fade-in-up">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#1b1b1b' }}>
                    <ArrowRight size={16} style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => setSsoStep(0)} />
                    rohan.jain@company.com
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Enter password</h2>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    defaultValue="••••••••"
                    style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid #000', fontSize: '1rem', marginBottom: '24px', outline: 'none' }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#0067b8', marginBottom: '32px', cursor: 'pointer' }}>Forgot password?</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" style={{ background: '#0067b8', color: 'white', border: 'none', padding: '8px 32px', fontSize: '1rem', cursor: 'pointer' }}>Sign in</button>
                  </div>
                </div>
              )}

              {ssoStep === 2 && (
                <div className="flex flex-col items-center justify-center animate-fade-in-up" style={{ minHeight: '200px' }}>
                  <Loader2 size={40} color="#0067b8" className="animate-spin" style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
                  <style jsx>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1b1b1b' }}>Verifying organization...</h2>
                  <p style={{ color: '#737373', fontSize: '0.9rem', marginTop: '8px' }}>Redirecting to PRISM Portal</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
