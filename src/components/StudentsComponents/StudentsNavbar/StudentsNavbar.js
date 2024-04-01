import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoPersonAddOutline } from 'react-icons/io5'
import { LiaUserEditSolid } from 'react-icons/lia'
import { LiaFileUploadSolid } from 'react-icons/lia'
import './StudentsNavbar.css'

function StudentsNavbar() {
  return (
    <div className='students-nav'>
      <ul className='students-nav-list'>
        <CustomLink to='/students/manage-students'>
          <LiaUserEditSolid size={24} />
          <p>Gestiune studenti</p>
        </CustomLink>
        <CustomLink to='/students/add-student'>
          <IoPersonAddOutline size={22} />
          <p>Adauga student</p>
        </CustomLink>
        <CustomLink to='/students/upload-students'>
          <LiaFileUploadSolid size={24} />
          <p>Incarca studenti</p>
        </CustomLink>
      </ul>
    </div>
  )
}

function CustomLink({ to, children }) {
  return (
    <NavLink to={to} className='students-nav-link'>
      <li className='students-nav-item'>{children}</li>
    </NavLink>
  )
}

export default StudentsNavbar
