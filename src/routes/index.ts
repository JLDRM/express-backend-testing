import { Router } from 'express';
import getDispenserRoutes from '../resources/dispenser/dispenser.router';

export const getAppRoutes = () => {
  const router = Router();
  router.use('/dispenser', getDispenserRoutes());

  return router;
};
