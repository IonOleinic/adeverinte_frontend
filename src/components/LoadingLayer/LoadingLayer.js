import React from 'react'
import useLoading from '../../hooks/useLoading'
import ClipLoader from 'react-spinners/ClipLoader'
import './LoadingLayer.css'

function LoadingLayer() {
  const { isLoading } = useLoading()
  const spinnerColor = '#2344ff'

  return (
    <div
      className={
        isLoading ? 'loadind-layer' : 'loadind-layer loadind-layer-hidden'
      }
    >
      <div className='loading-spinner'>
        <ClipLoader
          color={spinnerColor}
          loading={isLoading}
          size={50}
          aria-label='Loading Spinner'
          data-testid='loader'
        />
      </div>
    </div>
  )
}

export default LoadingLayer
