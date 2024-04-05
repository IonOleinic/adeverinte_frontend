import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './Certificates.css'
import CertificateNavbar from '../../components/CertificateComponents/CertificateNavbar/CertificateNavbar'
import CertificateOptions from '../../components/CertificateComponents/CertificateOptions/CertificateOptions'
import AddCertificate from '../../components/CertificateComponents/AddCertificate/AddCertificate'
import ManageCertificates from '../../components/CertificateComponents/ManageCertificates/ManageCertificates'

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
            element={<h1>Editeaza adeverinta</h1>}
          />
          <Route path='add-certificate' element={<AddCertificate />} />
          <Route path='certificate-options' element={<CertificateOptions />} />
        </Routes>
      </div>
    </>
  )
}

export default Certificates
