import React from 'react';

const PartnerCard = ({ 
  partner, 
  onSelectPartner, 
  onViewCaseStudy, 
  className = "" 
}) => {
  const {
    name,
    logo,
    tier,
    category,
    summary,
    specialization = [],
    success_rate = 0,
    case_studies = [],
    hubspot_certified = false,
    implementation_timeline = '',
    pricing_tier = 'Contact for Quote'
  } = partner;

  const tierColors = {
    'Diamond': 'bg-purple-100 text-purple-800 border-purple-200',
    'Platinum': 'bg-gray-100 text-gray-800 border-gray-300',
    'Gold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Silver': 'bg-blue-100 text-blue-800 border-blue-200',
    'Certified': 'bg-green-100 text-green-800 border-green-200'
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
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm" style={{display: logo ? 'none' : 'flex'}}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
            <p className="text-xs text-gray-500">{category}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          {tier && (
            <span className={`px-2 py-1 text-xs rounded-full border ${tierColors[tier] || tierColors['Certified']}`}>
              {tier} Partner
            </span>
          )}
          {hubspot_certified && (
            <span className="text-xs text-green-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              HubSpot Certified
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{summary}</p>

      {/* Specializations */}
      {specialization.length > 0 && (
        <div className="mb-3">
          <span className="text-xs font-medium text-gray-700 block mb-1">Specializations:</span>
          <div className="flex flex-wrap gap-1">
            {specialization.slice(0, 3).map((spec, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                {spec}
              </span>
            ))}
            {specialization.length > 3 && (
              <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                +{specialization.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
        {success_rate > 0 && (
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-gray-600">Success:</span>
            <span className="font-medium text-green-600">{success_rate}%</span>
          </div>
        )}
        
        {implementation_timeline && (
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            <span className="text-gray-600">Timeline:</span>
            <span className="font-medium">{implementation_timeline}</span>
          </div>
        )}
      </div>

      {/* Case Studies Preview */}
      {case_studies.length > 0 && (
        <div className="mb-4">
          <span className="text-xs font-medium text-gray-700 block mb-2">Recent Success:</span>
          <div className="bg-gray-50 rounded-md p-2">
            <p className="text-xs text-gray-600 line-clamp-2">
              {case_studies[0].summary || case_studies[0].title || 'Successful implementation with measurable results'}
            </p>
          </div>
        </div>
      )}

      {/* Pricing */}
      <div className="mb-4">
        <span className="text-xs text-gray-500">Pricing: </span>
        <span className="text-xs font-medium text-gray-700">{pricing_tier}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onSelectPartner(partner)}
          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Select Partner
        </button>
        
        {case_studies.length > 0 && (
          <button
            onClick={() => onViewCaseStudy(partner)}
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Case Study
          </button>
        )}
      </div>
    </div>
  );
};

export default PartnerCard;