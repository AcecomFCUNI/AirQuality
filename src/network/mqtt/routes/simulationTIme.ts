import debug from 'debug'
import { FastifyInstance } from 'fastify'
import { MAIN_TOPIC } from 'utils'

const TOPIC = 'simulationTIme'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const updateSimulationTime = (app: FastifyInstance) => {
  const simDebug = debug('simulation:time:update')

  app.post<{ Params: { time: number } }>(
    '/simulationTime/:time',
    async (req, reply) => {
      const {
        headers: { authorization },
        params: { time }
      } = req

      if (authorization !== process.env.API_KEY)
        return reply.status(401).send({ message: 'Unauthorized' })

      if (isNaN(Number(time)))
        return reply.status(400).send({ message: 'Time is not a number' })

      global.__SIMULATION_TIME__ = time * 1000
      simDebug(
        `Updated simulation time: ${new Date(
          global.__SIMULATION_TIME__
        ).toISOString()}`
      )

      return { message: 'Simulation time updated', newTime: `${time}s` }
    }
  )
}

const simulationTime: Route = {
  type: 'http',
  init: updateSimulationTime,
  SUB_TOPIC
}

export { simulationTime }
