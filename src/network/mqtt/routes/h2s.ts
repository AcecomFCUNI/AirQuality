import debug from 'debug'
import { MqttClient } from 'mqtt'

import { updateH2S } from 'database'
import { MAIN_TOPIC } from 'utils'
import { socketConnection } from 'network/socket'

const TOPIC = 'h2s'
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

      subDebug(`\nTopic: ${topic} - Message received`)
      subDebug(`Received a ${TOPIC} update at: ${new Date().toISOString()}`)
      subDebug(`Message: \t${message}\n`)
      updateH2S({
        db,
        id,
        moduleId,
        value: parseFloat(value),
        sensorId
      })
      socketConnection(subDebug)
        .connect()
        .emit(`${sensorId}/temperature`, parseFloat(value))
    }
  })
}

const temperature: Route = {
  sub,
  SUB_TOPIC
}

export { temperature }
