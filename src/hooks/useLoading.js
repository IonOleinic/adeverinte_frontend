import LoadingContext from '../context/LoadingProvider'
import { useContext } from 'react'

function useLoading() {
  return useContext(LoadingContext)
}

export default useLoading
