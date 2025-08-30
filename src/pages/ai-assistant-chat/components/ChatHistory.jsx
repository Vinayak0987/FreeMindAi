import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatHistory = ({ isOpen, onClose, onSelectConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const conversations = [
    {
      id: 1,
      title: "Dataset Analysis Help",
      preview: "How do I handle missing values in my customer data?",
      timestamp: new Date(Date.now() - 3600000),
      messageCount: 12,
      tags: ['preprocessing', 'data-cleaning']
    },
    {
      id: 2,
      title: "Model Selection Guidance",
      preview: "Which algorithm works best for time series forecasting?",
      timestamp: new Date(Date.now() - 7200000),
      messageCount: 8,
      tags: ['algorithms', 'time-series']
    },
    {
      id: 3,
      title: "Deployment Troubleshooting",
      preview: "My model deployment is failing with memory errors...",
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 15,
      tags: ['deployment', 'troubleshooting']
    },
    {
      id: 4,
      title: "Feature Engineering Tips",
      preview: "Best practices for creating features from text data",
      timestamp: new Date(Date.now() - 172800000),
      messageCount: 6,
      tags: ['feature-engineering', 'nlp']
    },
    {
      id: 5,
      title: "Hyperparameter Tuning",
      preview: "How to optimize my neural network parameters?",
      timestamp: new Date(Date.now() - 259200000),
      messageCount: 20,
      tags: ['optimization', 'neural-networks']
    }
  ];

  const filters = [
    { id: 'all', label: 'All Conversations', count: conversations?.length },
    { id: 'recent', label: 'Recent', count: 3 },
    { id: 'bookmarked', label: 'Bookmarked', count: 2 },
    { id: 'archived', label: 'Archived', count: 1 }
  ];

  const filteredConversations = conversations?.filter(conv => {
    const matchesSearch = conv?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         conv?.preview?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         conv?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    
    if (selectedFilter === 'recent') {
      return matchesSearch && (Date.now() - conv?.timestamp?.getTime()) < 86400000;
    }
    
    return matchesSearch;
  });

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now?.getTime() - timestamp?.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl h-[80vh] overflow-hidden elevation-3">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Chat History</h2>
            <p className="text-sm text-muted-foreground">Browse and search your previous conversations</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        <div className="flex h-full">
          {/* Sidebar Filters */}
          <div className="w-64 border-r border-border p-4">
            <div className="space-y-2">
              {filters?.map((filter) => (
                <button
                  key={filter?.id}
                  onClick={() => setSelectedFilter(filter?.id)}
                  className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors duration-150 ${
                    selectedFilter === filter?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="font-medium">{filter?.label}</span>
                  <span className="text-xs opacity-75">{filter?.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <Input
                type="search"
                placeholder="Search conversations, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full"
              />
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredConversations?.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No conversations found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredConversations?.map((conversation) => (
                    <button
                      key={conversation?.id}
                      onClick={() => onSelectConversation(conversation)}
                      className="w-full p-4 bg-background hover:bg-muted rounded-lg border border-border text-left transition-colors duration-150 group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {conversation?.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Icon name="MessageCircle" size={14} />
                          <span>{conversation?.messageCount}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {conversation?.preview}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {conversation?.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(conversation?.timestamp)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;