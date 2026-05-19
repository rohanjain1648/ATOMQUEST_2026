'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, TrendingUp, ShieldCheck, PieChart, Users, ArrowRight } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function IntroPage() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Background Ambience */}
      <div className="ambient-bg"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2" style={{ background: 'var(--accent-info)', animationDuration: '15s' }}></div>
      <div className="orb orb-3" style={{ background: 'var(--accent-success)', animationDuration: '18s', opacity: 0.4 }}></div>
      <div className="grid-overlay"></div>

      <nav style={{ padding: 'var(--space-md) var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)' }}>
            <Target size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px' }}>PRISM</span>
        </div>
        <div>
          <Link href="/login" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '20px' }}>
            Login to PRISM
          </Link>
        </div>
      </nav>

      <main style={{ paddingTop: '100px' }}>
        {/* Hero Section */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-xl)' }}>
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ maxWidth: '800px' }}>
            <motion.div variants={fadeIn} style={{ display: 'inline-block', marginBottom: 'var(--space-md)' }}>
              <span className="badge badge-active" style={{ fontSize: '0.9rem', padding: '6px 16px', borderRadius: '20px' }}>
                The Future of Performance Management
              </span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-gradient" style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-display)' }}>
              Align, Track, and Achieve with Absolute Clarity
            </motion.h1>
            <motion.p variants={fadeIn} style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
              PRISM eliminates spreadsheets and guesswork. A unified platform for enterprise goal setting, real-time tracking, and automated performance insights.
            </motion.p>
            <motion.div variants={fadeIn} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/login" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '30px' }}>
                Enter Portal <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section style={{ padding: 'var(--space-2xl) var(--space-xl)', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4))' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div variants={fadeIn} style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>End-to-End Goal Lifecycle</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>Everything you need to drive organizational success.</p>
            </motion.div>

            <div className="grid grid-cols-12 gap-xl">
              {[
                { title: 'Top-Down Alignment', desc: 'Managers can push shared KPIs to multiple team members, ensuring departmental alignment instantly.', icon: <Users size={24} />, color: 'var(--accent-primary)' },
                { title: 'Smart Validation', desc: 'System-enforced rules for weightages, limits, and scoring formulas, preventing errors at the source.', icon: <ShieldCheck size={24} />, color: 'var(--accent-success)' },
                { title: 'Automated Scoring', desc: 'Real-time weighted score calculation based on strict mathematical models for numeric and timeline goals.', icon: <TrendingUp size={24} />, color: 'var(--accent-info)' },
                { title: 'Rich Analytics', desc: 'Deep insights with QoQ trends, manager effectiveness dashboards, and org-wide goal heatmaps.', icon: <PieChart size={24} />, color: 'var(--accent-warning)' },
              ].map((feat, i) => (
                <motion.div key={i} variants={fadeIn} className="col-span-12 lg-col-span-6">
                  <div className="glass-panel" style={{ height: '100%', display: 'flex', gap: '20px', padding: 'var(--space-xl)', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `rgba(255,255,255,0.05)`, border: `1px solid ${feat.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: feat.color, flexShrink: 0 }}>
                      {feat.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', fontWeight: 600 }}>{feat.title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{feat.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Workflow Section */}
        <section style={{ padding: 'var(--space-2xl) var(--space-xl)' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <motion.h2 variants={fadeIn} style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 'var(--space-2xl)' }}>A Seamless Workflow</motion.h2>
            
            <div className="flex flex-col gap-lg" style={{ position: 'relative' }}>
              {/* Connecting Line */}
              <div style={{ position: 'absolute', left: '50%', top: '50px', bottom: '50px', width: '2px', background: 'linear-gradient(180deg, var(--accent-primary), var(--accent-success))', transform: 'translateX(-50%)', opacity: 0.3, zIndex: 0 }}></div>

              {[
                { step: '01', title: 'Plan & Define', desc: 'Employees draft their annual goal sheets across multiple thrust areas.' },
                { step: '02', title: 'Review & Lock', desc: 'Managers review, edit inline, and lock goals to establish a performance baseline.' },
                { step: '03', title: 'Quarterly Check-ins', desc: 'Employees log achievements, and managers provide structured feedback every quarter.' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} style={{ display: 'flex', alignItems: 'center', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end', position: 'relative', zIndex: 1 }}>
                  <div className="glass-card" style={{ width: '45%', padding: 'var(--space-lg)', textAlign: i % 2 === 0 ? 'right' : 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '8px' }}>STEP {item.step}</div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{item.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</p>
                  </div>
                  {/* Center Dot */}
                  <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-dark)', border: '4px solid var(--accent-primary)' }}></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
        
        {/* Call to Action */}
        <section style={{ padding: 'var(--space-2xl) var(--space-xl)', textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-2xl)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Ready to Experience PRISM?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: 'var(--space-xl)' }}>
              Sign in with your enterprise credentials to explore the interactive dashboard.
            </p>
            <Link href="/login" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.2rem', borderRadius: '30px', display: 'inline-flex' }}>
              Launch Application
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer style={{ padding: 'var(--space-lg)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'var(--space-xl)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>© 2026 PRISM Performance Portal.</p>
        </footer>
      </main>
    </div>
  );
}
