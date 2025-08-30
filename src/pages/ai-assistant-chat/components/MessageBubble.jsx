import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageBubble = ({ message, onCopyCode, onBookmark }) => {
  const isUser = message?.sender === 'user';
  const isSystem = message?.sender === 'system';
  
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessageContent = () => {
    if (message?.type === 'code') {
      return (
        <div className="bg-muted rounded-lg p-4 font-mono text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {message?.language || 'Code'}
            </span>
            <Button
              variant="ghost"
              size="xs"
              iconName="Copy"
              onClick={() => onCopyCode(message?.content)}
              className="text-muted-foreground hover:text-foreground"
            >
              Copy
            </Button>
          </div>
          <pre className="whitespace-pre-wrap text-foreground">{message?.content}</pre>
        </div>
      );
    }

    if (message?.type === 'chart') {
      return (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="BarChart3" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Data Visualization</span>
          </div>
          <div className="w-full h-48 bg-background rounded border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Icon name="TrendingUp" size={32} className="mx-auto mb-2" />
              <p className="text-sm">{message?.content}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="whitespace-pre-wrap text-foreground">
        {message?.content}
      </div>
    );
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
          {message?.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
        {!isUser && (
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Bot" size={16} color="white" />
          </div>
        )}
        
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-card border border-border'
          }`}>
            {renderMessageContent()}
          </div>
          
          <div className={`flex items-center mt-1 space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(message?.timestamp)}
            </span>
            
            {!isUser && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Bookmark"
                  onClick={() => onBookmark(message)}
                  className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="ThumbsUp"
                  className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            )}
          </div>
        </div>
        
        {isUser && (
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={16} color="white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;