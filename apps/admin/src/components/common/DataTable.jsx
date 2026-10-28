import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, MoreVertical, Filter, Search, Download, X } from 'lucide-react';

const DataTable = ({ columns, data, actions, onRowClick, hideToolbar = false }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const itemsPerPage = 10;

    // Columns whose raw values look like an enum (a handful of distinct primitive
    // values) are offered as dropdown filters. Free-text/object columns are skipped.
    const filterableColumns = useMemo(() => {
        return columns
            .map(col => {
                const values = data
                    .map(item => item[col.key])
                    .filter(val => val !== null && val !== undefined && typeof val !== 'object');
                const uniqueValues = [...new Set(values.map(String))].sort();
                return { key: col.key, header: col.header, options: uniqueValues };
            })
            .filter(col => col.options.length > 1 && col.options.length <= 12);
    }, [columns, data]);

    const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

    const setFilter = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setActiveFilters({});
        setCurrentPage(1);
    };

    // Client-side search + column filter logic
    const filteredData = data.filter(item => {
        if (searchTerm) {
            const matchesSearch = Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (typeof val === 'object' && val !== null && JSON.stringify(val).toLowerCase().includes(searchTerm.toLowerCase()))
            );
            if (!matchesSearch) return false;
        }

        return Object.entries(activeFilters).every(([key, value]) => {
            if (!value) return true;
            return String(item[key]) === value;
        });
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleExport = () => {
        if (filteredData.length === 0) return;
        
        // Simple CSV Export
        const headers = columns.map(col => col.header).join(',');
        const rows = filteredData.map(item => 
            columns.map(col => {
                const val = item[col.key];
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(',')
        ).join('\n');
        
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `export_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="card h-full flex flex-col overflow-hidden">
            {/* Table Header / Toolbar */}
            {!hideToolbar && (
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search local records..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                            />
                        </div>
                        {filterableColumns.length > 0 && (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowFilterPanel(prev => !prev)}
                                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                                        activeFilterCount > 0
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <Filter size={14} />
                                    <span>Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span className="h-4 min-w-[16px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                {showFilterPanel && (
                                    <div className="absolute z-20 top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Filter by</p>
                                            <button type="button" onClick={() => setShowFilterPanel(false)} className="text-slate-400 hover:text-slate-700">
                                                <X size={14} />
                                            </button>
                                        </div>
                                        {filterableColumns.map(col => (
                                            <div key={col.key} className="space-y-1">
                                                <label className="text-[11px] font-bold text-slate-500">{col.header}</label>
                                                <select
                                                    value={activeFilters[col.key] || ''}
                                                    onChange={(e) => setFilter(col.key, e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                                                >
                                                    <option value="">All</option>
                                                    {col.options.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                        {activeFilterCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="w-full py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                Clear all filters
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        <Download size={14} />
                        <span>Export</span>
                    </button>
                </div>
            )}

            {/* Table Content */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                            {actions && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentData.map((row, i) => (
                            <tr
                                key={i}
                                onClick={() => onRowClick && onRowClick(row)}
                                className="hover:bg-slate-50 cursor-pointer transition-colors group"
                            >
                                {columns.map((col, j) => (
                                    <td key={j} className="px-6 py-4">
                                        {col.render ? col.render(row[col.key], row) : (
                                            <span className="text-sm text-slate-700 font-medium">{row[col.key]}</span>
                                        )}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white text-sm font-medium text-slate-500">
                <p>
                    Showing <span className="text-slate-900 font-bold">{filteredData.length === 0 ? 0 : startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of <span className="text-slate-900 font-bold">{filteredData.length}</span> results
                </p>

                <div className="flex items-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-lg transition-all ${currentPage === i + 1
                                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                                    : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
