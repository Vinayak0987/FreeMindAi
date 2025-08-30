import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary', trend = false }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: {
        gradient: 'bg-gradient-to-br from-primary/15 via-primary/8 to-primary/5',
        text: 'text-primary',
        border: 'border-primary/25',
        glow: 'shadow-primary/10'
      },
      success: {
        gradient: 'bg-gradient-to-br from-success/15 via-success/8 to-success/5',
        text: 'text-success',
        border: 'border-success/25',
        glow: 'shadow-success/10'
      },
      warning: {
        gradient: 'bg-gradient-to-br from-warning/15 via-warning/8 to-warning/5',
        text: 'text-warning',
        border: 'border-warning/25',
        glow: 'shadow-warning/10'
      },
      accent: {
        gradient: 'bg-gradient-to-br from-accent/15 via-accent/8 to-accent/5',
        text: 'text-accent',
        border: 'border-accent/25',
        glow: 'shadow-accent/10'
      }
    };
    return colors?.[colorType] || colors?.primary;
  };

  const getChangeColor = (type) => {
    return type === 'positive' ? 'text-success' : type === 'negative' ? 'text-error' : 'text-muted-foreground';
  };

  const getChangeBgColor = (type) => {
    return type === 'positive' 
      ? 'bg-gradient-to-r from-success/15 to-success/10 border-success/20' 
      : type === 'negative' 
      ? 'bg-gradient-to-r from-error/15 to-error/10 border-error/20' 
      : 'bg-gradient-to-r from-muted/50 to-muted/30 border-border';
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="relative group">
      {/* Ambient glow effect */}
      <div className={`absolute inset-0 rounded-2xl ${colorClasses.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-105`}></div>
      
      {/* Main card */}
      <div className="relative bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group hover:-translate-y-2 hover:border-border/80">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent rounded-2xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-primary/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-8">
            {/* Enhanced icon container */}
            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${colorClasses.gradient} ${colorClasses.border}`}>
              {/* Icon glow */}
              <div className={`absolute inset-0 rounded-2xl ${colorClasses.gradient} opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-md`}></div>
              <Icon name={icon} size={32} className={`relative z-10 ${colorClasses.text} transition-all duration-300`} />
              
              {/* Pulse effect for active metrics */}
              {trend && (
                <div className={`absolute inset-0 rounded-2xl ${colorClasses.border} animate-ping opacity-20`}></div>
              )}
            </div>
            
            {/* Enhanced change indicator */}
            {change && (
              <div className={`flex items-center space-x-2.5 px-4 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getChangeBgColor(changeType)}`}>
                <div className="relative flex items-center">
                  <Icon 
                    name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                    size={16} 
                    className={`${getChangeColor(changeType)} transition-all duration-300`}
                  />
                  {changeType === 'positive' && (
                    <div className="absolute inset-0 text-success animate-pulse opacity-50">
                      <Icon name="TrendingUp" size={16} />
                    </div>
                  )}
                </div>
                <span className={`text-sm font-bold ${getChangeColor(changeType)}`}>{change}</span>
              </div>
            )}
          </div>
          
          {/* Enhanced value and title */}
          <div className="space-y-3">
            <div className="flex items-baseline space-x-2">
              <h3 className="text-4xl font-black text-foreground group-hover:text-primary transition-all duration-500 tracking-tight">
                {value}
              </h3>
              {trend && (
                <div className={`w-2 h-2 rounded-full ${changeType === 'positive' ? 'bg-success' : changeType === 'negative' ? 'bg-error' : 'bg-muted-foreground'} animate-pulse`}></div>
              )}
            </div>
            <p className="text-base text-muted-foreground font-semibold tracking-wide uppercase text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              {title}
            </p>
          </div>
          
          {/* Subtle progress line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;