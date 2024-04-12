import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { CiTrash } from 'react-icons/ci'
import { IoPrintOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { confirmDialog } from 'primereact/confirmdialog'
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
              //
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
              confirmDialog({
                message: `Sunteți sigur că doriți să ștergeți adeverința ${certificate.registrationNr}?`,
                header: 'Confimare ștergere adeverință',
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                acceptLabel: 'Da',
                rejectLabel: 'Nu',
                accept: () => {
                  deleteCertificate(certificate.registrationNr)
                },
                reject: () => {},
              })
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
