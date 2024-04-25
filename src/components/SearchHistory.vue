<template>
  <div id="history_comp">
    <form action="javascript:void(0);">
      <input type="text" id="search_field" ref="search_field">
      <button type="submit" @click="api.search"></button>
    </form>

    <div v-for="trending of history" :key="trending.name" class="search_record">
      <div class="trend">{{trending.name}}</div>
      <font-awesome-icon icon="plus" class="click_icon" @click="() => { api.query(trending) }"/>
      <font-awesome-icon icon="times" class="click_icon" @click="() => { api.remove(trending.name) }"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { event_bus_emit, EventBusType } from '@/service/comm_service'
import { call_ipc } from '@/service/front_ipc'
import IpcChannels from '@/utils/ipc_channels'
import { getCurrentInstance, Ref, ref } from 'vue'

const instance : VueRefs<{
  search_field: HTMLInputElement
}> = getCurrentInstance()! as any

const history : Ref<Array<TTrending>> = ref([])

class ComponentApi {
  public async search () {
    const keyword = instance.refs.search_field.value
    // the ret is sorted by trend, total_read and name
    history.value = await call_ipc(IpcChannels.search_history, keyword)
  }

  public async remove (name : string) {
    await call_ipc(IpcChannels.remove_history, name)
    this.search()
  }

  public query (trending : TTrending) {
    event_bus_emit(EventBusType.query, { name: trending.name })
  }
}
const api = new ComponentApi()
</script>

<style lang="scss">
#history_comp {
  button {
    display: none;
  }

  #search_field {
    width: calc(100% - 10px);
    height: 28px;
    margin-bottom: 10px;
  }

  .search_record {
    display: flex;
    align-items: center;
    padding: 5px;

    .trend {
      width: 100%;
    }

    .click_icon {
      margin-left: 5px;
    }
  }
}
</style>
