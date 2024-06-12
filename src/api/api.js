import axios from 'axios'

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost'
const serverPort = process.env.REACT_APP_SERVER_PORT || 5000

export default axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  withCredentials: true,
})

export const axiosPrivate = axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  withCredentials: true,
})

export { serverURL, serverPort }
