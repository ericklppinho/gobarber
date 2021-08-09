import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticatedMiddleware';
import UsersAppointmentsController from '@modules/appointments/infra/http/controllers/UsersAppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const usersAppointmentsController = new UsersAppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  usersAppointmentsController.create,
);

appointmentsRouter.get(
  '/me',
  celebrate({
    [Segments.BODY]: {
      day: Joi.number().integer().min(1).max(31).required(),
      month: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number().integer().required(),
    },
  }),
  providerAppointmentsController.index,
);

export default appointmentsRouter;
