import { Routes, Route, Navigate } from 'react-router-dom'
import CertificateNavbar from '../../components/CertificateComponents/CertificateNavbar/CertificateNavbar'
import CertificateOptions from '../../components/CertificateComponents/CertificateOptions/CertificateOptions'
import AddCertificate from '../../components/CertificateComponents/AddCertificate/AddCertificate'
import ManageCertificates from '../../components/CertificateComponents/ManageCertificates/ManageCertificates'
import EditCertificate from '../../components/CertificateComponents/EditCertificate/EditCertificate'
import NotFound from '../../components/NotFound/NotFound'
import './Certificates.css'

function Certificates() {
  return (
    <>
      <CertificateNavbar />
      <div className='certificates-container'>
        <Routes>
          <Route index element={<Navigate to='manage-certificates' />} />
          <Route path='manage-certificates' element={<ManageCertificates />} />
          <Route
            path='manage-certificates/edit-certificate/:registrationNr'
            element={<EditCertificate />}
          />
          <Route path='add-certificate' element={<AddCertificate />} />
          <Route path='certificate-options' element={<CertificateOptions />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default Certificates
