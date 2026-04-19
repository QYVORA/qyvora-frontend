import React, { useState } from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { Mail, MessageSquare, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import api from '../../../core/services/api';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const fd = new FormData(e.currentTarget);
      await api.post('/public/contact', {
        name: fd.get('name'),
        email: fd.get('email'),
        subject: fd.get('subject'),
        message: fd.get('message'),
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">// TRANSMISSION</span>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6">Contact the Desk</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Establishing a secure channel for inquiries, partnerships, and operational support.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <ScrollReveal delay={0.1} className="space-y-8">
            <div className="card-hsociety p-8 space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-accent-dim border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1 uppercase tracking-tight">Email Intelligence</h3>
                  <p className="text-sm text-text-muted mb-4">Direct secure channel to our operations desk.</p>
                  <a href="mailto:ops@hsociety.africa" className="text-accent font-mono font-bold hover:underline">ops@hsociety.africa</a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-accent-dim border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1 uppercase tracking-tight">WhatsApp</h3>
                  <p className="text-sm text-text-muted mb-4">Encrypted messaging for rapid triage.</p>
                  <a href="https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5" target="_blank" rel="noreferrer" className="text-accent font-mono font-bold hover:underline">Join the War Room</a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-accent-dim border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1 uppercase tracking-tight">HQ Coordinates</h3>
                  <p className="text-sm text-text-muted mb-4">Cape Town, South Africa. Remote operations globally.</p>
                  <address className="not-italic text-accent font-mono font-bold">Cape Town, South Africa</address>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Form Side */}
          <ScrollReveal delay={0.2} className="card-hsociety p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-8 uppercase tracking-tighter">Secure Message Form</h2>

            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <CheckCircle className="w-12 h-12 text-accent" />
                <h3 className="text-lg font-bold text-text-primary">Transmission Received</h3>
                <p className="text-sm text-text-muted">We'll respond to your operator email within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="btn-secondary text-xs !py-2 !px-4 mt-2">Send Another</button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Name</label>
                    <input name="name" type="text" required placeholder="Operator Zero"
                      className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</label>
                    <input name="email" type="email" required placeholder="secure@email.com"
                      className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Subject</label>
                  <select name="subject" className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm appearance-none cursor-pointer">
                    <option value="">Select Mission Type</option>
                    <option value="b2b">B2B Security Consultation</option>
                    <option value="bootcamp">Bootcamp Inquiries</option>
                    <option value="media">Media &amp; Partnerships</option>
                    <option value="other">Other Operational Needs</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Message</label>
                  <textarea name="message" rows={5} required placeholder="Encrypted transmission here..."
                    className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm resize-none transition-colors" />
                </div>
                {status === 'error' && (
                  <p className="text-xs text-red-400 font-mono">Transmission failed. Try emailing us directly at ops@hsociety.africa</p>
                )}
                <button type="submit" disabled={status === 'sending'}
                  className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-60">
                  {status === 'sending'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : <><Send className="w-4 h-4" /> Send Transmission</>}
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;
