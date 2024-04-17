import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { CiTrash } from 'react-icons/ci'
import { confirmDialog } from 'primereact/confirmdialog'
import './ProcessedRequestRow.css'

const getFormatedDate = (date) => {
  const dateObj = new Date(date)
  return `${dateObj.getDate()}.${addZero(
    dateObj.getMonth() + 1
  )}.${dateObj.getFullYear()} ${addZero(dateObj.getHours())}:${addZero(
    dateObj.getMinutes()
  )}`
}

const addZero = (number) => {
  return number < 10 ? `0${number}` : number
}

function RequestRow({ request, deleteRequest }) {
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
      <td className='processed-request-row-item processed-request-row-accepted'>
        <p>{request.accepted ? 'Da' : 'Nu'}</p>
      </td>
      <td className='processed-request-row-item processed-request-row-rejected-reason'>
        <p>{request.rejectedReason || '-'}</p>
      </td>
      {/* only for debugging purposes */}
      <td className='processed-request-row-item processed-request-row-buttons'>
        <button
          className='processed-request-row-button processed-request-row-delete'
          onClick={() => {
            deleteRequest(request.id)
          }}
        >
          <CiTrash size={23} />
        </button>
      </td>
    </tr>
  )
}

export default RequestRow
