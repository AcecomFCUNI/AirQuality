import { Server } from 'socket.io'

const takePhoto = ({ sensorId }: SensorData, io: Server) => {
  io.on(`${sensorId}/takePhoto`, () => {
    global.__mqttClient__.publish('takePhoto', sensorId)
  })
}

export { takePhoto }
