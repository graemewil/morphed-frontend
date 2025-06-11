import React from 'react';

const BlueprintCard = ({ 
  blueprint, 
  onViewDetails, 
  onConvertToProject, 
  className = "" 
}) => {
  const {
    title,
    summary,
    score = 0,
    persona,
    industry,
    hubspot_tier,
    implementation_timeline,
    business_impact,
    recommended_apps = [],
    milestones = []
  } = blueprint;

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
  const progressPercent = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {summary}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <div className={`text-2xl font-bold ${scoreColor}`}>
            {score}%
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            score >= 80 ? 'bg-green-100 text-green-800' : 
            score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {score >= 80 ? 'High Impact' : score >= 60 ? 'Medium Impact' : 'Needs Work'}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
          </svg>
          {persona}
        </span>
        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
          </svg>
          {industry}
        </span>
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
          {hubspot_tier}
        </span>
      </div>

      {/* Progress Bar */}
      {milestones.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900 font-medium">
              {completedMilestones}/{milestones.length} milestones
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        {implementation_timeline && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            <span className="text-gray-600">Timeline:</span>
            <span className="font-medium">{implementation_timeline}</span>
          </div>
        )}
        {business_impact && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
            </svg>
            <span className="text-gray-600">Impact:</span>
            <span className="font-medium">{business_impact}</span>
          </div>
        )}
      </div>

      {/* Recommended Apps Preview */}
      {recommended_apps.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">Recommended Apps:</span>
          <div className="flex flex-wrap gap-1">
            {recommended_apps.slice(0, 3).map((app, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                {typeof app === 'string' ? app : app.name}
              </span>
            ))}
            {recommended_apps.length > 3 && (
              <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                +{recommended_apps.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(blueprint)}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          View Details
        </button>
        <button 
          onClick={() => onConvertToProject(blueprint)}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Convert to Project
        </button>
      </div>
    </div>
  );
};

export default BlueprintCard;