import debug from 'debug'
import { MqttClient } from 'mqtt'

import { updateHumidity } from 'database'
import { MAIN_TOPIC } from 'utils'
import { socketConnection } from 'network/socket'

const TOPIC = 'humidity'
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
      updateHumidity({ db, moduleId, id, value: floatValue, sensorId })
      socketConnection(subDebug)
        .connect()
        .emit(`${sensorId}/humidity`, floatValue)
    }
  })
}

const humidity: Route = {
  sub,
  SUB_TOPIC
}

export { humidity }
