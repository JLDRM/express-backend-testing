import 'dotenv/config';
import { merge } from 'lodash';
import dev from './dev';
import prod from './prod';
const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  env,
  isDev: env === 'development',
  isProd: env === 'production',
  port: 8000,
  dbUrl: '',
};

let envConfig = {};

switch (env) {
  case 'dev':
  case 'development':
    envConfig = dev;
    break;
  default:
    envConfig = prod;
}

export default merge(baseConfig, envConfig);
