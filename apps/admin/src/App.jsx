import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminApp from './AdminApp';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AdminApp />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
