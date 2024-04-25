interface TTrending {
  name : string,
  trend : number,
  total_read : number
}

interface TQueryRet extends TTrending {
  do_success : boolean
}

declare class QueryResNode {
  declare prev? : QueryResNode
  declare next? : QueryResNode

  declare name : string
  declare trend : number
  declare total_read : number
  declare status? : TQueryStatus

  constructor (name : string, trend : number, total_read : number)

  declare cmp (other : QueryResNode) : number
  declare is_success () : boolean
  declare is_querying () : boolean
  declare is_fail () : boolean
  declare is_trending () : boolean
}

declare interface VueRefs<refs_el> {
  refs: refs_el
}
