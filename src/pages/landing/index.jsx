import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: 'Brain',
      title: 'AI-Powered Intelligence',
      description: 'Advanced machine learning algorithms built for modern applications',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: 'Zap',
      title: 'Lightning Fast',
      description: 'Optimized for speed with real-time processing and instant results',
      gradient: 'from-yellow-500 to-red-500'
    },
    {
      icon: 'Shield',
      title: 'Secure & Private',
      description: 'Enterprise-grade security with complete data privacy protection',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      icon: 'Globe',
      title: 'Global Reach',
      description: 'Multi-language support with worldwide accessibility and localization',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'Users',
      title: 'Team Collaboration',
      description: 'Built for teams with real-time collaboration and sharing features',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: 'Rocket',
      title: 'Easy Deployment',
      description: 'One-click deployment with auto-scaling and monitoring',
      gradient: 'from-pink-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Icon name="Brain" size={20} color="white" />
              </div>
              <span className={`text-xl font-bold ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>FreeMind AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}>Features</a>
              <a href="#pricing" className={`transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}>Pricing</a>
              <a href="#about" className={`transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}>About</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className={isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}
              >
                Login
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/15 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 text-gray-700 border border-gray-200 backdrop-blur-sm shadow-sm">
              ✨ Powered by AI • Built by Team AntiMatter
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 leading-tight">
            The Future of
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Empowering developers, businesses, and innovators worldwide with cutting-edge AI tools, 
            intelligent solutions, and seamless integration.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Building Now
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            >
              <Icon name="Play" size={20} className="mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Developers</div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">AI Models</div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale AI applications with intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon name={feature.icon} size={24} color="white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Simple Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-16">
            Start building for free. Scale as you grow.
          </p>

          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 border border-gray-200 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-600 border border-green-200 mb-4">
                <Icon name="Gift" size={16} className="mr-2" />
                Currently Free
              </div>
              <div className="text-6xl font-bold text-gray-900 mb-4">₹0</div>
              <div className="text-gray-600 text-lg">Forever free during beta</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                'Unlimited AI model training',
                'Real-time collaboration',
                'Multi-language support',
                'Cloud deployment',
                'API access',
                'Community support'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Icon name="Check" size={16} className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-4 text-lg font-semibold shadow-xl"
            >
              Start Free Now
            </Button>

            <p className="text-gray-500 text-sm mt-4">
              No credit card required • No hidden fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900">
            Built by Team AntiMatter
          </h2>
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 border border-gray-200 shadow-xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚀</span>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              "We created FreeMind AI to democratize artificial intelligence for developers 
              and businesses worldwide. Our platform combines cutting-edge AI technology with 
              intuitive design and powerful automation capabilities."
            </p>
            <div className="mt-8">
              <div className="text-gray-900 font-semibold text-lg">Team AntiMatter</div>
              <div className="text-gray-600">AI Innovation Team</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Icon name="Brain" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FreeMind AI</span>
            </div>
            
            <div className="text-gray-600 text-center">
              © 2024 FreeMind AI by Team AntiMatter. Built with ❤️
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
