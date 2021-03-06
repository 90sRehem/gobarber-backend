import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository()
        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123'
        })
        expect(appointment).toHaveProperty('id')
        expect(appointment.provider_id).toBe('123')
    });

    it('should not be able to create two apppointments on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository()
        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)

        const appointmentDate = new Date(2020, 8, 9, 18)
        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123'
        })

       await expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '123'
        })).rejects.toBeInstanceOf(AppError)
    })
})