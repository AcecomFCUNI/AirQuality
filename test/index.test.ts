import mqtt from 'mqtt'
import debug from 'debug'

import * as mqttServer from '../src/network/mqtt'
import * as router from '../src/network/mqtt/router'
import { MAIN_TOPIC } from '../src/utils'

beforeAll(async () => {
  await mqttServer.start(debug(`Testing:${MAIN_TOPIC}:Mqtt:Server`))
})

afterAll(async () => {
  await mqttServer.stop()
})

const mockDebug = jest.fn()

jest.mock('mqtt', () => {
  return {
    connect: jest.fn(() => {
      return {
        on: jest.fn().mockImplementation(() => {
          mockDebug(mqttServer.connectedMessage)
        }),
        end: jest.fn(),
        subscribe: jest.fn()
      }
    })
  }
})

jest.mock('debug', () => {
  return jest.fn()
})

const applyRoutes = jest.spyOn(router, 'applyRoutes')

describe(`${MAIN_TOPIC} backend tests`, () => {
  describe('Server', () => {
    test('Client connect should be called once', async () => {
      expect(mqtt.connect).toHaveBeenCalled()
    })

    // test(`Client debug should be called with "${mqttServer.namespace}"`, async () => {
    //   expect(debug).toHaveBeenCalled()
    //   expect(debug).toHaveBeenCalledWith(mqttServer.namespace)
    // })

    test(`Client serverDebug should be called with "${mqttServer.connectedMessage}"`, async () => {
      expect(mockDebug).toHaveBeenCalled()
      expect(mockDebug).toHaveBeenCalledWith(mqttServer.connectedMessage)
    })

    test('applyRoutes method should be called once', () => {
      expect(applyRoutes).toHaveBeenCalledTimes(1)
    })
  })
})
