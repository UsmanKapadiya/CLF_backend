require('dotenv').config();
const { initializeAdmin } = require('./controllers/adminController');
const connectDB = require('./config/database');

(async () => {
  await connectDB();
  // Mock req, res objects for direct invocation
  const req = {};
  const res = {
    status: (code) => ({
      json: (data) => {
        console.log('Status:', code);
        console.log('Response:', data);
        process.exit(0);
      }
    })
  };
  initializeAdmin(req, res);
})();
