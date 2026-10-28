import React, { useState } from 'react';
import {
    Send,
    History,
    Bell,
    AlertTriangle,
    CheckCircle2,
    BarChart3,
    Clock,
    ShieldAlert,
    RefreshCw,
    CalendarClock,
    Trash2,
    XCircle,
    Zap,
    ChevronDown,
    ChevronUp,
    ClipboardCheck,
    ClipboardX,
    UserPlus,
    CreditCard,
    ShieldCheck,
    Megaphone,
    Wrench,
    Star,
    PackageCheck,
    Award,
    AlertCircle,
    Info,
} from 'lucide-react';
import DataTable from '../components/common/DataTable.jsx';
import Toast from '../components/common/Toast.jsx';
import {
    listNotificationsAdmin,
    broadcastNotificationAdmin,
    listScheduledNotificationsAdmin,
    createScheduledNotificationAdmin,
    cancelScheduledNotificationAdmin,
    deleteScheduledNotificationAdmin,
} from '../services/api';

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseUserIds(text) {
    if (!text?.trim()) return [];
    return text
        .split(/[\s,;]+/)
        .map((s) => s.trim())
        .filter((s) => UUID_RE.test(s));
}

// ─────────────────────────────────────────────────────────────────────────────
// Event-based notification templates — clicking one pre-fills the composer
// ─────────────────────────────────────────────────────────────────────────────
const TEMPLATE_CATEGORIES = ['All', 'Tasks', 'Users', 'Payments', 'Platform', 'KYC'];

