import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { CiTrash } from 'react-icons/ci'
import { IoPrintOutline } from 'react-icons/io5'
import './CertificateRow.css'

function CertificateRow({ certificate, deleteCertificate }) {
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
              // navigate(`/students/manage-students/edit-student/${student.id}`)
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
