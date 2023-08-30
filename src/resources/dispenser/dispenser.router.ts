import { Router } from 'express';
import * as dispenserController from './dispenser.controller';

const getDispenserRoutes = () => {
  const router = Router();

  router.post('/', dispenserController.createDispenser);
  router.put('/:id/status', dispenserController.toggleDispenser);
  router.get('/:id/spending', dispenserController.getDispenserSpending);

  return router;
};

export default getDispenserRoutes;
