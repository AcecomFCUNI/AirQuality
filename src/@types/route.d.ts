interface Route {
  type: 'mqtt' | 'http'
  sub?: (client: import('mqtt').MqttClient) => void
  init?: (app: FastifyInstance) => void
  SUB_TOPIC: string
}
