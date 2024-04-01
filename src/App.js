import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Students from './pages/Students/Students'
import Requests from './pages/Requests/Requests'
import Certificates from './pages/Certificates/Certificates'
import Reports from './pages/Reports/Reports'
import Settings from './pages/Settings/Settings'

function App() {
  return (
    <div className='app-container'>
      <Navbar />
      <div className='page-container'>
        <Routes>
          <Route path='/' element={<Requests />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/certificates' element={<Certificates />} />
          <Route path='/students/*' element={<Students />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </div>
      <footer></footer>
    </div>
  )
}

export default App
