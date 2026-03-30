import PageNode from './PageNode'
import EventNode from './EventNode'
import ConversionNode from './ConversionNode'
import TrafficSourceNode from './TrafficSourceNode'

export const nodeTypes = {
  page: PageNode,
  event: EventNode,
  conversion: ConversionNode,
  traffic: TrafficSourceNode,
}

export { PageNode, EventNode, ConversionNode, TrafficSourceNode }