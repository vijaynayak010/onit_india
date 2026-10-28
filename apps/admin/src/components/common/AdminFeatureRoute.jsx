import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAdminFeatureAccess } from '../../hooks/useAdminFeatureAccess';
import { ADMIN_FEATURE_LABELS, hasAdminFeature } from '../../utils/adminFeatureAccess';

const AdminFeatureRoute = ({ feature, children }) => {
    const { loading, features, googleEmail } = useAdminFeatureAccess();

    if (loading) {
        return (
            <div className="h-80 flex items-center justify-center text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">
                Checking admin access...
            </div>
        );
    }

    if (!hasAdminFeature(features, feature)) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                        <ShieldAlert size={26} />
                    </div>
                    <h2 className="mt-5 text-xl font-black text-slate-900">Access restricted</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                        Your Google account does not have {ADMIN_FEATURE_LABELS[feature]} access.
                    </p>
                    {googleEmail && (
                        <p className="mt-3 text-xs font-bold text-slate-400 break-all">
                            Signed in as {googleEmail}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return children;
};

export default AdminFeatureRoute;
