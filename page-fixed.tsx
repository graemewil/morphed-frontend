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
    <div className="min-h-screen bg-purple-100 p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden" style={{height: '90vh'}}>
        
        {/* Header - Fixed height */}
        <div className="bg-blue-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-blue-600 p-2 rounded-full">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">ARBot Assistant</h1>
              <p className="text-sm text-blue-100">HubSpot Intelligence Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-white">Connected</span>
          </div>
        </div>

        {/* Chat Messages - Fixed height with scroll */}
        <div style={{height: 'calc(90vh - 200px)'}} className="bg-gray-50 overflow-y-auto">
          <div ref={messagesRef} className="p-3 space-y-2">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-2 text-sm ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.data && (
                    <div className="mt-1 p-1 bg-white bg-opacity-20 rounded text-xs">
                      <pre className="whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(message.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 rounded-lg p-2 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    <span className="text-sm">ARBot is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="bg-white p-3 border-t border-gray-200">
          <div className="flex space-x-2 mb-2">
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
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Send
            </button>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex justify-center space-x-1">
            <button
              onClick={() => sendMessage('Create a blueprint to improve my conversion rates')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
            >
              Blueprint
            </button>
            <button
              onClick={() => sendMessage('Run an audit of my HubSpot portal')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
            >
              Audit
            </button>
            <button
              onClick={() => sendMessage('Show me recommended HubSpot partners')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
            >
              Partners
            </button>
            <button
              onClick={() => sendMessage('Give me insights about my portal performance')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
            >
              Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}