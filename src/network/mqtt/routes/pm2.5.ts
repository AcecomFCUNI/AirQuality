import debug from 'debug'
import { MqttClient } from 'mqtt'

import { socketConnection } from 'network/socket'
// eslint-disable-next-line camelcase
import { updatePm2_5 } from 'database'
import { MAIN_TOPIC } from 'utils'

const TOPIC = 'pm2.5'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const sub = (client: MqttClient) => {
  const subDebug = debug(`${MAIN_TOPIC}:Mqtt:${TOPIC}:sub`)
  const db = global.__firebase__.database(process.env.FIREBASE_REAL_TIME_DB)

  client.subscribe(SUB_TOPIC, error => {
    if (!error) subDebug(`Subscribed to Topic: ${SUB_TOPIC}`)
  })

  client.on('message', (topic, message) => {
    if (topic.includes(TOPIC)) {
      const [id, moduleId, sensorId, value] = message.toString().split('/')
      const floatValue = parseFloat(value)

      if (floatValue === 0) return

      subDebug(`Topic: ${topic} - Message received: ${message.toString()}`)
      subDebug(
        `Received a ${TOPIC.toUpperCase()} update at: ${new Date().toISOString()}`
      )
      updatePm2_5({ db, moduleId, id, value: floatValue, sensorId })
      socketConnection(subDebug).connect().emit(`${sensorId}/pm2.5`, floatValue)
    }
  })
}

// eslint-disable-next-line camelcase
const pm2_5: Route = {
  sub,
  SUB_TOPIC
}

// eslint-disable-next-line camelcase
export { pm2_5 }
