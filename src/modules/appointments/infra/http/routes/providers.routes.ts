import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const providersRouter = Router();
const appointmentController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', appointmentController.index);

providersRouter.get('/:id/month-availability', celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
}), providerMonthAvailabilityController.index);

providersRouter.get('/:id/day-availability', celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
}), providerDayAvailabilityController.index);

export default providersRouter;
