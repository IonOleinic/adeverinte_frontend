import useAxiosPrivate from './useAxiosPrivate'
import { useEffect, useState } from 'react'

function useRoles() {
  const axiosPrivate = useAxiosPrivate()
  const [roles, setRoles] = useState([])

  const getAllRoles = async () => {
    try {
      const response = await axiosPrivate.get('/roles')
      setRoles(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAllRoles()
  }, [])

  return { roles }
}

export default useRoles
