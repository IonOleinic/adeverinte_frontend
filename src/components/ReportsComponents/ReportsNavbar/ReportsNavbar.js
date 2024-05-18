import { NavLink } from 'react-router-dom'
import { HiOutlineDocumentChartBar } from 'react-icons/hi2'

import './ReportsNavbar.css'

function ReportsNavbar() {
  return (
    <div className='reports-nav'>
      <ul className='reports-nav-list'>
        <CustomLink to='/reports/requests-report'>
          <HiOutlineDocumentChartBar size={23} />
          <p>Raport cereri</p>
        </CustomLink>
        <CustomLink to='/reports/certificates-report'>
          <HiOutlineDocumentChartBar size={23} />
          <p>Raport adeverințe</p>
        </CustomLink>
      </ul>
    </div>
  )
}

function CustomLink({ to, children }) {
  return (
    <NavLink to={to} className='reports-nav-link'>
      <li className='reports-nav-item'>{children}</li>
    </NavLink>
  )
}

export default ReportsNavbar
