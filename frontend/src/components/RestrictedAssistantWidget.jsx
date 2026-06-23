'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bot, ChevronDown, Lock, Send, ShieldCheck, X } from 'lucide-react';

const starterPrompts = [
  'What wet wipes do you sell?',
  'Do you support OEM private label?',
  'How can I track my order?',
  'What is your return policy?'
];

const initialMessages = [
  {
    role: 'assistant',
    text: 'Hello. I am the Bapuji Surgicals assistant. I can help with products, OEM, orders, shipping, returns, company information and customer support.'
  }
];

export default function RestrictedAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text = input) => {
    const message = text.trim();
    if (!message || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || "I don't have that information available at the moment. Please contact our customer support team."
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I don't have that information available at the moment. Please contact our customer support team."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .assistant-launcher {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 140;
          border: 1px solid #ffffff;
          width: 60px;
          height: 60px;
          border-radius: 22px;
          background: #0976BC;
          color: #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 22px 55px rgba(9, 118, 188, 0.28);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .assistant-launcher:hover {
          transform: translateY(-3px);
          box-shadow: 0 28px 70px rgba(9, 118, 188, 0.38);
        }

        .assistant-logo-mark {
          width: 30px;
          height: 36px;
          background: #ffffff;
          mask-image: url('/img/bapuji_logo_icon.png');
          mask-repeat: no-repeat;
          mask-position: center;
          mask-size: contain;
          -webkit-mask-image: url('/img/bapuji_logo_icon.png');
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
          -webkit-mask-size: contain;
        }

        .assistant-panel {
          position: fixed;
          right: 22px;
          bottom: 94px;
          width: min(390px, calc(100vw - 28px));
          height: min(640px, calc(100vh - 116px));
          z-index: 140;
          border-radius: 28px;
          overflow: hidden;
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(148,163,184,0.22);
          box-shadow: 0 30px 90px rgba(15,23,42,0.22);
          backdrop-filter: blur(22px);
          display: flex;
          flex-direction: column;
          transform-origin: bottom right;
          animation: assistantPanelIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes assistantPanelIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .assistant-header {
          padding: 18px;
          background:
            radial-gradient(circle at top right, rgba(0,168,132,0.22), transparent 35%),
            linear-gradient(135deg, #0f172a, #12314d);
          color: #ffffff;
        }

        .assistant-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .assistant-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .assistant-avatar {
          width: 42px;
          height: 42px;
          border-radius: 15px;
          background: rgba(255,255,255,0.13);
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.14);
        }

        .assistant-title {
          margin: 0;
          font-size: 0.98rem;
          font-weight: 900;
          color: #ffffff !important;
        }

        .assistant-subtitle {
          margin: 3px 0 0;
          color: rgba(255,255,255,0.72);
          font-size: 0.78rem;
          line-height: 1.35;
        }

        .assistant-close {
          border: none;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          color: #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .assistant-guardrail {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 16px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.82);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .assistant-messages {
          flex: 1;
          overflow-y: auto;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background:
            linear-gradient(90deg, rgba(9,118,188,0.035) 1px, transparent 1px),
            linear-gradient(180deg, rgba(9,118,188,0.03) 1px, transparent 1px),
            #f8fafc;
          background-size: 36px 36px;
        }

        .assistant-message {
          max-width: 88%;
          padding: 12px 14px;
          border-radius: 18px;
          font-size: 0.88rem;
          line-height: 1.55;
          white-space: pre-wrap;
        }

        .assistant-message-user {
          align-self: flex-end;
          background: #0976BC;
          color: #ffffff;
          border-bottom-right-radius: 6px;
        }

        .assistant-message-assistant {
          align-self: flex-start;
          background: #ffffff;
          color: #0f172a;
          border: 1px solid rgba(148,163,184,0.18);
          border-bottom-left-radius: 6px;
          box-shadow: 0 10px 26px rgba(15,23,42,0.05);
        }

        .assistant-typing {
          width: fit-content;
          padding: 10px 13px;
          border-radius: 999px;
          background: #ffffff;
          color: #64748b;
          border: 1px solid rgba(148,163,184,0.18);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .assistant-suggestions {
          padding: 12px 14px 0;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          background: #ffffff;
          border-top: 1px solid rgba(148,163,184,0.16);
        }

        .assistant-suggestion {
          flex: 0 0 auto;
          border: 1px solid rgba(9,118,188,0.16);
          background: #eef7ff;
          color: #075985;
          border-radius: 999px;
          padding: 8px 11px;
          font-size: 0.75rem;
          font-weight: 900;
          cursor: pointer;
        }

        .assistant-input-row {
          padding: 12px 14px 14px;
          display: grid;
          grid-template-columns: 1fr 44px;
          gap: 9px;
          background: #ffffff;
        }

        .assistant-input {
          height: 44px;
          border: 1px solid rgba(148,163,184,0.26);
          border-radius: 999px;
          padding: 0 14px;
          font-size: 0.88rem;
          outline: none;
          color: #0f172a;
          background: #f8fafc;
        }

        .assistant-input:focus {
          border-color: rgba(9,118,188,0.7);
          box-shadow: 0 0 0 4px rgba(9,118,188,0.08);
          background: #ffffff;
        }

        .assistant-send {
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #0976BC, #00A884);
          color: #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .assistant-send:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .assistant-panel {
            right: 10px;
            bottom: 142px;
            width: calc(100vw - 20px);
            height: min(560px, calc(100vh - 162px));
            border-radius: 24px;
          }

          .assistant-launcher {
            right: 18px;
            bottom: calc(72px + env(safe-area-inset-bottom, 0px));
            width: 56px;
            height: 56px;
            border-radius: 20px;
          }
        }
      `}} />

      {isOpen && (
        <section className="assistant-panel" aria-label="Bapuji Surgicals assistant">
          <div className="assistant-header">
            <div className="assistant-header-top">
              <div className="assistant-title-row">
                <div className="assistant-avatar">
                  <Bot size={22} />
                </div>
                <div>
                  <h2 className="assistant-title">Bapuji Assistant</h2>
                  <p className="assistant-subtitle">Restricted customer support only</p>
                </div>
              </div>
              <button className="assistant-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant">
                <X size={17} />
              </button>
            </div>
            <div className="assistant-guardrail">
              <Lock size={14} />
              No access to files, databases, admin panels or customer records.
            </div>
          </div>

          <div className="assistant-messages">
            {messages.map((message, index) => (
              <div
                className={`assistant-message assistant-message-${message.role}`}
                key={`${message.role}-${index}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && <div className="assistant-typing">Checking public support knowledge...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="assistant-suggestions">
            {starterPrompts.map((prompt) => (
              <button className="assistant-suggestion" type="button" key={prompt} onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="assistant-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              className="assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products, orders or support"
              maxLength={500}
            />
            <button className="assistant-send" type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button className="assistant-launcher" type="button" onClick={() => setIsOpen((prev) => !prev)} aria-label="Open Bapuji assistant">
        {isOpen ? <ChevronDown size={25} /> : <span className="assistant-logo-mark" aria-hidden="true" />}
      </button>
    </>
  );
}
