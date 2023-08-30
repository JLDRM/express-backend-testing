import app from './app';
import { connect } from './utils/db';

export const serverStart = async () => {
  try {
    // await connect();
    app.listen(app.get('port'), () => {
      console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
      console.log('  Press CTRL-C to stop\n');
    });
  } catch (error) {
    console.error(error);
  }
};
