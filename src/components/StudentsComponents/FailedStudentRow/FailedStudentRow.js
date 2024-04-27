import './FailedStudentRow.css'

function FailedStudentRow({ student }) {
  return (
    <tr className='failed-student-row'>
      <td className='failed-student-row-item failed-student-row-excel-index'>
        <p>{student.excelIndex}</p>
      </td>
      <td className='failed-student-row-item failed-student-row-fullname'>
        <p>{student.fullName}</p>
      </td>
      <td className='failed-student-row-item failed-student-row-email'>
        <p>{student.email}</p>
      </td>
      <td className='failed-student-row-item failed-student-row-study-domain'>
        <p>{student.studyDomain}</p>
      </td>
      <td className='failed-student-row-item failed-student-row-study-cycle'>
        <p>{student.studyCycle}</p>
      </td>
      <td className='failed-student-row-item failed-student-row-study-year'>
        <p>{student.studyYear}</p>
      </td>
    </tr>
  )
}

export default FailedStudentRow
