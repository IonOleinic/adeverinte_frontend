import { useEffect } from 'react'
import { axiosPrivate } from '../api/api'
import useRefreshToken from './useRefreshToken'
import useAuth from './useAuth'

function useAxiosPrivate() {
  const { auth } = useAuth()
  const refresh = useRefreshToken()

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config
        if (error.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccesToken = await refresh()
          prevRequest.headers.Authorization = `Bearer ${newAccesToken}`
          return axiosPrivate(prevRequest)
        }
        return Promise.reject(error)
      }
    )
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
