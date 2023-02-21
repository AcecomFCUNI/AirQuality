interface Route {
  sub: (client: import('mqtt').MqttClient) => void
  SUB_TOPIC: string
}
