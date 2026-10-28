import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const MainLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            <Header isSidebarCollapsed={isSidebarCollapsed} />

            <main className={`transition-all duration-300 min-h-screen ${isSidebarCollapsed ? 'pl-20' : 'pl-64'} pt-16`}>
                <div className="p-8 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Global Toast / Notification Container would go here */}
        </div>
    );
};

export default MainLayout;
