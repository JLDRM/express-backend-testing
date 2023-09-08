import app from './app';
import log from 'loglevel';
import { connect } from './utils/db';

export const serverStart = async ({ port = Number(process.env.PORT) } = {}) => {
  await connect();

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      log.info(`Listening on port ${port}`);
      const originalClose = server.close.bind(server);
      // @ts-ignore
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };
      resolve(server);
    });
  });
};
