import debug from 'debug'

import { MAIN_TOPIC } from 'utils'
import { getClient } from './network/mqtt'

const pubDebug = debug(`${MAIN_TOPIC}:Mqtt:demo:pub`)
const client = getClient()

client.on('error', error => {
  pubDebug('Error: ', error)
})

client.publish(`${MAIN_TOPIC}/electricConductivity`, 'wea', () => {
  pubDebug('Message send')
})
