<template>
  <div id="query_comp">
    <form action="javascript:void(0);" id="query_header">
      <input type="text" ref="query_input">
      <button type="submit" id="btn_query" @click="api.btn_query_clicked">Query</button>
      <button @click="api.copy" id="btn_copy">Copy</button>
    </form>

    <div v-for="node of query_res_ls" :key="node.name"
      class="query_res" :class="{'copy': copy_set.has(node.name)}"
    >
      <font-awesome-icon icon="trash" class="click_icon trash_btn" @click="() => { api.remove(node) }"/>
      <font-awesome-icon icon="copy" class="click_icon copy_btn" @click="() => { instance.refs.copy_dg.show([node.name]) }"/>

      <font-awesome-icon icon="fa-regular fa-square" class="click_icon" v-show="!copy_set.has(node.name)" @click="() => { copy_set.add(node.name) }"/>
      <font-awesome-icon icon="fa-regular fa-square-check" class="click_icon" v-show="copy_set.has(node.name)" @click="() => { copy_set.delete(node.name) }"/>

      <div class="name">{{node.name}}</div>
      <div class="trend" v-show="node.is_success()">{{node.trend ? node.trend : ''}}</div>

      <font-awesome-icon icon="arrow-up" v-show="node.is_trending()"/>
      <font-awesome-icon icon="spinner" class="click_icon" id="icon_loading" v-show="node.is_querying()"/>
      <font-awesome-icon icon="exclamation" class="click_icon" v-show="node.is_fail()" @click="api.query(node.name)"/>
    </div>

    <CopyDialog ref="copy_dg"/>
  </div>
</template>

<script setup lang="ts">
import CopyDialog from '@/components/CopyDialog.vue'

import { getCurrentInstance, reactive } from 'vue'
import IpcChannels from '@/utils/ipc_channels'
import { call_ipc } from '@/service/front_ipc'
import { QueryResList } from '@/utils/query_res_list'
import t2s from '@/service/t2s'
import { EventBusType, event_bus_on } from '@/service/comm_service'

const instance: VueRefs<{
  query_input: HTMLInputElement,
  copy_dg: InstanceType<typeof CopyDialog>
}> = getCurrentInstance()! as any

const query_res_ls = reactive(new QueryResList())
const copy_set = reactive(new Set<string>())
const query_node_map = new Map<string, QueryResNode>()

class ComponentApi {
  public btn_query_clicked () {
    api.query(instance.refs.query_input.value)
    instance.refs.query_input.value = ''
  }

  public async query (s : string) {
    const name = t2s(s)

    let node : QueryResNode
    if (query_node_map.has(name)) {
      node = query_node_map.get(name)!
      query_res_ls.move_querying(node)
    } else {
      node = query_res_ls.add_querying(name)
      query_node_map.set(name, node)
    }

    const res = await call_ipc(IpcChannels.query, name)

    node.trend = res.trend
    node.total_read = res.total_read

    if (res.do_success) {
      query_res_ls.move_success(node)
    } else {
      query_res_ls.move_fail(node)
    }

    if (node.is_trending()) {
      copy_set.add(node.name)
    }
  }

  public copy () {
    const copy_ls : Array<string> = []
    for (const node of query_res_ls) {
      if (copy_set.has(node.name)) {
        copy_ls.push(node.name)
      }
    }
    instance.refs.copy_dg.show(copy_ls)
  }

  public remove (node : QueryResNode) {
    query_res_ls.remove(node)
    query_node_map.delete(node.name)
  }
}
const api = new ComponentApi()

event_bus_on(EventBusType.query, data => { api.query(data.name) })
</script>

<style lang="scss">
#query_comp {
  #query_header {
    display: flex;

    > * {
      margin-right: 10px;
    }

    #btn_query, #btn_copy {
      background-color: #94b9da;
      border-color: #798ec5;
      padding: 8px 15px;
    }
  }

  .query_res {
    display: flex;
    align-items: center;
    margin-top: 10px;
    user-select: none;

    &:not(.copy) {
      opacity: 0.5;
    }

    > * {
      margin-right: 5px;
    }

    .name {
      min-width: 30%;
      font-size: 15px;
    }

    #icon_loading {
      animation-name: rotate360;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-delay: 0s;
    }
  }
}
</style>
