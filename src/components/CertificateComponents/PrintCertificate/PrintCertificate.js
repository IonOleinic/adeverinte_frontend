import React, { useEffect } from 'react'

const removeAccents = (str) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

function PrintCertificate({ certificate, faculty, secretarName }) {
  return (
    <div
      style={{
        width: '520px',
        height: '340px',
        border: '1px solid black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          fontSize: '0.75rem',
          height: '40px',
        }}
      >
        <p style={{ margin: 0 }}>UNIVERSITATEA STEFAN CEL MARE DIN SUCEAVA</p>
        <p style={{ margin: 0 }}>
          FACULTATEA DE INGINERIE ELECTRICA SI STIINTA CALCULATOARELOR
        </p>
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <p style={{ fontSize: '0.9rem', margin: '0' }}>
          Nr. ............../FIESC/...................
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          height: '60px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: '1.1rem' }}>ADEVERINȚĂ</h2>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          height: '120px',
          justifyContent: 'center',
        }}
      >
        <p style={{ fontSize: '0.9rem', margin: '0' }}>
          <span style={{ width: '40px', display: 'inline-block' }}></span>
          Studentul(a) {certificate.fullName}, este înscris(ă) în anul
          universitar {faculty.academicYear}, în anul {certificate.studyYear} de
          studii, program de studii - {certificate.studyCycle} :{' '}
          {certificate.studyProgram}, forma de învățământ :
          {certificate.educationForm === 'IF'
            ? ' cu frecvență'
            : ' fără frecvență'}
          , regim :{' '}
          {removeAccents(certificate.financing) === 'taxa'
            ? ' cu taxă'
            : ' la buget'}
          .
        </p>
        <p style={{ fontSize: '0.9rem', margin: '0' }}>
          <span style={{ width: '40px', display: 'inline-block' }}></span>
          Adeverința se eliberează pentru a-i servi la{' '}
          {certificate.certificatePurpose}.
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
          marginTop: '20px',
          padding: '0 10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            maxWidth: '150px',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '0.9rem', margin: '0', fontWeight: 'bold' }}>
            DECAN,
          </p>
          <p style={{ fontSize: '0.9rem', margin: '0' }}>{faculty.deanName}</p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            maxWidth: '150px',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '0.9rem', margin: '0', fontWeight: 'bold' }}>
            SECRETAR ȘEF,
          </p>
          <p style={{ fontSize: '0.9rem', margin: '0' }}>
            {faculty.chiefSecretarName}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            maxWidth: '150px',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '0.9rem', margin: '0', fontWeight: 'bold' }}>
            SECRETARIAT,
          </p>
          <p style={{ fontSize: '0.9rem', margin: '0', textAlign: 'center' }}>
            {secretarName}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrintCertificate
