import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatHeader = ({ 
  isVoiceActive, 
  onToggleVoice, 
  onShowHistory, 
  onShowCapabilities,
  isMinimized,
  onToggleMinimize 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
          <Icon name="Sparkles" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
          <p className="text-sm text-muted-foreground">
            {isVoiceActive ? 'Voice mode active' : 'Ready to help with ML workflows'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          iconName="History"
          onClick={onShowHistory}
          className="text-muted-foreground hover:text-foreground"
        >
          History
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="HelpCircle"
          onClick={onShowCapabilities}
          className="text-muted-foreground hover:text-foreground"
        >
          Help
        </Button>
        
        <Button
          variant={isVoiceActive ? "default" : "outline"}
          size="sm"
          iconName={isVoiceActive ? "MicOff" : "Mic"}
          onClick={onToggleVoice}
          className={isVoiceActive ? "bg-success text-success-foreground" : ""}
        >
          {isVoiceActive ? 'Stop' : 'Voice'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          iconName={isMinimized ? "Maximize2" : "Minimize2"}
          onClick={onToggleMinimize}
          className="text-muted-foreground hover:text-foreground"
        />
      </div>
    </div>
  );
};

export default ChatHeader;