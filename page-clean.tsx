'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'

interface Message {
  type: 'user' | 'arbot'
  content: string
  timestamp: string
  data?: any
}

export default function ARBotInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{
      type: 'arbot',
      content: 'Welcome to ARBot! I can help you with HubSpot blueprints, audits, and recommendations.',
      timestamp: new Date().toLocaleTimeString()
    }])
  }, [])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || loading) return

    const userMessage: Message = {
      type: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/arbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          context: {
            conversationHistory: messages.slice(-5)
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        const arbotMessage: Message = {
          type: 'arbot',
          content: data.response || 'I received your message and I\'m processing it.',
          timestamp: new Date().toLocaleTimeString(),
          data: data.data
        }
        setMessages(prev => [...prev, arbotMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      const errorMessage: Message = {
        type: 'arbot',
        content: 'I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setLoading(false)
  }

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#e9d5ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '384px',
        height: '600px',
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'grid',
        gridTemplateRows: '80px 1fr 100px',
        overflow: 'hidden'
      }}>
        
        {/* Header - Fixed 80px */}
        <div style={{
          backgroundColor: '#2563eb',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: 'white',
              color: '#2563eb',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} />
            </div>
            <div>
              <h1 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>ARBot Assistant</h1>
              <p style={{
                fontSize: '12px',
                color: '#bfdbfe',
                margin: 0
              }}>HubSpot Intelligence</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#4ade80',
              borderRadius: '50%'
            }}></div>
            <span style={{
              fontSize: '12px',
              color: 'white'
            }}>Connected</span>
          </div>
        </div>

        {/* Chat Messages - Takes remaining space */}
        <div style={{
          backgroundColor: '#f9fafb',
          overflowY: 'auto',
          padding: '12px'
        }}>
          <div ref={messagesRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((message, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  backgroundColor: message.type === 'user' ? '#2563eb' : 'white',
                  color: message.type === 'user' ? 'white' : '#111827',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                  {message.data && (
                    <div style={{
                      marginTop: '4px',
                      padding: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}>
                      <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                        {JSON.stringify(message.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div style={{
                    fontSize: '10px',
                    opacity: 0.7,
                    marginTop: '4px'
                  }}>{message.timestamp}</div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  backgroundColor: 'white',
                  color: '#111827',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid #2563eb',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span style={{ fontSize: '14px' }}>ARBot is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed 100px */}
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Ask ARBot about your HubSpot..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
            />
            
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: loading || !input.trim() ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Send
            </button>
          </div>
          
          {/* Quick Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4px'
          }}>
            {['Blueprint', 'Audit', 'Partners', 'Insights'].map((action) => (
              <button
                key={action}
                onClick={() => {
                  const commands = {
                    Blueprint: 'Create a blueprint to improve my conversion rates',
                    Audit: 'Run an audit of my HubSpot portal',
                    Partners: 'Show me recommended HubSpot partners',
                    Insights: 'Give me insights about my portal performance'
                  }
                  sendMessage(commands[action as keyof typeof commands])
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}