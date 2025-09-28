import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#171717] shadow-md rounded-xl overflow-hidden border border-white ${className}`}>
      {children}
    </div>
  );
};
export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};
