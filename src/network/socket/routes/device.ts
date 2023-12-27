import { Socket } from 'socket.io'
import debug from 'debug'
import { Device } from '@prisma/client'

import { MAIN_TOPIC } from 'utils'
import { updateDevices as ud } from 'database'

const realTimeDebug = debug(`${MAIN_TOPIC}:WebSockets:updateDevices`)

const updateDevices = (sensorData: SensorData, socket: Socket) => {
  const { id: clientId, sensorId } = sensorData

  realTimeDebug(`Creating route: "${sensorId}/updateDevices"`)

  socket.on(`${sensorId}/updateDevices`, (message: Device[]) => {
    ud(message)
      .then(() => {
        message.forEach(({ id, status }) => {
          __mqttClient__.publish(
            `${MAIN_TOPIC}/toggleDevice`,
            `${clientId}/${sensorId}/${id}/${status}`
          )
        })
        socket.emit(`${sensorId}/updatedDevices`, true)
      })
      .catch(error => {
        socket.emit(`${sensorId}/updatedDevices`, false)
        realTimeDebug('Error updating devices')
        realTimeDebug(error)
      })
  })
}

export { updateDevices }
