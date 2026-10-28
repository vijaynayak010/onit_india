import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, trend, icon, color = 'blue', onClick, children }) => {
    const isPositive = trend?.startsWith('+');

    const colorClasses = {
        blue: 'text-emerald-600 bg-emerald-50',
        green: 'text-emerald-600 bg-emerald-50',
        purple: 'text-purple-600 bg-purple-50',
        orange: 'text-orange-600 bg-orange-50',
        red: 'text-red-600 bg-red-50',
    };

    return (
        <div
            onClick={onClick}
            className={`card p-6 flex flex-col gap-4 hover:border-slate-300 transition-all duration-300 group ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
        >
            <div className="flex items-center justify-between w-full">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-accent transition-colors tracking-tight">{value}</h3>
                </div>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${colorClasses[color] || colorClasses.blue}`}>
                    {icon}
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                {trend && (
                    <div className="flex items-center gap-1.5">
                        <span className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isPositive ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
                            {trend}
                        </span>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export default StatCard;
