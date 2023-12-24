import { Server } from 'socket.io'

const takePhoto = (sensorData: SensorData, io: Server) => {
  const { id, moduleId, sensorId } = sensorData

  io.on(`${sensorId}/takePhoto`, () => {
    global.__mqttClient__.publish('takePhoto', `${id}/${moduleId}/${sensorId}`)
  })
}

export { takePhoto }
