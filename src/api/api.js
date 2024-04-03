import axios from 'axios'

const serverURL = 'http://localhost'
// const serverURL = 'http://192.168.1.80'
// const serverURL = 'http://192.168.0.174'
// const serverURL = 'http://192.168.12.121'
const serverPort = '5000'

export default axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  withCredentials: true,
})

export const axiosPrivate = axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  withCredentials: true,
})

export { serverURL, serverPort }
