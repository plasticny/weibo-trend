import { get as http_get } from 'https'
import { TrendingDb } from './db/trending_db'

const db = new TrendingDb()

function weibo_detail_api (q : string) : Promise<{ trend: number, total_read: number } | undefined> {
  return new Promise((resolve) => {
    http_get(`https://m.s.weibo.com/ajax_topic/detail?q=${q}`, (res) => {
      const buffer : Array<Uint8Array> = []

      let do_timeout = false
      const timeout_id = setTimeout(() => {
        do_timeout = true
        resolve(undefined)
      }, 10000)

      res.on('data', (chunk) => {
        buffer.push(chunk)
      })

      res.on('end', () => {
        if (do_timeout) {
          return
        }
        clearTimeout(timeout_id)

        const res = JSON.parse(Buffer.concat(buffer).toString())
        const count = res.data.baseInfo.count
        resolve(count ? {
          trend: count.t_r_num,
          total_read: count.read
        } : undefined)
      })
    }).on('error', (err) => {
      throw err
    })
  })
}

export async function query (name : string) : Promise<TQueryRet> {
  const ret = await weibo_detail_api(name)
  const do_success = ret !== undefined
  if (do_success) {
    db.store_history(name, ret.trend, ret.total_read)
  }
  return {
    name,
    trend: do_success ? ret.trend : -1,
    total_read: do_success ? ret.total_read : -1,
    do_success
  }
}

export function search_history (keyword : string) : Promise<Array<TTrending>> {
  return db.search_history(keyword)
}

export function remove_history (name : string) : Promise<void> {
  return db.remove_history(name)
}
