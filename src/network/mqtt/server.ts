import { connect, type IClientOptions, type MqttClient } from 'mqtt'
import { Debugger } from 'debug'

declare global {
  // eslint-disable-next-line no-var
  var __mqttClient__: MqttClient
}

const options: IClientOptions = {
  port: process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT) : 0,
  host: process.env.MQTT_HOST,
  keepalive: 0,
  protocol: 'mqtts',
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS
}
const connectedMessage = 'Connected to MQTT server.'
const disconnectedMessage = 'Disconnected from MQTT server.'

const getClient = (d?: Debugger) => {
  if (!global.__mqttClient__) {
    global.__mqttClient__ = connect(options)
    global.__mqttClient__.on('connect', () => {
      d?.(connectedMessage)
    })
    global.__mqttClient__.on('disconnect', () => {
      d?.(disconnectedMessage)
    })
    global.__mqttClient__.on('error', error => {
      d?.(`Error: ${error}`)
    })
  }

  return global.__mqttClient__
}

const start = async (d: Debugger) => {
  const { applyRoutes } = await import('./router')

  applyRoutes(getClient(d))
}

const stop = async () => {
  getClient().end()
}

export { start, getClient, stop, connectedMessage, disconnectedMessage }
