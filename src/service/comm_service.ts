/*
  provide service for components to communicate with each other
*/
import mitt from 'mitt'

/* event bus */
export enum EventBusType {
  query = 'query'
}
type EventBusData = {
  query: { name : string }
}

const event_bus = mitt<EventBusData>()
export function event_bus_on (event: EventBusType, handler: (params : EventBusData[EventBusType]) => void) {
  event_bus.on(event, handler)
}
export function event_bus_emit (event: EventBusType, params : EventBusData[EventBusType]) {
  event_bus.emit(event, params)
}
