'use client'

import { useState, useEffect } from 'react'
import { Bot, CheckCircle, ArrowRight, Zap, Shield, Users } from 'lucide-react'

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
      }
    } catch (error) {
      console.log('Authentication check failed')
    }
    setLoading(false)
  }

  const handleLogin = () => {
    window.location.href = '/auth/login'
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard'
    } else {
      handleLogin()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    window.location.href = '/dashboard'
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">Morphed Intelligence</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogin}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered HubSpot
            <span className="block text-blue-600">Intelligence Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate comprehensive strategic blueprints, analyze your HubSpot portal, and optimize your marketing operations with advanced AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center gap-2"
            >
              Start Free Blueprint <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500">Connect with HubSpot • No credit card required</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful AI Features</h2>
            <p className="text-lg text-gray-600">Everything you need to optimize your HubSpot operations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Blueprints</h3>
              <p className="text-gray-600">Generate comprehensive strategic blueprints tailored to your industry, persona, and HubSpot tier with actionable implementation steps.</p>
            </div>

            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Portal Analysis</h3>
              <p className="text-gray-600">Real-time analysis of your HubSpot portal health, performance metrics, and optimization opportunities with proactive suggestions.</p>
            </div>

            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Guidance</h3>
              <p className="text-gray-600">Access persona-specific recommendations from CMO, Sales Director, Marketing Manager, and RevOps perspectives.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">Choose the plan that fits your team size and needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$29</div>
                <p className="text-gray-600 mb-6">per month</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>3 Projects</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>5 AI Blueprints</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Basic HubSpot Integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Email Support</span>
                  </li>
                </ul>
                
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="bg-white p-8 rounded-xl border-2 border-blue-500 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$99</div>
                <p className="text-gray-600 mb-6">per month</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>10 Projects</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>20 AI Blueprints</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Advanced HubSpot Integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Chrome Extension</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Priority Support</span>
                  </li>
                </ul>
                
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Scale Plan */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Scale</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$249</div>
                <p className="text-gray-600 mb-6">per month</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>25 Projects</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>50 AI Blueprints</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Enterprise HubSpot Integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Custom AI Training</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Dedicated Support</span>
                  </li>
                </ul>
                
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your HubSpot Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of marketers who use Morphed Intelligence to optimize their HubSpot portals and drive better results.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            Start Your Free Blueprint
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">Morphed Intelligence</span>
            </div>
            <p className="text-gray-400">
              AI-powered HubSpot intelligence platform for modern marketing teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}