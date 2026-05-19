'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import Link from 'next/link';
import { Target, ShieldCheck, PieChart, Users, ArrowRight, Sparkles, Activity } from 'lucide-react';
import { useRef } from 'react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function PremiumIntroPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', overflowX: 'hidden', fontFamily: 'var(--font-sans)' }}>
      
      {/* Ultra Premium Ambient Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', top: '20%', left: '40%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5 }} />
      </div>

      {/* Modern Navigation */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.03)', background: 'rgba(5,5,5,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Target size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>PRISM</span>
        </div>
        <Link href="/login" style={{ padding: '10px 24px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}>
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <motion.section style={{ y: yHero, opacity: opacityHero, position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', paddingTop: '80px' }}>
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <motion.div variants={fadeInUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }}>
            <Sparkles size={14} color="#a855f7" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e5e5e5', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Next-Gen Performance OS</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: '32px' }}>
            Goal Alignment,<br />
            <span style={{ background: 'linear-gradient(to right, #fff, #a8a8a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Redefined.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: '#a3a3a3', maxWidth: '650px', lineHeight: 1.6, marginBottom: '48px' }}>
            A meticulously crafted platform that transforms fragmented spreadsheets into a unified, intelligent performance ecosystem for modern enterprises.
          </motion.p>

          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '18px 40px', borderRadius: '40px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 20px 40px rgba(99,102,241,0.3)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(99,102,241,0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.3)'; }}>
              Enter Portal <ArrowRight size={20} />
            </Link>
          </motion.div>

        </motion.div>

        {/* Floating UI Mockup */}
        <motion.div initial={{ opacity: 0, y: 100, rotateX: 20 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ marginTop: '80px', width: '100%', maxWidth: '1100px', perspective: '1000px' }}>
          <div style={{ background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px', boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.1)', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '24px' }}>
              <div style={{ height: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={14} color="white" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>Menu</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                  {[
                    { text: 'Dashboard', icon: <PieChart size={14} />, active: true },
                    { text: 'Team Goals', icon: <Users size={14} />, active: false },
                    { text: 'Analytics', icon: <Activity size={14} />, active: false },
                    { text: 'Governance', icon: <ShieldCheck size={14} />, active: false }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '8px', background: item.active ? 'rgba(99,102,241,0.1)' : 'transparent', color: item.active ? '#a855f7' : 'rgba(255,255,255,0.5)', cursor: 'default' }}>
                      {item.icon}
                      <span style={{ fontSize: '0.85rem', fontWeight: item.active ? 600 : 500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: '300px', background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(0,0,0,0) 100%)', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.1)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>Revenue Trajectory</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Q1-Q4 Actuals vs Target</div>
                  </div>
                  <div style={{ padding: '4px 12px', background: 'rgba(99,102,241,0.1)', color: '#a855f7', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>+14.2%</div>
                </div>
                
                {/* Mock Chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '150px' }}>
                  {[40, 70, 45, 90, 65, 100].map((h, i) => (
                    <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.8 + (i * 0.1), ease: "easeOut" }} style={{ flex: 1, background: 'linear-gradient(to top, rgba(99,102,241,0.2), rgba(99,102,241,0.8))', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>Q{i+1}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div style={{ height: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ flex: 1, background: 'rgba(16,185,129,0.05)', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.1)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>92%</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '8px' }}>Org Attainment</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>Goals Locked</div>
                    <ShieldCheck size={16} color="#6366f1" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>1,248</div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, delay: 1.2 }} style={{ height: '100%', background: '#6366f1' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Bento Box Features */}
      <section style={{ position: 'relative', zIndex: 10, padding: '120px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '24px' }}>
            Engineered for <span style={{ color: '#6366f1' }}>Excellence.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ color: '#a3a3a3', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Every feature designed with precision to eliminate friction and elevate organizational performance.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-12 gap-xl">
          
          {/* Large Feature 1 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="col-span-12 lg-col-span-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)' }} />
            <Users size={32} color="#6366f1" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>Top-Down Strategic Alignment</h3>
            <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '400px' }}>
              Push departmental KPIs directly to your entire team with a single click. Maintain absolute alignment while allowing individual weightage customization.
            </p>
          </motion.div>

          {/* Small Feature 1 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="col-span-12 lg-col-span-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <ShieldCheck size={32} color="#10b981" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Immutable Audit</h3>
            <p style={{ color: '#a3a3a3', lineHeight: 1.6 }}>Tamper-proof logs track every target adjustment, approval, and check-in for enterprise compliance.</p>
          </motion.div>

          {/* Small Feature 2 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="col-span-12 lg-col-span-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Activity size={32} color="#f59e0b" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Auto-Scoring</h3>
            <p style={{ color: '#a3a3a3', lineHeight: 1.6 }}>Mathematical models automatically compute precise weighted progress based on complex UoM targets.</p>
          </motion.div>

          {/* Large Feature 2 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="col-span-12 lg-col-span-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)' }} />
            <PieChart size={32} color="#a855f7" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>Crystal-Clear Org Analytics</h3>
            <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '400px' }}>
              Uncover deep insights with Quarter-over-Quarter trends, manager effectiveness comparisons, and dynamic goal distribution heatmaps.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Modern Workflow Timeline */}
      <section style={{ padding: '120px 24px', position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.02))' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', marginBottom: '80px' }}>
            <motion.h2 variants={fadeInUp} style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>Flawless Execution Cycle.</motion.h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md-grid-cols-3 gap-xl">
            {[
              { num: '01', title: 'Define', desc: 'Employees craft goals within strict boundary conditions.' },
              { num: '02', title: 'Lock', desc: 'Managers review, calibrate, and immutably lock targets.' },
              { num: '03', title: 'Track', desc: 'Quarterly check-ins drive continuous, measurable progress.' }
            ].map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="col-span-1" style={{ padding: '40px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '24px', position: 'relative' }}>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '20px', right: '24px', lineHeight: 1 }}>{step.num}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', position: 'relative', zIndex: 2 }}>{step.title}</h3>
                <p style={{ color: '#a3a3a3', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '150px 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '32px' }}>
            Ready to upgrade your<br/>performance OS?
          </h2>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 48px', borderRadius: '40px', background: 'white', color: 'black', fontWeight: 700, fontSize: '1.1rem', transition: 'transform 0.2s ease', boxShadow: '0 0 40px rgba(255,255,255,0.2)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
            Launch Application
          </Link>
        </motion.div>
      </section>

      <footer style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#666', fontSize: '0.9rem', position: 'relative', zIndex: 10 }}>
        © 2026 PRISM Ecosystem. All rights reserved.
      </footer>
    </div>
  );
}
