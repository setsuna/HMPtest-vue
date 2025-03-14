import { defineNuxtPlugin } from '#app'
import { 
  Fingerprint, 
  CreditCard, 
  Camera, 
  Code, 
  Check, 
  RefreshCw, 
  Download,
  Layers,
  Clock,
  X,
  Settings,
  Rotate3D,
  Save,
  ImagePlus,
  User,
  Users,
  AlertTriangle
} from 'lucide-vue-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FingerprintIcon', Fingerprint)
  nuxtApp.vueApp.component('CreditCardIcon', CreditCard)
  nuxtApp.vueApp.component('CameraIcon', Camera)
  nuxtApp.vueApp.component('CodeIcon', Code)
  nuxtApp.vueApp.component('CheckIcon', Check)
  nuxtApp.vueApp.component('RefreshCwIcon', RefreshCw)
  nuxtApp.vueApp.component('DownloadIcon', Download)
  nuxtApp.vueApp.component('LayersIcon', Layers)
  nuxtApp.vueApp.component('ClockIcon', Clock)
  nuxtApp.vueApp.component('XIcon', X)
  nuxtApp.vueApp.component('SettingsIcon', Settings)
  nuxtApp.vueApp.component('Rotate3DIcon', Rotate3D)
  nuxtApp.vueApp.component('SaveIcon', Save)
  nuxtApp.vueApp.component('ImagePlusIcon', ImagePlus)
  nuxtApp.vueApp.component('UserIcon', User)
  nuxtApp.vueApp.component('UsersIcon', Users)
  nuxtApp.vueApp.component('AlertTriangleIcon', AlertTriangle)
})
