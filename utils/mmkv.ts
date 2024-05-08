import { MMKV } from 'react-native-mmkv'

export const mmkv = new MMKV({
  id: 'player-storage',
})

export default mmkv