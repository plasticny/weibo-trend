type TIpcMainRet<channel extends IpcChannels> = {
  id: number,
  data: ReturnType<Ipc[channel]>
}

type Ipc = {
  query: (name : string) => TQueryRet
  search_history: (keyword : string) => Array<TTrending>
  remove_history: (name : string) => void
}
