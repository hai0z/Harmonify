import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV({
  id: 'player-storage',
})

export default storage