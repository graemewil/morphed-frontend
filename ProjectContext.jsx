import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  currentProject: null,
  activeTasks: [],
  completedTasks: [],
  blueprints: [],
  conversationHistory: [],
  projectProgress: {},
  auditResults: null,
  recommendations: [],
  partners: [],
  apps: []
};

// Action types
const ActionTypes = {
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  COMPLETE_TASK: 'COMPLETE_TASK',
  ADD_BLUEPRINT: 'ADD_BLUEPRINT',
  UPDATE_BLUEPRINT: 'UPDATE_BLUEPRINT',
  ADD_CONVERSATION: 'ADD_CONVERSATION',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  SET_AUDIT_RESULTS: 'SET_AUDIT_RESULTS',
  ADD_RECOMMENDATION: 'ADD_RECOMMENDATION',
  SET_PARTNERS: 'SET_PARTNERS',
  SET_APPS: 'SET_APPS',
  RESET_PROJECT: 'RESET_PROJECT'
};

// Reducer function
const projectReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload,
        activeTasks: action.payload?.tasks || [],
        projectProgress: action.payload?.progress || {}
      };

    case ActionTypes.ADD_TASK:
      return {
        ...state,
        activeTasks: [...state.activeTasks, action.payload]
      };

    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        activeTasks: state.activeTasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        )
      };

    case ActionTypes.COMPLETE_TASK:
      const taskToComplete = state.activeTasks.find(task => task.id === action.payload.id);
      return {
        ...state,
        activeTasks: state.activeTasks.filter(task => task.id !== action.payload.id),
        completedTasks: [...state.completedTasks, { 
          ...taskToComplete, 
          status: 'Completed',
          completedAt: new Date().toISOString(),
          completionNotes: action.payload.notes || ''
        }]
      };

    case ActionTypes.ADD_BLUEPRINT:
      return {
        ...state,
        blueprints: [...state.blueprints, action.payload]
      };

    case ActionTypes.UPDATE_BLUEPRINT:
      return {
        ...state,
        blueprints: state.blueprints.map(bp =>
          bp.id === action.payload.id ? { ...bp, ...action.payload.updates } : bp
        )
      };

    case ActionTypes.ADD_CONVERSATION:
      return {
        ...state,
        conversationHistory: [...state.conversationHistory, action.payload]
      };

    case ActionTypes.UPDATE_PROGRESS:
      return {
        ...state,
        projectProgress: { ...state.projectProgress, ...action.payload }
      };

    case ActionTypes.SET_AUDIT_RESULTS:
      return {
        ...state,
        auditResults: action.payload
      };

    case ActionTypes.ADD_RECOMMENDATION:
      return {
        ...state,
        recommendations: [...state.recommendations, action.payload]
      };

    case ActionTypes.SET_PARTNERS:
      return {
        ...state,
        partners: action.payload
      };

    case ActionTypes.SET_APPS:
      return {
        ...state,
        apps: action.payload
      };

    case ActionTypes.RESET_PROJECT:
      return {
        ...initialState,
        conversationHistory: state.conversationHistory // Keep conversation history
      };

    default:
      return state;
  }
};

// Context
const ProjectContext = createContext();

// Provider component
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Action creators
  const actions = {
    setCurrentProject: useCallback((project) => {
      dispatch({ type: ActionTypes.SET_CURRENT_PROJECT, payload: project });
    }, []),

    addTask: useCallback((task) => {
      const newTask = {
        ...task,
        id: task.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: ActionTypes.ADD_TASK, payload: newTask });
    }, []),

    updateTask: useCallback((taskId, updates) => {
      dispatch({ 
        type: ActionTypes.UPDATE_TASK, 
        payload: { id: taskId, updates } 
      });
    }, []),

    completeTask: useCallback((taskId, notes = '') => {
      dispatch({ 
        type: ActionTypes.COMPLETE_TASK, 
        payload: { id: taskId, notes } 
      });
    }, []),

    addBlueprint: useCallback((blueprint) => {
      const newBlueprint = {
        ...blueprint,
        id: blueprint.id || `blueprint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: ActionTypes.ADD_BLUEPRINT, payload: newBlueprint });
    }, []),

    updateBlueprint: useCallback((blueprintId, updates) => {
      dispatch({ 
        type: ActionTypes.UPDATE_BLUEPRINT, 
        payload: { id: blueprintId, updates } 
      });
    }, []),

    addConversation: useCallback((message, response) => {
      const conversation = {
        id: `conv_${Date.now()}`,
        message,
        response,
        timestamp: new Date().toISOString()
      };
      dispatch({ type: ActionTypes.ADD_CONVERSATION, payload: conversation });
    }, []),

    updateProgress: useCallback((progress) => {
      dispatch({ type: ActionTypes.UPDATE_PROGRESS, payload: progress });
    }, []),

    setAuditResults: useCallback((results) => {
      dispatch({ type: ActionTypes.SET_AUDIT_RESULTS, payload: results });
    }, []),

    addRecommendation: useCallback((recommendation) => {
      const newRecommendation = {
        ...recommendation,
        id: recommendation.id || `rec_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: ActionTypes.ADD_RECOMMENDATION, payload: newRecommendation });
    }, []),

    setPartners: useCallback((partners) => {
      dispatch({ type: ActionTypes.SET_PARTNERS, payload: partners });
    }, []),

    setApps: useCallback((apps) => {
      dispatch({ type: ActionTypes.SET_APPS, payload: apps });
    }, []),

    resetProject: useCallback(() => {
      dispatch({ type: ActionTypes.RESET_PROJECT });
    }, [])
  };

  // Computed values
  const computed = {
    totalTasks: state.activeTasks.length + state.completedTasks.length,
    completionRate: state.activeTasks.length + state.completedTasks.length > 0 
      ? (state.completedTasks.length / (state.activeTasks.length + state.completedTasks.length)) * 100 
      : 0,
    overdueTasks: state.activeTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed'
    ).length,
    upcomingTasks: state.activeTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length,
    projectScore: state.currentProject?.score || 0
  };

  const value = {
    state,
    actions,
    computed
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// Hook to use the context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext;