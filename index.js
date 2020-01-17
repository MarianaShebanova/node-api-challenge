const express = require('express');

const projectRouter = require('./routers/projectRouter.js');

const actionRouter = require('./routers/actionRouter.js');

const server = express();

server.use(express.json());

server.use(logger);

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

// requests to routes that begin with /api/hubs
server.use('/api/projects', projectRouter);

server.use('/api/actions', actionRouter);

function logger(req, res, next) {
    const { method, originalUrl } = req;
    console.log(`[${new Date().toISOString()}] ${method} to ${originalUrl}`);
    next();
}
const port = process.env.PORT || 7000;

server.listen(8000, () => {
    console.log('\n*** Server Running on http://localhost:8000 ***\n');
});