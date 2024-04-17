import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { CiTrash } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import { confirmDialog } from 'primereact/confirmdialog'
import './StudentRow.css'

function StudentRow({ student, deleteStudent }) {
  const navigate = useNavigate()
  return (
    <tr className='student-row'>
      <td className='student-row-item student-row-fullname'>
        <p>{student.fullName}</p>
      </td>
      <td className='student-row-item student-row-email'>
        <p>{student.email}</p>
      </td>
      <td className='student-row-item student-row-study-domain'>
        <p>{student.studyDomain}</p>
      </td>
      <td className='student-row-item student-row-study-program'>
        <p>{student.studyProgram}</p>
      </td>
      <td className='student-row-item student-row-study-cycle'>
        <p>{student.studyCycle}</p>
      </td>
      <td className='student-row-item student-row-study-year'>
        <p>{student.studyYear}</p>
      </td>
      <td className='student-row-item student-row-buttons'>
        <button
          className='student-row-button student-row-edit'
          onClick={(e) => {
            navigate(`/students/manage-students/edit-student/${student.id}`)
          }}
        >
          <CiEdit size={23} />
        </button>
        <button
          className='student-row-button student-row-delete'
          onClick={() => {
            confirmDialog({
              message: `Sunteți sigur că doriți să ștergeți studentul ${student.fullName}?`,
              header: 'Confimare ștergere student',
              icon: 'pi pi-info-circle',
              defaultFocus: 'reject',
              acceptClassName: 'p-button-danger',
              acceptLabel: 'Da',
              rejectLabel: 'Nu',
              accept: () => {
                deleteStudent(student.id)
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

export default StudentRow
