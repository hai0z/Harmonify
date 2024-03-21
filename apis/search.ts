import axios from "./config"

const getSearch = async (keyword: string) => {
  try {
    const data = await axios.get("/search", {
      params: {
        keyword: keyword
      }
    })
    return data
  } catch (err) {
    console.log(err)
  }
}

export { getSearch }
