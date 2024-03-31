import React from 'react'
import logoUsv from './images/usv-sigla.png'
import { NavLink, Link } from 'react-router-dom'
import { HiOutlineDocumentPlus } from 'react-icons/hi2'
import { HiOutlineDocumentChartBar } from 'react-icons/hi2'
import { HiOutlineClipboardDocumentCheck } from 'react-icons/hi2'
import { PiStudent } from 'react-icons/pi'
import { IoSettingsOutline } from 'react-icons/io5'
import './Navbar.css'

function Navbar() {
  return (
    <nav className='nav'>
      <Link to='/requests'>
        <img src={logoUsv} alt='logo USV' className='nav-logo' />
      </Link>
      <ul className='nav-list'>
        <CustomLink to='/requests'>
          <HiOutlineDocumentPlus />
          <p>Cereri</p>
        </CustomLink>
        <CustomLink to='/certificates'>
          <HiOutlineClipboardDocumentCheck />
          <p>Adeverințe</p>
        </CustomLink>
        <CustomLink to='/students'>
          <PiStudent />
          <p>Studenți</p>
        </CustomLink>
        <CustomLink to='/reports'>
          <HiOutlineDocumentChartBar />
          <p>Rapoarte</p>
        </CustomLink>
        <CustomLink to='/settings'>
          <IoSettingsOutline />
          <p>Setări</p>
        </CustomLink>
      </ul>
      <Link to='/signin'>
        <button className='signin-btn'>Sign In</button>
      </Link>
    </nav>
  )
}

function CustomLink({ to, children }) {
  return (
    <NavLink to={to} className='nav-link'>
      <li className='nav-item'>{children}</li>
    </NavLink>
  )
}

export default Navbar
