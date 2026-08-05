"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SUGGESTIONS = [
  "Find me a casual summer t-shirt",
  "Do you have any premium denim jeans?",
  "What is your return policy?",
  "Show me the latest new arrivals"
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let sid = localStorage.getItem('chat_session_id');
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chat_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  // Scroll to bottom of chat container only when open
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input, isOpen]);

  // Optionally auto-close on route change on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, [pathname]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || !sessionId) return;

    const userMessage = messageText.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', blocks: data }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', blocks: [{ type: 'error', content: data.detail || 'An error occurred while connecting to the AI.' }] }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', blocks: [{ type: 'error', content: 'Network error. Please try again later.' }] }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  return (
    <div className="global-chat-container">
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div className="header-info">
              <div className="avatar">
                <img src="/bot-icon-v3.png" alt="Topnoz AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="title-area">
                <h3>Topnoz Stylist</h3>
                <span className="status">Always here to help</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          <div className="chat-main" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="welcome-screen">
                <div className="brand-logo">
                  <img src="/bot-icon-v3.png" alt="Topnoz AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h2>Your Personal Style Assistant</h2>
                <p>Discover new arrivals, get fit advice, or check on your recent orders.</p>

                <div className="suggestions-list">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="suggestion-btn"
                      onClick={() => handleSend(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="messages-area">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message-row ${msg.role === 'user' ? 'user-row' : 'ai-row'}`}>

                    {msg.role === 'ai' && (
                      <div className="msg-avatar">
                        <img src="/bot-icon-v3.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}

                    <div className={`message-content ${msg.role === 'user' ? 'user-content' : 'ai-content'}`}>
                      {msg.role === 'user' ? (
                        <div className="user-bubble">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="ai-blocks">
                          {msg.blocks.map((block: any, bIdx: number) => {
                            if (block.type === 'text') {
                              return (
                                <div key={bIdx} className="ai-bubble">
                                  <span dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br/>') }} />
                                </div>
                              );
                            } else if (block.type === 'product_card') {
                              const imgUrl = block.image_url.startsWith('http') ? block.image_url : `${backendUrl}${block.image_url}`;
                              return (
                                <Link href={`/product/${block.product_slug}`} key={bIdx} className="fashion-product-card">
                                  <div className="img-wrapper">
                                    <img src={imgUrl} alt={block.name} />
                                  </div>
                                  <div className="card-info">
                                    <h4>{block.name}</h4>
                                    <span className="price">{block.price}</span>
                                    <span className="view-btn">View Product</span>
                                  </div>
                                </Link>
                              );
                            } else if (block.type === 'error') {
                              return (
                                <div key={bIdx} className="error-bubble">
                                  {block.content}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message-row ai-row">
                    <div className="msg-avatar">
                      <img src="/bot-icon-v3.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="message-content ai-content">
                      <div className="typing-dots-wrapper">
                        <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <form onSubmit={onSubmit} className="input-form">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about styles, orders, or policies..."
                className="fashion-input"
                rows={1}
                disabled={loading}
              />
              <button
                type="submit"
                className={`send-btn ${input.trim() ? 'active' : ''}`}
                disabled={loading || !input.trim()}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </form>
            <div className="footer-disclaimer">
              AI responses may be inaccurate. Please review important details.
            </div>
          </div>
        </div>
      )}

      <button className={`chat-fab ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Chat">
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <div className="fab-icon-inner">
            <img src="/bot-icon-v3.png" alt="Topnoz AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </button>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        .global-chat-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .chat-fab {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          transition: transform 0.2s, background-color 0.2s;
          border: none;
          outline: none;
        }
        
        .chat-fab:hover {
          transform: scale(1.05);
        }

        .chat-fab.open {
          background-color: #333;
        }

        .chat-widget {
          width: 380px;
          height: 600px;
          max-height: calc(100vh - 120px);
          background: #FFFFFF;
          border: 1px solid #EBEBEB;
          border-radius: 16px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin-bottom: 16px;
          transform-origin: bottom right;
          animation: popUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes popUp {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .chat-header {
          padding: 16px 20px;
          border-bottom: 1px solid #F0F0F0;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 38px; height: 38px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }

        .title-area h3 {
          margin: 0 0 2px 0;
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 600;
          color: #111;
        }

        .title-area .status {
          font-size: 12px;
          color: #666;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #999;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: color 0.2s;
        }
        
        .fab-icon-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
        }

        .close-btn:hover {
          color: #000;
        }

        .chat-main {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px;
          background: #FAFAFA;
        }

        .chat-main::-webkit-scrollbar { width: 6px; }
        .chat-main::-webkit-scrollbar-thumb { background: #DDD; border-radius: 4px; }

        .welcome-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          padding: 20px 0;
        }

        .brand-logo {
          width: 64px; height: 64px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .welcome-screen h2 {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #111;
          margin: 0 0 10px 0;
        }

        .welcome-screen p {
          color: #666;
          font-size: 14px;
          max-width: 90%;
          line-height: 1.5;
          margin: 0 0 32px 0;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .suggestion-btn {
          background: #FFF;
          border: 1px solid #E5E5E5;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          color: #333;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .suggestion-btn:hover {
          border-color: #000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }

        .messages-area {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .message-row {
          display: flex;
          gap: 10px;
        }

        .user-row { justify-content: flex-end; }
        .ai-row { justify-content: flex-start; }

        .msg-avatar {
          width: 32px; height: 32px;
          background: #000;
          color: #333;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .message-content {
          max-width: 85%;
        }

        .user-bubble {
          background: #000;
          color: #fff;
          font-size: 14px;
          line-height: 1.5;
          padding: 10px 16px;
          border-radius: 16px;
          border-bottom-right-radius: 4px;
        }

        .ai-blocks {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ai-bubble {
          background: #FFF;
          color: #222;
          border: 1px solid #EAEAEA;
          font-size: 14px;
          line-height: 1.5;
          padding: 12px 16px;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .error-bubble {
          background: #FFF0F0;
          color: #D32F2F;
          border: 1px solid #FFCDCD;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
        }

        .fashion-product-card {
          display: flex;
          background: #FFF;
          border: 1px solid #EAEAEA;
          border-radius: 10px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          max-width: 100%;
        }

        .fashion-product-card:hover {
          border-color: #000;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }

        .img-wrapper {
          width: 80px;
          background: #F5F5F5;
        }

        .img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-info {
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
        }

        .card-info h4 {
          margin: 0 0 4px 0;
          font-size: 13px;
          font-weight: 600;
          color: #111;
        }

        .card-info .price {
          font-weight: 500;
          color: #555;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .view-btn {
          font-size: 11px;
          font-weight: 600;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #000;
          align-self: flex-start;
        }

        .typing-dots-wrapper {
          background: #FFF;
          border: 1px solid #EAEAEA;
          padding: 12px 16px;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-dots-wrapper .dot {
          width: 5px; height: 5px;
          background: #CCC;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-dots-wrapper .dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots-wrapper .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
          40% { transform: scale(1); opacity: 1; }
        }

        .chat-input-area {
          padding: 16px 20px;
          background: #FFFFFF;
          border-top: 1px solid #F0F0F0;
        }

        .input-form {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: #FAFAFA;
          border: 1px solid #EAEAEA;
          border-radius: 20px;
          padding: 6px 10px 6px 16px;
          transition: border-color 0.2s;
        }

        .input-form:focus-within {
          border-color: #000;
          background: #FFF;
        }

        .fashion-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px; /* 16px prevents iOS zoom on focus */
          color: #111;
          resize: none;
          max-height: 100px;
          padding: 6px 0;
          line-height: 1.5;
        }

        .fashion-input::placeholder {
          color: #999;
          font-size: 14px;
        }

        .send-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #EAEAEA;
          color: #999;
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: not-allowed;
          transition: all 0.2s;
          flex-shrink: 0;
          margin-bottom: 1px;
        }

        .send-btn.active {
          background: #000;
          color: #FFF;
          cursor: pointer;
        }

        .send-btn.active:hover {
          transform: scale(1.05);
        }

        .footer-disclaimer {
          font-size: 11px;
          color: #999;
          margin-top: 10px;
          text-align: center;
        }

        /* --- MOBILE RESPONSIVENESS --- */
        @media (max-width: 768px) {
          .global-chat-container {
            bottom: 16px;
            right: 16px;
            left: 16px; /* Allow full width span */
            align-items: flex-end; /* Keep FAB right-aligned */
            pointer-events: none; /* Let clicks pass through container */
          }
          
          .global-chat-container > * {
            pointer-events: auto; /* Re-enable clicks on actual elements */
          }

          .chat-widget {
            position: fixed;
            top: 16px;
            left: 16px;
            right: 16px;
            bottom: 84px; /* Stop above the FAB */
            width: auto;
            height: auto;
            max-height: none;
            margin-bottom: 0;
            z-index: 9998;
          }
          
          .chat-fab {
             z-index: 9999;
          }
        }
      `}} />
    </div>
  );
}