const NOTIFICATION_TEMPLATES = [
    // ── Tasks ──
    {
        id: 'task_approved',
        category: 'Tasks',
        event: 'Task Approved',
        icon: ClipboardCheck,
        color: 'emerald',
        audience: 'providers',
        title: 'Your task is live! 🎉',
        body: 'Your task has been reviewed and approved by the OnIT team. It is now visible to performers — expect interest soon!',
        description: 'Notify providers their task passed review',
    },
    {
        id: 'task_rejected',
        category: 'Tasks',
        event: 'Task Needs Changes',
        icon: ClipboardX,
        color: 'red',
        audience: 'providers',
        title: 'Action required on your task',
        body: 'Your recently submitted task requires a few adjustments before it can go live. Please review the feedback in the app and resubmit.',
        description: 'Nudge providers to address rejection feedback',
    },
    {
        id: 'new_task_available',
        category: 'Tasks',
        event: 'New Tasks Posted',
        icon: Star,
        color: 'amber',
        audience: 'taskers',
        title: 'Fresh tasks just dropped! 🚀',
        body: 'New tasks matching your skills are now available on OnIT. Open the app and grab the ones that excite you before they\'re taken.',
        description: 'Alert performers when a batch of tasks goes live',
    },
    {
        id: 'task_due_soon',
        category: 'Tasks',
        event: 'Task Deadline Reminder',
        icon: Clock,
        color: 'orange',
        audience: 'all',
        title: 'Your task deadline is approaching ⏰',
        body: 'A gentle reminder — some of your active tasks are due soon. Head to the app to check progress and avoid missing deadlines.',
        description: 'Remind users about upcoming task deadlines',
    },
    {
        id: 'task_completed',
        category: 'Tasks',
        event: 'Task Milestone',
        icon: PackageCheck,
        color: 'teal',
        audience: 'providers',
        title: 'Task completed — please review!',
        body: 'The performer has submitted their work for your review. Log in to verify the deliverables and mark the task complete.',
        description: 'Prompt providers to review submitted work',
    },
    // ── Users ──
    {
        id: 'welcome_new_users',
        category: 'Users',
        event: 'Welcome New Users',
        icon: UserPlus,
        color: 'blue',
        audience: 'all',
        title: 'Welcome to OnIT India! 👋',
        body: 'We\'re glad you\'re here. Start exploring tasks, connect with top performers, and grow your business or career on OnIT today.',
        description: 'Onboarding message for newly registered users',
    },
    {
        id: 'profile_incomplete',
        category: 'Users',
        event: 'Profile Incomplete Nudge',
        icon: AlertCircle,
        color: 'amber',
        audience: 'all',
        title: 'Complete your profile to get started',
        body: 'Your profile is missing a few details. A complete profile increases trust and helps you land tasks faster. It takes under 2 minutes!',
        description: 'Nudge users who haven\'t finished their profile',
    },
    {
        id: 'referral_reward',
        category: 'Users',
        event: 'Referral Reward',
        icon: Award,
        color: 'purple',
        audience: 'all',
        title: 'You\'ve earned a referral bonus! 🎁',
        body: 'Your friend just joined OnIT using your referral link. Your bonus has been credited — check your wallet in the app.',
        description: 'Celebrate users who referred successful sign-ups',
    },
    // ── Payments ──
    {
        id: 'payment_received',
        category: 'Payments',
        event: 'Payment Processed',
        icon: CreditCard,
        color: 'green',
        audience: 'providers',
        title: 'Payment successful ✅',
        body: 'Your recent payment has been processed and credited to your OnIT wallet. Check your transaction history for details.',
        description: 'Confirm payment processing to providers',
    },
    {
        id: 'reward_eligible',
        category: 'Payments',
        event: 'Reward Available',
        icon: Star,
        color: 'yellow',
        audience: 'all',
        title: 'You have a reward waiting! 💰',
        body: 'A special reward has been added to your OnIT account. Open the app to claim it before it expires.',
        description: 'Alert users when a reward or bonus is available',
    },
    // ── Platform ──
    {
        id: 'platform_update',
        category: 'Platform',
        event: 'New Feature',
        icon: Zap,
        color: 'indigo',
        audience: 'all',
        title: 'Something new on OnIT ⚡',
        body: 'We\'ve just shipped an update with exciting new features. Open the app to explore what\'s new and improved.',
        description: 'Announce a platform update or new feature',
    },
    {
        id: 'maintenance_alert',
        category: 'Platform',
        event: 'Maintenance Window',
        icon: Wrench,
        color: 'slate',
        audience: 'all',
        title: 'Scheduled maintenance tonight',
        body: 'OnIT will undergo a brief scheduled maintenance window today from 2:00 AM – 4:00 AM IST. The app may be unavailable during this time. We apologise for any inconvenience.',
        description: 'Warn users before a planned maintenance period',
    },
    {
        id: 'general_announcement',
        category: 'Platform',
        event: 'General Announcement',
        icon: Megaphone,
        color: 'emerald',
        audience: 'all',
        title: 'Important announcement from OnIT',
        body: 'We have an important update to share with you. Please read this message carefully and reach out to support if you have any questions.',
        description: 'Free-form announcement to all users',
    },
    // ── KYC ──
    {
        id: 'kyc_reminder',
        category: 'KYC',
        event: 'KYC Reminder',
        icon: ShieldCheck,
        color: 'teal',
        audience: 'taskers',
        title: 'Verify your identity to unlock tasks 🔐',
        body: 'To accept paid tasks on OnIT you need to complete a quick KYC verification. It only takes a few minutes — do it now from your profile.',
        description: 'Remind performers who haven\'t completed KYC',
    },
    {
        id: 'kyc_approved',
        category: 'KYC',
        event: 'KYC Approved',
        icon: ShieldAlert,
        color: 'green',
        audience: 'taskers',
        title: 'KYC verified! You\'re all set 🎉',
        body: 'Your identity verification is complete. You can now accept tasks and receive payments on OnIT. Welcome to the verified community!',
        description: 'Celebrate performers who just passed KYC',
    },
    {
        id: 'kyc_action_required',
        category: 'KYC',
        event: 'KYC Action Required',
        icon: AlertTriangle,
        color: 'red',
        audience: 'taskers',
        title: 'Action needed on your KYC documents',
        body: 'There was an issue with your submitted KYC documents. Please review the feedback in your profile and resubmit the correct documents.',
        description: 'Alert performers whose KYC submission was rejected',
    },
];

