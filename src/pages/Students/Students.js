import React from 'react'
import StudentsNavbar from '../../components/StudentsComponents/StudentsNavbar/StudentsNavbar'
import ManageStudents from '../../components/StudentsComponents/ManageStudents/ManageStudents'
import AddStudent from '../../components/StudentsComponents/AddStudent/AddStudent'
import EditStudent from '../../components/StudentsComponents/EditStudent/EditStudent'
import UploadStudents from '../../components/StudentsComponents/UploadStudents/UploadStudents'
import { Routes, Route, Navigate } from 'react-router-dom'
import './Students.css'

function Students() {
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
          <Route path='upload-students' element={<UploadStudents />} />
        </Routes>
      </div>
    </>
  )
}

export default Students
