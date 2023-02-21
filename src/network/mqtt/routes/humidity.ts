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

      subDebug(`\nTopic: ${topic} - Message received`)
      subDebug(`Received a ${TOPIC} update at: ${new Date().toISOString()}`)
      subDebug(`Message: \t${message}\n`)
      updateHumidity({ db, moduleId, id, value: parseFloat(value), sensorId })
      socketConnection(subDebug)
        .connect()
        .emit(`${sensorId}/tds`, parseFloat(value))
    }
  })
}

const tds: Route = {
  sub,
  SUB_TOPIC
}

export { tds }
