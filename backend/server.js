import app from './src/app.js';
import { env } from './src/config/env.js';
import { connectDB } from './src/config/db.js';

const PORT = env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn(`⚠️ DB Initialization Warning: ${err.message}`);
  }

  server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 IMPERIA ESTATES Backend Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`====================================================`);
  });
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message || err);
});

export default server;

