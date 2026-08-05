'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/store/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message || 'Your message has been received!');
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        toast.error(data.message || 'Failed to send message.');
      }
    } catch (error) {
      toast.error('An error occurred while sending your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            
            {/* Left Column: Map and Info */}
            <div>
              <div style={{ marginBottom: '24px', border: '1px solid #000' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.9974481810477!2d90.26433101498167!3d23.881278489090732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755e9e322582c87%3A0x5b6f9f778d0b56ed!2sJahangirnagar%20University!5e0!3m2!1sen!2sbd!4v1681006795413!5m2!1sen!2sbd"
                  width="100%" 
                  height="360" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              
              <div>
                <h4 style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '1.1rem', marginBottom: '16px' }}>
                  OUR LOCATION
                </h4>
                
                <div style={{ background: '#fff', border: '1px solid #000', padding: '16px', marginBottom: '12px' }}>
                  <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <strong>ADDRESS:</strong> JAHANGIRNAGAR UNIVERSITY, SAVAR, DHAKA
                  </p>
                </div>
                
                <div style={{ background: '#fff', border: '1px solid #000', padding: '16px', marginBottom: '12px' }}>
                  <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <strong>PHONE:</strong> 01575306583
                  </p>
                </div>
                
                <div style={{ background: '#fff', border: '1px solid #000', padding: '16px', marginBottom: '12px' }}>
                  <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <strong>EMAIL:</strong> TOPNOZWEB@GMAIL.COM
                  </p>
                </div>
                
                <div style={{ background: '#fff', border: '1px solid #000', padding: '16px', marginBottom: '12px' }}>
                  <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <strong>HOURS:</strong> 9AM - 8PM, MON-SAT
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div>
              <div style={{ border: '1px solid #000', padding: '24px', background: '#fff' }}>
                <h4 style={{ textAlign: 'center', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '1.2rem', margin: '0 0 24px 0', borderBottom: '1px solid #000', paddingBottom: '16px' }}>
                  GET IN TOUCH
                </h4>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="name" style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }}>YOUR NAME</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      placeholder="Enter your name" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      style={{ padding: '12px', border: '1px solid #000', outline: 'none', fontSize: '14px', background: '#fff', color: '#000' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="email" style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }}>EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      placeholder="Enter email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      style={{ padding: '12px', border: '1px solid #000', outline: 'none', fontSize: '14px', background: '#fff', color: '#000' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="message" style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }}>MESSAGE</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows={5} 
                      placeholder="Your message" 
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      style={{ padding: '12px', border: '1px solid #000', outline: 'none', fontSize: '14px', background: '#fff', color: '#000', resize: 'vertical' }}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ 
                      marginTop: '12px',
                      padding: '14px 24px', 
                      background: isSubmitting ? '#555' : '#000', 
                      color: '#fff', 
                      border: '1px solid #000', 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px', 
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#000';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.background = '#000';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="spinner" viewBox="0 0 50 50" width="20" height="20" style={{ animation: 'spin 1s linear infinite' }}>
                          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="30 100" strokeLinecap="round"></circle>
                        </svg>
                        SENDING...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        SEND MESSAGE
                      </>
                    )}
                  </button>
                  
                </form>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
