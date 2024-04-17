import axios from '../api/api'
import useAuth from './useAuth'

function useLogout() {
  const { setAuth } = useAuth()
  const logout = async () => {
    try {
      await axios.post('/logout')
      setAuth((prevAuth) => ({
        ...prevAuth,
        roles: [],
        accessToken: '',
      }))
    } catch (error) {
      console.log(error)
    }
  }
  return logout
}

export default useLogout
