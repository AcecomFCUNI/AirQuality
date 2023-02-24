import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC } from 'utils'

const TOPIC = 'ping'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const sub = (client: MqttClient) => {
  const subDebug = debug(`${MAIN_TOPIC}:Mqtt:${TOPIC}:sub`)

  client.subscribe(SUB_TOPIC, error => {
    if (!error) subDebug(`Subscribed to Topic: ${SUB_TOPIC}`)
  })

  client.on('message', topic => {
    if (topic.includes(TOPIC)) subDebug(`Topic: ${topic} - Message received`)
  })
}

const ping: Route = {
  sub,
  SUB_TOPIC
}

export { ping }
