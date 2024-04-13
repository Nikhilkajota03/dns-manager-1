import express from 'express';
import app from './app.js';
import { serverMode } from './config/config.js';

const server = express();
server.use(app);

const PORT = process.env.PORT || 8080;

server.listen(8080, () => {
  process.stdout.write(`server is running on 8080 in ${serverMode} Mode \n`);
});
