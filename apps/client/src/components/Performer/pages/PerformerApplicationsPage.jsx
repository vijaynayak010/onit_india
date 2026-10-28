import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Route alias: Redirects /performer/applications directly to the pending/applications tab in PerformerMyTasksPage.
 */
const PerformerApplicationsPage = () => {
    return <Navigate to="/performer/my-tasks?tab=pending" replace />;
};

export default PerformerApplicationsPage;
