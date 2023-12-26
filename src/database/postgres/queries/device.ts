import { Device } from '@prisma/client'

import { dbConnection } from '../connection'

const updateDevices = async (devices: Device[]) => {
  const client = await dbConnection().connect()

  for await (const device of devices) {
    const { id, ...data } = device

    await client.device.update({
      where: { id },
      data
    })
  }
}

export { updateDevices }
