const express = require('express');
const http = require('http');
const db = require('./models');
const userRouter = require('./routers/userRouters.js');
const transactionRouter = require('./routers/transactionRouter.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);

const server = http.createServer(app);

db.sequelize.sync({}).then(() => {
  server.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
});
