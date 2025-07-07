const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Shutting Down');
  process.exit(1);
});

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT;

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose.connect(DB).then(() => console.log('Data base connected'));

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandledRejection');
  server.close(() => {
    process.exit(1);
  });
});
