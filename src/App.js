import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Students from './pages/Students/Students'
import Requests from './pages/Requests/Requests'
import Certificates from './pages/Certificates/Certificates'
import Reports from './pages/Reports/Reports'
import Settings from './pages/Settings/Settings'
import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { ToastContainer } from 'react-toastify'

function App() {
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
      <div className='app-container'>
        <Navbar />
        <div className='page-container'>
          <Routes>
            <Route path='/' element={<Requests />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/certificates/*' element={<Certificates />} />
            <Route path='/students/*' element={<Students />} />
            <Route path='/requests/*' element={<Requests />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
        </div>
        <footer></footer>
      </div>
    </>
  )
}

export default App
