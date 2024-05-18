import { NavLink } from 'react-router-dom'
import { LiaBuilding } from 'react-icons/lia'
import { IoSettingsOutline } from 'react-icons/io5'
import { PiUsersThreeLight } from 'react-icons/pi'
import './SettingsNavbar.css'

function SettingsNavbar() {
  return (
    <div className='settings-nav'>
      <ul className='settings-nav-list'>
        <CustomLink to='/settings/manage-users'>
          <PiUsersThreeLight size={22} />
          <p>Gestiune utilizatori</p>
        </CustomLink>
        <CustomLink to='/settings/manage-faculty'>
          <LiaBuilding size={22} />
          <p>Gestiune facultate</p>
        </CustomLink>
        <CustomLink to='/settings/system-settings'>
          <IoSettingsOutline size={21} />
          <p>Setări generale</p>
        </CustomLink>
      </ul>
    </div>
  )
}

function CustomLink({ to, children }) {
  return (
    <NavLink to={to} className='settings-nav-link'>
      <li className='settings-nav-item'>{children}</li>
    </NavLink>
  )
}

export default SettingsNavbar
