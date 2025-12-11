
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-brand-surface dark:bg-gray-800 rounded-xl shadow-md overflow-hidden dark:border dark:border-gray-700 ${className}`}>
      {title && <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 px-6 py-4 border-b border-gray-100 dark:border-gray-700">{title}</h2>}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
