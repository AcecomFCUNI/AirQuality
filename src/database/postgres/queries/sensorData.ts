import { dbConnection } from '../connection'

const saveClientData = async (sensorId: number, clientData: ClientData) => {
  const client = await dbConnection().connect()
  const { date: createdAt, demo: _, ...data } = clientData

  await client.sensorData.create({
    data: {
      ...data,
      createdAt: new Date(createdAt),
      sensorId
    }
  })
}

export { saveClientData }