const COLOR_MAP = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
    red:     { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200',     badge: 'bg-red-100 text-red-700' },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',   badge: 'bg-amber-100 text-amber-700' },
    orange:  { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200',  badge: 'bg-orange-100 text-orange-700' },
    teal:    { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200',    badge: 'bg-teal-100 text-teal-700' },
    blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    badge: 'bg-blue-100 text-blue-700' },
    purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200',  badge: 'bg-purple-100 text-purple-700' },
    green:   { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-200',   badge: 'bg-green-100 text-green-700' },
    yellow:  { bg: 'bg-yellow-50',  text: 'text-yellow-600',  border: 'border-yellow-200',  badge: 'bg-yellow-100 text-yellow-700' },
    indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200',  badge: 'bg-indigo-100 text-indigo-700' },
    slate:   { bg: 'bg-slate-100',  text: 'text-slate-600',   border: 'border-slate-200',   badge: 'bg-slate-200 text-slate-700' },
};

const AUDIENCE_LABELS = {
    all: 'All Users',
    providers: 'Providers',
    taskers: 'Performers',
    specific_users: 'Specific Users',
};

// ─────────────────────────────────────────────────────────────────────────────

const NotificationsPage = () => {
    const [activeTab, setActiveTab] = useState('composer');
    const [toast, setToast] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [notification, setNotification] = useState({
        title: '',
        body: '',
        audience: 'all',
        userIdsText: '',
        data: {},
    });
    const [activeTemplateId, setActiveTemplateId] = useState(null);
    const [templateCategory, setTemplateCategory] = useState('All');
    const [showTemplates, setShowTemplates] = useState(true);

    const [scheduledRows, setScheduledRows] = useState([]);
    const [loadingScheduled, setLoadingScheduled] = useState(false);
    const [scheduling, setScheduling] = useState(false);
    const [scheduleForm, setScheduleForm] = useState({
        title: '',
        body: '',
        audience: 'all',
        userIdsText: '',
        scheduledAt: '',
    });

    const filteredTemplates =
        templateCategory === 'All'
            ? NOTIFICATION_TEMPLATES
            : NOTIFICATION_TEMPLATES.filter((t) => t.category === templateCategory);

    const applyTemplate = (tpl) => {
        setActiveTemplateId(tpl.id);
        setNotification((prev) => ({
            ...prev,
            title: tpl.title,
            body: tpl.body,
            audience: tpl.audience,
            userIdsText: '',
        }));
        // Scroll form into view on small screens
        document.getElementById('composer-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const clearTemplate = () => {
        setActiveTemplateId(null);
        setNotification({ title: '', body: '', audience: 'all', userIdsText: '', data: {} });
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await listNotificationsAdmin({ limit: 50 });
            setHistory(res.data || []);
        } catch {
            setToast({ message: 'Failed to load history.', type: 'error' });
        } finally {
            setLoadingHistory(false);
        }
    };

    const fetchScheduled = async () => {
        setLoadingScheduled(true);
        try {
            const res = await listScheduledNotificationsAdmin({ limit: 100 });
            setScheduledRows(res.data || []);
        } catch {
            setToast({ message: 'Failed to load scheduled notifications.', type: 'error' });
        } finally {
            setLoadingScheduled(false);
        }
    };

    React.useEffect(() => {
        if (activeTab === 'history') fetchHistory();
        if (activeTab === 'scheduled') fetchScheduled();
    }, [activeTab]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (notification.audience === 'specific_users') {
            const ids = parseUserIds(notification.userIdsText);
            if (ids.length === 0) {
                setToast({ message: 'Add at least one valid user UUID for specific users.', type: 'error' });
                return;
            }
        }
        setIsSending(true);
        try {
            const payload = {
                title: notification.title,
                body: notification.body,
                audience: notification.audience,
                data: notification.data,
            };
            if (notification.audience === 'specific_users') {
                payload.userIds = parseUserIds(notification.userIdsText);
            }
            const res = await broadcastNotificationAdmin(payload);
            const reached = res?.sentCount ?? 0;
            const targeted = res?.totalUsersNotified ?? 0;
            setToast({
                message: targeted === 0
                    ? 'No users matched this audience.'
                    : `Broadcast sent — delivered to ${reached} of ${targeted} user(s).`,
                type: targeted === 0 ? 'error' : 'success',
            });
            clearTemplate();
        } catch (error) {
            setToast({ message: error.message || 'Failed to send broadcast.', type: 'error' });
        } finally {
            setIsSending(false);
        }
    };

    const handleCreateScheduled = async (e) => {
        e.preventDefault();
        if (!scheduleForm.scheduledAt) {
            setToast({ message: 'Pick a date and time in the future.', type: 'error' });
            return;
        }
        const when = new Date(scheduleForm.scheduledAt);
        if (when.getTime() <= Date.now()) {
            setToast({ message: 'Schedule time must be in the future.', type: 'error' });
            return;
        }
        if (scheduleForm.audience === 'specific_users') {
            const ids = parseUserIds(scheduleForm.userIdsText);
            if (ids.length === 0) {
                setToast({ message: 'Add at least one valid user UUID.', type: 'error' });
                return;
            }
        }
        setScheduling(true);
        try {
            const body = {
                title: scheduleForm.title,
                body: scheduleForm.body,
                audience: scheduleForm.audience,
                scheduledAt: when.toISOString(),
            };
            if (scheduleForm.audience === 'specific_users') {
                body.userIds = parseUserIds(scheduleForm.userIdsText);
            }
            await createScheduledNotificationAdmin(body);
            setToast({ message: 'Scheduled notification created.', type: 'success' });
            setScheduleForm({ title: '', body: '', audience: 'all', userIdsText: '', scheduledAt: '' });
            fetchScheduled();
        } catch (error) {
            setToast({ message: error.message || 'Failed to create schedule.', type: 'error' });
        } finally {
            setScheduling(false);
        }
    };

    const handleCancelScheduled = async (id) => {
        try {
            await cancelScheduledNotificationAdmin(id);
            setToast({ message: 'Schedule cancelled.', type: 'success' });
            fetchScheduled();
        } catch (error) {
            setToast({ message: error.message || 'Failed to cancel.', type: 'error' });
        }
    };

    const handleDeleteScheduled = async (id) => {
        if (!window.confirm('Delete this scheduled notification?')) return;
        try {
            await deleteScheduledNotificationAdmin(id);
            setToast({ message: 'Deleted.', type: 'success' });
            fetchScheduled();
        } catch (error) {
            setToast({ message: error.message || 'Failed to delete.', type: 'error' });
        }
    };

    const historyColumns = [
        {
            header: 'Notification',
            key: 'payload',
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-tight">{val?.title || row.title || 'System Notification'}</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{val?.body || row.body || 'No description'}</span>
                </div>
            )
        },
        {
            header: 'Recipient',
            key: 'user',
            render: (val) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">{val?.role || 'User'}</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{val?.email || 'Unknown'}</span>
                </div>
            )
        },
        {
            header: 'Type',
            key: 'type',
            render: (val) => <span className="text-[10px] font-bold text-slate-500 uppercase">{val}</span>
        },
        {
            header: 'Status',
            key: 'isSent',
            render: (val) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${val ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                    {val ? 'Sent' : 'Pending'}
                </span>
            )
        },
        {
            header: 'Sent At',
            key: 'createdAt',
            render: (val) => <span className="text-[10px] font-medium text-slate-400">{new Date(val).toLocaleString()}</span>
        }
    ];

    const scheduledColumns = [
        {
            header: 'Title',
            key: 'title',
            render: (val) => <span className="text-sm font-bold text-slate-900">{val}</span>,
        },
        {
            header: 'Audience',
            key: 'audience',
            render: (val) => <span className="text-[10px] font-bold text-slate-500 uppercase">{val}</span>,
        },
        {
            header: 'When',
            key: 'scheduledAt',
            render: (val) => <span className="text-[10px] text-slate-600">{new Date(val).toLocaleString()}</span>,
        },
        {
            header: 'Status',
            key: 'status',
            render: (val) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                    val === 'sent'      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : val === 'failed'  ? 'bg-red-50 text-red-600 border-red-100'
                    : val === 'cancelled' ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                    {val}
                </span>
            ),
        },
        {
            header: 'Actions',
            key: 'id',
            render: (_, row) => {
                if (row.status === 'pending') {
                    return (
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleCancelScheduled(row.id)}
                                className="text-[10px] font-bold text-amber-700 hover:underline flex items-center gap-1">
                                <XCircle size={12} /> Cancel
                            </button>
                            <button type="button" onClick={() => handleDeleteScheduled(row.id)}
                                className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1">
                                <Trash2 size={12} /> Delete
                            </button>
                        </div>
                    );
                }
                if (row.status === 'cancelled') {
                    return (
                        <button type="button" onClick={() => handleDeleteScheduled(row.id)}
                            className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1">
                            <Trash2 size={12} /> Delete
                        </button>
                    );
                }
                return <span className="text-[10px] text-slate-400">—</span>;
            },
        },
    ];

    const activeTemplate = NOTIFICATION_TEMPLATES.find((t) => t.id === activeTemplateId);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Communications</h1>
                    <p className="text-slate-500 mt-1 font-medium">Broadcast messages, manage automated alerts, and monitor system health.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex-wrap">
                    <button onClick={() => setActiveTab('composer')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'composer' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                        <Send size={16} /> Composer
                    </button>
                    <button onClick={() => setActiveTab('scheduled')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'scheduled' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                        <CalendarClock size={16} /> Scheduled
                    </button>
                    <button onClick={() => setActiveTab('history')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                        <History size={16} /> History
                    </button>
                </div>
            </div>

            {/* System Health Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card p-4 border-l-4 border-l-green-500 flex items-center gap-4">
                    <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Status</p>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">Operational</h3>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-green-600">Active</span>
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-emerald-500 flex items-center gap-4">
                    <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server Load</p>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">12% Under Capacity</h3>
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-orange-500 flex items-center gap-4">
                    <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Queue</p>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">Processing Normally</h3>
                    </div>
                </div>
            </div>

            {/* ── COMPOSER TAB ── */}
            {activeTab === 'composer' && (
                <div className="space-y-6">

                    {/* ── Event Templates Panel ── */}
                    <div className="card overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowTemplates((p) => !p)}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                    <Zap size={16} className="text-indigo-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-slate-900">Event Templates</p>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        {activeTemplate
                                            ? `Using: "${activeTemplate.event}" — edit freely below`
                                            : 'Click a template to pre-fill the composer. All fields remain editable.'}
                                    </p>
                                </div>
                                {activeTemplate && (
                                    <span className={`ml-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${COLOR_MAP[activeTemplate.color]?.badge}`}>
                                        {activeTemplate.event}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                {activeTemplate && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); clearTemplate(); }}
                                        className="text-[11px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50"
                                    >
                                        <XCircle size={12} /> Clear
                                    </button>
                                )}
                                {showTemplates ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </div>
                        </button>

                        {showTemplates && (
                            <div className="border-t border-slate-100">
                                {/* Category filter */}
                                <div className="px-6 pt-4 pb-3 flex items-center gap-2 flex-wrap">
                                    {TEMPLATE_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setTemplateCategory(cat)}
                                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                                                templateCategory === cat
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Template grid */}
                                <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {filteredTemplates.map((tpl) => {
                                        const colors = COLOR_MAP[tpl.color] ?? COLOR_MAP.slate;
                                        const Icon = tpl.icon;
                                        const isActive = activeTemplateId === tpl.id;
                                        return (
                                            <button
                                                key={tpl.id}
                                                type="button"
                                                onClick={() => applyTemplate(tpl)}
                                                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                                                    isActive
                                                        ? `${colors.border} ${colors.bg} shadow-md`
                                                        : 'border-slate-100 hover:border-slate-200 hover:shadow-sm bg-white'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between mb-2.5">
                                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
                                                        <Icon size={16} className={colors.text} />
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${colors.badge}`}>
                                                        {AUDIENCE_LABELS[tpl.audience]}
                                                    </span>
                                                </div>
                                                <p className={`text-sm font-black leading-tight mb-1 ${isActive ? colors.text : 'text-slate-800 group-hover:text-slate-900'}`}>
                                                    {tpl.event}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2">
                                                    {tpl.description}
                                                </p>
                                                {isActive && (
                                                    <div className={`mt-2 flex items-center gap-1 text-[10px] font-bold ${colors.text}`}>
                                                        <CheckCircle2 size={11} /> Applied
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Composer + Preview ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-8">
                            <div id="composer-form" className="card p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-slate-900">Broadcast Composer</h2>
                                        <p className="text-sm text-slate-500 font-medium">Draft and send mass communications.</p>
                                    </div>
                                    {activeTemplate && (
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-bold ${COLOR_MAP[activeTemplate.color]?.bg} ${COLOR_MAP[activeTemplate.color]?.text} ${COLOR_MAP[activeTemplate.color]?.border}`}>
                                            <Info size={13} /> Template loaded — edit freely
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSend} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Notification Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm"
                                            placeholder="e.g. Weekly Reward Program"
                                            value={notification.title}
                                            onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Message Content</label>
                                        <textarea
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm h-32 resize-none"
                                            placeholder="Enter your broadcast message here..."
                                            value={notification.body}
                                            onChange={(e) => setNotification({ ...notification, body: e.target.value })}
                                        />
                                        <p className="text-[11px] text-slate-400 text-right">{notification.body.length} chars</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Audience</label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                                            value={notification.audience}
                                            onChange={(e) => setNotification({ ...notification, audience: e.target.value })}
                                        >
                                            <option value="all">All Users</option>
                                            <option value="providers">Service Providers</option>
                                            <option value="taskers">Skill Performers</option>
                                            <option value="specific_users">Specific users (UUIDs)</option>
                                        </select>
                                        <p className="text-[11px] text-slate-500 font-medium">
                                            Broadcasts are sent as <span className="font-bold text-slate-700">push notifications</span> (and saved in-app where applicable).
                                        </p>
                                    </div>

                                    {notification.audience === 'specific_users' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                User IDs (UUID, comma or newline separated)
                                            </label>
                                            <textarea
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm font-mono h-24"
                                                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                                                value={notification.userIdsText}
                                                onChange={(e) => setNotification({ ...notification, userIdsText: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSending || !notification.title || !notification.body}
                                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                                    >
                                        {isSending ? (
                                            <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <><Send size={20} /> Send Broadcast</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Preview + Rules */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="card p-6 bg-slate-900 text-white overflow-hidden relative">
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Live Preview</span>
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center gap-4">
                                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-5 w-5 bg-emerald-500 rounded flex items-center justify-center">
                                                    <Bell size={12} className="text-white" />
                                                </div>
                                                <span className="text-[10px] font-bold text-white/60">Push &bull; ONIT Admin &bull; Now</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-white truncate">{notification.title || 'Notification Title'}</h4>
                                            <p className="text-xs text-white/60 leading-relaxed line-clamp-3">{notification.body || 'Your message content will appear here once you start typing...'}</p>
                                        </div>
                                        {notification.audience && (
                                            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                                                <span className="text-[10px] text-white/40 font-medium">Audience:</span>
                                                <span className="text-[11px] font-bold text-emerald-400">{AUDIENCE_LABELS[notification.audience]}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/10">
                                        <p className="text-[10px] font-medium text-white/40 italic">Estimated Reach: <span className="text-white font-bold ml-1">~14,250 devices</span></p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                            </div>

                            <div className="card p-6 space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Broadcast Rules</h4>
                                <ul className="space-y-3">
                                    {[
                                        { text: 'Keep titles under 50 characters', status: notification.title.length > 0 && notification.title.length <= 50 },
                                        { text: 'Include a clear call to action', status: notification.body.length > 20 },
                                        { text: 'Select an audience', status: !!notification.audience },
                                    ].map((rule, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            {rule.status ? (
                                                <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                                            ) : (
                                                <AlertTriangle size={14} className="text-slate-300 shrink-0" />
                                            )}
                                            <span className={`text-[11px] font-medium ${rule.status ? 'text-slate-600' : 'text-slate-400'}`}>{rule.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SCHEDULED TAB ── */}
            {activeTab === 'scheduled' && (
                <div className="space-y-8">
                    <div className="card p-8 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-900">Schedule a broadcast</h2>
                            <p className="text-sm text-slate-500 font-medium">
                                Same targeting as instant broadcast; sends automatically at the chosen time (server checks every minute).
                            </p>
                        </div>
                        <form onSubmit={handleCreateScheduled} className="space-y-5 max-w-3xl">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Title</label>
                                <input type="text" required
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                    value={scheduleForm.title}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Message</label>
                                <textarea required
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm h-28"
                                    value={scheduleForm.body}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, body: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Audience</label>
                                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                        value={scheduleForm.audience}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, audience: e.target.value })}>
                                        <option value="all">All users</option>
                                        <option value="providers">Providers</option>
                                        <option value="taskers">Performers</option>
                                        <option value="specific_users">Specific users (UUIDs)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Send at (local)</label>
                                    <input type="datetime-local" required
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                        value={scheduleForm.scheduledAt}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledAt: e.target.value })}
                                    />
                                </div>
                            </div>
                            {scheduleForm.audience === 'specific_users' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">User UUIDs</label>
                                    <textarea className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono h-24"
                                        value={scheduleForm.userIdsText}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, userIdsText: e.target.value })}
                                    />
                                </div>
                            )}
                            <button type="submit" disabled={scheduling}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">
                                {scheduling ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <><CalendarClock size={18} /> Create schedule</>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Scheduled jobs</h2>
                            <button type="button" onClick={fetchScheduled} disabled={loadingScheduled}
                                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-sm font-bold hover:bg-emerald-100 disabled:opacity-50">
                                <RefreshCw size={16} className={loadingScheduled ? 'animate-spin' : ''} /> Refresh
                            </button>
                        </div>
                        <DataTable columns={scheduledColumns} data={scheduledRows} loading={loadingScheduled} />
                    </div>
                </div>
            )}

            {/* ── HISTORY TAB ── */}
            {activeTab === 'history' && (
                <div className="card">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Broadcast History</h2>
                        <button onClick={fetchHistory} disabled={loadingHistory}
                            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-all disabled:opacity-50">
                            <RefreshCw size={16} className={loadingHistory ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                    </div>
                    <DataTable columns={historyColumns} data={history} loading={loadingHistory} />
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default NotificationsPage;
