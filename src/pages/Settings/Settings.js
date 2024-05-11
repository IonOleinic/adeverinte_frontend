import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from '../../components/NotFound/NotFound'
import SettingsNavbar from '../../components/SettingsComponents/SettingsNavbar/SettingsNavbar'
import './Settings.css'
import ManageUsers from '../../components/SettingsComponents/ManageUsers/ManageUsers'
import AddUser from '../../components/SettingsComponents/AddUser/AddUser'
import EditUser from '../../components/SettingsComponents/EditUser/EditUser'
import EditFaculty from '../../components/SettingsComponents/EditFaculty/EditFaculty'

function Settings() {
  return (
    <>
      <SettingsNavbar />
      <div className='settings-container'>
        <Routes>
          <Route index element={<Navigate to='manage-users' />} />
          <Route path='manage-users' element={<ManageUsers />} />
          <Route path='manage-users/add-user' element={<AddUser />} />
          <Route path='manage-users/edit-user/:userId' element={<EditUser />} />
          <Route path='manage-faculty' element={<EditFaculty />} />
          <Route path='system-settings' element={<h1>Setări sistem</h1>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default Settings
