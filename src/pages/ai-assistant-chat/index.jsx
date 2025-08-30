import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import QuickActions from './components/QuickActions';
import ChatInput from './components/ChatInput';
import ChatHistory from './components/ChatHistory';
import CapabilitiesPanel from './components/CapabilitiesPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AIAssistantChat = () => {
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentContext, setCurrentContext] = useState('general');
  
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Mock conversation data
  const initialMessages = [
    {
      id: 1,
      sender: 'system',
      content: 'AI Assistant connected',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      sender: 'assistant',
      content: `Hello! I'm your AI assistant for machine learning workflows. I can help you with:\n\n• Dataset analysis and preprocessing\n• Model selection and training guidance\n• Deployment and monitoring strategies\n• Troubleshooting and optimization\n\nWhat would you like to work on today?`,
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      sender: 'user',content: 'I have a customer churn dataset with missing values. How should I handle them?',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 4,
      sender: 'assistant',content: `Great question! For customer churn datasets, here's how to handle missing values:\n\n**1. Analyze the Pattern**\n• Check if missing values are random or systematic\n• Identify which features have missing data\n\n**2. Handling Strategies**\n• **Numerical features**: Use median imputation for skewed data, mean for normal distribution\n• **Categorical features**: Use mode imputation or create "Unknown" category\n• **Time-based features**: Forward-fill or backward-fill based on context\n\n**3. Advanced Techniques**\n• KNN imputation for similar customer profiles\n• Multiple imputation for uncertainty quantification\n• Domain-specific rules (e.g., missing payment history = new customer)\n\nWould you like me to show you code examples for any of these approaches?`,
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: 5,
      sender: 'user',
      content: 'Yes, show me KNN imputation code',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: 6,
      sender: 'assistant',
      type: 'code',
      language: 'python',
      content: `from sklearn.impute import KNNImputer
import pandas as pd
import numpy as np

# Load your dataset
df = pd.read_csv('customer_churn.csv')

# Separate numerical and categorical columns
numerical_cols = df.select_dtypes(include=[np.number]).columns
categorical_cols = df.select_dtypes(include=['object']).columns

# Apply KNN imputation to numerical features
knn_imputer = KNNImputer(n_neighbors=5)
df[numerical_cols] = knn_imputer.fit_transform(df[numerical_cols])

# Handle categorical features separately
for col in categorical_cols:
    df[col].fillna(df[col].mode()[0], inplace=True)

print(f"Missing values after imputation: {df.isnull().sum().sum()}")`,
      timestamp: new Date(Date.now() - 30000)
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    // Determine context based on current route
    const path = location?.pathname;
    if (path?.includes('dataset-management')) {
      setCurrentContext('dataset-management');
    } else if (path?.includes('model-training')) {
      setCurrentContext('model-training');
    } else if (path?.includes('model-deployment')) {
      setCurrentContext('model-deployment');
    } else {
      setCurrentContext('general');
    }
  }, [location?.pathname]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content) => {
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your question. Let me analyze this for you...",
        "That\'s a great approach! Here are some additional considerations...",
        "Based on your dataset characteristics, I'd recommend...",
        "Let me break this down into actionable steps for you...",
        "This is a common challenge in ML. Here\'s how to address it..."
      ];

      const aiResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        content: responses?.[Math.floor(Math.random() * responses?.length)] + `\n\nRegarding "${content?.substring(0, 50)}${content?.length > 50 ? '...' : ''}", here's my detailed analysis and recommendations based on current ML best practices.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (isVoiceActive) {
      setIsRecording(false);
    }
  };

  const handleVoiceRecord = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
    }
    setIsRecording(!isRecording);
    
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage("How do I evaluate model performance for imbalanced datasets?");
      }, 3000);
    }
  };

  const handleFileAttach = (file) => {
    const fileMessage = {
      id: Date.now(),
      sender: 'user',
      content: `Uploaded file: ${file?.name}`,
      timestamp: new Date(),
      attachment: {
        type: 'file',
        name: file?.name,
        size: file?.size
      }
    };

    setMessages(prev => [...prev, fileMessage]);
    
    // Simulate file analysis response
    setTimeout(() => {
      const analysisResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        content: `I've received your file "${file?.name}". Let me analyze it for you...\n\nBased on the file type and size, I can help you with:\n• Data structure analysis\n• Quality assessment\n• Preprocessing recommendations\n• Feature engineering suggestions\n\nWhat specific aspect would you like me to focus on?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, analysisResponse]);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action?.label);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    // Could add a toast notification here
  };

  const handleBookmark = (message) => {
    // Implementation for bookmarking messages
    console.log('Bookmarked message:', message?.id);
  };

  const handleSelectConversation = (conversation) => {
    setShowHistory(false);
    // Load conversation messages
    console.log('Selected conversation:', conversation?.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Chat Interface */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${
            isChatMinimized ? 'opacity-50' : ''
          }`}>
            {/* Chat Header */}
            <ChatHeader
              isVoiceActive={isVoiceActive}
              onToggleVoice={handleVoiceToggle}
              onShowHistory={() => setShowHistory(true)}
              onShowCapabilities={() => setShowCapabilities(true)}
              isMinimized={isChatMinimized}
              onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
            />

            {!isChatMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-background">
                  <div className="max-w-4xl mx-auto">
                    {messages?.map((message) => (
                      <MessageBubble
                        key={message?.id}
                        message={message}
                        onCopyCode={handleCopyCode}
                        onBookmark={handleBookmark}
                      />
                    ))}
                    
                    <TypingIndicator isVisible={isTyping} />
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Quick Actions */}
                <QuickActions
                  onActionClick={handleQuickAction}
                  currentContext={currentContext}
                />

                {/* Chat Input */}
                <ChatInput
                  onSendMessage={handleSendMessage}
                  onVoiceRecord={handleVoiceRecord}
                  onFileAttach={handleFileAttach}
                  isVoiceActive={isVoiceActive}
                  isRecording={isRecording}
                  disabled={isTyping}
                />
              </>
            )}
          </div>

          {/* Floating Action Button (when minimized) */}
          {isChatMinimized && (
            <div className="fixed bottom-6 right-6 z-40">
              <Button
                variant="default"
                size="lg"
                iconName="MessageSquare"
                onClick={() => setIsChatMinimized(false)}
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              />
              {isVoiceActive && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <Icon name="Mic" size={12} color="white" />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <ChatHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectConversation={handleSelectConversation}
      />
      <CapabilitiesPanel
        isOpen={showCapabilities}
        onClose={() => setShowCapabilities(false)}
      />
    </div>
  );
};

export default AIAssistantChat;