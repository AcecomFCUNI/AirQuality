import cron from 'node-cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC } from 'utils'

const DEMO_CLIENT = {
  id: 'FqCd9KAK16YDMolRQ1O4HHqHXS43',
  moduleId: 2,
  sensorId: 1
}

const randomInInterval = (min: number, max: number, fix = 0): string =>
  (Math.random() * (max - min) + min).toFixed(fix)

type ClientPublishProps<T> = {
  client: MqttClient
  value: T
  id: string
  moduleId: number
  sensorId: number
  topic: string
  demo?: boolean
  cb?: () => void
}

const clientPublish = <T>({
  client,
  value,
  id,
  moduleId,
  sensorId,
  topic,
  demo = false,
  cb
}: ClientPublishProps<T>) => {
  client.publish(
    `${MAIN_TOPIC}/${topic}`,
    `${id}/${moduleId}/${sensorId}/${value}${demo ? '/demo' : ''}`
  )
  cb?.()
}

const updateData = (client: MqttClient) => {
  const pubDebug = debug(`${MAIN_TOPIC}:Mqtt:demo:pub`)

  if (process.env.NODE_ENV === 'production') {
    pubDebug(`This job: "${updateData.name}" is not allowed in production.`)

    return
  }

  cron.schedule('*/30 * * * * *', async (): Promise<void> => {
    pubDebug(`Job started at: ${new Date().toISOString()}`)

    const { id, moduleId, sensorId } = DEMO_CLIENT
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
          value: parseFloat(randomInInterval(500, 800)),
          id,
          moduleId,
          sensorId,
          topic: 'co2',
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
                  value: randomInInterval(40, 70),
                  id,
                  moduleId,
                  sensorId,
                  topic: 'pm2.5',
                  cb: () => {
                    clientPublish({
                      client,
                      value: 998,
                      id,
                      moduleId,
                      sensorId,
                      topic: 'pressure',
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
                              topic: 'date',
                              demo: true
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
}

export { updateData }
