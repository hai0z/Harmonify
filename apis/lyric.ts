import axios from "./config"

const getLyric = async (id: string) => {
  try {
    const data = await axios.get<any, any>("/lyric", {
      params: {
        id: id
      }
    })
    return data
  } catch (err) {
    console.log(err)
  }
}

export { getLyric }