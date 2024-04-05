import React, { useState, useEffect } from 'react'
import './ManageStudents.css'
import StudentRow from '../StudentRow/StudentRow'
import { axiosPrivate } from '../../../api/api'

function ManageStudents() {
  const [originalStudents, setOriginalStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [emailFilter, setEmailFilter] = useState('')
  const [studyProgramFilter, setStudyProgramFilter] = useState('')
  const [studyCycleFilter, setStudyCycleFilter] = useState('')
  const [studyYearFilter, setStudyYearFilter] = useState(-1)

  const getStudents = async () => {
    try {
      const response = await axiosPrivate.get('/students')
      setOriginalStudents(response.data)
      setFilteredStudents(response.data)
      console.log(response.data)
      clearFilters()
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getStudents()
  }, [])

  const deleteStudent = async (id) => {
    try {
      await axiosPrivate.delete(`/student/${id}`)
      getStudents()
    } catch (error) {
      console.error(error)
    }
  }

  const clearFilters = () => {
    setEmailFilter('')
    setStudyProgramFilter('')
    setStudyCycleFilter('')
    setStudyYearFilter(-1)
    // setFilteredStudents(originalStudents)
  }

  const filterStudents = (
    emailFilter,
    studyProgramFilter,
    studyCycleFilter,
    studyYearFilter
  ) => {
    let filteredStudents = originalStudents
    if (emailFilter) {
      filteredStudents = filteredStudents.filter((student) =>
        student.email?.toLowerCase()?.includes(emailFilter.toLowerCase())
      )
    }
    if (studyProgramFilter) {
      filteredStudents = filteredStudents.filter((student) =>
        student.studyProgram
          .toLowerCase()
          .includes(studyProgramFilter.toLowerCase())
      )
    }
    if (studyCycleFilter) {
      filteredStudents = filteredStudents.filter(
        (student) => student.studyCycle === studyCycleFilter
      )
    }
    studyYearFilter = parseInt(studyYearFilter)
    if (studyYearFilter !== -1) {
      filteredStudents = filteredStudents.filter(
        (student) => student.studyYear === studyYearFilter
      )
    }
    setFilteredStudents(filteredStudents)
  }

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
            value={emailFilter}
            onChange={(e) => {
              // filterStudentByEmail(e.target.value)
              filterStudents(
                e.target.value,
                studyProgramFilter,
                studyCycleFilter,
                studyYearFilter
              )
              setEmailFilter(e.target.value)
            }}
          />
        </div>
        <div className='manage-students-toolbar-item search-students-by-study-program'>
          <label htmlFor='search-by-study-program'>Program:</label>
          <input
            type='text'
            placeholder='program de studii'
            id='search-by-study-program'
            className='form-control'
            value={studyProgramFilter}
            onChange={(e) => {
              setStudyProgramFilter(e.target.value)
              filterStudents(
                emailFilter,
                e.target.value,
                studyCycleFilter,
                studyYearFilter
              )
            }}
          />
        </div>
        <div className='manage-students-toolbar-item search-students-by-study-cycle'>
          <label htmlFor='search-by-study-cycle'>Ciclu:</label>
          <select
            className='form-control'
            id='search-by-study-cycle'
            value={studyCycleFilter}
            onChange={(e) => {
              setStudyCycleFilter(e.target.value)
              filterStudents(
                emailFilter,
                studyProgramFilter,
                e.target.value,
                studyYearFilter
              )
            }}
          >
            <option value={''}>*</option>
            <option value={'licenta'}>Licenta</option>
            <option value={'masterat'}>Masterat</option>
            <option value={'studii postuniversitare'}>Postuniv.</option>
            <option value={'conversie profesionala'}>Conv. prof.</option>
          </select>
        </div>
        <div className='manage-students-toolbar-item search-students-by-study-year'>
          <label htmlFor='search-by-study-year'>An:</label>
          <select
            className='form-control'
            id='search-by-study-year'
            value={studyYearFilter}
            onChange={(e) => {
              setStudyYearFilter(e.target.value)
              filterStudents(
                emailFilter,
                studyProgramFilter,
                studyCycleFilter,
                e.target.value
              )
            }}
          >
            <option value={-1}>*</option>
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
            {filteredStudents.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                deleteStudent={deleteStudent}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageStudents
