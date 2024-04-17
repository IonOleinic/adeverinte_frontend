import useAxios from './useAxios'
import useAuth from './useAuth'

function useRefreshToken() {
  const axios = useAxios()
  const { setAuth } = useAuth()
  const refresh = async () => {
    try {
      const response = await axios.get('/refresh-token')
      setAuth((prevAuth) => ({
        ...prevAuth,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      }))
      return response.data.accessToken
    } catch (error) {
      console.log(error)
    }
  }
  return refresh
}

export default useRefreshToken
