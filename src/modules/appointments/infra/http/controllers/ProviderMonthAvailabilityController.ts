import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailability from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.params.id;
    const { month, year } = req.query;

    const listProvidersMonthAvailability = container.resolve(ListProviderMonthAvailability);

    const appointment = await listProvidersMonthAvailability.run({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return res.json(appointment);
  }
}
