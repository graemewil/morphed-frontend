import React, { useState } from 'react';
import { useProject } from '../ProjectContext';
import TaskCard from '../TaskCard';

const ProjectPanel = ({ className = "" }) => {
  const { state, computed, actions } = useProject();
  const [activeTab, setActiveTab] = useState('overview');

  const { currentProject, activeTasks, completedTasks } = state;
  const { totalTasks, completionRate, overdueTasks, upcomingTasks } = computed;

  if (!currentProject) {
    return (
      <div className={`bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center ${className}`}>
        <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Project</h3>
        <p className="text-gray-600">Ask ARBot to generate a blueprint or convert an existing blueprint to start a project.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Project Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentProject.projectName || currentProject.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {currentProject.description || currentProject.summary}
            </p>
          </div>
          <div className="ml-6 flex flex-col items-end space-y-2">
            <span className="text-2xl font-bold text-blue-600">
              {Math.round(completionRate)}%
            </span>
            <span className="text-xs text-gray-500">Complete</span>
          </div>
        </div>

        {/* Project Metrics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">{totalTasks}</div>
            <div className="text-xs text-blue-800">Total Tasks</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">{completedTasks.length}</div>
            <div className="text-xs text-green-800">Completed</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-semibold text-red-600">{overdueTasks}</div>
            <div className="text-xs text-red-800">Overdue</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-semibold text-yellow-600">{upcomingTasks}</div>
            <div className="text-xs text-yellow-800">Due Soon</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Project Progress</span>
            <span className="text-gray-900 font-medium">{Math.round(completionRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', count: null },
            { id: 'active', label: 'Active Tasks', count: activeTasks.length },
            { id: 'completed', label: 'Completed', count: completedTasks.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Project Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Persona:</span>
                  <span className="ml-2 font-medium">{currentProject.persona || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">HubSpot Tier:</span>
                  <span className="ml-2 font-medium">{currentProject.hubspotTier || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 font-medium">
                    {currentProject.createdAt ? new Date(currentProject.createdAt).toLocaleDateString() : 'Today'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-medium">{currentProject.status || 'Active'}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {completedTasks.slice(-3).map((task, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">{task.task}</span>
                  </div>
                ))}
                {completedTasks.length === 0 && (
                  <p className="text-gray-500 text-sm">No completed tasks yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeTasks.length > 0 ? (
              activeTasks.map((task, index) => (
                <TaskCard
                  key={task.id || index}
                  task={task}
                  onTaskComplete={(task) => actions.completeTask(task.id)}
                  onTaskUpdate={(task, status) => actions.updateTask(task.id, { status })}
                  onViewDetails={(task) => console.log('View task details:', task)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p className="text-gray-500">No active tasks. All tasks have been completed!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedTasks.length > 0 ? (
              completedTasks.map((task, index) => (
                <TaskCard
                  key={task.id || index}
                  task={task}
                  onTaskComplete={() => {}}
                  onTaskUpdate={() => {}}
                  onViewDetails={(task) => console.log('View task details:', task)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p className="text-gray-500">No completed tasks yet. Start working on your active tasks!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPanel;