import React, { useState } from 'react';
import { LogisticsShell, CommandCenter } from './index';

interface LogisticsViewProps {
  onNavigate?: (view: string) => void;
}

const LogisticsView: React.FC<LogisticsViewProps> = ({ onNavigate }) => {
  const [activeView, setActiveView] = useState('command-center');

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'command-center':
        return <CommandCenter />;
      default:
        return (
          <div className="p-8">
            <div className="text-center mt-20">
              <h2 className="text-2xl font-semibold" style={{ color: '#e2e8f0' }}>
                {activeView.charAt(0).toUpperCase() + activeView.slice(1).replace(/-/g, ' ')}
              </h2>
              <p className="text-sm mt-4" style={{ color: '#94a3b8' }}>
                This module is under active development. Phase 02-04 implementation in progress.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <LogisticsShell
      activeView={activeView}
      onViewChange={handleViewChange}
    >
      {renderContent()}
    </LogisticsShell>
  );
};

export default LogisticsView;
