import React from 'react'
import './ManageStudents.css'
import StudentRow from '../StudentRow/StudentRow'

function ManageStudents() {
  return (
    <div className='manage-students'>
      <div className='manage-students-toolbar'>
        <div className='manage-students-toolbar-item search-students-by-email'>
          <label htmlFor='search-by-email'>Email:</label>
          <input
            type='text'
            placeholder='cauta dupa email'
            id='search-by-email'
            className='form-control'
          />
        </div>
        <div className='manage-students-toolbar-item search-students-by-study-program'>
          <label htmlFor='search-by-study-program'>Program:</label>
          <input
            type='text'
            placeholder='program de studii'
            id='search-by-study-program'
            className='form-control'
          />
        </div>
        <div className='manage-students-toolbar-item search-students-by-study-cycle'>
          <label htmlFor='search-by-study-cycle'>Ciclu:</label>
          <select className='form-control' id='search-by-study-cycle'>
            <option value={''}>*</option>
            <option value={'licenta'}>licenta</option>
            <option value={'masterat'}>masterat</option>
            <option value={'studii postuniversitare'}>postuniv.</option>
            <option value={'conversie profesionala'}>conv. prof.</option>
          </select>
        </div>
        <div className='manage-students-toolbar-item search-students-by-study-year'>
          <label htmlFor='search-by-study-year'>An:</label>
          <select className='form-control' id='search-by-study-year'>
            <option value={0}>*</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
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
