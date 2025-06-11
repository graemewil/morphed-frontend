import React from 'react';

const AppRecommendationCard = ({ 
  app, 
  onInstallApp, 
  onViewDetails, 
  className = "" 
}) => {
  const {
    name,
    category,
    description,
    logo,
    rating = 0,
    pricing = 'Free',
    hubspot_tier_required = 'Starter',
    features = [],
    use_cases = [],
    setup_complexity = 'Easy',
    integration_time = '5 minutes'
  } = app;

  const complexityColors = {
    'Easy': 'text-green-600',
    'Medium': 'text-yellow-600',
    'Advanced': 'text-red-600'
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </div>
          </div>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {logo ? (
            <img 
              src={logo} 
              alt={`${name} logo`} 
              className="w-10 h-10 rounded-lg object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm" style={{display: logo ? 'none' : 'flex'}}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
            <p className="text-xs text-gray-500">{category}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-1">
            {renderStars(rating)}
            <span className="text-xs text-gray-500 ml-1">({rating})</span>
          </div>
          <span className="text-xs font-medium text-green-600">{pricing}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

      {/* Requirements */}
      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
          <span className="text-gray-600">Requires:</span>
          <span className="font-medium">{hubspot_tier_required}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
          <span className="text-gray-600">Setup:</span>
          <span className={`font-medium ${complexityColors[setup_complexity]}`}>{integration_time}</span>
        </div>
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="mb-3">
          <span className="text-xs font-medium text-gray-700 block mb-1">Key Features:</span>
          <div className="flex flex-wrap gap-1">
            {features.slice(0, 3).map((feature, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full">
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full">
                +{features.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Use Cases */}
      {use_cases.length > 0 && (
        <div className="mb-4">
          <span className="text-xs font-medium text-gray-700 block mb-1">Best For:</span>
          <p className="text-xs text-gray-600">{use_cases.slice(0, 2).join(', ')}</p>
        </div>
      )}

      {/* Setup Complexity Badge */}
      <div className="mb-4">
        <span className="text-xs text-gray-500">Setup Complexity: </span>
        <span className={`text-xs font-medium ${complexityColors[setup_complexity]}`}>
          {setup_complexity}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onInstallApp(app)}
          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Install App
        </button>
        
        <button
          onClick={() => onViewDetails(app)}
          className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default AppRecommendationCard;