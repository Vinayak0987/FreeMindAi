import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProjectCard = ({ project }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      'training': {
        bg: 'bg-gradient-to-r from-warning/15 to-warning/10',
        text: 'text-warning',
        border: 'border-warning/30',
        pulse: 'bg-warning'
      },
      'deployed': {
        bg: 'bg-gradient-to-r from-success/15 to-success/10',
        text: 'text-success',
        border: 'border-success/30',
        pulse: 'bg-success'
      },
      'preparing': {
        bg: 'bg-gradient-to-r from-accent/15 to-accent/10',
        text: 'text-accent',
        border: 'border-accent/30',
        pulse: 'bg-accent'
      },
      'completed': {
        bg: 'bg-gradient-to-r from-primary/15 to-primary/10',
        text: 'text-primary',
        border: 'border-primary/30',
        pulse: 'bg-primary'
      },
      'failed': {
        bg: 'bg-gradient-to-r from-error/15 to-error/10',
        text: 'text-error',
        border: 'border-error/30',
        pulse: 'bg-error'
      }
    };
    return colors?.[status] || colors?.preparing;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'training': 'Loader',
      'deployed': 'CheckCircle',
      'preparing': 'Clock',
      'completed': 'CheckCircle2',
      'failed': 'XCircle'
    };
    return icons?.[status] || 'Circle';
  };

  const handleProjectClick = () => {
    navigate('/project-workspace');
  };

  const handleMenuAction = (action) => {
    setIsMenuOpen(false);
    switch (action) {
      case 'edit': navigate('/project-workspace');
        break;
      case 'duplicate': console.log('Duplicate project:', project?.id);
        break;
      case 'delete':
        console.log('Delete project:', project?.id);
        break;
      default:
        break;
    }
  };

  const statusColors = getStatusColor(project?.status);

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl scale-105"></div>
      
      {/* Main card */}
      <div className="relative bg-card/95 backdrop-blur-sm border border-border/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 group hover:-translate-y-3 hover:border-border/80">
        {/* Project Thumbnail */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-muted via-muted/80 to-muted/50">
          {/* Enhanced image with overlay effects */}
          <Image
            src={project?.thumbnail}
            alt={project?.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Multiple gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Floating action menu */}
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-foreground hover:bg-white hover:scale-110 transition-all duration-300 shadow-xl border border-white/20"
              >
                <Icon name="MoreVertical" size={20} className="transition-transform duration-200" />
              </button>
              
              {/* Enhanced dropdown menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-popover/95 backdrop-blur-md border border-border/60 rounded-2xl shadow-2xl z-20 overflow-hidden animate-slide-in-from-top-2">
                  <div className="py-3">
                    <button
                      onClick={() => handleMenuAction('edit')}
                      className="flex items-center space-x-3 w-full px-5 py-3 text-sm text-popover-foreground hover:bg-muted/50 transition-all duration-200 group/item"
                    >
                      <Icon name="Edit" size={18} className="text-accent group-hover/item:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Edit Project</span>
                    </button>
                    <button
                      onClick={() => handleMenuAction('duplicate')}
                      className="flex items-center space-x-3 w-full px-5 py-3 text-sm text-popover-foreground hover:bg-muted/50 transition-all duration-200 group/item"
                    >
                      <Icon name="Copy" size={18} className="text-primary group-hover/item:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Duplicate</span>
                    </button>
                    <div className="border-t border-border/50 my-2 mx-3"></div>
                    <button
                      onClick={() => handleMenuAction('delete')}
                      className="flex items-center space-x-3 w-full px-5 py-3 text-sm text-error hover:bg-error/10 transition-all duration-200 group/item"
                    >
                      <Icon name="Trash2" size={18} className="group-hover/item:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Status Badge */}
          <div className="absolute bottom-4 left-4">
            <div className={`relative flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-sm font-bold border backdrop-blur-md ${statusColors.bg} ${statusColors.text} ${statusColors.border} transition-all duration-300 hover:scale-105`}>
              {/* Status pulse indicator */}
              <div className="relative flex items-center">
                <Icon name={getStatusIcon(project?.status)} size={16} className="transition-all duration-300" />
                {(project?.status === 'training' || project?.status === 'preparing') && (
                  <div className={`absolute inset-0 w-4 h-4 rounded-full ${statusColors.pulse} animate-ping opacity-30`}></div>
                )}
              </div>
              <span className="capitalize tracking-wide">{project?.status}</span>
            </div>
          </div>
          
          {/* Overlay interaction hint */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center space-x-2 text-foreground">
                <Icon name="Play" size={18} />
                <span className="font-semibold text-sm">Open Project</span>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Project Info */}
        <div className="p-7 space-y-6">
          {/* Header with enhanced typography */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 
                className="text-2xl font-black text-foreground group-hover:text-primary transition-all duration-500 cursor-pointer line-clamp-1 tracking-tight hover:tracking-normal"
                onClick={handleProjectClick}
              >
                {project?.name}
              </h3>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">AI Project</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground bg-gradient-to-r from-muted/60 to-muted/40 px-3 py-2 rounded-xl border border-border/30 backdrop-blur-sm">
              <Icon name="Calendar" size={16} />
              <span className="text-sm font-semibold">{project?.lastModified}</span>
            </div>
          </div>
          
          {/* Enhanced description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            {project?.description}
          </p>

          {/* Enhanced Progress Bar (for training projects) */}
          {project?.status === 'training' && project?.progress !== undefined && (
            <div className="bg-gradient-to-r from-muted/30 to-muted/20 rounded-2xl p-4 border border-border/30">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="font-bold text-foreground flex items-center space-x-2">
                  <Icon name="Zap" size={16} className="text-warning" />
                  <span>Training Progress</span>
                </span>
                <span className="font-black text-warning text-lg">{project?.progress}%</span>
              </div>
              <div className="relative w-full bg-muted/60 rounded-full h-3 overflow-hidden border border-border/20">
                <div 
                  className="bg-gradient-to-r from-warning via-warning/90 to-warning/80 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${project?.progress}%` }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Project Tags */}
          <div className="flex flex-wrap gap-2.5">
            {project?.tags?.slice(0, 3)?.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-muted/60 via-muted/50 to-muted/40 text-muted-foreground text-xs font-bold rounded-xl border border-border/40 hover:border-accent/40 hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 hover:text-accent transition-all duration-300 hover:scale-105 cursor-default"
              >
                {tag}
              </span>
            ))}
            {project?.tags?.length > 3 && (
              <span className="px-4 py-2 bg-gradient-to-r from-accent/15 to-accent/10 text-accent text-xs font-bold rounded-xl border border-accent/30 hover:scale-105 transition-transform duration-200 cursor-default">
                +{project?.tags?.length - 3} more
              </span>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleProjectClick}
              className="flex-1 h-12 font-bold rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300"
              iconName="Play"
              iconPosition="left"
            >
              Open Project
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/model-deployment');
              }}
              iconName="Share"
              iconPosition="left"
              className="h-12 px-5 font-bold rounded-2xl border-2 hover:border-accent hover:bg-accent/10 hover:text-accent transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-card to-card/80"
            >
              Share
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"></div>
      </div>
      
      {/* Click outside handler */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/5 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectCard;