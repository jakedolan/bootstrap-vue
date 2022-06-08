/**
 * Augment the typings of Vue.js
 */
import { BvModal } from './components/modal'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $bvModal: BvModal
  }
}
