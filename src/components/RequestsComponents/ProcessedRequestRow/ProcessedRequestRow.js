import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { CiTrash } from 'react-icons/ci'
import { confirmDialog } from 'primereact/confirmdialog'
import './ProcessedRequestRow.css'

const getFormatedDate = (date) => {
  const dateObj = new Date(date)
  return `${dateObj.getDate()}.${addZero(
    dateObj.getMonth() + 1
  )}.${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`
}

const addZero = (number) => {
  return number < 10 ? `0${number}` : number
}

function RequestRow({ request, deleteRequest }) {
  return (
    <tr className='processed-request-row'>
      <td className='processed-request-row-item processed-request-row-date'>
        {getFormatedDate(request.date)}
      </td>
      <td className='processed-request-row-item processed-request-row-email'>
        {request.studentEmail}
      </td>
      <td className='processed-request-row-item processed-request-row-purpose'>
        {request.certificatePurpose}
      </td>
      <td className='processed-request-row-item processed-request-row-handled-by'>
        {request.handledBy || '-'}
      </td>
      <td className='processed-request-row-item processed-request-row-accepted'>
        {request.accepted ? 'Da' : 'Nu'}
      </td>
      <td className='processed-request-row-item processed-request-row-rejected-reason'>
        {request.rejectedReason || '-'}
      </td>
    </tr>
  )
}

export default RequestRow
