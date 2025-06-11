import React, { useState } from "react";

export default function TaskAccordion({ tasks }) {
  const [expandedTask, setExpandedTask] = useState(null);

  const toggleTask = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div key={task.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
          <div 
            className="bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleTask(task.id || index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg 
                  className={`w-5 h-5 transform transition-transform ${expandedTask === (task.id || index) ? 'rotate-90' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">{task.title || task.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                {task.priority && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                )}
                {task.status && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {expandedTask === (task.id || index) && (
            <div className="px-4 py-4 bg-white border-t border-gray-200">
              {task.description && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{task.description}</p>
                </div>
              )}
              
              {task.whyItMatters && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Why It Matters</h4>
                  <p className="text-gray-700">{task.whyItMatters}</p>
                </div>
              )}
              
              {task.implementation && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Implementation Steps</h4>
                  <div className="text-gray-700 whitespace-pre-wrap">{task.implementation}</div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {task.assignedTo && (
                  <div>
                    <span className="font-medium text-gray-900">Assigned to:</span>
                    <span className="ml-2 text-gray-700">{task.assignedTo}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <span className="font-medium text-gray-900">Due date:</span>
                    <span className="ml-2 text-gray-700">{task.dueDate}</span>
                  </div>
                )}
                {task.estimatedHours && (
                  <div>
                    <span className="font-medium text-gray-900">Estimated hours:</span>
                    <span className="ml-2 text-gray-700">{task.estimatedHours}h</span>
                  </div>
                )}
                {task.category && (
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="ml-2 text-gray-700">{task.category}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}