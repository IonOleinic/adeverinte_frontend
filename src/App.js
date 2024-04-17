import { Routes, Route, Navigate } from 'react-router-dom'
import Students from './pages/Students/Students'
import Requests from './pages/Requests/Requests'
import Certificates from './pages/Certificates/Certificates'
import Reports from './pages/Reports/Reports'
import Settings from './pages/Settings/Settings'
import SignIn from './pages/SignIn/SignIn'
import AppLayout from './components/Layouts/AppLayout'
import PrivatePagesLayout from './components/Layouts/PrivatePagesLayout'
import RequireAuth from './components/Auth/RequireAuth'
import PersistLogin from './components/Auth/PersistLogin'
import NotFound from './pages/NotFound/NotFound'
import axios from './api/api'
import { useEffect, useState } from 'react'

function App() {
  const [roles, setRoles] = useState([])

  const getAllRoles = async () => {
    try {
      const response = await axios.get('/roles')
      setRoles(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAllRoles()
  }, [])
  return (
    <Routes>
      <Route path='/' element={<AppLayout />}>
        {/* public routes */}
        <Route path='/signin' element={<SignIn />} />
        {/* private routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[roles.Secretar]} />}>
            <Route element={<PrivatePagesLayout />}>
              <Route index element={<Navigate to='/requests' />} />
              <Route path='requests/*' element={<Requests />} />
              <Route path='certificates/*' element={<Certificates />} />
              <Route path='students/*' element={<Students />} />
              <Route path='reports' element={<Reports />} />
              <Route element={<RequireAuth allowedRoles={[roles.Admin]} />}>
                <Route path='settings' element={<Settings />} />
              </Route>
              <Route path='*' element={<NotFound />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
export default App
