import { useState, useEffect, useMemo } from 'react'
import './ManageStudents.css'
import StudentRow from '../StudentRow/StudentRow'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Paginator } from 'primereact/paginator'
import { toast } from 'react-toastify'
import LoadingLayer from '../../LoadingLayer/LoadingLayer'
import useLoading from '../../../hooks/useLoading'

const removeAccents = (str) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

function ManageStudents() {
  const { setIsLoading } = useLoading() // Use useLoading hook
  const axiosPrivate = useAxiosPrivate()
  const [students, setStudents] = useState([])
  const [filters, setFilters] = useState({
    email: '',
    studyProgram: '',
    studyCycle: '',
    studyYear: '',
  })
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)

  const getStudents = async () => {
    try {
      setIsLoading(true)
      const response = await axiosPrivate.get('/students')
      setStudents(response.data)
      console.log(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getStudents()
  }, [])

  const deleteStudent = async (id) => {
    try {
      const response = await axiosPrivate.get(`/student/${id}`)
      await axiosPrivate.delete(`/student/${id}`)
      toast.warning(`Studentul ${response.data?.fullName} a fost șters.`)
      getStudents()
    } catch (error) {
      console.error(error)
    }
  }

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      return (
        student.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        removeAccents(student.studyProgram)
          .toLowerCase()
          .includes(filters.studyProgram.toLowerCase()) &&
        (filters.studyCycle
          ? removeAccents(student.studyCycle) === filters.studyCycle
          : true) &&
        (filters.studyYear
          ? student.studyYear === parseInt(filters.studyYear)
          : true)
      )
    })
  }, [students, filters])

  const displayedStudents = useMemo(() => {
    return filteredStudents.slice(first, first + rows)
  }, [filteredStudents, first, rows])

  const handleFilterChange = (filter, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }))
  }

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
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
            value={filters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
          />
        </div>
        <div className='manage-students-toolbar-item search-students-by-study-program'>
          <label htmlFor='search-by-study-program'>Program:</label>
          <input
            type='text'
            placeholder='program de studii'
            id='search-by-study-program'
            className='form-control'
            value={filters.studyProgram}
            onChange={(e) => handleFilterChange('studyProgram', e.target.value)}
          />
        </div>
        <div className='manage-students-toolbar-item search-students-by-study-cycle'>
          <label htmlFor='search-by-study-cycle'>Ciclu:</label>
          <select
            className='form-control'
            id='search-by-study-cycle'
            value={filters.studyCycle}
            onChange={(e) => handleFilterChange('studyCycle', e.target.value)}
          >
            <option value={''}>*</option>
            <option value={'licenta'}>Licență</option>
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
            value={filters.studyYear}
            onChange={(e) => handleFilterChange('studyYear', e.target.value)}
          >
            <option value={''}>*</option>
            <option value={'1'}>1</option>
            <option value={'2'}>2</option>
            <option value={'3'}>3</option>
            <option value={'4'}>4</option>
          </select>
        </div>
      </div>
      <div className='manage-students-list'>
        <div className='manage-students-table-container'>
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
              {displayedStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  deleteStudent={deleteStudent}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className='manage-students-paginator'>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filteredStudents.length}
            rowsPerPageOptions={[10, 20, 50]}
            onPageChange={onPageChange}
          />
        </div>
        <LoadingLayer />
      </div>
    </div>
  )
}

export default ManageStudents
