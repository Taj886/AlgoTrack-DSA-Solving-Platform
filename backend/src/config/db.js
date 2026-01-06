const mongoose = require('mongoose');

async function main() {

   try {
   const connStr = process.env.DB_CONNECT_STRING || '';
   // log masked connection string for debugging (do not leak passwords in production)
   const masked = connStr.replace(/:(?:[^:@]+)@/, ':*****@');
   console.log('Attempting DB connect to:', masked);
   await mongoose.connect(connStr);
   console.log('database connected successfully'); 
}

catch (error) {
   console.log('database connection failed');
   console.error(error);
}
}

module.exports = main;
