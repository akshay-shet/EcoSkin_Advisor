import React from 'react';

export const HomeFooter: React.FC = () => {
    return (
        <footer className="bg-base-200 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-text-secondary dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} ECOSKIN. All rights reserved.</p>
            </div>
        </footer>
    );
};
