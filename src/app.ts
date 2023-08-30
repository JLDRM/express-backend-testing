#!/usr/bin/env node
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import config from './config';
import { getAppRoutes } from './routes';

const app = express();
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));
app.set('port', config.port);

const appRoutes = getAppRoutes();
app.use('/api', appRoutes);

export default app;
