import React, { useState } from 'react';

const TaskCard = ({ 
  task, 
  onTaskComplete, 
  onTaskUpdate, 
  onViewDetails,
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    task: taskName,
    status,
    assignedTo,
    dueDate,
    details,
    milestone,
    priority = 'medium',
    completionNotes = ''
  } = task;

  const statusColors = {
    'Completed': 'bg-green-100 text-green-800 border-green-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Not Started': 'bg-gray-100 text-gray-800 border-gray-200',
    'Overdue': 'bg-red-100 text-red-800 border-red-200'
  };

  const priorityColors = {
    'high': 'border-l-red-500',
    'medium': 'border-l-yellow-500',
    'low': 'border-l-green-500'
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isOverdue = status !== 'Completed' && new Date(dueDate) < new Date();

  return (
    <div className={`bg-white rounded-lg border-l-4 ${priorityColors[priority]} border-r border-t border-b border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {taskName}
            </h4>
            {milestone && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {milestone}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span className={`px-2 py-1 text-xs rounded-full border ${statusColors[status] || statusColors['Not Started']}`}>
              {status}
            </span>
          </div>
        </div>

        {/* Task Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {assignedTo && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-600">{assignedTo}</span>
                </div>
              )}
              {dueDate && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  <span className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {formatDate(dueDate)}
                  </span>
                  {isOverdue && (
                    <span className="text-xs text-red-600 font-medium">(Overdue)</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Expand/Collapse Button */}
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

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            {details && (
              <div>
                <span className="text-xs font-medium text-gray-700 block mb-1">Implementation Details:</span>
                <p className="text-sm text-gray-600 leading-relaxed">{details}</p>
              </div>
            )}
            
            {completionNotes && (
              <div>
                <span className="text-xs font-medium text-gray-700 block mb-1">Completion Notes:</span>
                <p className="text-sm text-gray-600 leading-relaxed">{completionNotes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              {status !== 'Completed' && (
                <button
                  onClick={() => onTaskComplete(task)}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Mark Complete
                </button>
              )}
              
              <button
                onClick={() => onViewDetails(task)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View Details
              </button>
              
              {status === 'Not Started' && (
                <button
                  onClick={() => onTaskUpdate(task, 'In Progress')}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Start Task
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;