import { sqlite } from '../sqlite'

export class TrendingDb {
  public async store_history (name : string, trend : number, total_read : number) {
    const row = await sqlite.all<TTrending>(`
      select name from Trending where name = ?;
    `, [ name ])

    if (row.length === 0) {
      return sqlite.run(`
        insert into Trending (name, trend, total_read) values (?, ?, ?);
      `, [ name, trend, total_read ])
    }
    else {
      return sqlite.run(`
        update Trending set trend = ?, total_read = ? where name = ?;
      `, [ trend, total_read, name ])
    }
  }

  public remove_history (name : string) {
    return sqlite.run(`
      delete from Trending where name = ?;
    `, [ name ])
  }

  public search_history (keyword : string) {
    return sqlite.all<TTrending>(`
      select name, trend, total_read
      from Trending
      where name like ?
      order by trend desc, total_read desc, name asc;
    `, [ `%${keyword}%` ])
  }
}
export const trending_db = new TrendingDb()
