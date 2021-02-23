import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailability from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.params.id;
    const { day, month, year } = req.body;

    const listProviderDayAvailability = container.resolve(ListProviderDayAvailability);

    const appointment = await listProviderDayAvailability.run({
      provider_id, day, month, year,
    });

    return res.json(appointment);
  }
}
