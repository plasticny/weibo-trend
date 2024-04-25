import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faTrash, faCopy, faSpinner, faArrowUp, faExclamation,
  faTimes, faPlus
} from '@fortawesome/free-solid-svg-icons'
import {
  faSquareCheck, faSquare
} from '@fortawesome/free-regular-svg-icons'

library.add(
  faTrash, faCopy, faSpinner, faArrowUp, faExclamation,
  faTimes, faPlus,
  faSquareCheck, faSquare
)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app')
