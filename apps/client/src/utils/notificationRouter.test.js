import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveNotificationRoute } from './notificationRouter';
import { NOTIFICATION_ROUTE_MAP, NOTIFICATION_FALLBACK_ROUTE } from '../config/notificationRoutes';

describe('notificationRouter', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.restoreAllMocks();
  });

  it('should route KYC_STATUS_UPDATED to performer kyc with role override', () => {
    const notification = { type: 'KYC_STATUS_UPDATED', payload: {} };
    const route = resolveNotificationRoute(notification, 'PROVIDER');
    expect(route).toBe('/performer/kyc');
  });

  it('should route TASK_ASSIGNED correctly with a taskId and role override', () => {
    const notification = {
      type: 'TASK_ASSIGNED',
      payload: { taskId: 'task_123' },
    };
    // Even if user is PROVIDER, roleOverride for TASK_ASSIGNED is 'performer'
    const route = resolveNotificationRoute(notification, 'PROVIDER');
    expect(route).toBe('/performer/active-task/task_123');
  });

  it('should open the specific task for NEW_TASK_AVAILABLE notifications', () => {
    const notification = {
      type: 'new_task_available',
      payload: { taskId: 'task_123' },
    };

    expect(resolveNotificationRoute(notification, 'TASKER')).toBe('/performer/task/task_123');
  });

  it('should extract a taskId from legacy metadata payloads', () => {
    const notification = {
      type: 'SYSTEM',
      payload: { metadata: { taskId: 'task_legacy' } },
    };

    expect(resolveNotificationRoute(notification, 'TASKER')).toBe('/performer/active-task/task_legacy');
  });

  it('should extract nested taskId from taskAssignment.taskId', () => {
    const notification = {
      type: 'TASK_COMPLETED',
      payload: {
        taskAssignment: { taskId: 'task_456' },
      },
    };
    const route = resolveNotificationRoute(notification, 'PROVIDER');
    expect(route).toBe('/provider/active-task/task_456');
  });

  it('should use fallback route when required param is missing', () => {
    // Mock console.warn to keep test output clean, per the AI skill
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // TASK_COMPLETED requires taskId, but we provide empty payload
    const notification = {
      type: 'TASK_COMPLETED',
      payload: {},
    };
    
    const route = resolveNotificationRoute(notification, 'PERFORMER');
    expect(route).toBe('/performer/dashboard');
    expect(consoleWarnSpy).toHaveBeenCalled();
    
    consoleWarnSpy.mockRestore();
  });

  it('should use smart fallback logic (taskId) for unregistered notification type', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const notification = {
      type: 'UNKNOWN_FUTURE_TYPE',
      payload: { taskId: 'task_789' },
    };
    
    const route = resolveNotificationRoute(notification, 'PROVIDER');
    expect(route).toBe('/provider/active-task/task_789');
    expect(consoleWarnSpy).toHaveBeenCalled();
    
    consoleWarnSpy.mockRestore();
  });

  it('should route to dashboard when type is unknown and no entities match', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const notification = {
      type: 'UNKNOWN_WEIRD_TYPE',
      payload: { randomData: 'xyz' },
    };
    
    const route = resolveNotificationRoute(notification, 'PERFORMER');
    expect(route).toBe('/performer/dashboard');
    expect(consoleWarnSpy).toHaveBeenCalled();
    
    consoleWarnSpy.mockRestore();
  });

  describe('exhaustive routing check (all 32 notification types)', () => {
    Object.entries(NOTIFICATION_ROUTE_MAP).forEach(([type, config]) => {
      it(`should correctly resolve route for ${type}`, () => {
        // Construct a comprehensive mock payload with sample IDs
        const mockPayload = {
          taskId: 'test_task_123',
          assignmentId: 'test_assign_456',
          interestId: 'test_int_789',
          conversationId: 'test_conv_101',
          transactionId: 'test_txn_202',
          ticketId: 'test_tkt_303',
        };

        const notification = {
          type,
          payload: mockPayload,
        };

        // Test with user role PROVIDER
        const testRole = 'PROVIDER';
        const expectedRole = config.roleOverride || 'provider';
        
        let expectedPath = config.path.replace(':role', expectedRole);
        config.params.forEach((param) => {
          expectedPath = expectedPath.replace(`:${param}`, mockPayload[param]);
        });

        const actualPath = resolveNotificationRoute(notification, testRole);
        expect(actualPath).toBe(expectedPath);
      });
    });
  });
});
