const axios = require('axios');

async function fetchTasks() {
  try {
    const res = await axios.get('https://api.onitindia.com/admin/tasks', {
        headers: {
            'Authorization': 'Bearer ' + 'YOUR_TOKEN' // Wait, I don't have the token.
        }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
fetchTasks();
