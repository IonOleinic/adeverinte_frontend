import React from 'react'
import StudentsNavbar from '../../components/StudentsComponents/StudentsNavbar/StudentsNavbar'
import ManageStudents from '../../components/StudentsComponents/ManageStudents/ManageStudents'
import AddStudent from '../../components/StudentsComponents/AddStudent/AddStudent'
import EditStudent from '../../components/StudentsComponents/EditStudent/EditStudent'
import UploadStudents from '../../components/StudentsComponents/UploadStudents/UploadStudents'
import { Routes, Route, Navigate } from 'react-router-dom'
import useRoles from '../../hooks/useRoles'
import NotFound from '../../components/NotFound/NotFound'
import RequireAuth from '../../components/Auth/RequireAuth'
import './Students.css'

function Students() {
  const { roles } = useRoles()
  return (
    <>
      <StudentsNavbar />
      <div className='students-container'>
        <Routes>
          <Route path='/' element={<Navigate to='manage-students' />} />
          <Route path='manage-students' element={<ManageStudents />} />
          <Route
            path='manage-students/edit-student/:studentId'
            element={<EditStudent />}
          />
          <Route path='add-student' element={<AddStudent />} />
          <Route element={<RequireAuth allowedRoles={[roles.Admin]} />}>
            <Route path='upload-students' element={<UploadStudents />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default Students
