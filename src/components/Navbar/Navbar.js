import React from 'react'
import logoUsv from './images/usv-sigla.png'
import { NavLink, Link } from 'react-router-dom'
import { HiOutlineDocumentChartBar } from 'react-icons/hi2'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import { PiStudent } from 'react-icons/pi'
import { IoSettingsOutline } from 'react-icons/io5'
import { HiOutlineDocumentText } from 'react-icons/hi2'
import './Navbar.css'

function Navbar() {
  return (
    <nav className='nav'>
      <Link to='/'>
        <img src={logoUsv} alt='logo USV' className='nav-logo' />
      </Link>
      <ul className='nav-list'>
        <CustomLink to='/'>
          <HiOutlineDocumentText />
          <p>Cereri</p>
        </CustomLink>
        <CustomLink to='/certificates'>
          <HiOutlineClipboardDocumentList />
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
