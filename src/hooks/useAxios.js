import axios from '../api/api'
import { useEffect } from 'react'
import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'

function useAxios() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          //token expired or user has been lost its token
          if (setAuth) {
            setAuth({})
          }
          navigate('/signin')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(responseIntercept)
    }
  }, [])

  return axios
}

export default useAxios
