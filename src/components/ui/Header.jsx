import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const primaryNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Projects', path: '/project-workspace', icon: 'FolderOpen' },
    { label: 'Datasets', path: '/dataset-management', icon: 'Database' },
    { label: 'Models', path: '/model-training', icon: 'Brain' },
    { label: 'Deploy', path: '/model-deployment', icon: 'Rocket' }
  ];

  const secondaryNavItems = [
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help', path: '/help', icon: 'HelpCircle' }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border elevation-1">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-150"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="Brain" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">🧠 FreeMind AI</span>
              <span className="text-xs text-muted-foreground -mt-1">Intelligent ML Platform</span>
            </div>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </button>
          ))}
          
          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
            >
              <Icon name="MoreHorizontal" size={16} />
              <span>More</span>
            </button>
            
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md elevation-2 animate-fade-in">
                <div className="py-1">
                  {secondaryNavItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => {
                        handleNavigation(item?.path);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 w-full px-3 py-2 text-sm text-left transition-colors duration-150 ${
                        isActivePath(item?.path)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150">
            <Icon name="Search" size={20} />
          </button>

          {/* Notifications */}
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150 relative">
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md transition-colors duration-150"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-popover border border-border rounded-md elevation-2 animate-fade-in">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-popover-foreground">🙏 {user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-1">
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150">
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150">
            <Icon name="Menu" size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-border bg-card">
        <nav className="flex overflow-x-auto px-4 py-2 space-x-1">
          {primaryNavItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Click outside handlers */}
      {(isUserMenuOpen || isMoreMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMoreMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;