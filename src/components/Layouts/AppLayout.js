import React from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'
function AppLayout() {
  return (
    <>
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <ConfirmDialog />
      <main className='app-container'>
        <Outlet />
      </main>
    </>
  )
}

export default AppLayout
