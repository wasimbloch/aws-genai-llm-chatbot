import React from 'react';

interface TelcoQuickActionsProps {
  onActionClick: (action: string) => void;
}

export const TelcoQuickActions: React.FC<TelcoQuickActionsProps> = ({ onActionClick }) => {
  const quickActions = [
    'Check my data usage',
    'View my current plan',
    'Report a network issue',
    'Upgrade my plan',
    'International roaming options',
    'Pay my bill',
    'Add a new line',
    'Technical support'
  ];

  return (
    <div className="telco-quick-actions">
      {quickActions.map((action, index) => (
        <button
          key={index}
          className="telco-quick-action-button"
          onClick={() => onActionClick(action)}
        >
          {action}
        </button>
      ))}
    </div>
  );
};