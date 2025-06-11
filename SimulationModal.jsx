import React, { useState, useEffect } from 'react';

const SimulationModal = ({ isOpen, onClose, itemId, itemType = 'app' }) => {
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && itemId) {
      fetchSimulationData();
    }
  }, [isOpen, itemId]);

  const fetchSimulationData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/sandbox/app-impact/${itemId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch simulation: ${response.status}`);
      }
      
      const result = await response.json();
      setSimulationData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstallOrBook = () => {
    if (itemType === 'app') {
      // Trigger app installation flow
      window.open(`https://ecosystem.hubspot.com/marketplace/apps/${itemId}`, '_blank');
    } else {
      // Trigger partner booking flow
      window.open(`mailto:partnerships@morphed.ai?subject=Partner Consultation Request&body=I'm interested in engaging ${simulationData?.name} for my optimization project.`, '_blank');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Impact Simulation: {simulationData?.name || 'Loading...'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Generating impact simulation...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">Failed to load simulation data: {error}</p>
                </div>
              </div>
            </div>
          )}

          {simulationData && !isLoading && (
            <div className="space-y-6">
              {/* Confidence Score */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Simulation Confidence</span>
                  <span className="text-lg font-bold text-blue-600">
                    {Math.round(simulationData.confidence_score * 100)}%
                  </span>
                </div>
                <p className="text-xs text-blue-800 mt-1">{simulationData.data_source}</p>
              </div>

              {/* Metrics Simulated */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Projected Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(simulationData.metrics_simulated || {}).map(([metric, value]) => (
                    <div key={metric} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 capitalize">
                        {metric.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xl font-semibold text-green-600">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementation Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Overview</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {Object.entries(simulationData.implementation_preview || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI Projection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(simulationData.roi_projection || {}).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-xs text-green-600 uppercase tracking-wide">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-lg font-bold text-green-800">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementation Steps */}
              {(simulationData.implementation_steps || simulationData.deliverables) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {itemType === 'app' ? 'Implementation Steps' : 'Key Deliverables'}
                  </h3>
                  <div className="space-y-2">
                    {(simulationData.implementation_steps || simulationData.deliverables || []).map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Studies */}
              {simulationData.case_studies && simulationData.case_studies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Stories</h3>
                  <div className="space-y-3">
                    {simulationData.case_studies.map((study, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{study.company}</h4>
                          <span className="text-xs text-gray-500">{study.timeframe}</span>
                        </div>
                        <p className="text-sm text-gray-600">{study.industry}</p>
                        <p className="text-sm text-green-700 font-medium mt-2">{study.result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {simulationData && !isLoading && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleInstallOrBook}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {itemType === 'app' ? 'Install App' : 'Book Consultation'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationModal;