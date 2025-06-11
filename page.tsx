'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Activity, Users, Database, AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-react'

interface SystemMetrics {
  systemHealth: {
    hubspotConnection: string
    aiProviders: any
    database: any
    memory: any
    uptime: number
  }
  userMetrics: {
    totalActiveUsers: number
    dailyActiveUsers: number
  }
  apiMetrics: {
    totalCallsToday: number
    averageResponseTime: number
    errorRate: number
  }
  recentErrors: any[]
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')

  useEffect(() => {
    fetchSystemMetrics()
    const interval = setInterval(fetchSystemMetrics, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch(`/api/admin/metrics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatMemory = (bytes: number) => {
    return `${Math.round(bytes / 1024 / 1024)}MB`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ARBot Admin Dashboard</h1>
                <p className="text-gray-600">System monitoring and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">HubSpot Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.systemHealth?.hubspotConnection === 'connected' ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                metrics?.systemHealth?.hubspotConnection === 'connected' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {metrics?.systemHealth?.hubspotConnection === 'connected' ? 
                  <CheckCircle className="w-6 h-6" /> : 
                  <AlertTriangle className="w-6 h-6" />
                }
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.userMetrics?.dailyActiveUsers || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.apiMetrics?.totalCallsToday || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className={`text-2xl font-bold ${
                  (metrics?.apiMetrics?.errorRate || 0) > 5 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {metrics?.apiMetrics?.errorRate || 0}%
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                (metrics?.apiMetrics?.errorRate || 0) > 5 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-green-100 text-green-600'
              }`}>
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">System Performance</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium">
                  {formatUptime(metrics?.systemHealth?.uptime || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Memory Usage</span>
                <span className="text-sm font-medium">
                  {formatMemory(metrics?.systemHealth?.memory?.used || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="text-sm font-medium">
                  {metrics?.apiMetrics?.averageResponseTime || 0}ms
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">System started successfully</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">HubSpot connection established</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">AI engines initialized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}