import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useProject } from '../ProjectContext';
import SimulationModal from '../SimulationModal';

const BotResponseCard = ({ response, onFollowUp, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [simulationModal, setSimulationModal] = useState({ isOpen: false, itemId: null, itemType: 'app' });
  const { actions } = useProject();

  const {
    response: messageContent,
    confidence_score = 0,
    suggestions = [],
    follow_up_questions = [],
    blueprints = [],
    tasks = [],
    projects = [],
    timestamp = new Date().toISOString()
  } = response;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleConvertToProject = (blueprint) => {
    actions.addBlueprint(blueprint);
    if (blueprint.tasks) {
      blueprint.tasks.forEach(task => actions.addTask(task));
    }
  };

  const handleTaskAction = (task, action) => {
    switch (action) {
      case 'complete':
        actions.completeTask(task.id);
        break;
      case 'start':
        actions.updateTask(task.id, { status: 'In Progress' });
        break;
      default:
        break;
    }
  };

  const handleSimulateImpact = (itemId, itemType = 'app') => {
    setSimulationModal({ isOpen: true, itemId, itemType });
  };

  const closeSimulationModal = () => {
    setSimulationModal({ isOpen: false, itemId: null, itemType: 'app' });
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm mb-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-900">ARBot</span>
            <span className="text-xs text-gray-500 ml-2">{formatTimestamp(timestamp)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {confidence_score > 0 && (
            <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(confidence_score)}`}>
              {Math.round(confidence_score * 100)}% confidence
            </span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg 
              className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Main Response */}
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown 
              components={{
                // Custom renderers for better styling
                h1: ({children}) => <h1 className="text-lg font-semibold text-gray-900 mb-2">{children}</h1>,
                h2: ({children}) => <h2 className="text-base font-semibold text-gray-900 mb-2">{children}</h2>,
                h3: ({children}) => <h3 className="text-sm font-semibold text-gray-900 mb-1">{children}</h3>,
                p: ({children}) => <p className="text-sm text-gray-700 mb-2 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="text-sm text-gray-700 space-y-1 mb-2">{children}</ul>,
                li: ({children}) => <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><span>{children}</span></li>,
                strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-800">{children}</em>
              }}
            >
              {messageContent}
            </ReactMarkdown>
          </div>

          {/* Blueprints */}
          {blueprints.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Generated Blueprints</h4>
              {blueprints.map((blueprint, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-sm font-medium text-blue-900">{blueprint.title}</h5>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {blueprint.score || 85}% match
                    </span>
                  </div>
                  <p className="text-xs text-blue-800 mb-3">{blueprint.summary}</p>
                  <button
                    onClick={() => handleConvertToProject(blueprint)}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Convert to Project
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {tasks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Recommended Tasks</h4>
              {tasks.map((task, index) => (
                <details key={index} className="bg-gray-50 rounded-lg border border-gray-200">
                  <summary className="p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{task.task}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </summary>
                  <div className="px-3 pb-3 space-y-2">
                    {task.details && (
                      <p className="text-xs text-gray-600">{task.details}</p>
                    )}
                    <div className="flex space-x-2">
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleTaskAction(task, 'complete')}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      {task.status === 'Not Started' && (
                        <button
                          onClick={() => handleTaskAction(task, 'start')}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                        >
                          Start Task
                        </button>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Suggestions</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onFollowUp(suggestion)}
                    className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Questions */}
          {follow_up_questions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Follow-up Questions</h4>
              <div className="space-y-1">
                {follow_up_questions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onFollowUp(question)}
                    className="block w-full text-left text-xs px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Partner/App Recommendations with Simulation */}
          {(response.recommended_apps || response.recommended_partners) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Strategic Recommendations</h4>
              
              {response.recommended_apps && response.recommended_apps.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs text-gray-600">Recommended Apps:</span>
                  {response.recommended_apps.map((app, index) => (
                    <div key={index} className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-indigo-900">{app.name}</h5>
                          <p className="text-xs text-indigo-800">{app.use_case}</p>
                          {app.roi_impact && (
                            <p className="text-xs text-green-700 font-medium mt-1">Impact: {app.roi_impact}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleSimulateImpact(app.name.toLowerCase().replace(/\s+/g, '-'), 'app')}
                          className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors"
                        >
                          Simulate Impact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {response.recommended_partners && response.recommended_partners.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs text-gray-600">Recommended Partners:</span>
                  {response.recommended_partners.map((partner, index) => (
                    <div key={index} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-purple-900">{partner.name}</h5>
                          <p className="text-xs text-purple-800">{partner.specialization}</p>
                          {partner.case_study && (
                            <p className="text-xs text-green-700 font-medium mt-1">{partner.case_study}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleSimulateImpact(partner.name.toLowerCase().replace(/\s+/g, '-'), 'partner')}
                          className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                        >
                          Simulate Impact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Simulation Modal */}
      <SimulationModal
        isOpen={simulationModal.isOpen}
        onClose={closeSimulationModal}
        itemId={simulationModal.itemId}
        itemType={simulationModal.itemType}
      />
    </div>
  );
};

export default BotResponseCard;