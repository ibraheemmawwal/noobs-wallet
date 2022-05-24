const express = require('express');
const http = require('http');
const db = require('./models');
const bodyParser = require('body-parser');
const userRouter = require('./routers/userRouters.js');
const transactionRouter = require('./routers/transactionRouter.js');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);

const server = http.createServer(app);

db.sequelize.sync({}).then(() => {
  server.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
});
