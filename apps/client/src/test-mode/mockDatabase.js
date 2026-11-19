/**
 * Stateful Mock Database for Frontend Manual Testing.
 * Persists changes in localStorage so interactions (creating tasks, bidding, messaging, profile updates)
 * remain consistent across page navigation, with instant reset support.
 */

import {
  MOCK_USERS,
  MOCK_TASKS,
  MOCK_APPLICATIONS,
  MOCK_WALLET,
  MOCK_TRANSACTIONS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_NOTIFICATIONS,
  MOCK_DAILY_QUIZ,
  MOCK_INVOICE,
  MOCK_PUBLIC_SHARE,
} from './mockData';
import { getTestRole, TEST_ROLES, isSimulateEmptyEnabled } from './testModeConfig';

const STORAGE_DB_PREFIX = 'onit_mock_db_';

const MOCK_TASKERS = [
  {
    id: 'usr_performer_mock_2',
    userId: 'usr_performer_mock_2',
    displayName: 'Rahul Sharma',
    name: 'Rahul Sharma',
    profession: 'Full-Stack Engineer & UI Specialist',
    domain: 'Tech, Data & Admin',
    bio: 'Over 4 years of experience delivering robust web applications, frontend UI audits, responsive landing pages, and automated research scraping.',
    hourlyRate: 650,
    ratingAvg: 4.94,
    rating: 4.94,
    ratingCount: 48,
    completedTasksCount: 38,
    completedTasks: 38,
    experienceLevel: 'Expert',
    locationCity: 'Bengaluru',
    city: 'Bengaluru',
    skills: ['React', 'TailwindCSS', 'TypeScript', 'Frontend Bug Fixes', 'Retail Audits'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    profilePicUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    verified: true,
    isIdVerified: true,
  },
  {
    id: 'usr_tasker_4',
    userId: 'usr_tasker_4',
    displayName: 'Sneha Reddy',
    name: 'Sneha Reddy',
    profession: 'Field Research & Content Specialist',
    domain: 'Business Operations & Research',
    bio: 'Experienced field researcher and content strategist covering Bengaluru local audits and D2C brand research.',
    hourlyRate: 520,
    ratingAvg: 4.85,
    rating: 4.85,
    ratingCount: 24,
    completedTasksCount: 22,
    completedTasks: 22,
    experienceLevel: 'Intermediate',
    locationCity: 'Bengaluru',
    city: 'Bengaluru',
    skills: ['Field Research', 'Photo Verification', 'Content', 'Research'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    profilePicUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    verified: true,
    isIdVerified: true,
  },
  {
    id: 'usr_tasker_1',
    userId: 'usr_tasker_1',
    displayName: 'Aarav Patel',
    name: 'Aarav Patel',
    profession: 'Full Stack & Operations Lead',
    domain: 'Tech, Data & Admin',
    bio: 'Senior product builder and operations auditor with 64 verified completions across tech and on-ground sprints.',
    hourlyRate: 800,
    ratingAvg: 4.98,
    rating: 4.98,
    ratingCount: 64,
    completedTasksCount: 64,
    completedTasks: 64,
    experienceLevel: 'Expert',
    locationCity: 'Mumbai',
    city: 'Mumbai',
    skills: ['Full Stack', 'Operations', 'Market Research'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    profilePicUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    verified: true,
    isIdVerified: true,
  },
  {
    id: 'usr_tasker_3',
    userId: 'usr_tasker_3',
    displayName: 'Vikram Sengupta',
    name: 'Vikram Sengupta',
    profession: 'Market Audits & Analytics',
    domain: 'Business Operations & Research',
    bio: 'Retail audit and competitive pricing analyst delivering structured, verifiable reports.',
    hourlyRate: 580,
    ratingAvg: 4.88,
    rating: 4.88,
    ratingCount: 21,
    completedTasksCount: 21,
    completedTasks: 21,
    experienceLevel: 'Intermediate',
    locationCity: 'Delhi',
    city: 'Delhi',
    skills: ['Market Audits', 'Excel', 'Pricing Analysis'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    profilePicUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    verified: true,
    isIdVerified: true,
  },
];

const DEFAULT_SAVED_TASK_IDS = ['task-101', 'task-102'];

const DEFAULT_PERFORMER_NOTIFICATIONS = [
  {
    id: 'notif-perf-1',
    role: 'PERFORMER',
    title: 'New Task Invitation',
    body: 'You were invited to work on a task. Review details and respond to accept.',
    type: 'TASK_INVITATION',
    isRead: false,
    createdAt: '2026-10-27T14:20:00.000Z',
    link: '/performer/invitations',
  },
  {
    id: 'notif-perf-2',
    role: 'PERFORMER',
    title: 'Escrow Funded for Active Task',
    body: 'Payment is secured in escrow for your active assignment. You can begin work now.',
    type: 'PAYMENT',
    isRead: false,
    createdAt: '2026-10-26T11:10:00.000Z',
    link: '/performer/my-tasks',
  },
];

const DEFAULT_INVITATIONS = [
  {
    id: 'inv-501',
    taskId: 'task-101',
    taskerId: 'usr_performer_mock_2',
    status: 'ACCEPTED',
    createdAt: '2026-10-25T15:00:00.000Z',
  },
  {
    id: 'inv-505',
    taskId: 'task-101',
    taskerId: 'usr_tasker_1',
    status: 'ACCEPTED',
    createdAt: '2026-10-25T15:10:00.000Z',
  },
  {
    id: 'inv-502',
    taskId: 'task-101',
    taskerId: 'usr_tasker_3',
    status: 'PENDING',
    createdAt: '2026-10-25T15:30:00.000Z',
  },
  {
    id: 'inv-503',
    taskId: 'task-101',
    taskerId: 'usr_tasker_4',
    status: 'DECLINED',
    createdAt: '2026-10-24T12:00:00.000Z',
  },
  {
    id: 'inv-504',
    taskId: 'task-105',
    taskerId: 'usr_tasker_3',
    status: 'EXPIRED',
    createdAt: '2026-10-18T10:00:00.000Z',
  },
];

const DEFAULT_CHECKLISTS = {
  'task-101': {
    id: 'chk-101',
    taskId: 'task-101',
    status: 'PENDING',
    items: [
      { id: 'chki-101-1', title: 'Storefront & shelf display photos (12 locations)', status: 'SUBMITTED', order: 0, note: 'Uploaded geotagged photos for all 12 stores' },
      { id: 'chki-101-2', title: 'Price tag & competitor placement log', status: 'APPROVED', order: 1, note: 'Verified spreadsheet' },
    ],
  },
  'task-102': {
    id: 'chk-102',
    taskId: 'task-102',
    status: 'PENDING',
    items: [
      { id: 'chki-102-1', title: 'Rough cut & pacing for 5 reels', status: 'APPROVED', order: 0, note: 'Approved by provider' },
      { id: 'chki-102-2', title: 'Brand captions & motion hooks', status: 'SUBMITTED', order: 1, note: 'Submitted preview links' },
      { id: 'chki-102-3', title: 'Final 4K export & audio master', status: 'CHANGE_REQUESTED', order: 2, note: 'Audio levels need -14 LUFS normalization before final approval', revisionNote: 'Normalize voiceover to -14 LUFS' },
    ],
  },
  'task-103': {
    id: 'chk-103',
    taskId: 'task-103',
    status: 'PENDING',
    items: [
      { id: 'chki-103-1', title: 'Modal ARIA attributes & focus trap', status: 'SUBMITTED', order: 0, note: 'Updated Modal & Drawer components' },
      { id: 'chki-103-2', title: 'Mobile Safari layout shift verification', status: 'APPROVED', order: 1, note: 'Verified at 375px' },
    ],
  },
};

const DEFAULT_UPDATES = {
  'assign-102': [
    {
      id: 'upd-102-1',
      assignmentId: 'assign-102',
      message: 'Uploaded rough cuts for the first 3 product reels.',
      createdAt: '2026-10-24T11:15:00.000Z',
      authorName: 'Rahul Sharma',
    },
  ],
  'assign-103': [
    {
      id: 'upd-103-1',
      assignmentId: 'assign-103',
      message: 'Submitted PR #42 with ARIA fixes and responsive layout verification.',
      documentUrl: 'https://github.com/onitindia/pull/42',
      createdAt: '2026-10-27T16:00:00.000Z',
      authorName: 'Rahul Sharma',
    },
  ],
};

const DEFAULT_REVIEWS = {
  'task-104': [
    {
      id: 'rev-104-1',
      taskId: 'task-104',
      rating: 5,
      comment: 'Exceptional speed and thorough research! Data formatting was clean and actionable.',
      createdAt: '2026-10-19T10:30:00.000Z',
    },
  ],
};

function enrichTaskRecord(task) {
  if (!task) return null;
  const priceAmount = task.priceAmount ?? task.budget ?? 0;
  const dueAt = task.dueAt || task.deadline || task.expectedCompletionDate || null;
  const normalizedStatus = String(task.status || 'PUBLISHED').toUpperCase();
  const allApps = getStorageItem('applications', MOCK_APPLICATIONS);
  const taskInterests = allApps.filter((a) => String(a.taskId) === String(task.id));
  const interestMeta = {
    interests: taskInterests,
    interestsCount: taskInterests.length,
    applicantCount: taskInterests.length,
    applicantsCount: Math.max(Number(task.applicantsCount || 0), taskInterests.length),
    _count: { ...(task._count || {}), interests: taskInterests.length },
  };
  const existingAssignments = task.taskAssignments || task.assignments;
  if (Array.isArray(existingAssignments) && existingAssignments.length > 0) {
    return { ...task, ...interestMeta, priceAmount, dueAt, assignments: existingAssignments, taskAssignments: existingAssignments };
  }
  if (['IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'ASSIGNED'].includes(normalizedStatus) && (task.assignedTo || task.performer)) {
    const taskerId = task.assignedTo || task.performer?.id || 'usr_performer_mock_2';
    const taskerProfile = MOCK_TASKERS.find((t) => t.id === taskerId) || task.performer || MOCK_TASKERS[0];
    const assignmentStatus = normalizedStatus === 'SUBMITTED' ? 'SUBMITTED' : normalizedStatus === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS';
    const assignments = [
      {
        id: `assign-${String(task.id).replace(/^task-/, '')}`,
        taskId: task.id,
        taskerId,
        tasker: { ...taskerProfile, userId: taskerId },
        status: assignmentStatus,
      },
    ];
    return {
      ...task,
      ...interestMeta,
      priceAmount,
      dueAt,
      assignments,
      taskAssignments: assignments,
    };
  }
  return { ...task, ...interestMeta, priceAmount, dueAt, assignments: [], taskAssignments: [] };
}

function getStorageItem(key, fallback) {
  try {
    const raw = localStorage.getItem(`${STORAGE_DB_PREFIX}${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`[MOCK DB] Failed to parse ${key}`, e);
  }
  return fallback;
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(`${STORAGE_DB_PREFIX}${key}`, JSON.stringify(value));
    if (key === 'tasks' && typeof window !== 'undefined' && window.sessionStorage) {
      Object.keys(window.sessionStorage).forEach((sKey) => {
        if (sKey.startsWith('onit_performer_')) {
          window.sessionStorage.removeItem(sKey);
        }
      });
    }
  } catch (e) {
    console.warn(`[MOCK DB] Failed to save ${key}`, e);
  }
}

class MockDatabase {
  constructor() {
    this.init();
  }

  init() {
    // Seed database if not present
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}tasks`)) {
      setStorageItem('tasks', MOCK_TASKS);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}applications`)) {
      setStorageItem('applications', MOCK_APPLICATIONS);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}wallet`)) {
      setStorageItem('wallet', MOCK_WALLET);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}transactions`)) {
      setStorageItem('transactions', MOCK_TRANSACTIONS);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}conversations`)) {
      setStorageItem('conversations', MOCK_CONVERSATIONS);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}messages`)) {
      setStorageItem('messages', MOCK_MESSAGES);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}notifications`)) {
      setStorageItem('notifications', [...MOCK_NOTIFICATIONS, ...DEFAULT_PERFORMER_NOTIFICATIONS]);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}invitations`)) {
      setStorageItem('invitations', DEFAULT_INVITATIONS);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}checklists`)) {
      setStorageItem('checklists', DEFAULT_CHECKLISTS);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}updates`)) {
      setStorageItem('updates', DEFAULT_UPDATES);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}reviews`)) {
      setStorageItem('reviews', DEFAULT_REVIEWS);
    }
    if (!localStorage.getItem(`${STORAGE_DB_PREFIX}saved_tasks`)) {
      setStorageItem('saved_tasks', DEFAULT_SAVED_TASK_IDS);
    }
  }

  reset() {
    setStorageItem('tasks', MOCK_TASKS);
    setStorageItem('applications', MOCK_APPLICATIONS);
    setStorageItem('wallet', MOCK_WALLET);
    setStorageItem('transactions', MOCK_TRANSACTIONS);
    setStorageItem('conversations', MOCK_CONVERSATIONS);
    setStorageItem('messages', MOCK_MESSAGES);
    setStorageItem('notifications', [...MOCK_NOTIFICATIONS, ...DEFAULT_PERFORMER_NOTIFICATIONS]);
    setStorageItem('invitations', DEFAULT_INVITATIONS);
    setStorageItem('checklists', DEFAULT_CHECKLISTS);
    setStorageItem('updates', DEFAULT_UPDATES);
    setStorageItem('reviews', DEFAULT_REVIEWS);
    setStorageItem('saved_tasks', DEFAULT_SAVED_TASK_IDS);

    // Also re-seed current active role session
    const currentRole = getTestRole();
    const user = this.getCurrentUser(currentRole);
    if (user) {
      localStorage.setItem('onit_user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('onit_token', `mock_token_${user.role.toLowerCase()}`);
    }

    window.dispatchEvent(new CustomEvent('onit-mock-db-reset'));
    console.log('[MOCK DB] Database successfully reset to initial seed state.');
  }

  getCurrentUser(overrideRole) {
    const role = overrideRole || getTestRole();
    if (role === TEST_ROLES.GUEST) return null;
    try {
      const stored = localStorage.getItem('onit_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.role === role || (!parsed.role && role === TEST_ROLES.PROVIDER))) {
          return parsed;
        }
      }
    } catch {
      // Ignore malformed stored user JSON
    }
    return MOCK_USERS[role] || MOCK_USERS.PROVIDER;
  }

  updateCurrentUser(partial) {
    const role = getTestRole();
    const current = this.getCurrentUser(role);
    if (!current) return null;

    const updated = {
      ...current,
      ...partial,
      provider: { ...(current.provider || {}), ...(partial.provider || {}) },
      taskers: { ...(current.taskers || {}), ...(partial.taskers || {}) },
    };

    localStorage.setItem('onit_user', JSON.stringify(updated));
    return updated;
  }

  // --- Tasks API ---
  getTasks(filters = {}) {
    if (isSimulateEmptyEnabled()) return [];
    let list = getStorageItem('tasks', MOCK_TASKS);

    if (filters.status) {
      const targetStatus = String(filters.status).toUpperCase();
      list = list.filter((t) => String(t.status).toUpperCase() === targetStatus);
    }
    if (filters.category) {
      list = list.filter((t) => t.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    return list.map(enrichTaskRecord);
  }

  getTaskById(id) {
    const list = getStorageItem('tasks', MOCK_TASKS);
    const found = list.find((t) => t.id === id || t._id === id) || list[0] || null;
    const enriched = enrichTaskRecord(found);
    if (!enriched) return null;
    const currentUser = this.getCurrentUser();
    const invitations = getStorageItem('invitations', DEFAULT_INVITATIONS);
    const pendingInvitation = invitations.find(
      (inv) =>
        String(inv.taskId) === String(enriched.id) &&
        String(inv.taskerId) === String(currentUser?.id || '') &&
        String(inv.status || '').toUpperCase() === 'PENDING',
    ) || null;
    const isSaved = this.getSavedTaskIds().some((savedId) => String(savedId) === String(enriched.id));
    return {
      ...enriched,
      isSaved,
      pendingInvitation,
    };
  }

  createTask(taskData) {
    const list = getStorageItem('tasks', MOCK_TASKS);
    const currentUser = this.getCurrentUser();
    const newTask = {
      id: `task-${Date.now()}`,
      _id: `task-${Date.now()}`,
      status: taskData.status || 'PUBLISHED',
      currency: 'INR',
      paymentType: 'FIXED',
      createdAt: new Date().toISOString(),
      applicantsCount: 0,
      providerId: currentUser?.id || 'usr_provider_mock_1',
      provider: {
        id: currentUser?.id || 'usr_provider_mock_1',
        displayName: currentUser?.displayName || 'Alex Morgan',
        profilePicUrl: currentUser?.profilePicUrl,
        rating: 4.9,
      },
      ...taskData,
    };

    const updated = [newTask, ...list];
    setStorageItem('tasks', updated);
    const seedChecklistItems = taskData.checklistItems || taskData.checkpoints || taskData.checklist?.items || (Array.isArray(taskData.checklist) ? taskData.checklist : null);
    if (Array.isArray(seedChecklistItems) && seedChecklistItems.length > 0) {
      this.createChecklist(newTask.id, { items: seedChecklistItems });
    }
    return newTask;
  }

  updateTask(id, partial) {
    const list = getStorageItem('tasks', MOCK_TASKS);
    const index = list.findIndex((t) => t.id === id || t._id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...partial };
    setStorageItem('tasks', list);
    return list[index];
  }

  deleteTask(id) {
    const list = getStorageItem('tasks', MOCK_TASKS);
    const filtered = list.filter((t) => t.id !== id && t._id !== id);
    setStorageItem('tasks', filtered);
    return true;
  }

  // --- Applications API ---
  getApplications(taskId) {
    if (isSimulateEmptyEnabled()) return [];
    const list = getStorageItem('applications', MOCK_APPLICATIONS);
    if (!taskId) return list;
    return list.filter((a) => a.taskId === taskId);
  }

  createApplication(taskId, applicationData) {
    const list = getStorageItem('applications', MOCK_APPLICATIONS);
    const currentUser = this.getCurrentUser();
    const newApp = {
      id: `app-${Date.now()}`,
      taskId,
      taskerId: currentUser?.id || 'usr_performer_mock_2',
      tasker: {
        id: currentUser?.id || 'usr_performer_mock_2',
        displayName: currentUser?.displayName || 'Rahul Sharma',
        profilePicUrl: currentUser?.profilePicUrl,
        rating: 4.94,
        completedTasks: 38,
      },
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      ...applicationData,
    };

    const updated = [newApp, ...list];
    setStorageItem('applications', updated);

    // Increment task applicant count
    const task = this.getTaskById(taskId);
    if (task) {
      this.updateTask(taskId, { applicantsCount: (task.applicantsCount || 0) + 1 });
    }

    return newApp;
  }

  // --- Wallet & Transactions ---
  getWallet() {
    if (isSimulateEmptyEnabled()) {
      return { balance: 0, available: 0, escrowBalance: 0, currency: 'INR' };
    }
    return getStorageItem('wallet', MOCK_WALLET);
  }

  getTransactions() {
    if (isSimulateEmptyEnabled()) return [];
    return getStorageItem('transactions', MOCK_TRANSACTIONS);
  }

  getWithdrawals() {
    if (isSimulateEmptyEnabled()) return [];
    return this.getTransactions().filter((tx) => tx.type === 'DEBIT' && String(tx.id || '').startsWith('wd-'));
  }

  requestWithdrawal(data = {}) {
    const amount = Number(data.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { error: true, status: 400, message: 'Invalid withdrawal amount' };
    }
    const wallet = getStorageItem('wallet', MOCK_WALLET);
    const currentBalance = Number(wallet.available ?? wallet.balance ?? 0);
    if (amount > currentBalance) {
      return { error: true, status: 400, message: 'Insufficient wallet balance' };
    }

    const txs = getStorageItem('transactions', MOCK_TRANSACTIONS);
    const requestKey = data.idempotencyKey || data.clientRequestId || null;
    if (requestKey && txs.some((tx) => tx.requestKey === requestKey)) {
      const existing = txs.find((tx) => tx.requestKey === requestKey);
      return { success: true, withdrawalId: existing.id, status: existing.status, balance: currentBalance };
    }

    const nextBalance = currentBalance - amount;
    setStorageItem('wallet', {
      ...wallet,
      balance: nextBalance,
      available: nextBalance,
      ...(wallet.availableBalance !== undefined ? { availableBalance: nextBalance } : {}),
    });

    const withdrawalId = `wd-${Date.now()}`;
    const newTx = {
      id: withdrawalId,
      type: 'DEBIT',
      amount,
      status: 'PROCESSING',
      description: 'Withdrawal to UPI',
      payoutMethodId: data.payoutMethodId || 'pm-1',
      ...(requestKey ? { requestKey } : {}),
      createdAt: new Date().toISOString(),
    };
    setStorageItem('transactions', [newTx, ...txs]);

    return {
      success: true,
      withdrawalId,
      status: 'PROCESSING',
      balance: nextBalance,
      transaction: newTx,
    };
  }

  // --- Conversations & Messages ---
  getConversations() {
    if (isSimulateEmptyEnabled()) return [];
    return getStorageItem('conversations', MOCK_CONVERSATIONS);
  }

  createConversation(payload = {}) {
    const convs = getStorageItem('conversations', MOCK_CONVERSATIONS);
    const otherUserId = payload.otherUserId || payload.participantId || 'usr_provider_mock_1';
    const taskId = payload.taskId || null;
    const existing = convs.find(
      (c) =>
        String(c.participant?.id || c.otherUser?.id || '') === String(otherUserId) &&
        String(c.taskId || '') === String(taskId || ''),
    );
    if (existing) return existing;

    const providerUser = MOCK_USERS.PROVIDER;
    const taskerProfile = MOCK_TASKERS.find((t) => String(t.id) === String(otherUserId));
    const otherUser = String(otherUserId) === String(providerUser.id)
      ? {
          id: providerUser.id,
          name: providerUser.displayName,
          displayName: providerUser.displayName,
          profilePicUrl: providerUser.profilePicUrl,
          role: 'PROVIDER',
          online: true,
        }
      : taskerProfile
      ? {
          id: taskerProfile.id,
          name: taskerProfile.displayName,
          displayName: taskerProfile.displayName,
          profilePicUrl: taskerProfile.profilePicUrl,
          role: 'TASKER',
          online: true,
        }
      : {
          id: otherUserId,
          name: 'Alex Morgan',
          displayName: 'Alex Morgan',
          role: 'PROVIDER',
          online: true,
        };

    const task = taskId ? this.getTaskById(taskId) : null;
    const created = {
      id: `conv-${Date.now()}`,
      taskId,
      taskTitle: task?.title || null,
      participant: otherUser,
      otherUser,
      lastMessage: null,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };
    setStorageItem('conversations', [created, ...convs]);
    return created;
  }

  getMessages(conversationId) {
    if (isSimulateEmptyEnabled()) return [];
    const all = getStorageItem('messages', MOCK_MESSAGES);
    return all[conversationId] || all['conv-1'] || [];
  }

  sendMessage(conversationId, text) {
    const all = getStorageItem('messages', MOCK_MESSAGES);
    const currentUser = this.getCurrentUser();
    const currentList = all[conversationId] || [];

    const newMsg = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser?.id || 'usr_provider_mock_1',
      text,
      content: text,
      createdAt: new Date().toISOString(),
    };

    all[conversationId] = [...currentList, newMsg];
    setStorageItem('messages', all);

    // Update conversation last message
    const convs = getStorageItem('conversations', MOCK_CONVERSATIONS);
    const conv = convs.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessage = { text, createdAt: newMsg.createdAt, senderId: newMsg.senderId };
      conv.updatedAt = newMsg.createdAt;
      setStorageItem('conversations', convs);
    }

    return newMsg;
  }

  // --- Notifications ---
  getNotifications() {
    if (isSimulateEmptyEnabled()) return [];
    const role = getTestRole();
    const list = getStorageItem('notifications', MOCK_NOTIFICATIONS);
    if (role === TEST_ROLES.PERFORMER) {
      const storedPerformer = list.filter((n) => n.role === 'PERFORMER' || n.link?.startsWith('/performer'));
      return storedPerformer.length > 0 ? storedPerformer : DEFAULT_PERFORMER_NOTIFICATIONS;
    }
    return list.filter((n) => n.role !== 'PERFORMER' && !n.link?.startsWith('/performer'));
  }

  // --- Saved Tasks ---
  getSavedTaskIds() {
    if (isSimulateEmptyEnabled()) return [];
    return getStorageItem('saved_tasks', DEFAULT_SAVED_TASK_IDS);
  }

  getSavedTasks() {
    if (isSimulateEmptyEnabled()) return [];
    const ids = this.getSavedTaskIds();
    const allTasks = this.getTasks();
    return ids.map((id) => allTasks.find((t) => String(t.id) === String(id))).filter(Boolean);
  }

  saveTask(taskId) {
    const ids = this.getSavedTaskIds();
    if (!ids.some((id) => String(id) === String(taskId))) {
      setStorageItem('saved_tasks', [taskId, ...ids]);
    }
    return { saved: true, taskId };
  }

  unsaveTask(taskId) {
    const ids = this.getSavedTaskIds();
    setStorageItem('saved_tasks', ids.filter((id) => String(id) !== String(taskId)));
    return { saved: false, taskId };
  }

  markNotificationRead(id) {
    const list = getStorageItem('notifications', MOCK_NOTIFICATIONS);
    const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setStorageItem('notifications', updated);
    return true;
  }

  markAllNotificationsRead() {
    const list = getStorageItem('notifications', MOCK_NOTIFICATIONS);
    const updated = list.map((n) => ({ ...n, isRead: true }));
    setStorageItem('notifications', updated);
    return true;
  }

  // --- Quiz & Education ---
  getDailyQuiz() {
    return MOCK_DAILY_QUIZ;
  }

  submitDailyQuiz() {
    return {
      success: true,
      score: 100,
      totalQuestions: 3,
      correctCount: 3,
      earnedPoints: 50,
      trustScoreDelta: +2,
      explanation: 'All questions answered accurately! Your trust score increased by 2 points.',
    };
  }

  // --- Public Invoices & Sharing ---
  getPublicShare(code) {
    return MOCK_PUBLIC_SHARE[code] || MOCK_PUBLIC_SHARE['TASK-10293'];
  }

  verifyInvoice(invoiceNumber) {
    return {
      ...MOCK_INVOICE,
      invoiceNumber: invoiceNumber || MOCK_INVOICE.invoiceNumber,
    };
  }

  // --- Taskers ---
  getTaskers(filters = {}) {
    if (isSimulateEmptyEnabled()) return [];
    let list = [...MOCK_TASKERS];
    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      list = list.filter((t) =>
        t.displayName.toLowerCase().includes(q)
        || t.profession.toLowerCase().includes(q)
        || (t.skills || []).some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getTaskerById(id) {
    return MOCK_TASKERS.find((t) => t.id === id || t.userId === id) || MOCK_TASKERS[0];
  }

  // --- Interests & Invitations ---
  getTaskInterests(taskId) {
    if (isSimulateEmptyEnabled()) return [];
    return this.getApplications(taskId).map((app) => {
      const taskerProfile = MOCK_TASKERS.find((t) => t.id === app.taskerId) || app.tasker || {};
      return {
        ...app,
        tasker: { ...taskerProfile, ...app.tasker },
      };
    });
  }

  _assignTaskerToTask(taskId, taskerId) {
    const task = this.getTaskById(taskId);
    if (!task) return null;
    const taskerProfile = this.getTaskerById(taskerId);
    const assignment = {
      id: `assign-${String(task.id).replace(/^task-/, '')}-${Date.now()}`,
      taskId: task.id,
      taskerId: taskerProfile.id,
      tasker: { ...taskerProfile, userId: taskerProfile.id },
      status: 'IN_PROGRESS',
    };
    return this.updateTask(task.id, {
      status: 'IN_PROGRESS',
      assignedTo: taskerProfile.id,
      performer: taskerProfile,
      assignments: [assignment],
      taskAssignments: [assignment],
    });
  }

  acceptInterest(interestId) {
    const list = getStorageItem('applications', MOCK_APPLICATIONS);
    const target = list.find((a) => a.id === interestId);
    const updated = list.map((a) => {
      if (a.id === interestId) return { ...a, status: 'ACCEPTED' };
      if (target && a.taskId === target.taskId && a.status === 'PENDING') return { ...a, status: 'REJECTED' };
      return a;
    });
    setStorageItem('applications', updated);
    if (target) {
      this._assignTaskerToTask(target.taskId, target.taskerId);
    }
    return { success: true, id: interestId, status: 'ACCEPTED' };
  }

  rejectInterest(interestId) {
    const list = getStorageItem('applications', MOCK_APPLICATIONS);
    const updated = list.map((a) => (a.id === interestId ? { ...a, status: 'REJECTED' } : a));
    setStorageItem('applications', updated);
    return { success: true, id: interestId, status: 'REJECTED' };
  }

  getTaskInvitations(taskId) {
    if (isSimulateEmptyEnabled()) return [];
    const list = getStorageItem('invitations', DEFAULT_INVITATIONS);
    return list.filter((inv) => String(inv.taskId) === String(taskId));
  }

  getMyInvitations() {
    if (isSimulateEmptyEnabled()) return [];
    const activeTaskerId = this.getCurrentUser()?.id || 'usr_performer_mock_2';
    const list = getStorageItem('invitations', DEFAULT_INVITATIONS);
    return list
      .filter((inv) => String(inv.taskerId) === String(activeTaskerId))
      .map((inv) => ({
        ...inv,
        task: this.getTaskById(inv.taskId) || null,
      }));
  }

  acceptInvitation(invitationId) {
    const list = getStorageItem('invitations', DEFAULT_INVITATIONS);
    let accepted = null;
    const updated = list.map((inv) => {
      if (String(inv.id) === String(invitationId)) {
        accepted = { ...inv, status: 'ACCEPTED', respondedAt: new Date().toISOString() };
        return accepted;
      }
      return inv;
    });
    setStorageItem('invitations', updated);
    return accepted || { id: invitationId, status: 'ACCEPTED' };
  }

  declineInvitation(invitationId, data = {}) {
    const list = getStorageItem('invitations', DEFAULT_INVITATIONS);
    let declined = null;
    const updated = list.map((inv) => {
      if (String(inv.id) === String(invitationId)) {
        declined = {
          ...inv,
          status: 'DECLINED',
          declineReason: data?.reason || '',
          respondedAt: new Date().toISOString(),
        };
        return declined;
      }
      return inv;
    });
    setStorageItem('invitations', updated);
    return declined || { id: invitationId, status: 'DECLINED' };
  }

  sendTaskInvitation(taskId, taskerId) {
    const list = getStorageItem('invitations', DEFAULT_INVITATIONS);
    const existing = list.find((inv) => String(inv.taskId) === String(taskId) && String(inv.taskerId) === String(taskerId));
    if (existing) {
      return { duplicate: true, invitation: existing };
    }
    const created = {
      id: `inv-${Date.now()}`,
      taskId,
      taskerId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setStorageItem('invitations', [created, ...list]);
    return { duplicate: false, invitation: created };
  }

  directHireTasker(taskId, taskerId) {
    const updatedTask = this._assignTaskerToTask(taskId, taskerId);
    return { success: true, task: updatedTask };
  }

  // --- Payment Preview ---
  previewPayment(taskId, options = {}) {
    const task = this.getTaskById(taskId);
    const baseAmount = Number(task?.priceAmount ?? task?.budget ?? 3500);
    const commissionRate = 10;
    const commissionAmount = Math.round(baseAmount * 0.1);
    const platformFeeAmount = 49;
    const couponDiscount = options?.couponCode ? Math.min(250, Math.round(baseAmount * 0.05)) : 0;
    const grossProviderAmount = baseAmount + commissionAmount + platformFeeAmount;
    const afterDiscount = Math.max(0, grossProviderAmount - couponDiscount);
    const walletBalance = Number(this.getWallet()?.balance || 0);
    const walletAppliedAmount = options?.useWallet ? Math.min(walletBalance, afterDiscount) : 0;
    const totalAmount = Math.max(0, afterDiscount - walletAppliedAmount);
    return {
      baseAmount,
      commissionRate,
      commissionAmount,
      platformFeeAmount,
      couponDiscount,
      couponDiscountAmount: couponDiscount,
      grossProviderAmount,
      walletBalance,
      walletAppliedAmount,
      gatewayPaidAmount: totalAmount,
      totalAmount,
      totalProviderPaid: afterDiscount,
    };
  }

  // --- Checklists ---
  getChecklist(taskId) {
    const all = getStorageItem('checklists', DEFAULT_CHECKLISTS);
    return all[taskId] || null;
  }

  createChecklist(taskId, data = {}) {
    const all = getStorageItem('checklists', DEFAULT_CHECKLISTS);
    const items = (data.items || []).map((item, idx) => ({
      id: `chki-${Date.now()}-${idx}`,
      title: item.title || item.text || `Item ${idx + 1}`,
      note: item.note || '',
      status: 'PENDING',
      order: item.order ?? idx,
    }));
    const checklist = {
      id: `chk-${taskId}`,
      taskId,
      status: 'PENDING',
      items,
    };
    all[taskId] = checklist;
    setStorageItem('checklists', all);
    return checklist;
  }

  tickChecklistItem(itemId, data = {}) {
    const all = getStorageItem('checklists', DEFAULT_CHECKLISTS);
    let updatedItem = null;
    Object.keys(all).forEach((tId) => {
      const chk = all[tId];
      if (!chk?.items) return;
      chk.items = chk.items.map((item) => {
        if (String(item.id) === String(itemId)) {
          updatedItem = {
            ...item,
            status: 'SUBMITTED',
            taskerDescription: data.taskerDescription ?? data.description ?? item.taskerDescription ?? '',
            taskerLink: data.taskerLink ?? data.githubLink ?? item.taskerLink ?? '',
            taskerFiles: data.taskerFiles ?? data.fileIds ?? item.taskerFiles ?? [],
            note: data.taskerDescription ?? data.description ?? item.note ?? '',
            submittedAt: new Date().toISOString(),
          };
          return updatedItem;
        }
        return item;
      });
    });
    setStorageItem('checklists', all);
    return updatedItem || { id: itemId, status: 'SUBMITTED' };
  }

  reviewChecklistItem(itemId, data = {}) {
    const all = getStorageItem('checklists', DEFAULT_CHECKLISTS);
    const rawAction = String(data.status || data.action || 'APPROVE').toUpperCase();
    const nextStatus = ['REJECTED', 'REQUEST_CHANGES', 'CHANGE_REQUESTED'].includes(rawAction) ? 'CHANGE_REQUESTED' : 'APPROVED';
    const feedback = data.providerFeedback || data.reason || '';
    let updatedItem = null;
    Object.keys(all).forEach((tId) => {
      const chk = all[tId];
      if (!chk?.items) return;
      chk.items = chk.items.map((item) => {
        if (String(item.id) === String(itemId)) {
          updatedItem = {
            ...item,
            status: nextStatus,
            note: feedback || item.note,
            ...(nextStatus === 'CHANGE_REQUESTED' && feedback ? { revisionNote: feedback } : {}),
          };
          return updatedItem;
        }
        return item;
      });
    });
    setStorageItem('checklists', all);
    return updatedItem || { id: itemId, status: nextStatus };
  }

  approveChecklist(checklistId) {
    const all = getStorageItem('checklists', DEFAULT_CHECKLISTS);
    let target = null;
    Object.keys(all).forEach((tId) => {
      if (all[tId]?.id === checklistId) {
        all[tId].status = 'APPROVED';
        target = all[tId];
      }
    });
    setStorageItem('checklists', all);
    return target || { id: checklistId, status: 'APPROVED' };
  }

  // --- Assignment Updates, Completion & Revision ---
  getTaskUpdates(assignmentId) {
    const all = getStorageItem('updates', DEFAULT_UPDATES);
    return all[assignmentId] || [];
  }

  addTaskUpdate(assignmentId, data = {}) {
    const all = getStorageItem('updates', DEFAULT_UPDATES);
    const list = all[assignmentId] || [];
    const text = data.note || data.message || data.content || 'Progress update logged.';
    const created = {
      id: `upd-${Date.now()}`,
      assignmentId,
      note: text,
      message: text,
      link: data.link || null,
      documentUrl: data.link || data.documentUrl || null,
      progress: data.progress,
      createdAt: new Date().toISOString(),
      authorName: this.getCurrentUser()?.displayName || 'Alex Morgan',
    };
    all[assignmentId] = [created, ...list];
    setStorageItem('updates', all);
    return created;
  }

  _updateTaskByAssignment(assignmentId, nextTaskStatus, nextAssignmentStatus) {
    const tasks = getStorageItem('tasks', MOCK_TASKS).map(enrichTaskRecord);
    let updatedTask = null;
    const nextTasks = tasks.map((task) => {
      const hasAssignment = (task.assignments || []).some((a) => String(a.id) === String(assignmentId));
      if (!hasAssignment && String(task.id) !== String(assignmentId)) return task;
      const nextAssignments = (task.taskAssignments || task.assignments || []).map((a) => ({ ...a, status: nextAssignmentStatus }));
      updatedTask = { ...task, status: nextTaskStatus, assignments: nextAssignments, taskAssignments: nextAssignments };
      return updatedTask;
    });
    setStorageItem('tasks', nextTasks);
    return updatedTask;
  }

  approveAssignment(assignmentId) {
    const task = this._updateTaskByAssignment(assignmentId, 'COMPLETED', 'COMPLETED');
    if (task) {
      const payout = Number(task.priceAmount ?? task.budget ?? 0);
      if (payout > 0) {
        const wallet = getStorageItem('wallet', MOCK_WALLET);
        setStorageItem('wallet', {
          ...wallet,
          balance: Number(wallet.balance || 0) + payout,
          available: Number(wallet.available ?? wallet.balance ?? 0) + payout,
        });
        const txs = getStorageItem('transactions', MOCK_TRANSACTIONS);
        setStorageItem('transactions', [
          {
            id: `tx-${Date.now()}`,
            type: 'CREDIT',
            amount: payout,
            status: 'COMPLETED',
            description: `Task Payout: ${task.title}`,
            createdAt: new Date().toISOString(),
          },
          ...txs,
        ]);
      }
    }
    return { success: true, status: 'COMPLETED', task };
  }

  rejectAssignment(assignmentId, data = {}) {
    const task = this._updateTaskByAssignment(assignmentId, 'IN_PROGRESS', 'IN_PROGRESS');
    if (data?.reason || data?.feedback) {
      this.addTaskUpdate(assignmentId, { message: `Revision requested: ${data.reason || data.feedback}` });
    }
    return { success: true, status: 'IN_PROGRESS', task };
  }

  submitAssignment(assignmentId, data = {}) {
    const task = this._updateTaskByAssignment(assignmentId, 'SUBMITTED', 'SUBMITTED');
    this.addTaskUpdate(assignmentId, { message: data?.notes || 'Resubmitted updated work deliverables for provider review.' });
    return { success: true, status: 'SUBMITTED', task };
  }

  fundAcceptedInvitation(taskId) {
    const task = this.getTaskById(taskId);
    if (!task) return null;
    const existing = task.taskAssignments || task.assignments || [];
    if (existing.length > 0) return task;
    const invitations = this.getTaskInvitations(taskId);
    const accepted = invitations.find((inv) => String(inv.status || '').toUpperCase().includes('ACCEPT'));
    if (!accepted) return task;
    const taskerProfile = this.getTaskerById(accepted.taskerId);
    const assignment = {
      id: `assign-${String(task.id).replace(/^task-/, '')}`,
      taskId: task.id,
      taskerId: taskerProfile.id,
      tasker: { ...taskerProfile, userId: taskerProfile.id },
      status: 'IN_PROGRESS',
    };
    return this.updateTask(task.id, {
      status: 'IN_PROGRESS',
      assignedTo: taskerProfile.id,
      performer: taskerProfile,
      assignments: [assignment],
      taskAssignments: [assignment],
    });
  }

  // --- Reviews ---
  createTaskReview(taskId, data = {}) {
    const all = getStorageItem('reviews', DEFAULT_REVIEWS);
    const list = all[taskId] || [];
    const review = {
      id: `rev-${Date.now()}`,
      taskId,
      rating: Number(data.rating || 5),
      comment: data.comment || '',
      createdAt: new Date().toISOString(),
    };
    all[taskId] = [review, ...list];
    setStorageItem('reviews', all);
    this.updateTask(taskId, { review });
    return review;
  }

  getTaskReviews(taskId) {
    const all = getStorageItem('reviews', DEFAULT_REVIEWS);
    return all[taskId] || [];
  }
}

export const mockDb = new MockDatabase();
