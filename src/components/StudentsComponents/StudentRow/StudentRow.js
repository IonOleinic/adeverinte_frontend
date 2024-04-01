import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { CiTrash } from 'react-icons/ci'
import './StudentRow.css'

function StudentRow({ student }) {
  return (
    <tr className='student-row'>
      <td className='student-row-item student-row-fullname'>
        {student.fullName}
      </td>
      <td className='student-row-item student-row-email'>{student.email}</td>
      <td className='student-row-item student-row-study-domain'>
        {student.studyDomain}
      </td>
      <td className='student-row-item student-row-study-program'>
        {student.studyProgram}
      </td>
      <td className='student-row-item student-row-study-cycle'>
        {student.studyCycle}
      </td>
      <td className='student-row-item student-row-study-year'>
        {student.studyYear}
      </td>
      <td>
        <div className='student-row-item student-row-buttons'>
          <div className='student-row-edit'>
            <CiEdit size={21} />
          </div>
          <div className='student-row-delete'>
            <CiTrash size={21} />
          </div>
        </div>
      </td>
    </tr>
  )
}

export default StudentRow
