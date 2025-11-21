import React from 'react';
import { Outlet } from 'react-router-dom';
import { HomeHeader } from './HomeHeader';
import { HomeFooter } from './HomeFooter';

export const PublicLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <HomeHeader />
            <main className="flex-grow">
                <Outlet />
            </main>
            <HomeFooter />
        </div>
    );
};
