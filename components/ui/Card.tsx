import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-base-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md transition-shadow duration-300 hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
    return <div className={`p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
}

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
    return <div className={`p-4 md:p-6 ${className}`}>{children}</div>
}

export const CardTitle: React.FC<CardProps> = ({ children, className }) => {
    return <h3 className={`text-lg font-semibold text-text-primary dark:text-gray-100 ${className}`}>{children}</h3>
}
