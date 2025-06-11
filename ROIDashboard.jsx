import React, { useState, useEffect } from 'react';

const ROIDashboard = ({ userId, className = "" }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, [userId, timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dashboard/impact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId || 'demo_user',
          time_range: timeRange
        })
      });

      if (!response.ok) {
        throw new Error(`Dashboard API error: ${response.status}`);
      }

      const result = await response.json();
      setDashboardData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Dashboard Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Blueprint ROI Dashboard</h2>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
              <option value="1y">1 Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        ) : dashboardData ? (
          <div className="space-y-6">
            {/* Portal Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData.portal_health?.current_score || 0}
                </div>
                <div className="text-sm text-blue-800">Portal Score</div>
                <div className="text-xs text-green-600 mt-1">
                  +{dashboardData.portal_health?.improvement || 0} improvement
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(dashboardData.roi_metrics?.business_impact?.estimated_revenue_impact || 0).toLocaleString()}
                </div>
                <div className="text-sm text-green-800">Revenue Impact</div>
                <div className="text-xs text-gray-600 mt-1">This period</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(dashboardData.roi_metrics?.blueprint_performance?.average_completion_rate || 0)}%
                </div>
                <div className="text-sm text-purple-800">Completion Rate</div>
                <div className="text-xs text-gray-600 mt-1">All blueprints</div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {dashboardData.roi_metrics?.business_impact?.time_saved_hours || 0}h
                </div>
                <div className="text-sm text-yellow-800">Time Saved</div>
                <div className="text-xs text-gray-600 mt-1">Operational efficiency</div>
              </div>
            </div>

            {/* Key Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Achievements</h3>
              <div className="space-y-2">
                {(dashboardData.key_achievements || []).map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Projections */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Future Projections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardData.projections && Object.entries(dashboardData.projections).map(([period, projection]) => (
                  <div key={period} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 capitalize mb-3">
                      {period.replace('_', ' ')}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue Lift:</span>
                        <span className="font-medium text-green-600">
                          ${projection.projected_revenue_lift?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Portal Improvement:</span>
                        <span className="font-medium text-blue-600">
                          +{projection.expected_portal_improvement} points
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Savings:</span>
                        <span className="font-medium text-purple-600">
                          {projection.estimated_time_savings}h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium text-gray-900">
                          {Math.round(projection.confidence_level * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Value */}
            {dashboardData.partner_value && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Value Delivered</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {dashboardData.partner_value.active_partnerships || 0}
                      </div>
                      <div className="text-xs text-gray-600">Active Partnerships</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        ${(dashboardData.partner_value.total_investment || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Total Investment</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        ${(dashboardData.partner_value.realized_value || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Value Realized</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {Math.round(dashboardData.partner_value.net_roi || 0)}%
                      </div>
                      <div className="text-xs text-gray-600">Net ROI</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
              <div className="space-y-2">
                {(dashboardData.recommendations || []).map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <p className="text-sm text-blue-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <p className="text-gray-500">No dashboard data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ROIDashboard;