import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Route alias: Redirects /performer/active-tasks directly to the active tasks tab in PerformerMyTasksPage.
 */
const PerformerActiveTasksPage = () => {
    return <Navigate to="/performer/my-tasks?tab=active" replace />;
};

export default PerformerActiveTasksPage;
