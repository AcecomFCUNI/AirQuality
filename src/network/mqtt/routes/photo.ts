import debug from 'debug'
import { MqttClient } from 'mqtt'
import { z } from 'zod'

import { socketConnection } from 'network/socket'
import { MAIN_TOPIC } from 'utils'

import { writeFile } from 'fs/promises'

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

      if (!messageString) return

      const messageJson = JSON.parse(messageString)
      const messageValidation = messageSchema.safeParse(messageJson)

      if (!messageValidation.success) {
        subDebug(`Message validation failed: ${messageValidation.error}`)

        return
      }

      const { data } = messageValidation

      if (process.env.NODE_ENV === 'local') {
        const base64 = data.base64.split(';base64,').pop()

        if (!base64) return

        const buffer = Buffer.from(base64, 'base64')
        // save the base64 as a file
        writeFile(`./${data.meta.timestamp}.jpeg`, buffer).then(() => {
          subDebug('File saved')
        })
      }

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
