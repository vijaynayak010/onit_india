---
name: frontend-unit-testing
description: Use this skill when writing unit tests for the OnIT React frontend application. Defines strict rules for using Vitest, testing utility functions, mocking dependencies, and file naming conventions.
---

# Frontend Unit Testing Guidelines (OnIT React App)

When instructed to write unit tests for the frontend (`onitindia1/client`), you MUST adhere to the following rules:

## 1. Testing Framework
- **Always use Vitest.** Do not use Jest. The project uses Vite, and Vitest is explicitly configured for it.
- **Imports:** Import testing functions explicitly from `vitest`:
  ```javascript
  import { describe, it, expect, vi, beforeEach } from 'vitest';
  ```

## 2. File Naming and Placement
- Test files must be placed directly next to the file they are testing.
- Test files must use the `.test.js` or `.test.jsx` extension.
  - Example: `client/src/utils/notificationRouter.test.js`

## 3. Mocking Strategy
- Use `vi.fn()` for all mocks.
- **Console Warnings/Errors:** If testing fallback logic that triggers `console.warn` or `console.error`, mock the console methods to prevent polluting the test output:
  ```javascript
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  // ... run test
  expect(consoleWarnSpy).toHaveBeenCalled();
  consoleWarnSpy.mockRestore();
  ```

## 4. Test Structure
- Wrap tests in a `describe` block named after the function or module being tested.
- Use `it('should ...', () => { ... })` for individual test cases.
- Group related test cases within nested `describe` blocks if necessary.
- Ensure 100% path coverage for complex conditionals (like router fallback logic).

## 5. Specific Routing Test Rules
When testing routing utility functions (like `notificationRouter.js`), ensure you test:
1. **Valid Payload Paths:** Provide exact mock payloads that match what the backend sends, and assert the correct route string is returned.
2. **Missing Properties:** Test behavior when required properties (like `taskId`) are missing. It should return a fallback route.
3. **Unknown Notification Types:** Test behavior when the notification type is unregistered. It should use the smart fallback logic.
