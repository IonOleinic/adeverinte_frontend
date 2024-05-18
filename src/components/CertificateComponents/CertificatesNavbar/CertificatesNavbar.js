import { NavLink } from 'react-router-dom'
import { GrDocumentConfig } from 'react-icons/gr'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { GrDocumentStore } from 'react-icons/gr'
import './CertificatesNavbar.css'

function CertificateNavbar() {
  return (
    <div className='certificates-nav'>
      <ul className='certificates-nav-list'>
        <CustomLink to='/certificates/manage-certificates'>
          <GrDocumentStore size={20} />
          <p>Gestiune adeverințe</p>
        </CustomLink>
        <CustomLink to='/certificates/add-certificate'>
          <AiOutlineFileAdd size={23} />
          <p>Adaugă adeverință</p>
        </CustomLink>
        <CustomLink to='/certificates/certificate-options'>
          <GrDocumentConfig size={20} />
          <p>Opțiuni</p>
        </CustomLink>
      </ul>
    </div>
  )
}

function CustomLink({ to, children }) {
  return (
    <NavLink to={to} className='certificates-nav-link'>
      <li className='certificates-nav-item'>{children}</li>
    </NavLink>
  )
}

export default CertificateNavbar
