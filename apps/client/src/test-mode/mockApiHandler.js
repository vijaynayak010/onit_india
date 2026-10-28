/**
 * Centralized Mock API Request Handler.
 * Intercepts all frontend API calls (/api-onitindia and /api) when Test Mode is active.
 * Guarantees zero unhandled network errors, prevents 401 session wipes, and supports realistic CRUD operations.
 */

import { mockDb } from './mockDatabase';
import { isTestModeEnabled, isSimulateSlowEnabled, getTestRole } from './testModeConfig';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function handleMockApiRequest(method, url, body, params = {}) {
  // Add realistic or simulated network latency
  const latency = isSimulateSlowEnabled() ? 1200 : 150;
  await delay(latency);

  const cleanUrl = url
    .replace(/^https?:\/\/[^/]+/i, '') // strip origin if present
    .replace(/^\/api-onitindia/, '')   // strip lambda proxy prefix
    .split('?')[0];                   // strip query string

  const httpMethod = String(method).toUpperCase();

  console.log(`[TEST MODE MOCK API] ${httpMethod} ${cleanUrl}`, { body, params });

  // 1. Current User / Authentication
  if (cleanUrl === '/users/me' || cleanUrl === '/auth/me') {
    if (httpMethod === 'GET') {
      const user = mockDb.getCurrentUser();
      if (!user) {
        return { status: 401, data: { message: 'Not authenticated in Guest mode' } };
      }
      return { status: 200, data: user };
    }
    if (httpMethod === 'PUT') {
      const updated = mockDb.updateCurrentUser(body || {});
      return { status: 200, data: updated };
    }
  }

  if (cleanUrl === '/auth/check-email' || cleanUrl === '/auth/check-account') {
    return { status: 200, data: { exists: true, provider: 'mock', role: getTestRole() } };
  }

  if (cleanUrl === '/auth/refresh') {
    return { status: 200, data: { accessToken: 'mock_access_token_refreshed', refreshToken: 'mock_refresh_token' } };
  }

  if (cleanUrl === '/auth/logout') {
    return { status: 200, data: { success: true } };
  }

  if (cleanUrl === '/users/onboard') {
    const role = body?.role || 'PROVIDER';
    mockDb.updateCurrentUser({ role });
    return { status: 200, data: { success: true, role } };
  }

  if (cleanUrl === '/users/me/deletion-request') {
    if (httpMethod === 'GET') {
      return { status: 200, data: { hasPendingRequest: false } };
    }
    return { status: 200, data: { success: true, scheduledDate: '2026-11-27T00:00:00Z' } };
  }

  if (cleanUrl === '/users/me/deletion-request/cancel') {
    return { status: 200, data: { success: true, restored: true } };
  }

  if (cleanUrl.includes('/auth/profile-phone/verify-access-token')) {
    mockDb.updateCurrentUser({ phoneNumber: '+91 98765 43210', phone: '+91 98765 43210' });
    return { status: 200, data: { verified: true } };
  }

  // 2. Provider Endpoints
  if (cleanUrl === '/providers/me/onboarding-status') {
    return { status: 200, data: { onboardingComplete: true, step: 3 } };
  }

  if (cleanUrl === '/providers/me' || cleanUrl === '/providers') {
    const user = mockDb.getCurrentUser();
    if (httpMethod === 'GET') {
      return { status: 200, data: user?.provider || { id: 'prov_101', onboardingComplete: true } };
    }
    if (httpMethod === 'POST' || httpMethod === 'PUT') {
      const updated = mockDb.updateCurrentUser({ provider: body });
      return { status: 200, data: updated.provider };
    }
  }

  if (cleanUrl === '/providers/me/saved-taskers') {
    return {
      status: 200,
      data: [
        {
          id: 'usr_performer_mock_2',
          displayName: 'Rahul Sharma',
          rating: 4.94,
          skills: ['React', 'UI Design', 'Market Research'],
          profilePicUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        },
      ],
    };
  }

  // 3. Performer Endpoints
  if (cleanUrl === '/taskers/me/onboarding-status') {
    return { status: 200, data: { onboardingComplete: true, step: 4 } };
  }

  if (cleanUrl === '/taskers/me' || cleanUrl === '/taskers') {
    const user = mockDb.getCurrentUser();
    if (httpMethod === 'GET') {
      return { status: 200, data: user?.taskers || { id: 'tsk_usr_2', onboardingComplete: true } };
    }
    if (httpMethod === 'POST' || httpMethod === 'PUT') {
      const mergedTaskers = { ...(user?.taskers || {}), ...(body || {}) };
      const updated = mockDb.updateCurrentUser({ taskers: mergedTaskers });
      return { status: 200, data: updated.taskers };
    }
  }

  if (cleanUrl.includes('/uploads/profile-picture') || cleanUrl.includes('/uploads/confirm')) {
    return {
      status: 200,
      data: {
        success: true,
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        publicUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      },
    };
  }

  if (cleanUrl === '/taskers/me/availability/toggle') {
    const user = mockDb.getCurrentUser();
    const currentAvail = Boolean(user?.taskers?.isAvailable);
    mockDb.updateCurrentUser({ taskers: { ...(user?.taskers || {}), isAvailable: !currentAvail } });
    return { status: 200, data: { isAvailable: !currentAvail } };
  }

  if (cleanUrl === '/taskers/rankings' || cleanUrl.includes('/taskers/rankings')) {
    return {
      status: 200,
      data: [
        { id: '1', rank: 1, displayName: 'Aarav Patel', rating: 4.98, completedTasks: 64, trustScore: 99, skills: ['Full Stack'] },
        { id: '2', rank: 2, displayName: 'Rahul Sharma', rating: 4.94, completedTasks: 38, trustScore: 96, skills: ['React', 'UI Design'] },
        { id: '3', rank: 3, displayName: 'Sneha Reddy', rating: 4.91, completedTasks: 29, trustScore: 93, skills: ['Content', 'Research'] },
        { id: '4', rank: 4, displayName: 'Vikram Sengupta', rating: 4.88, completedTasks: 21, trustScore: 89, skills: ['Market Audits'] },
      ],
    };
  }

  if (cleanUrl === '/taskers/me/bank-account') {
    if (httpMethod === 'GET') {
      return {
        status: 200,
        data: {
          accountNumber: '••••••••4829',
          ifsc: 'HDFC0000123',
          accountHolderName: 'Rahul Sharma',
          bankName: 'HDFC Bank Indiranagar',
          upiId: 'rahulsharma@okhdfcbank',
          isVerified: true,
        },
      };
    }
    return { status: 200, data: { success: true, isVerified: true } };
  }

  if (cleanUrl === '/taskers/me/kyc') {
    return {
      status: 200,
      data: {
        status: 'APPROVED',
        idVerified: true,
        selfieVerified: true,
        documentType: 'AADHAAR',
        verifiedAt: '2026-02-15T10:00:00Z',
      },
    };
  }

  if (cleanUrl === '/taskers/me/kyc/id' || cleanUrl === '/taskers/me/kyc/selfie') {
    return { status: 200, data: { success: true, status: 'APPROVED' } };
  }

  if (cleanUrl === '/taskers/me/saved-tasks') {
    return { status: 200, data: mockDb.getTasks().slice(0, 2) };
  }

  // 4. Growth & Quiz Endpoints
  if (cleanUrl.includes('/performer/growth/daily-quiz')) {
    if (cleanUrl.includes('/attempt') || httpMethod === 'POST') {
      return { status: 200, data: mockDb.submitDailyQuiz() };
    }
    return { status: 200, data: mockDb.getDailyQuiz() };
  }

  if (cleanUrl === '/performer/growth/progress') {
    return {
      status: 200,
      data: {
        trustScore: 96,
        level: 'Pro Tasker Tier 3',
        completedQuizzes: 18,
        accuracyRate: 94,
        nextMilestonePoints: 40,
      },
    };
  }

  if (cleanUrl === '/performer/growth/trust-score') {
    return { status: 200, data: { trustScore: 96, breakdown: { onTime: 98, quality: 96, compliance: 100 } } };
  }

  if (cleanUrl.includes('/performer/growth/task-preview') || cleanUrl.includes('/performer/growth/earnings-benchmark')) {
    return { status: 200, data: { averageHourly: 650, topPerformerHourly: 1200, activeGigsCount: 42 } };
  }

  if (cleanUrl.includes('/performer/growth/resources')) {
    return {
      status: 200,
      data: [
        { id: 'res-1', title: 'Retail Audits Masterclass', category: 'Field Research', readTime: '6 mins', points: 25 },
        { id: 'res-2', title: 'React 18 Performance Optimization', category: 'Tech', readTime: '10 mins', points: 35 },
      ],
    };
  }

  // 5. Tasks & Applications
  if (cleanUrl === '/tasks/my-tasks' || cleanUrl === '/providers/me/tasks') {
    const tasks = mockDb.getTasks();
    return { status: 200, data: { data: tasks, pagination: { total: tasks.length } } };
  }

  if (cleanUrl === '/tasks' || cleanUrl === '/tasks/browse' || cleanUrl === '/tasks/feed') {
    if (httpMethod === 'POST') {
      const created = mockDb.createTask(body || {});
      return { status: 201, data: created };
    }
    const tasks = mockDb.getTasks(params);
    return { status: 200, data: { tasks, data: tasks, total: tasks.length } };
  }

  if (cleanUrl.startsWith('/tasks/')) {
    const parts = cleanUrl.split('/').filter(Boolean);
    const taskId = parts[1];

    if (parts.length === 2) {
      if (httpMethod === 'GET') {
        const task = mockDb.getTaskById(taskId);
        return { status: 200, data: task || mockDb.getTasks()[0] };
      }
      if (httpMethod === 'PUT' || httpMethod === 'PATCH') {
        const updated = mockDb.updateTask(taskId, body || {});
        return { status: 200, data: updated };
      }
      if (httpMethod === 'DELETE') {
        mockDb.deleteTask(taskId);
        return { status: 200, data: { success: true } };
      }
    }

    if (parts[2] === 'applications') {
      if (httpMethod === 'GET') {
        const apps = mockDb.getApplications(taskId);
        return { status: 200, data: apps };
      }
    }

    if (parts[2] === 'apply') {
      const app = mockDb.createApplication(taskId, body || {});
      return { status: 201, data: app };
    }

    if (parts[2] === 'submit-work') {
      mockDb.updateTask(taskId, { status: 'SUBMITTED', submission: body });
      return { status: 200, data: { success: true, status: 'SUBMITTED' } };
    }

    if (parts[2] === 'approve-work') {
      mockDb.updateTask(taskId, { status: 'COMPLETED' });
      return { status: 200, data: { success: true, status: 'COMPLETED' } };
    }
  }

  if (cleanUrl === '/task-catalog/domains') {
    return {
      status: 200,
      data: [
        { id: 'business', label: 'Business Operations & Research' },
        { id: 'content', label: 'Content, Design & Marketing' },
        { id: 'tech', label: 'Tech, Data & Admin' },
        { id: 'academic', label: 'Academic & Knowledge Support' },
        { id: 'onground', label: 'On-Ground & Local Assistance' },
      ],
    };
  }

  // 6. Wallet & Payments
  if (cleanUrl === '/wallet') {
    return { status: 200, data: mockDb.getWallet() };
  }

  if (cleanUrl === '/wallet/transactions' || cleanUrl === '/payments/history') {
    return { status: 200, data: mockDb.getTransactions() };
  }

  if (cleanUrl.startsWith('/payout-methods')) {
    if (cleanUrl.includes('withdrawals')) {
      return { status: 200, data: { success: true, withdrawalId: `wd-${Date.now()}`, status: 'PROCESSING' } };
    }
    return { status: 200, data: [{ id: 'pm-1', type: 'UPI', handle: 'rahulsharma@okhdfcbank', isDefault: true }] };
  }

  // 7. Conversations & Messages
  if (cleanUrl === '/conversations') {
    return { status: 200, data: mockDb.getConversations() };
  }

  if (cleanUrl.startsWith('/conversations/')) {
    const convId = cleanUrl.split('/')[2];
    if (cleanUrl.includes('/messages')) {
      if (httpMethod === 'POST') {
        const text = body?.content || body?.text || 'Sample message';
        const msg = mockDb.sendMessage(convId, text);
        return { status: 201, data: msg };
      }
      return { status: 200, data: mockDb.getMessages(convId) };
    }
    return { status: 200, data: mockDb.getConversations().find((c) => c.id === convId) || {} };
  }

  // 8. Notifications
  if (cleanUrl === '/notifications') {
    const list = mockDb.getNotifications();
    return { status: 200, data: list, unreadCount: list.filter((n) => !n.isRead).length };
  }

  if (cleanUrl.includes('/notifications/read-all')) {
    mockDb.markAllNotificationsRead();
    return { status: 200, data: { success: true } };
  }

  if (cleanUrl.startsWith('/notifications/') && cleanUrl.endsWith('/read')) {
    const id = cleanUrl.split('/')[2];
    mockDb.markNotificationRead(id);
    return { status: 200, data: { success: true } };
  }

  // 9. Public Share & Invoices
  if (cleanUrl.startsWith('/public/share/')) {
    const code = cleanUrl.split('/')[3];
    return { status: 200, data: mockDb.getPublicShare(code) };
  }

  if (cleanUrl.includes('/public/invoices/verify')) {
    return { status: 200, data: mockDb.verifyInvoice() };
  }

  if (cleanUrl.startsWith('/settings/content-pages/')) {
    const slug = cleanUrl.split('/')[3] || 'policy';
    return {
      status: 200,
      data: {
        title: slug.replace(/-/g, ' ').toUpperCase(),
        content: `# ${slug.replace(/-/g, ' ').toUpperCase()}\n\nThis is a verified test-mode policy document.\n\n- Verified OnIT platform standards\n- Transparent dispute and refund handling\n- Active protection for clients and performers.`,
      },
    };
  }

  // 10. Express BFF Micro-services
  if (cleanUrl.includes('/generate-task') || cleanUrl.includes('/api/generate-task')) {
    return {
      status: 200,
      data: {
        success: true,
        data: {
          title: 'Comprehensive Market Competitor Benchmarking',
          category: 'business',
          subcategory: 'Market Research',
          estimatedBudget: 4500,
          currency: 'INR',
          description: 'Gather pricing, features, and target demographics for top 5 competing e-commerce platforms in India.',
          deliverables: [
            'Excel spreadsheet with SKU price comparisons',
            'Summary report PDF with key observations',
            'Executive presentation deck summary',
          ],
        },
      },
    };
  }

  if (cleanUrl.includes('/enhance-description') || cleanUrl.includes('/api/enhance-description')) {
    return {
      status: 200,
      data: {
        success: true,
        enhanced: `${body?.description || 'Task requirements'}\n\nKey Requirements:\n- High-resolution deliverables adhering to brand palette\n- Timely daily check-ins on progress\n- Full documentation and proof files included on completion.`,
      },
    };
  }

  if (cleanUrl.includes('/submit-task') || cleanUrl.includes('/submit-career') || cleanUrl.includes('/subscribe')) {
    return { status: 200, data: { success: true, message: 'Form submitted successfully in test mode.' } };
  }

  // Fallback default response
  return {
    status: 200,
    data: { success: true, message: 'Mock response OK', path: cleanUrl },
  };
}
