import React from 'react'
import './ManageStudents.css'
import StudentRow from '../StudentRow/StudentRow'

function ManageStudents() {
  return (
    <div className='manage-students'>
      <div className='manage-students-toolbar'>
        <div className='manage-students-toolbar-item search-students'>
          <label htmlFor='search-student'>Email:</label>
          <input
            type='text'
            placeholder='Cauta studenti'
            id='search-student'
            className='form-control'
          />
        </div>
      </div>
      <div className='manage-students-list'>
        <table className='manage-students-table'>
          <thead>
            <tr className='student-row student-row-header'>
              <th className='student-row-item student-row-fullname'>
                Nume complet
              </th>
              <th className='student-row-item student-row-email'>Email</th>
              <th className='student-row-item student-row-study-domain'>
                Domeniul de studii
              </th>
              <th className='student-row-item student-row-study-program'>
                Program de studii
              </th>
              <th className='student-row-item student-row-study-cycle'>
                Ciclu de studii
              </th>
              <th className='student-row-item student-row-study-year'>An</th>
              <th className='student-row-item student-row-buttons'></th>
            </tr>
          </thead>
          <tbody>
            <StudentRow
              student={{
                fullName: 'Oleinic V. Ion',
                email: 'ion.oleinic1@student.usv.ro',
                studyDomain:
                  'Stiinta Calculatoarelor Stiinta Calculatoarelor Stiinta Calculatoarelor',
                studyProgram: 'Stiinta si Ingineria Calculatoarelor',
                studyCycle: 'masterat',
                studyYear: '1',
              }}
            />
            <StudentRow
              student={{
                fullName: 'Oleinic V. Ion',
                email: 'ion.oleinic1@student.usv.ro',
                studyDomain: 'Stiinta Calculatoarelor',
                studyProgram: 'Stiinta si Ingineria Calculatoarelor',
                studyCycle: 'masterat',
                studyYear: '1',
              }}
            />
            <StudentRow
              student={{
                fullName: 'Oleinic V. Ion',
                email: 'ion.oleinic1@student.usv.ro',
                studyDomain: 'Stiinta Calculatoarelor',
                studyProgram: 'Stiinta si Ingineria Calculatoarelor',
                studyCycle: 'masterat',
                studyYear: '1',
              }}
            />
            <StudentRow
              student={{
                fullName: 'Beleniuc V. Vitalie',
                email: 'vitalie.beleniuc1@student.usv.ro',
                studyDomain: 'Stiinta Calculatoarelor',
                studyProgram: 'Stiinta si Ingineria Calculatoarelor',
                studyCycle: 'masterat',
                studyYear: '1',
              }}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageStudents
