import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatInput = ({ 
  onSendMessage, 
  onVoiceRecord, 
  onFileAttach, 
  isVoiceActive, 
  isRecording,
  disabled 
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);

  const suggestions = [
    "How do I improve model accuracy?",
    "Explain overfitting in simple terms",
    "What\'s the best algorithm for my data?",
    "Help me interpret these results"
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled) {
      onSendMessage(message?.trim());
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e?.target?.value);
    setIsTyping(e?.target?.value?.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    setIsTyping(true);
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      onFileAttach(file);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-card">
      {/* Suggestions */}
      {!isTyping && message?.length === 0 && (
        <div className="p-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full transition-colors duration-150"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end space-x-2">
          {/* File Attachment */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconName="Paperclip"
            onClick={() => fileInputRef?.current?.click()}
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground"
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".csv,.txt,.json,.py,.ipynb"
            onChange={handleFileSelect}
          />

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={isVoiceActive ? "Voice mode active - speak or type..." : "Ask me anything about ML..."}
              disabled={disabled}
              className="w-full min-h-[44px] max-h-32 px-4 py-3 pr-12 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
              rows={1}
              style={{ 
                height: 'auto',
                minHeight: '44px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e?.target?.scrollHeight, 128) + 'px';
              }}
            />
            
            {/* Character count */}
            {message?.length > 0 && (
              <div className="absolute bottom-1 right-1 text-xs text-muted-foreground">
                {message?.length}/1000
              </div>
            )}
          </div>

          {/* Voice Recording */}
          <Button
            type="button"
            variant={isRecording ? "destructive" : "ghost"}
            size="sm"
            iconName={isRecording ? "Square" : "Mic"}
            onClick={onVoiceRecord}
            disabled={disabled}
            className={isRecording ? "animate-pulse" : "text-muted-foreground hover:text-foreground"}
          />

          {/* Send Button */}
          <Button
            type="submit"
            variant="default"
            size="sm"
            iconName="Send"
            disabled={!message?.trim() || disabled}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          />
        </div>

        {/* Voice Recording Indicator */}
        {isRecording && (
          <div className="flex items-center justify-center mt-2 p-2 bg-error/10 rounded-lg">
            <div className="flex items-center space-x-2 text-error">
              <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Recording... Click to stop</span>
            </div>
          </div>
        )}

        {/* Voice Active Indicator */}
        {isVoiceActive && !isRecording && (
          <div className="flex items-center justify-center mt-2 p-2 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2 text-success">
              <Icon name="Mic" size={16} />
              <span className="text-sm font-medium">Voice mode active - listening...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;