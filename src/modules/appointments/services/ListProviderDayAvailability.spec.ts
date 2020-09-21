import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderDayAvailability from './ListProviderDayAvailability'

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailability;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        listProviderDayAvailability = new ListProviderDayAvailability(
            fakeAppointmentsRepository
        )
    })

    it('should be able to list the day availability from providers', async () => {

        await fakeAppointmentsRepository.create({
            provider_id: 'some_id',
            user_id: 'some_user',
            date: new Date(2020, 4, 20, 14, 0, 0),
        })

        await fakeAppointmentsRepository.create({
            provider_id: 'some_id',
            user_id: 'some_user',
            date: new Date(2020, 4, 20, 15, 0, 0),
        })

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 20, 11).getTime()
        })

        const availability = await listProviderDayAvailability.execute({
            provider_id: 'some_id',
            year: 2020,
            month: 5,
            day: 20,
        })

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 13, available: true },
                { hour: 14, available: false },
                { hour: 15, available: false },
                { hour: 16, available: true },
            ]),
        );
    });
});


