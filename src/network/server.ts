import debug from 'debug'

import { dbConnection, firebaseConnection } from 'database'
import { MAIN_TOPIC } from 'utils'
import { /* getClient, */ start as startMqtt } from './mqtt'
import { socketConnection } from './socket'

const namespace = `${MAIN_TOPIC}:Mqtt:Server`
const serverDebug = debug(namespace)

const start = async () => {
  await firebaseConnection(serverDebug, async () => {
    startMqtt(serverDebug)
    socketConnection(serverDebug).connect()
    await dbConnection(serverDebug).connect()
  })

  // if (process.env.NODE_ENV !== 'local') {
  //   const jobs = await import('../jobs')

  //   ;(Object.keys(jobs) as (keyof typeof jobs)[]).forEach(job => {
  //     jobs[job](getClient(serverDebug))
  //   })
  // }
}

export { start }
