import { MqttClient } from 'mqtt'
import { FastifyInstance } from 'fastify'
import * as Routes from './routes'

const applyRoutes = (client: MqttClient, app: FastifyInstance) => {
  ;(Object.keys(Routes) as (keyof typeof Routes)[]).forEach(routeKey => {
    const route = Routes[routeKey] as Route

    if (route.type === 'mqtt' && route.sub) route.sub(client)
    else if (route.type === 'http' && route.init) route.init(app)
  })
}

export { applyRoutes }
