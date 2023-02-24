import cron from 'node-cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC, waitFor } from 'utils'

const ping = (client: MqttClient) => {
  const pubDebug = debug(`${MAIN_TOPIC}:Mqtt:ping:pub`)

  pubDebug(`Started job: "${ping.name}".`)
  cron.schedule('*/5 * * * *', async () => {
    const isoTime = new Date().toISOString()

    pubDebug(`Job started at: ${isoTime}`)

    client.publish(`${MAIN_TOPIC}/ping`, 'ping')

    await waitFor(1000)

    pubDebug(`Job finished at: ${new Date().toISOString()}`)
  })
}

export { ping }
