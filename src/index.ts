import log, { LogLevelDesc } from 'loglevel';
import config from './config/index';
import { serverStart } from './server';

const isTest = process.env.NODE_ENV === 'test';
const logLevel = process.env.LOG_LEVEL || (isTest ? 'warn' : 'info');

log.setLevel(logLevel as LogLevelDesc);

serverStart({ port: config.port });
