import IpcChannels from '@/utils/ipc_channels'

declare global {
  interface Window {
    ipc: {
      send: (channel: string, ...args: any[]) => void
      on: (channel: string, listener: (...args: any[]) => void) => void
    }
  }
}

type IpcListener<channel extends IpcChannels> = (data : ReturnType<Ipc[channel]>) => void

const listener_map : Map<IpcChannels, Map<number, IpcListener<IpcChannels>>> = new Map()
Object.values(IpcChannels).forEach(ch => {
  listener_map.set(ch, new Map())
  window.ipc.on(ch, (ret : TIpcMainRet<IpcChannels>) => {
    handle_recevie(ch, ret)
  })
})

function handle_recevie<channel extends IpcChannels> (
  ch: channel, ret : TIpcMainRet<IpcChannels>
) {
  console.log('receive', ret)

  const ch_listeners = listener_map.get(ch)!
  const listener = ch_listeners.get(ret.id)
  if (!listener) {
    throw new Error(`no listener for ${ch} with id ${ret.id}`)
  }
  listener(ret.data)
  ch_listeners.delete(ret.id)
}

export function call_ipc<channel extends IpcChannels> (
  ch: channel, ...params : Parameters<Ipc[channel]>
) : Promise<ReturnType<Ipc[channel]>> {
  return new Promise(resolve => {
    const id = Date.now()
    console.log('send', { id, ch, params })

    const listener : IpcListener<channel> = data => resolve(data)
    listener_map.get(ch)!.set(id, listener)
    window.ipc.send(ch, ...params, id)
  })
}
