import React, { useEffect } from "react";
import ReactMarkdown from 'react-markdown';

export default function MorphedBotOutput({ output, followUps }) {
  // Debug logging for bot connectivity
  useEffect(() => {
    console.log("Bot response:", output);
  }, [output]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="text-xl font-semibold text-gray-900">AI Blueprint Output</div>
      
      <div className="prose prose-sm max-w-none text-gray-700">
        <ReactMarkdown 
          components={{
            h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
            h2: ({children}) => <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6">{children}</h2>,
            h3: ({children}) => <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">{children}</h3>,
            p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
            ul: ({children}) => <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>,
            li: ({children}) => <li className="text-gray-700">{children}</li>,
            strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
            code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
            blockquote: ({children}) => <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600">{children}</blockquote>
          }}
        >
          {output}
        </ReactMarkdown>
      </div>

      {followUps?.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Recommended Next Steps</h4>
          <div className="flex flex-wrap gap-2">
            {followUps.map((item, i) => (
              <button 
                key={i}
                className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}