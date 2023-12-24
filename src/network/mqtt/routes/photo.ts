import debug from 'debug'
import { MqttClient } from 'mqtt'
import { z } from 'zod'

import { socketConnection } from 'network/socket'
import { MAIN_TOPIC } from 'utils'

const TOPIC = 'receivePhoto'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const messageSchema = z.object({
  base64: z.string(),
  meta: z.object({
    sensorId: z.string(),
    timestamp: z.string(),
    gps: z.object({ lat: z.number(), lng: z.number() })
  })
})

const sub = (client: MqttClient) => {
  const subDebug = debug(`${MAIN_TOPIC}:Mqtt:${TOPIC}:sub`)

  client.subscribe(SUB_TOPIC, error => {
    if (!error) subDebug(`Subscribed to Topic: ${SUB_TOPIC}`)
  })

  client.on('message', (topic, message) => {
    if (topic.includes(TOPIC)) {
      const messageString = message.toString()
      subDebug(`Topic: ${topic} - Message received: ${message.toString()}`)

      const messageJson = JSON.parse(messageString)
      const messageValidation = messageSchema.safeParse(messageJson)

      if (!messageValidation.success) {
        subDebug(`Message validation failed: ${messageValidation.error}`)

        return
      }

      const { data } = messageValidation
      const {
        meta: { sensorId }
      } = data
      socketConnection(subDebug)
        .connect()
        .emit(`${sensorId}/receivePhoto`, data)
    }
  })
}

const receivePhoto: Route = {
  sub,
  SUB_TOPIC
}

export { receivePhoto }
