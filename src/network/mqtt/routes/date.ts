import debug from 'debug'
import { MqttClient } from 'mqtt'

import { listenChangesInDate, updateDate } from 'database'
import { MAIN_TOPIC } from 'utils'
import { socketConnection } from 'network/socket'

const TOPIC = 'date'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const sub = (client: MqttClient) => {
  const subDebug = debug(`${MAIN_TOPIC}:Mqtt:${TOPIC}:sub`)
  const db = global.__firebase__.database(process.env.FIREBASE_REAL_TIME_DB)
  let subscribed = false

  client.subscribe(SUB_TOPIC, error => {
    if (!error) subDebug(`Subscribed to Topic: ${SUB_TOPIC}`)
  })

  client.on('message', (topic, message) => {
    if (topic.includes(TOPIC)) {
      const [id, moduleId, sensorId, , env] = message.toString().split('/')
      const value = new Date().toISOString()

      subDebug(`Topic: ${topic} - Message received: ${message.toString()}`)
      subDebug(
        `Received a ${TOPIC.toUpperCase()} update at: ${new Date().toISOString()}`
      )
      updateDate({
        db,
        id,
        moduleId,
        value,
        sensorId,
        demo: env === 'demo'
      })
      socketConnection(subDebug).connect().emit(`${sensorId}/date`, value)

      if (!subscribed) {
        listenChangesInDate({ db, id, moduleId, sensorId })
        subscribed = true
      }
    }
  })
}

const date: Route = {
  type: 'mqtt',
  sub,
  SUB_TOPIC
}

export { date }
