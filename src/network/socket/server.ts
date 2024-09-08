import { getData } from 'database'
import { Debugger } from 'debug'
import { Server } from 'socket.io'

import * as routes from './routes'

const PORT = parseInt(process.env.PORT as string) || 1996
const ORIGIN = ['http://localhost:3000'].concat(
  process.env.FRONT_URLS?.split(',') ?? []
)

const socketConnection = (d: Debugger) => ({
  connect: () => {
    if (!global.__io__) {
      let id: string
      let moduleId: string
      let sensorId: string

      global.__io__ = new Server(PORT, {
        allowRequest(req, fn) {
          const url = new URL(req?.url ?? '', `http://${req?.headers.host}`)
          const search = url.search.substring(1)
          const query = JSON.parse(
            '{"' +
              decodeURI(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
              '"}'
          ) as { id: string; moduleId: string; sensorId: string }

          id = query.id
          moduleId = query.moduleId
          sensorId = query.sensorId

          fn(null, true)
        },
        cors: {
          origin: ORIGIN
        }
      })

      global.__io__.on('connection', async socket => {
        const db = global.__firebase__.database(
          process.env.FIREBASE_REAL_TIME_DB
        )
        const data = await getData({ db, id, moduleId, sensorId })

        socket.emit(`${sensorId}/initialData`, data)
        ;(Object.keys(routes) as (keyof typeof routes)[]).forEach(route => {
          d(`Applying route: ${route} for ${id}/${moduleId}/${sensorId}`)
          routes[route]({ id, moduleId, sensorId }, socket)
        })
      })

      d(`Socket server started on port: ${PORT}.`)
      d(`Origins allowed: ${ORIGIN}`)
    }

    return global.__io__
  },
  disconnect: () => {
    if (global.__io__) global.__io__.disconnectSockets(true)
  }
})

export { socketConnection }
