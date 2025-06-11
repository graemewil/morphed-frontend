import React, { useState, useEffect } from 'react';
import { ProjectProvider } from './ProjectContext';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import BotInput from './Bot/BotInput';
import BotResponseCard from './Bot/BotResponseCard';
import ProjectPanel from './Bot/ProjectPanel';
import BlueprintCard from './BlueprintCard';
import PartnerCard from './PartnerCard';
import AppRecommendationCard from './AppRecommendationCard';
import ROIDashboard from './ROIDashboard';

const MainInterface = () => {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('chat');
  const [blueprints, setBlueprints] = useState([]);
  const [partners, setPartners] = useState([]);
  const [apps, setApps] = useState([]);

  // Load conversation from localStorage on mount
  useEffect(() => {
    const savedConversation = localStorage.getItem('morphed_conversation');
    if (savedConversation) {
      try {
        setConversation(JSON.parse(savedConversation));
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    }
  }, []);

  // Save conversation to localStorage
  useEffect(() => {
    if (conversation.length > 0) {
      localStorage.setItem('morphed_conversation', JSON.stringify(conversation));
    }
  }, [conversation]);

  const handleSendMessage = async (message) => {
    setIsLoading(true);
    
    try {
      // Add user message to conversation
      const userMessage = {
        id: `msg_${Date.now()}`,
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, userMessage]);

      // Call blueprint generation API
      const response = await fetch('/api/blueprints/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: {
            user_id: 'web_user',
            conversation_history: conversation.slice(-5) // Last 5 messages for context
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      
      // Add bot response to conversation
      const botResponse = {
        id: `msg_${Date.now()}_bot`,
        type: 'bot',
        content: result.data,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, botResponse]);

      // Update blueprints if any were generated
      if (result.data.blueprints && result.data.blueprints.length > 0) {
        setBlueprints(prev => [...prev, ...result.data.blueprints]);
      }

    } catch (error) {
      console.error('Message send error:', error);
      
      // Add error message to conversation
      const errorResponse = {
        id: `msg_${Date.now()}_error`,
        type: 'bot',
        content: {
          response: `I encountered an error processing your request: ${error.message}. Please try again or contact support if the issue persists.`,
          confidence_score: 0,
          suggestions: ['Try rephrasing your question', 'Check your internet connection', 'Contact support']
        },
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUp = (followUpMessage) => {
    handleSendMessage(followUpMessage);
  };

  const handleViewBlueprint = (blueprint) => {
    console.log('Viewing blueprint:', blueprint);
    // Implementation for blueprint detail view
  };

  const handleConvertToProject = (blueprint) => {
    console.log('Converting blueprint to project:', blueprint);
    // Implementation for project conversion
  };

  const handleSelectPartner = (partner) => {
    console.log('Selecting partner:', partner);
    // Implementation for partner selection
  };

  const handleInstallApp = (app) => {
    console.log('Installing app:', app);
    // Implementation for app installation
  };

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-1 flex">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="px-3">
                <nav className="space-y-1">
                  {[
                    { id: 'chat', label: 'AI Assistant', icon: '💬' },
                    { id: 'projects', label: 'Projects', icon: '📋' },
                    { id: 'blueprints', label: 'Blueprints', icon: '🎯' },
                    { id: 'roi', label: 'Blueprint ROI', icon: '📈' },
                    { id: 'partners', label: 'Partners', icon: '🤝' },
                    { id: 'apps', label: 'Apps', icon: '⚡' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeView === item.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {activeView === 'chat' && (
                <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 pb-32">
                  {conversation.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Morphed Intelligence</h2>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Ask me anything about your business workflows, HubSpot optimization, or generating actionable blueprints.
                      </p>
                    </div>
                  )}
                  
                  {conversation.map((msg) => (
                    <div key={msg.id}>
                      {msg.type === 'user' ? (
                        <div className="flex justify-end mb-4">
                          <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-md">
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        <BotResponseCard
                          response={msg.content}
                          onFollowUp={handleFollowUp}
                        />
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span className="text-sm">ARBot is thinking...</span>
                    </div>
                  )}
                </div>
              )}

              {activeView === 'projects' && (
                <div className="max-w-6xl mx-auto p-4 sm:p-6">
                  <ProjectPanel />
                </div>
              )}

              {activeView === 'blueprints' && (
                <div className="max-w-6xl mx-auto p-4 sm:p-6">
                  <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Generated Blueprints</h1>
                    <p className="text-gray-600 mt-1">Review and convert your AI-generated blueprints into actionable projects.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {blueprints.length > 0 ? (
                      blueprints.map((blueprint, index) => (
                        <BlueprintCard
                          key={blueprint.id || index}
                          blueprint={blueprint}
                          onViewDetails={handleViewBlueprint}
                          onConvertToProject={handleConvertToProject}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                        <p className="text-gray-500">No blueprints generated yet. Start a conversation with ARBot to create your first blueprint.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeView === 'roi' && (
                <div className="max-w-6xl mx-auto p-4 sm:p-6">
                  <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Blueprint ROI Dashboard</h1>
                    <p className="text-gray-600 mt-1">Track the impact and return on investment of your optimization projects.</p>
                  </div>
                  
                  <ROIDashboard userId="web_user" />
                </div>
              )}
            </div>

            {/* Fixed Bot Input */}
            {activeView === 'chat' && (
              <BotInput 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProjectProvider>
  );
};

export default MainInterface;