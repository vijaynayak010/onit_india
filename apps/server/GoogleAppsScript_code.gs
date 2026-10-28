/**
 * Google Apps Script - Deploy as Web App to collect task + career data to Google Sheets
 *
 * Writes to two sheets in the same spreadsheet:
 * - "Tasks": from Post task form (taskDetails, mobileNumber)
 * - "Careers": from Careers application form (name, email, phone, role, coverNote, portfolioFileName)
 *
 * Instructions:
 * 1. Go to https://script.google.com and open the project that uses this spreadsheet
 * 2. Paste this code into the editor (code.gs)
 * 3. Deploy as Web App (or redeploy if you already have one):
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL and set GOOGLE_APPS_SCRIPT_URL in server .env (or it uses the default)
 */

// Your Google Sheet ID (from the spreadsheet URL)
const SPREADSHEET_ID = '1CjOlOpOMWIn3TAhQSBLWnWwf1r-vxUpY43VGYPZAGIM';
const SHEET_NAME = 'Tasks';  // tab where Post task form data goes
const CAREERS_SHEET_NAME = 'Careers';  // tab where Careers form data goes
const JOBS_SHEET_NAME = 'Jobs'; // tab where Job postings are stored

const doPost = (e) => {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(SPREADSHEET_ID);
    const formType = (e.parameter && e.parameter.formType) ? String(e.parameter.formType).toLowerCase() : '';

    if (formType === 'career') {
      // Career application: append to "Careers" sheet
      let sheet = doc.getSheetByName(CAREERS_SHEET_NAME);
      if (!sheet) {
        sheet = doc.insertSheet(CAREERS_SHEET_NAME);
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Role', 'Cover Note', 'Portfolio File Name', 'Status']);
      }
      sheet.appendRow([
        new Date(),
        e.parameter.name || '',
        e.parameter.email || '',
        e.parameter.phone || '',
        e.parameter.role || '',
        e.parameter.coverNote || '',
        e.parameter.portfolioFileName || '',
        'New'
      ]);
      return createJsonResponse({ success: true, message: 'Application saved' });
    } else if (formType === 'addjob' || formType === 'updatejob') {
      let sheet = doc.getSheetByName(JOBS_SHEET_NAME);
      if (!sheet) {
        sheet = doc.insertSheet(JOBS_SHEET_NAME);
        sheet.appendRow(['ID', 'Title', 'Department', 'Type', 'Location', 'Description', 'Responsibilities', 'Requirements', 'ApplicationProcess', 'IsActive', 'PostedDate', 'Deadline', 'CreatedAt']);
      }

      const jobId = e.parameter.id || Utilities.getUuid();
      const jobData = [
        jobId,
        e.parameter.title || '',
        e.parameter.department || '',
        e.parameter.type || '',
        e.parameter.location || '',
        e.parameter.description || '',
        e.parameter.responsibilities || '[]',
        e.parameter.requirements || '[]',
        e.parameter.applicationProcess || '[]',
        e.parameter.isActive === 'false' ? 'false' : 'true',
        e.parameter.postedDate || new Date().toISOString(),
        e.parameter.deadline || '',
        new Date().toISOString()
      ];

      if (formType === 'updatejob') {
        const rows = sheet.getDataRange().getValues();
        let found = false;
        for (let i = 1; i < rows.length; i++) {
          if (rows[i][0] === jobId) {
            sheet.getRange(i + 1, 1, 1, jobData.length).setValues([jobData]);
            found = true;
            break;
          }
        }
        if (!found) throw new Error('Job not found');
      } else {
        sheet.appendRow(jobData);
      }
      return createJsonResponse({ success: true, message: 'Job saved', id: jobId });
    } else if (formType === 'deletejob') {
      let sheet = doc.getSheetByName(JOBS_SHEET_NAME);
      if (!sheet) throw new Error('Jobs sheet not found');
      const jobId = e.parameter.id;
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === jobId) {
          sheet.deleteRow(i + 1);
          return createJsonResponse({ success: true, message: 'Job deleted' });
        }
      }
      throw new Error('Job not found');
    } else {
      // Task submission: append to "Tasks" sheet
      let sheet = doc.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = doc.insertSheet(SHEET_NAME);
        sheet.appendRow(['Timestamp', 'Task Details', 'Mobile Number', 'Status']);
      }
      const taskDetails = e.parameter.taskDetails || '';
      const mobileNumber = e.parameter.mobileNumber || '';
      sheet.appendRow([
        new Date(),
        taskDetails,
        mobileNumber,
        'New'
      ]);
      return createJsonResponse({ success: true, message: 'Task saved' });
    }

  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
};

const doGet = (e) => {
  try {
    const doc = SpreadsheetApp.openById(SPREADSHEET_ID);
    const action = (e.parameter && e.parameter.action) ? String(e.parameter.action).toLowerCase() : '';

    if (action === 'getjobs') {
      const sheet = doc.getSheetByName(JOBS_SHEET_NAME);
      if (!sheet) return createJsonResponse([]);
      const rows = sheet.getDataRange().getValues();
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          let val = row[index];
          if (['Responsibilities', 'Requirements', 'ApplicationProcess'].includes(header)) {
            try { val = JSON.parse(val); } catch(e) { val = []; }
          }
          if (header === 'IsActive') val = val === 'true' || val === true;
          obj[header.charAt(0).toLowerCase() + header.slice(1)] = val;
        });
        return obj;
      });
      return createJsonResponse(data);
    }

    return createJsonResponse({ status: 'ok', message: 'Google Apps Script is running' });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
};

const createJsonResponse = (data) => {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
};
