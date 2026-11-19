/**
 * Centralized Mock API Request Handler.
 * Intercepts all frontend API calls (/api-onitindia and /api) when Test Mode is active.
 * Guarantees zero unhandled network errors, prevents 401 session wipes, and supports realistic CRUD operations.
 */

import { mockDb } from './mockDatabase';
import { isSimulateSlowEnabled, getTestRole } from './testModeConfig';

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

  if (cleanUrl === '/providers/me/saved-taskers' || cleanUrl === '/providers/saved-taskers') {
    const taskers = mockDb.getTaskers();
    let savedIds = ['usr_performer_mock_2', 'usr_tasker_1'];
    try {
      const raw = localStorage.getItem('onit_provider_saved_performers');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) savedIds = parsed;
      }
    } catch {
      // fallback to default savedIds
    }
    const saved = taskers
      .filter((t) => savedIds.includes(t.id))
      .map((t) => ({ ...t, user: { profilePicUrl: t.profilePicUrl, ratingAvg: t.ratingAvg } }));
    return { status: 200, data: { data: saved } };
  }

  if (cleanUrl.startsWith('/providers/saved-taskers/')) {
    return { status: 200, data: { success: true } };
  }

  // 3. Performer Endpoints
  if (cleanUrl === '/taskers/me/onboarding-status') {
    return { status: 200, data: { onboardingComplete: true, step: 4 } };
  }

  if (cleanUrl === '/taskers/me' || (cleanUrl === '/taskers' && httpMethod !== 'GET')) {
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
    const taskers = mockDb.getTaskers();
    const order = ['usr_tasker_1', 'usr_performer_mock_2', 'usr_tasker_4', 'usr_tasker_3'];
    const ranked = order
      .map((id, idx) => {
        const t = taskers.find((item) => item.id === id);
        return t ? { ...t, rank: idx + 1, trustScore: 99 - idx * 3 } : null;
      })
      .filter(Boolean);
    return { status: 200, data: ranked };
  }

  if (cleanUrl === '/taskers' || cleanUrl === '/taskers/search' || cleanUrl === '/taskers/suggested') {
    const taskers = mockDb.getTaskers(params);
    return { status: 200, data: { taskers, data: taskers, total: taskers.length } };
  }

  if (cleanUrl.startsWith('/taskers/') && !cleanUrl.includes('/me/')) {
    const taskerId = cleanUrl.split('/').filter(Boolean)[1];
    return { status: 200, data: mockDb.getTaskerById(taskerId) };
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

  if (cleanUrl === '/taskers/me/analytics/summary') {
    const activeTaskerId = mockDb.getCurrentUser()?.id || 'usr_performer_mock_2';
    const completed = mockDb.getTasks().filter((t) => {
      const targetId = t.assignedTo || t.performer?.id || t.taskAssignments?.[0]?.taskerId;
      return String(targetId || '') === String(activeTaskerId) && ['COMPLETED', 'DONE', 'FINISHED', 'CLOSED'].includes(String(t.status || '').toUpperCase());
    });
    const totalEarnings = completed.reduce((sum, t) => sum + Number(t.priceAmount ?? t.budget ?? 0), 0);
    return { status: 200, data: { completedTasks: completed.length, totalEarnings } };
  }

  if (cleanUrl === '/taskers/me/saved-tasks') {
    return { status: 200, data: mockDb.getSavedTasks() };
  }

  if (cleanUrl.startsWith('/taskers/me/saved-tasks/')) {
    const savedTaskId = cleanUrl.split('/').filter(Boolean)[3];
    if (httpMethod === 'POST') {
      return { status: 201, data: mockDb.saveTask(savedTaskId) };
    }
    if (httpMethod === 'DELETE') {
      return { status: 200, data: mockDb.unsaveTask(savedTaskId) };
    }
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
  if (cleanUrl === '/tasks/my-tasks' || cleanUrl === '/tasks/my-posted-tasks' || cleanUrl === '/providers/me/tasks') {
    const tasks = mockDb.getTasks(params);
    return { status: 200, data: { data: tasks, tasks, pagination: { total: tasks.length } } };
  }

  if (cleanUrl === '/tasks/assigned-to-me' || cleanUrl === '/tasks/my-work' || cleanUrl === '/tasks/my-active-tasks' || cleanUrl === '/tasks/my-completed-tasks') {
    const activeTaskerId = mockDb.getCurrentUser()?.id || 'usr_performer_mock_2';
    const allTasks = mockDb.getTasks();
    const assigned = allTasks.filter((t) => {
      const targetId = t.assignedTo || t.performer?.id || t.taskAssignments?.[0]?.taskerId;
      return String(targetId || '') === String(activeTaskerId);
    });
    const toAssignedRow = (t) => ({
      id: t.taskAssignments?.[0]?.id || `assign-${String(t.id).replace(/^task-/, '')}`,
      taskId: t.id,
      status: t.status,
      task: t,
      assignment: t.taskAssignments?.[0] || {
        id: `assign-${String(t.id).replace(/^task-/, '')}`,
        taskId: t.id,
        taskerId: activeTaskerId,
        status: t.status,
        createdAt: t.createdAt,
      },
      createdAt: t.createdAt,
    });
    if (cleanUrl === '/tasks/my-active-tasks') {
      const rows = assigned.filter((t) => ['IN_PROGRESS', 'ASSIGNED', 'SUBMITTED', 'ACTIVE'].includes(String(t.status || '').toUpperCase())).map(toAssignedRow);
      return { status: 200, data: rows };
    }
    if (cleanUrl === '/tasks/my-completed-tasks') {
      const rows = assigned.filter((t) => ['COMPLETED', 'DONE', 'FINISHED', 'CLOSED'].includes(String(t.status || '').toUpperCase())).map(toAssignedRow);
      return { status: 200, data: rows };
    }
    return { status: 200, data: assigned.map(toAssignedRow) };
  }

  if (cleanUrl === '/tasks/my-invitations') {
    return { status: 200, data: mockDb.getMyInvitations() };
  }

  if (cleanUrl === '/tasks/my-interests') {
    const activeTaskerId = mockDb.getCurrentUser()?.id || 'usr_performer_mock_2';
    const apps = mockDb.getApplications().filter((a) => String(a.taskerId || '') === String(activeTaskerId));
    const rows = apps
      .map((a) => ({
        ...a,
        task: mockDb.getTaskById(a.taskId) || null,
      }))
      .filter((row) => {
        const st = String(row.task?.status || '').toUpperCase();
        return !['IN_PROGRESS', 'ASSIGNED', 'SUBMITTED', 'COMPLETED', 'DONE', 'CLOSED'].includes(st);
      });
    return { status: 200, data: rows };
  }

  if (cleanUrl === '/tasks' || cleanUrl === '/tasks/browse' || cleanUrl === '/tasks/feed' || cleanUrl === '/tasks/search') {
    if (httpMethod === 'POST') {
      const created = mockDb.createTask(body || {});
      return { status: 201, data: created };
    }
    const tasks = mockDb.getTasks(params);
    return { status: 200, data: { tasks, data: tasks, total: tasks.length } };
  }

  if (cleanUrl.startsWith('/tasks/')) {
    const parts = cleanUrl.split('/').filter(Boolean);

    // /tasks/provider/:id
    if (parts[1] === 'provider' && parts[2]) {
      return { status: 200, data: mockDb.getTaskById(parts[2]) || mockDb.getTasks()[0] };
    }

    // /tasks/interests/:interestId/accept | reject
    if (parts[1] === 'interests' && parts[2]) {
      if (parts[3] === 'accept') {
        return { status: 200, data: mockDb.acceptInterest(parts[2]) };
      }
      if (parts[3] === 'reject') {
        return { status: 200, data: mockDb.rejectInterest(parts[2]) };
      }
    }

    // /tasks/invitations/:invitationId/accept | decline
    if (parts[1] === 'invitations' && parts[2]) {
      if (parts[3] === 'accept') {
        return { status: 200, data: mockDb.acceptInvitation(parts[2]) };
      }
      if (parts[3] === 'decline') {
        return { status: 200, data: mockDb.declineInvitation(parts[2], body || {}) };
      }
    }

    // /tasks/checklist/items/:itemId/tick | review
    if (parts[1] === 'checklist' && parts[2] === 'items' && parts[3]) {
      if (parts[4] === 'tick') {
        return { status: 200, data: mockDb.tickChecklistItem(parts[3], body || {}) };
      }
      if (parts[4] === 'review') {
        return { status: 200, data: mockDb.reviewChecklistItem(parts[3], body || {}) };
      }
    }

    // /tasks/checklist/:checklistId/approve
    if (parts[1] === 'checklist' && parts[2] && parts[3] === 'approve') {
      return { status: 200, data: mockDb.approveChecklist(parts[2]) };
    }

    // /tasks/updates/:assignmentId
    if (parts[1] === 'updates' && parts[2]) {
      if (httpMethod === 'POST') {
        return { status: 201, data: mockDb.addTaskUpdate(parts[2], body || {}) };
      }
      return { status: 200, data: mockDb.getTaskUpdates(parts[2]) };
    }

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

    if (parts[2] === 'publish') {
      const updated = mockDb.updateTask(taskId, { status: 'PUBLISHED' });
      return { status: 200, data: updated || { success: true, status: 'PUBLISHED' } };
    }

    if (parts[2] === 'cancel') {
      const updated = mockDb.updateTask(taskId, { status: 'CANCELLED' });
      return { status: 200, data: updated || { success: true, status: 'CANCELLED' } };
    }

    if (parts[2] === 'interests') {
      return { status: 200, data: mockDb.getTaskInterests(taskId) };
    }

    if (parts[2] === 'invitations') {
      if (parts[3] && httpMethod === 'POST') {
        const result = mockDb.sendTaskInvitation(taskId, parts[3]);
        if (result.duplicate) {
          return { status: 409, data: { message: 'An invitation has already been sent to this performer.' } };
        }
        return { status: 201, data: result.invitation };
      }
      return { status: 200, data: mockDb.getTaskInvitations(taskId) };
    }

    if (parts[2] === 'direct-hire') {
      return { status: 200, data: mockDb.directHireTasker(taskId, body?.taskerId) };
    }

    if (parts[2] === 'checklist') {
      if (httpMethod === 'POST') {
        return { status: 201, data: mockDb.createChecklist(taskId, body || {}) };
      }
      return { status: 200, data: mockDb.getChecklist(taskId) };
    }

    if (parts[2] === 'reviews') {
      if (httpMethod === 'POST') {
        return { status: 201, data: mockDb.createTaskReview(taskId, body || {}) };
      }
      return { status: 200, data: mockDb.getTaskReviews(taskId) };
    }

    if (parts[2] === 'applications') {
      if (httpMethod === 'GET') {
        const apps = mockDb.getApplications(taskId);
        return { status: 200, data: apps };
      }
    }

    if (parts[2] === 'apply' || parts[2] === 'interest') {
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

    if (parts[2] === 'submit') {
      return { status: 200, data: mockDb.submitAssignment(taskId, body || {}) };
    }

    if (parts[2] === 'complete' || parts[2] === 'approve') {
      return { status: 200, data: mockDb.approveAssignment(taskId) };
    }

    if (parts[2] === 'reject') {
      return { status: 200, data: mockDb.rejectAssignment(taskId, body || {}) };
    }
  }

  if (cleanUrl === '/task-catalog/domains') {
    return {
      status: 200,
      data: [
        { id: 'business', name: 'Business Operations & Research', label: 'Business Operations & Research', isActive: true, isLaunchVisible: true },
        { id: 'content', name: 'Content, Design & Marketing', label: 'Content, Design & Marketing', isActive: true, isLaunchVisible: true },
        { id: 'tech', name: 'Tech, Data & Admin', label: 'Tech, Data & Admin', isActive: true, isLaunchVisible: true },
        { id: 'academic', name: 'Academic & Knowledge Support', label: 'Academic & Knowledge Support', isActive: true, isLaunchVisible: true },
        { id: 'onground', name: 'On-Ground & Local Assistance', label: 'On-Ground & Local Assistance', isActive: true, isLaunchVisible: true },
      ],
    };
  }

  if (cleanUrl === '/task-catalog/services') {
    const services = [
      { id: 'srv-market-research', name: 'Market Research', domainId: 'business', domainName: 'Business Operations & Research', minPrice: 500, isActive: true, isLaunchVisible: true },
      { id: 'srv-retail-audit', name: 'Retail Audits', domainId: 'business', domainName: 'Business Operations & Research', minPrice: 800, isActive: true, isLaunchVisible: true },
      { id: 'srv-video-editing', name: 'Video Editing', domainId: 'content', domainName: 'Content, Design & Marketing', minPrice: 1000, isActive: true, isLaunchVisible: true },
      { id: 'srv-ui-design', name: 'UI/UX Design', domainId: 'content', domainName: 'Content, Design & Marketing', minPrice: 1200, isActive: true, isLaunchVisible: true },
      { id: 'srv-web-dev', name: 'Web Development', domainId: 'tech', domainName: 'Tech, Data & Admin', minPrice: 1500, isActive: true, isLaunchVisible: true },
      { id: 'srv-qa-testing', name: 'QA & Bug Testing', domainId: 'tech', domainName: 'Tech, Data & Admin', minPrice: 800, isActive: true, isLaunchVisible: true },
      { id: 'srv-presentations', name: 'Presentations', domainId: 'academic', domainName: 'Academic & Knowledge Support', minPrice: 600, isActive: true, isLaunchVisible: true },
      { id: 'srv-field-verify', name: 'Local Verification', domainId: 'onground', domainName: 'On-Ground & Local Assistance', minPrice: 700, isActive: true, isLaunchVisible: true },
    ];
    return { status: 200, data: services };
  }

  // 6. Wallet & Payments
  if (cleanUrl.startsWith('/payments/tasks/') && cleanUrl.endsWith('/preview')) {
    const taskId = cleanUrl.split('/').filter(Boolean)[2];
    return { status: 200, data: mockDb.previewPayment(taskId, body || {}) };
  }

  if (cleanUrl === '/payments/create-order') {
    const breakdown = mockDb.previewPayment(body?.taskId, body || {});
    if (body?.taskId) {
      mockDb.fundAcceptedInvitation(body.taskId);
    }
    return {
      status: 200,
      data: {
        id: `order_mock_${Date.now()}`,
        amount: 0,
        currency: 'INR',
        paymentRequired: false,
        breakdown,
      },
    };
  }

  if (cleanUrl === '/payments/verify-payment') {
    return { status: 200, data: { success: true, verified: true } };
  }

  if (cleanUrl === '/coupons/my-vouchers') {
    return {
      status: 200,
      data: [
        { code: 'FIRST5', title: '5% off up to ₹250', discountType: 'PERCENT', discountValue: 5, maxDiscount: 250 },
      ],
    };
  }

  if (cleanUrl === '/coupons/validate') {
    return {
      status: 200,
      data: { valid: true, code: body?.code || 'FIRST5', discountAmount: 175 },
    };
  }
  if (cleanUrl === '/wallet') {
    return { status: 200, data: mockDb.getWallet() };
  }

  if (cleanUrl === '/wallet/transactions' || cleanUrl === '/payments/history') {
    return { status: 200, data: mockDb.getTransactions() };
  }

  if (cleanUrl.startsWith('/payout-methods')) {
    if (cleanUrl.includes('withdrawals')) {
      if (httpMethod === 'POST') {
        const result = mockDb.requestWithdrawal(body || {});
        if (result?.error) {
          return { status: result.status || 400, data: { message: result.message } };
        }
        return { status: 201, data: result };
      }
      return { status: 200, data: mockDb.getWithdrawals() };
    }
    return { status: 200, data: [{ id: 'pm-1', type: 'UPI', handle: 'rahulsharma@okhdfcbank', isDefault: true }] };
  }

  // 7. Conversations & Messages
  if (cleanUrl === '/conversations') {
    if (httpMethod === 'POST') {
      return { status: 201, data: mockDb.createConversation(body || {}) };
    }
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
