import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const Callback = () => {
    useEffect(() => {
        // This page handles the Auth0 callback
        // Auth0 will redirect here after successful authentication
        // The Auth0Provider will automatically process the code and redirect to home
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Processing authentication...</p>
            </div>
        </div>
    );
};

export default Callback;
