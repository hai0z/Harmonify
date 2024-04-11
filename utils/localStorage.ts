import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getData(key: string): Promise<any | null> {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data != null) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}
export async function storeData<T>(key: string, data: T) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error: any) {
    console.log(error);
  }
}
