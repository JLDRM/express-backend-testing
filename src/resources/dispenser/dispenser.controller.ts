import { Request, Response } from 'express';
import { isObjectIdOrHexString } from 'mongoose';
import { GetSpendingResponse, PostDispenserBody, PostDispenserResponse, PutDispenserBody } from './dispenser.interface';
import * as dispenserService from './dispenser.service';
import * as dispenserUtils from './dispenser.utils';

const createDispenser = async (
  req: Request<{}, {}, PostDispenserBody>,
  res: Response<PostDispenserResponse | string>,
) => {
  try {
    if (!req?.body?.flowVolume) return res.status(400).json('No flow volume within the body');

    const createdDispenser = await dispenserService.createDispenser(req?.body);

    return res.status(200).json({ id: createdDispenser.id, flowVolume: createdDispenser.flowVolume });
  } catch (error) {
    console.error(error);
    return res.status(500).json('Unexpected API error');
  }
};

const toggleDispenser = async (req: Request<{ id: string }, {}, PutDispenserBody>, res: Response<string>) => {
  try {
    if (!req?.params?.id || !isObjectIdOrHexString(req?.params?.id))
      return res.status(400).json('No correct id within the query');

    if (!req?.body?.status) return res.status(400).json('No correct status within the body');

    const dispenser = await dispenserService.findDispenserById(req?.params?.id);
    if (!dispenser) return res.status(404).json(`The dispenser with id ${req?.params?.id} not found`);

    if (dispenser.status === req.body.status)
      return res.status(400).json(`Dispenser with id: ${dispenser.id} was already ${req.body.status}`);

    await dispenserService.toggleDispenser(dispenser, new Date(), req.body);

    return res.status(200).json('Status of the tap changed correctly');
  } catch (error) {
    console.error(error);
    return res.status(500).json('Unexpected API error');
  }
};

const getDispenserSpending = async (req: Request<{ id: string }>, res: Response<GetSpendingResponse | string>) => {
  try {
    if (!req?.params?.id || !isObjectIdOrHexString(req?.params?.id))
      return res.status(400).json('No correct id within the query');

    const dispenser = await dispenserService.findDispenserById(req?.params?.id);
    if (!dispenser) {
      return res.status(404).json(`The dispenser with id ${req?.params?.id} not found`);
    }

    const result = dispenserUtils.getDispenserSpending(dispenser);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Unexpected API error');
  }
};

export { createDispenser, getDispenserSpending, toggleDispenser };
