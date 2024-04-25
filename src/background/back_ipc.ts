/*
  Register ipcMain handler
*/
import { ipcMain } from 'electron'

import IpcChannels from '@/utils/ipc_channels'
import * as trending from './trending'

function __reg_handler<channel extends IpcChannels> (
  ch : channel,
  handler : (...params : Parameters<Ipc[channel]>) => Promise<ReturnType<Ipc[channel]>>,
) {
  // args : [...params, id]
  ipcMain.on(ch, async (event, ...args) => {
    const id = args.pop() as number
    const params : Parameters<Ipc[channel]> = args as any
    const data = await handler(...params)
    event.reply(ch, {id, data})
  })
}

export function static_handler () {
  __reg_handler(IpcChannels.query, trending.query)
  __reg_handler(IpcChannels.search_history, trending.search_history)
  __reg_handler(IpcChannels.remove_history, trending.remove_history)
}
