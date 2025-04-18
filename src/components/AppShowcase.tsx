import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppShowcaseCard from './AppShowcaseCard';

interface AppShowcaseProps {
  primaryColor?: string;
  onAppSelect?: (appId: string) => void;
}

const AppShowcase: React.FC<AppShowcaseProps> = ({
  primaryColor = '#6366F1',
  onAppSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // App data with categories
  const apps = [
    {
      id: 'insightforge',
      title: 'Data Insights',
      description: 'Transform your data into actionable insights with AI-powered analytics.',
      imageSrc: '/apps/insightforge.png',
      category: 'analytics'
    },
    {
      id: 'docnavigator',
      title: 'Document Assistant',
      description: 'Intelligent document analysis and information extraction.',
      imageSrc: '/apps/docnavigator.png',
      category: 'productivity'
    },
    {
      id: 'vocalinsight',
      title: 'Voice Transcriber',
      description: 'Convert speech to text with advanced language understanding.',
      imageSrc: '/apps/vocalinsight.png',
      category: 'communication'
    },
    {
      id: 'momentumarchitect',
      title: 'Workflow Optimizer',
      description: 'Plan and optimize your workflow with AI assistance.',
      imageSrc: '/apps/momentumarchitect.png',
      category: 'productivity'
    },
    {
      id: 'visiontranslator',
      title: 'Image Analyzer',
      description: 'Analyze and interpret visual content with AI precision.',
      imageSrc: '/apps/visiontranslator.png',
      category: 'vision'
    },
    {
      id: 'solutionarchitect',
      title: 'Problem Solver',
      description: 'Design comprehensive solutions to complex problems.',
      imageSrc: '/apps/solutionarchitect.png',
      category: 'productivity'
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All Apps' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'communication', label: 'Communication' },
    { id: 'vision', label: 'Vision' }
  ];

  // Filter apps based on selected category
  const filteredApps = selectedCategory === 'all' 
    ? apps 
    : apps.filter(app => app.category === selectedCategory);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleAppClick = (appId: string) => {
    if (onAppSelect) {
      onAppSelect(appId);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            style={{ color: primaryColor }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Our AI Applications
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our suite of AI-powered tools designed to enhance your productivity and decision-making.
          </motion.p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id 
                  ? 'text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ 
                backgroundColor: selectedCategory === category.id ? primaryColor : 'transparent',
                borderWidth: '1px',
                borderColor: selectedCategory === category.id ? primaryColor : 'rgba(156, 163, 175, 0.5)'
              }}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* App cards grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredApps.map((app) => (
            <motion.div 
              key={app.id}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
            >
              <AppShowcaseCard
                title={app.title}
                description={app.description}
                imageSrc={app.imageSrc}
                color={primaryColor}
                onClick={() => handleAppClick(app.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AppShowcase;