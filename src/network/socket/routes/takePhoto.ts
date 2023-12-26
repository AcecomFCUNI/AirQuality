import { Socket } from 'socket.io'
import debug from 'debug'

import { MAIN_TOPIC } from 'utils'

const realTimeDebug = debug(`${MAIN_TOPIC}:WebSockets:takePhoto`)

const takePhoto = (sensorData: SensorData, socket: Socket) => {
  const { id, moduleId, sensorId } = sensorData

  realTimeDebug(`Creating route: "${sensorId}/takePhoto"`)

  socket.on(`${sensorId}/takePhoto`, () => {
    realTimeDebug(`Taking photo for: ${id}/${moduleId}/${sensorId}`)

    global.__mqttClient__.publish(
      `${MAIN_TOPIC}/takePhoto`,
      `${id}/${moduleId}/${sensorId}`
    )
  })
}

export { takePhoto }
