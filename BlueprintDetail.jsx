import React from "react";

export default function BlueprintDetail({ blueprint, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!blueprint) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{blueprint.title || 'Blueprint'}</h2>
        {blueprint.tier && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
            {blueprint.tier}
          </span>
        )}
      </div>

      {blueprint.executiveSummary && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Summary</h3>
          <p className="text-gray-700 leading-relaxed">{blueprint.executiveSummary}</p>
        </div>
      )}

      {blueprint.implementation && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Implementation</h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{blueprint.implementation}</div>
        </div>
      )}

      {blueprint.expectedResults && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Expected Results</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {blueprint.expectedResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}

      {blueprint.recommendedApps && blueprint.recommendedApps.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommended Apps</h3>
          <div className="flex flex-wrap gap-2">
            {blueprint.recommendedApps.map((app, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {app}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}