import { useState, useEffect } from 'react'
import { CiTrash } from 'react-icons/ci'
import { confirmDialog } from 'primereact/confirmdialog'
import useAuth from '../../../hooks/useAuth'
import useRoles from '../../../hooks/useRoles'
import { Tooltip } from 'react-tooltip'
import './ProcessedRequestRow.css'

const getFormatedDate = (date) => {
  const dateObj = new Date(date)
  return `${addZero(dateObj.getDate())}.${addZero(
    dateObj.getMonth() + 1
  )}.${dateObj.getFullYear()} ${addZero(dateObj.getHours())}:${addZero(
    dateObj.getMinutes()
  )}`
}

const addZero = (number) => {
  return number < 10 ? `0${number}` : number
}

function RequestRow({ request, deleteRequest }) {
  const [allowDelete, setAllowDelete] = useState(true)
  const { auth } = useAuth()
  const { roles } = useRoles()

  useEffect(() => {
    if (auth.roles?.includes(roles.Admin)) {
      setAllowDelete(true)
    } else {
      setAllowDelete(false)
    }
  }, [roles, auth])
  return (
    <tr className='processed-request-row'>
      <td className='processed-request-row-item processed-request-row-date'>
        <p>{getFormatedDate(request.date)}</p>
      </td>
      <td className='processed-request-row-item processed-request-row-email'>
        <p>{request.studentEmail}</p>
      </td>
      <td className='processed-request-row-item processed-request-row-purpose'>
        <p>{request.certificatePurpose}</p>
      </td>
      <td className='processed-request-row-item processed-request-row-handled-by'>
        <p>{request.handledBy || '-'}</p>
      </td>
      <td
        className={
          request.accepted
            ? 'processed-request-row-item processed-request-row-accepted processed-request-row-printed-green'
            : 'processed-request-row-item processed-request-row-accepted processed-request-row-printed-red'
        }
      >
        <p>{request.accepted ? 'Da' : 'Nu'}</p>
      </td>
      <td className='processed-request-row-item processed-request-row-rejected-reason'>
        <p>{request.rejectedReason || '-'}</p>
      </td>
      {/* only for debugging purposes */}
      <td className='processed-request-row-item processed-request-row-buttons'>
        <Tooltip id={`tooltip-btn-delete-${request.id}`} />
        <button
          data-tooltip-id={`tooltip-btn-delete-${request.id}`}
          data-tooltip-content={
            allowDelete ? 'Șterge cererea' : 'Nu aveți permisiunea'
          }
          data-tooltip-place='left'
          className='processed-request-row-button processed-request-row-delete'
          disabled={!allowDelete}
          onClick={() => {
            confirmDialog({
              message: `Sunteți sigur că doriți să ștergeți cererea cu id-ul ${request.id}?`,
              header: 'Confimare ștergere cerere',
              icon: 'pi pi-trash',
              defaultFocus: 'reject',
              acceptClassName: 'p-button-danger',
              acceptLabel: 'Da',
              rejectLabel: 'Nu',
              accept: () => {
                deleteRequest(request.id)
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

export default RequestRow
