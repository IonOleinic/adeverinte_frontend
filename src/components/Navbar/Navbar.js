import React from 'react'
import logoUsv from './images/usv-sigla-alba.png'
import { NavLink, Link } from 'react-router-dom'
import { HiOutlineDocumentChartBar } from 'react-icons/hi2'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import { PiStudent } from 'react-icons/pi'
import { IoSettingsOutline } from 'react-icons/io5'
import { HiOutlineDocumentText } from 'react-icons/hi2'
import UserProfile from '../UserComponents/UserProfile/UserProfile'
import useAuth from '../../hooks/useAuth'
import './Navbar.css'

function Navbar() {
  const { auth } = useAuth()
  return (
    <nav className='nav'>
      <Link to='/requests'>
        <img src={logoUsv} alt='logo USV' className='nav-logo' />
      </Link>
      <ul className='nav-list'>
        <CustomLink to='/requests'>
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
      {auth.email ? (
        <UserProfile />
      ) : (
        <Link to='/signin'>
          <button className='signin-btn'>Sign In</button>
        </Link>
      )}
    </nav>
  )
}

function CustomLink({ to, children }) {
  return (
    <NavLink to={to} className='nav-link'>
      <li className='nav-item'>{children}</li>
      <span className='nav-item-bottom-line'></span>
    </NavLink>
  )
}

export default Navbar
