import cron from 'node-cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC, waitFor } from 'utils'

const clients = [
  {
    id: '8e234a60-4b52-431a-8c33-98fac1bca3a9',
    moduleId: 1,
    sensorId: 1
  }
]

const randomInInterval = (min: number, max: number, fix = 0): string =>
  (Math.random() * (max - min) + min).toFixed(fix)

type ClientPublishProps<T> = {
  client: MqttClient
  value: T
  id: string
  moduleId: number
  sensorId: number
  topic: string
  cb?: () => void
}

const clientPublish = <T>({
  client,
  value,
  id,
  moduleId,
  sensorId,
  topic,
  cb
}: ClientPublishProps<T>) => {
  client.publish(
    `${MAIN_TOPIC}/${topic}`,
    `${id}/${moduleId}/${sensorId}/${value}`
  )
  cb?.()
}

const updateData = (client: MqttClient) => {
  const pubDebug = debug(`${MAIN_TOPIC}:Mqtt:demo:pub`)

  if (process.env.NODE_ENV === 'production') {
    pubDebug(`This job: "${updateData.name}" is not allowed in production.`)

    return
  }

  cron.schedule('*/10 * * * * *', async (): Promise<void> => {
    pubDebug(`Job started at: ${new Date().toISOString()}`)

    for (const { id, moduleId, sensorId } of clients) {
      const currentIsoTime = new Date().toISOString()

      pubDebug(`Publishing messages at: ${currentIsoTime}`)
      clientPublish({
        client,
        value: randomInInterval(200, 450),
        id,
        moduleId,
        sensorId,
        topic: 'aq',
        cb: () => {
          clientPublish({
            client,
            value: parseFloat(randomInInterval(200, 450)),
            id,
            moduleId,
            sensorId,
            topic: 'h2s',
            cb: () => {
              clientPublish({
                client,
                value: randomInInterval(1, 20),
                id,
                moduleId,
                sensorId,
                topic: 'humidity',
                cb: () => {
                  clientPublish({
                    client,
                    value: randomInInterval(23, 27, 1),
                    id,
                    moduleId,
                    sensorId,
                    topic: 'temperature',
                    cb: () => {
                      clientPublish({
                        client,
                        value: currentIsoTime,
                        id,
                        moduleId,
                        sensorId,
                        topic: 'date'
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
      await waitFor(1000)
    }
  })
}

export { updateData }
