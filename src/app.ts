#!/usr/bin/env node
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import passport from 'passport';
import config from './config';
import { getAppRoutes } from './routes';
import { getLocalStrategy } from './utils/auth';
import errorMiddleware from './utils/error-middleware';

const app = express();
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());
passport.use(getLocalStrategy());

app.set('port', config.port);
const appRoutes = getAppRoutes();
app.use('/api', appRoutes);
app.use(errorMiddleware);

export default app;
