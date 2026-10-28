/**
 * Google Apps Script - Deploy as Web App to collect task data to Google Sheets
 * 
 * Instructions:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this code into the editor
 * 3. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL and add it to your .env file as GOOGLE_APPS_SCRIPT_URL
 */

// Replace with your Google Sheet name
const SHEET_NAME = 'Tasks';

const doPost = (e) => {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      // Add headers
      sheet.appendRow(['Timestamp', 'Task Details', 'Mobile Number', 'Status']);
    }
    
    // Get data from POST request
    const { taskDetails, mobileNumber } = e.parameter;
    
    // Append data to sheet
    sheet.appendRow([
      new Date(),
      taskDetails || '',
      mobileNumber || '',
      'New'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
};

// For testing - add GET handler
const doGet = (e) => {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Google Apps Script is running' }))
    .setMimeType(ContentService.MimeType.JSON);
};
