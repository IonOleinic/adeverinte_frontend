import React from 'react'
import PrintCertificate from '../PrintCertificate/PrintCertificate' // Assuming you have a Certificate component

const PrintCertificatesPage = ({ certificates, faculty, secretarName }) => {
  return (
    <div
      className='certificates-page'
      id='certificates-page'
      style={{
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        pageBreakAfter: 'always',
        width: '297mm',
        gap: '25px',
      }}
    >
      {certificates.map((certificate, index) => (
        <PrintCertificate
          key={certificate.registrationNumber}
          certificate={certificate}
          faculty={faculty} // Pass faculty as a prop
          secretarName={secretarName} // Pass secretarName as a prop
        />
      ))}
    </div>
  )
}

export default PrintCertificatesPage
