import debug from 'debug'
import { MqttClient } from 'mqtt'

import { socketConnection } from 'network/socket'
// eslint-disable-next-line camelcase
import { updateCO2 } from 'database'
import { MAIN_TOPIC } from 'utils'

const TOPIC = 'co2'
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
      updateCO2({ db, moduleId, id, value: floatValue, sensorId })
      socketConnection(subDebug).connect().emit(`${sensorId}/co2`, floatValue)
    }
  })
}

const co2: Route = {
  type: 'mqtt',
  sub,
  SUB_TOPIC
}

export { co2 }
