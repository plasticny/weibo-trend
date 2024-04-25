import { sqlite } from '../sqlite'

export default class {
  public async run () : Promise<void> {
    await sqlite.run(`
      create table if not exists Trending (
        id          integer     not null    primary key     autoincrement,
        name        text,
        trend       integer,
        total_read  integer
      );
    `)
  }
}
