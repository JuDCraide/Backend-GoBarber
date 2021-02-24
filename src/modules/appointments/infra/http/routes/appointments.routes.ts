import { Router } from 'express';

import AppointmentController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProvidersAppointmentsController from '@modules/appointments/infra/http/controllers/ProvidersAppointmentsController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentController = new AppointmentController();
const providersAppointmentsController = new ProvidersAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentController.create);

appointmentsRouter.get('/me', providersAppointmentsController.index);

export default appointmentsRouter;
