import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Route alias: Redirects /performer/completed-tasks directly to the completed tasks tab in PerformerMyTasksPage.
 */
const PerformerCompletedTasksPage = () => {
    return <Navigate to="/performer/my-tasks?tab=completed" replace />;
};

export default PerformerCompletedTasksPage;
