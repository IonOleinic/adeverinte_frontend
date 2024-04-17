import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'

function PrivatePagesLayout() {
  return (
    <>
      <Navbar />
      <div className='page-container'>
        <Outlet />
      </div>
    </>
  )
}

export default PrivatePagesLayout
