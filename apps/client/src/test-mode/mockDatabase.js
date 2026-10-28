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
      setStorageItem('notifications', MOCK_NOTIFICATIONS);
    }
  }

  reset() {
    setStorageItem('tasks', MOCK_TASKS);
    setStorageItem('applications', MOCK_APPLICATIONS);
    setStorageItem('wallet', MOCK_WALLET);
    setStorageItem('transactions', MOCK_TRANSACTIONS);
    setStorageItem('conversations', MOCK_CONVERSATIONS);
    setStorageItem('messages', MOCK_MESSAGES);
    setStorageItem('notifications', MOCK_NOTIFICATIONS);

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
    } catch (e) {}
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
    return list;
  }

  getTaskById(id) {
    const list = getStorageItem('tasks', MOCK_TASKS);
    return list.find((t) => t.id === id || t._id === id) || list[0] || null;
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

  // --- Conversations & Messages ---
  getConversations() {
    if (isSimulateEmptyEnabled()) return [];
    return getStorageItem('conversations', MOCK_CONVERSATIONS);
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
    return getStorageItem('notifications', MOCK_NOTIFICATIONS);
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

  submitDailyQuiz(assignmentId, answers) {
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
}

export const mockDb = new MockDatabase();
