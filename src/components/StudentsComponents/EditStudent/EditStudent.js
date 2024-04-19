import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { toast } from 'react-toastify'

import './EditStudent.css'

function EditStudent() {
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const { studentId } = useParams()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [studyDomain, setStudyDomain] = useState('')
  const [studyProgram, setStudyProgram] = useState('')
  const [studyCycle, setStudyCycle] = useState('')
  const [studyYear, setStudyYear] = useState(-1)
  const [educationForm, setEducationForm] = useState('')
  const [financing, setFinancing] = useState('')
  const [sex, setSex] = useState('')
  const [disabledEditBtn, setDisabledEditBtn] = useState(true)

  const getStudent = async () => {
    try {
      const response = await axiosPrivate.get(`/student/${studentId}`)
      const student = response.data
      setEmail(student.email)
      setFullName(student.fullName)
      setStudyDomain(student.studyDomain)
      setStudyProgram(student.studyProgram)
      setStudyCycle(student.studyCycle)
      setStudyYear(student.studyYear)
      setEducationForm(student.educationForm)
      setFinancing(student.financing)
      setSex(student.sex)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getStudent()
  }, [studentId])

  const editStudent = async (e) => {
    e.preventDefault()
    setDisabledEditBtn(true)
    toast.dismiss()
    const form = document.getElementById('edit-student-form')
    if (!form.checkValidity()) {
      e.stopPropagation()
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
    form.classList.add('was-validated')

    if (form.checkValidity()) {
      try {
        await axiosPrivate.put(`/student/${studentId}`, {
          email,
          fullName,
          studyDomain,
          studyProgram,
          studyCycle,
          studyYear,
          educationForm,
          financing,
          sex,
        })
        toast.success(`Studentul ${fullName} a fost actualizat cu succes.`)
        setTimeout(() => {
          navigate('/students')
        }, 500)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    toast.dismiss()
  }, [
    email,
    fullName,
    studyDomain,
    studyProgram,
    studyCycle,
    studyYear,
    educationForm,
    financing,
  ])

  useEffect(() => {
    return () => {
      setTimeout(() => {
        toast.dismiss()
      }, 2000)
    }
  }, [])

  return (
    <div className='student-form-container'>
      <div className='card border-0 rounded-3 my-5 student-card'>
        <div className='card-body p-4 p-sm-5 student-card-body'>
          <h3 className='card-title text-center mb-3  fs-3'>
            Editeaza Student
          </h3>
          <form
            className='student-form needs-validation'
            id='edit-student-form'
            noValidate
            onSubmit={editStudent}
          >
            <div className='student-email-and-name'>
              <div className='form-floating mb-3'>
                <input
                  type='email'
                  className={'form-control'}
                  id='floatingStudentEmail'
                  placeholder='nume.prenume@student.usv.ro'
                  required
                  readOnly
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setDisabledEditBtn(false)
                  }}
                />
                <label htmlFor='floatingStudentEmail'>Email</label>
              </div>

              <div className='form-floating mb-3'>
                <input
                  type='text'
                  className='form-control'
                  id='floatingStudentName'
                  placeholder='Nume inițiala-tată prenume'
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    setDisabledEditBtn(false)
                  }}
                />
                <label htmlFor='floatingStudentName'>Nume complet</label>
              </div>
            </div>
            <div className='form-floating mb-3'>
              <input
                type='text'
                className='form-control'
                id='floatingStudentDomain'
                placeholder='Domeniu de studii'
                required
                value={studyDomain}
                onChange={(e) => {
                  setStudyDomain(e.target.value)
                  setDisabledEditBtn(false)
                }}
              />
              <label htmlFor='floatingStudentDomain'>Domeniu de studii</label>
            </div>
            <div className='form-floating mb-3'>
              <input
                type='text'
                className='form-control'
                id='floatingStudentDomain'
                placeholder='Program de studii'
                required
                value={studyProgram}
                onChange={(e) => {
                  setStudyProgram(e.target.value)
                  setDisabledEditBtn(false)
                }}
              />
              <label htmlFor='floatingStudentProgram'>Program de studii</label>
            </div>
            <div className='student-cycle-and-year'>
              <div className='form-floating'>
                <select
                  className='form-select'
                  id='floatingStudentCycle'
                  aria-label='Ciclu de studii'
                  required
                  value={studyCycle}
                  onChange={(e) => {
                    setStudyCycle(e.target.value)
                    setDisabledEditBtn(false)
                  }}
                >
                  <option value={''}>Selecteaza...</option>
                  <option value='licenta'>Licenta</option>
                  <option value='masterat'>Masterat</option>
                  <option value='studii postuniversitare'>Postuniv.</option>
                  <option value='conversie profesionala'>Conv. prof.</option>
                </select>
                <label htmlFor='floatingStudentCycle'>Ciclu de studii</label>
              </div>
              <div className='form-floating'>
                <select
                  className='form-select'
                  id='floatingStudentYear'
                  aria-label='An studiu'
                  required
                  value={studyYear}
                  onChange={(e) => {
                    setStudyYear(parseInt(e.target.value))
                    setDisabledEditBtn(false)
                  }}
                >
                  <option value={''}>Selecteaza...</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
                <label htmlFor='floatingStudentYear'>An studiu</label>
              </div>
            </div>
            <div className='student-finan-educform-sex'>
              <div className='form-floating'>
                <select
                  className='form-select'
                  id='floatingStudentEducForm'
                  aria-label='Formă de învățămant'
                  required
                  value={educationForm}
                  onChange={(e) => {
                    setEducationForm(e.target.value)
                    setDisabledEditBtn(false)
                  }}
                >
                  <option value={''}>Selecteaza...</option>
                  <option value='IF'>IF</option>
                  <option value='ID'>ID</option>
                </select>
                <label htmlFor='floatingStudentEducForm'>
                  Formă de învățămant
                </label>
              </div>
              <div className='form-floating'>
                <select
                  className='form-select'
                  id='floatingStudentFinan'
                  aria-label='Finanțare'
                  required
                  value={financing}
                  onChange={(e) => {
                    setFinancing(e.target.value)
                    setDisabledEditBtn(false)
                  }}
                >
                  <option value={''}>Selecteaza...</option>
                  <option value='buget'>Buget</option>
                  <option value='taxă'>Taxă</option>
                </select>
                <label htmlFor='floatingStudentFinan'>Finanțare</label>
              </div>
              <div className='form-floating'>
                <select
                  className='form-select'
                  id='floatingStudentSex'
                  aria-label='Sex'
                  required
                  value={sex}
                  onChange={(e) => {
                    setSex(e.target.value)
                    setDisabledEditBtn(false)
                  }}
                >
                  <option value={''}>Selecteaza...</option>
                  <option value='M'>M</option>
                  <option value='F'>F</option>
                </select>
                <label htmlFor='floatingStudentSex'>Sex</label>
              </div>
            </div>
            <hr className='my-4' />
            <div className='d-grid div-btn-edit-student'>
              <button
                className='btn btn-primary fw-bold btn-edit-student'
                type='submit'
                disabled={disabledEditBtn}
                onSubmit={editStudent}
              >
                Editeaza
              </button>
              <button
                type='button'
                className='btn btn-danger fw-bold btn-cancel-edit-student'
                onClick={() => {
                  navigate('/students/manage-students')
                }}
              >
                Anulează
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditStudent
