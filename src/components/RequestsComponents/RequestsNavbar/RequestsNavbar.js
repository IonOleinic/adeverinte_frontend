import React from 'react'
import { LiaListAltSolid } from 'react-icons/lia'
import { LiaClockSolid } from 'react-icons/lia'
import { NavLink } from 'react-router-dom'
import './RequestsNavbar.css'

function RequestsNavbar() {
  return (
    <div className='requests-nav'>
      <ul className='requests-nav-list'>
        <CustomLink to='/requests/pending-requests'>
          <LiaClockSolid size={24} />
          <p>Cereri în așteptare</p>
        </CustomLink>
        <CustomLink to='/requests/processed-requests'>
          <LiaListAltSolid size={24} />
          <p>Cereri procesate</p>
        </CustomLink>
      </ul>
    </div>
  )
}

function CustomLink({ to, children }) {
  return (
    <NavLink to={to} className='requests-nav-link'>
      <li className='requests-nav-item'>{children}</li>
    </NavLink>
  )
}

export default RequestsNavbar
