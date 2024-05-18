import React from 'react'
import PrintCertificate from '../PrintCertificate/PrintCertificate' // Assuming you have a Certificate component

const PrintCertificatesPage = ({ certificates, faculty, secretarName }) => {
  // Helper function to split array into chunks of specified size
  const chunkArray = (array, chunkSize) => {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  // Split certificates into chunks of 4
  const certificateChunks = chunkArray(certificates, 4)

  return (
    <>
      {certificateChunks.map((chunk, chunkIndex) => (
        <div
          className='certificates-page'
          id={`certificates-page-${chunkIndex}`}
          key={chunkIndex}
          style={{
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            pageBreakAfter: 'always',
            width: '297mm',
            gap: '60px',
          }}
        >
          {chunk.map((certificate) => (
            <PrintCertificate
              key={certificate.registrationNumber}
              certificate={certificate}
              faculty={faculty} // Pass faculty as a prop
              secretarName={secretarName} // Pass secretarName as a prop
            />
          ))}
        </div>
      ))}
    </>
  )
}

export default PrintCertificatesPage
