import { CiEdit } from 'react-icons/ci'
import { CiTrash } from 'react-icons/ci'
import { IoPrintOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import { confirmDialog } from 'primereact/confirmdialog'
import './CertificateRow.css'

function CertificateRow({
  certificate,
  deleteCertificate,
  printCertificate,
  selectedCertificates,
  setSelectedCertificates,
  index,
}) {
  const navigate = useNavigate()

  return (
    <tr className='certificate-row'>
      <td className='certificate-row-item certificate-row-checkbox'>
        <input
          className='form-check-input'
          type='checkbox'
          value=''
          checked={selectedCertificates[index] || false}
          id='flexCheckDefault'
          onChange={(e) => {
            setSelectedCertificates((prev) => {
              const newSelected = [...prev]
              newSelected[index] = e.target.checked
              return newSelected
            })
          }}
        />
      </td>
      <td className='certificate-row-item certificate-row-registration-nr'>
        <p>{certificate.registrationNr}</p>
      </td>
      <td className='certificate-row-item certificate-row-fullname'>
        <p>{certificate.fullName}</p>
      </td>
      <td className='certificate-row-item certificate-row-email'>
        <p>{certificate.studentEmail}</p>
      </td>
      <td className='certificate-row-item certificate-row-purpose'>
        <p>{certificate.certificatePurpose}</p>
      </td>
      <td
        className={
          certificate.printed
            ? 'certificate-row-item certificate-row-printed certificate-row-printed-green'
            : 'certificate-row-item certificate-row-printed certificate-row-printed-red'
        }
      >
        <p>{certificate.printed ? 'Da' : 'Nu'}</p>
      </td>
      <td className='certificate-row-item certificate-row-buttons'>
        <Tooltip id={`tooltip-btn-print-${certificate.registrationNr}`} />
        <button
          data-tooltip-id={`tooltip-btn-print-${certificate.registrationNr}`}
          data-tooltip-content={'Imprimă adeverința'}
          data-tooltip-place='left'
          className='certificate-row-button certificate-row-print'
          onClick={() => {
            printCertificate([certificate])
          }}
        >
          <IoPrintOutline size={23} />
        </button>
        <Tooltip id={`tooltip-btn-edit-${certificate.registrationNr}`} />
        <button
          data-tooltip-id={`tooltip-btn-edit-${certificate.registrationNr}`}
          data-tooltip-content={'Editează adeverința'}
          data-tooltip-place='left'
          className='certificate-row-button certificate-row-edit'
          onClick={(e) => {
            navigate(
              `/certificates/manage-certificates/edit-certificate/${encodeURIComponent(
                certificate.registrationNr
              )}`
            )
          }}
        >
          <CiEdit size={23} />
        </button>
        <Tooltip id={`tooltip-btn-delete-${certificate.registrationNr}`} />
        <button
          data-tooltip-id={`tooltip-btn-delete-${certificate.registrationNr}`}
          data-tooltip-content={'Șterge adeverința'}
          data-tooltip-place='left'
          className='certificate-row-button certificate-row-delete'
          onClick={() => {
            confirmDialog({
              message: `Sunteți sigur că doriți să ștergeți adeverința ${certificate.registrationNr}?`,
              header: 'Confimare ștergere adeverință',
              icon: 'pi pi-trash',
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
        </button>
      </td>
    </tr>
  )
}

export default CertificateRow
