import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { CiTrash } from 'react-icons/ci'
import { IoPrintOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import './CertificateRow.css'

function CertificateRow({ certificate, deleteCertificate }) {
  const navigate = useNavigate()
  return (
    <tr className='certificate-row'>
      <td className='certificate-row-item certificate-row-registration-nr'>
        {certificate.registrationNr}
      </td>
      <td className='certificate-row-item certificate-row-fullname'>
        {certificate.fullName}
      </td>
      <td className='certificate-row-item certificate-row-email'>
        {certificate.studentEmail}
      </td>
      <td className='certificate-row-item certificate-row-purpose'>
        {certificate.certificatePurpose}
      </td>
      <td className='certificate-row-item certificate-row-printed'>
        {certificate.printed ? 'Da' : 'Nu'}
      </td>
      <td>
        <div className='certificate-row-item certificate-row-buttons'>
          <div
            className='certificate-row-print'
            onClick={() => {
              // deleteStudent(student.id)
            }}
          >
            <IoPrintOutline size={23} />
          </div>
          <div
            className='certificate-row-edit'
            onClick={(e) => {
              navigate(
                `/certificates/manage-certificates/edit-certificate/${encodeURIComponent(
                  certificate.registrationNr
                )}`
              )
            }}
          >
            <CiEdit size={23} />
          </div>
          <div
            className='certificate-row-delete'
            onClick={() => {
              deleteCertificate(certificate.registrationNr)
            }}
          >
            <CiTrash size={23} />
          </div>
        </div>
      </td>
    </tr>
  )
}

export default CertificateRow
