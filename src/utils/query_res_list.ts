enum TQueryStatus {
  success = 0,
  querying = 1,
  fail = 2
}

class QueryResNode {
  public prev? : QueryResNode
  public next? : QueryResNode

  public name : string
  public trend : number
  public total_read : number
  public status? : TQueryStatus

  constructor (name : string, trend = -1, total_read = -1) {
    this.name = name
    this.trend = trend
    this.total_read = total_read
  }

  public cmp (other : QueryResNode) : number {
    // compare trend, then total_read, then name
    // if this > other, return > 0
    if (this.trend !== other.trend) {
      return this.trend - other.trend
    }
    if (this.total_read !== other.total_read) {
      return this.total_read - other.total_read
    }
    if (this.name !== other.name) {
      return 0
    }
    return this.name > other.name ? 1 : -1
  }

  public is_success () : boolean {
    return this.status === TQueryStatus.success
  }

  public is_querying () : boolean {
    return this.status === TQueryStatus.querying
  }

  public is_fail () : boolean {
    return this.status === TQueryStatus.fail
  }

  public is_trending () : boolean {
    return this.trend >= 10000
  }
}

export class QueryResList {
  // [success, querying, fail]
  protected __head_ls : Array<QueryResNode | undefined> = [undefined, undefined, undefined]

  public * [Symbol.iterator] () {
    for (const head of this.__head_ls) {
      for (let node = head; node !== undefined; node = node.next) {
        yield node
      }
    }
  }

  public add_querying (name : string) : QueryResNode {
    const node = new QueryResNode(name)
    this.push(node, TQueryStatus.querying)
    return node
  }

  public push (node : QueryResNode, status : TQueryStatus) {
    node.status = status

    const head = this.__head_ls[status]
    if (head === undefined) {
      this.__head_ls[status] = node
      return
    }

    let next : QueryResNode | undefined = head
    let prev : QueryResNode | undefined
    while (next !== undefined && next.cmp(node) > 0) {
      prev = next
      next = next.next
    }

    node.prev = prev
    node.next = next
    if (this.__head_ls[status] === next) {
      this.__head_ls[status] = node
    }
    if (prev !== undefined) {
      prev.next = node
    }
    if (next !== undefined) {
      next.prev = node
    }
  }

  public remove (node : QueryResNode) {
    if (node.status === undefined) {
      throw new Error('node.status is undefined')
    }

    if (node.prev === undefined) {
      this.__head_ls[node.status] = node.next
    } else {
      node.prev.next = node.next
    }

    if (node.next !== undefined) {
      node.next.prev = node.prev
    }

    node.prev = undefined
    node.next = undefined
  }

  public move (node : QueryResNode, status : TQueryStatus) {
    this.remove(node)
    this.push(node, status)
  }

  public move_success (node : QueryResNode) {
    this.move(node, TQueryStatus.success)
  }

  public move_fail (node : QueryResNode) {
    this.move(node, TQueryStatus.fail)
  }

  public move_querying (node : QueryResNode) {
    this.move(node, TQueryStatus.querying)
  }
}
