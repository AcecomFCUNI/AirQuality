import cron from 'node-cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC } from 'utils'

const clients = [
  {
    id: '8e234a60-4b52-431a-8c33-98fac1bca3a9',
    moduleId: 1,
    sensorId: 1
  },
  {
    id: 'ad532c60-00aa-4cea-af45-30c0af1a87e8',
    moduleId: 2,
    sensorId: 2
  }
]

const randomInInterval = (min: number, max: number, fix = 2): string =>
  (Math.random() * (max - min) + min).toFixed(fix)

const updateData = (client: MqttClient) => {
  let errorRegistered = false

  cron.schedule('00 */5 * * * *', async (): Promise<void> => {
    const pubDebug = debug(`${MAIN_TOPIC}:Mqtt:demo:pub`)

    pubDebug(`Job started at: ${new Date().toISOString()}`)

    if (!errorRegistered) {
      client.on('error', error => {
        pubDebug('Error: ', error)
      })
      errorRegistered = true
    }

    clients.forEach(({ id, moduleId, sensorId }) => {
      client.publish(
        `${MAIN_TOPIC}/pH`,
        `${id}/${moduleId}/${sensorId}/${randomInInterval(6.5, 7.5, 1)}`,
        () => {
          client.publish(
            `${MAIN_TOPIC}/tds`,
            `${id}/${moduleId}/${sensorId}/${randomInInterval(100, 200, 0)}`,
            () => {
              client.publish(
                `${MAIN_TOPIC}/temperature`,
                `${id}/${moduleId}/${sensorId}/${randomInInterval(22, 25, 1)}`,
                () => {
                  client.publish(
                    `${MAIN_TOPIC}/turbidity`,
                    `${id}/${moduleId}/${sensorId}/${randomInInterval(
                      10,
                      30,
                      0
                    )}`
                  )
                }
              )
            }
          )
        }
      )
    })
  })
}

export { updateData }
