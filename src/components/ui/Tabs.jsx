import React from 'react';

// TABS CONTAINER
export const Tabs = ({ value, onChange, children }) => {
  return (
    <div className="flex space-x-1 p-1 rounded-lg ">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isActive: child.props.value === value,
            onClick: () => onChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

// INDIVIDUAL TAB
export const Tab = ({ children, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 flex items-center cursor-pointer
        ${isActive
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-white hover:bg-blue-500/70'
        }`}
    >
      {children}
    </button>
  );
};
