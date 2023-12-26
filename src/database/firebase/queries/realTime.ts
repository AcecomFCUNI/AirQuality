import { Database } from 'firebase-admin/lib/database/database.js'
import { z } from 'zod'
import debug from 'debug'

import { saveClientData } from 'database'
import { MAIN_TOPIC } from 'utils'

const realTimeDebug = debug(`${MAIN_TOPIC}:Mqtt:FirebaseRealTime`)
const clientData = z.object({
  date: z.string(),
  aq: z.number(),
  co2: z.number(),
  humidity: z.number(),
  pm2_5: z.number(),
  pressure: z.number(),
  temperature: z.number(),
  demo: z.boolean().optional().default(false)
})

declare global {
  type ClientData = z.infer<typeof clientData>
}

type Update<T = number> = {
  db: Database
  id: string
  moduleId: string
  sensorId: string
  value: T
  demo?: boolean
}

const getData = async ({
  db,
  id,
  moduleId,
  sensorId
}: Omit<Update, 'value'>) => {
  const result = await db
    .ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}`)
    .get()

  try {
    const value = clientData.parse(result.val())

    return value
  } catch (error) {
    realTimeDebug(
      `getData - Error validation for: ${JSON.stringify({
        id,
        moduleId,
        sensorId
      })}. Error: ${error}`
    )

    return null
  }
}

const updateDate = ({
  db,
  id,
  moduleId,
  sensorId,
  value,
  demo = false
}: Update<string>) => {
  if (demo)
    db.ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}/demo`).set(
      true,
      error => {
        if (error) realTimeDebug(`Error: ${error}`)
      }
    )

  db.ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}/date`).set(
    value,
    error => {
      if (error) realTimeDebug(`Error: ${error}`)
      else realTimeDebug('Date updated.')
    }
  )
}

const updateAQ = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}/aq`).set(
    value,
    error => {
      if (error) realTimeDebug(`Error: ${error}`)
      else realTimeDebug('AQ updated.')
    }
  )
}

const updateCO2 = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}/co2`).set(
    value,
    error => {
      if (error) realTimeDebug(`Error: ${error}`)
      else realTimeDebug('CO2 updated.')
    }
  )
}

const updateHumidity = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}/humidity`).set(
    value,
    error => {
      if (error) realTimeDebug(`Error: ${error}`)
      else realTimeDebug('Humidity updated.')
    }
  )
}

// eslint-disable-next-line camelcase
const updatePm2_5 = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}/pm2_5`).set(
    value,
    error => {
      if (error) realTimeDebug(`Error: ${error}`)
      else realTimeDebug('Pm2.5 updated.')
    }
  )
}

const updatePressure = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}/pressure`).set(
    value,
    error => {
      if (error) realTimeDebug(`Error: ${error}`)
      else realTimeDebug('Pressure updated.')
    }
  )
}

const updateTemperature = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}/temperature`).set(
    value,
    error => {
      if (error) realTimeDebug(`Error: ${error}`)
      else realTimeDebug('Temperature updated.')
    }
  )
}

const listenChangesInDate = ({
  db,
  id,
  moduleId,
  sensorId
}: Omit<Update, 'value'>) => {
  db.ref(`/${MAIN_TOPIC}/${id}/${moduleId}/${sensorId}/date`).on(
    'value',
    async () => {
      const data = await getData({ db, id, moduleId, sensorId })

      if (data && !data.demo) {
        try {
          await saveClientData(z.coerce.number().parse(sensorId), data)
        } catch (error) {
          realTimeDebug(`Error: ${error}`)
        }

        return
      }

      if (data?.demo) {
        realTimeDebug(
          `The data for the sensor ${sensorId} was not saved because it is a demo.`
        )

        return
      }

      realTimeDebug(
        `Error: The data for the sensor ${sensorId} was not found in the database.`
      )
    }
  )
}

export {
  getData,
  updateAQ,
  updateCO2,
  updateHumidity,
  // eslint-disable-next-line camelcase
  updatePm2_5,
  updatePressure,
  updateTemperature,
  updateDate,
  listenChangesInDate
}
