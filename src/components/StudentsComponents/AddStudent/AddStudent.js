import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../../api/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './AddStudent.css'

function AddStudent() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [studyDomain, setStudyDomain] = useState('')
  const [studyProgram, setStudyProgram] = useState('')
  const [studyCycle, setStudyCycle] = useState('')
  const [studyYear, setStudyYear] = useState(-1)
  const [educationForm, setEducationForm] = useState('')
  const [financing, setFinancing] = useState('')
  const [sex, setSex] = useState('')
  const [emailFieldErrorMessage, setEmailFieldErrorMessage] = useState('')
  const [emailFieldErrorBool, setEmailFieldErrorBool] = useState(false)
  const [disabledAddBtn, setDisabledAddBtn] = useState(true)

  const addStudent = async (e) => {
    e.preventDefault()
    setDisabledAddBtn(true)
    const form = document.getElementById('add-student-form')
    if (!form.checkValidity()) {
      e.stopPropagation()
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
    form.classList.add('was-validated')
    if (form.checkValidity()) {
      if (!verifyStudentData()) {
        form.classList.remove('was-validated')
        return
      }
      try {
        await axiosPrivate.post('/student', {
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
        toast.success(`A fost adaugat studentul ${fullName}`)
        setTimeout(() => {
          navigate('/students')
        }, 500)
      } catch (error) {
        console.log(error)
        if (error.response.status === 409) {
          form.classList.remove('was-validated')
          setEmailFieldErrorMessage('Exista deja un student cu acest email')
          setEmailFieldErrorBool(true)
        }
      }
    }
  }
  const verifyStudentData = (form) => {
    let valid = true
    if (email.split('@')[1] !== 'student.usv.ro') {
      setEmailFieldErrorMessage(
        'Email-ul trebuie sa fie de forma ' + ' @student.usv.ro'
      )
      setEmailFieldErrorBool(true)
      valid = false
    }
    return valid
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

  useEffect(() => {
    if (emailFieldErrorBool) {
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
  }, [emailFieldErrorBool])

  return (
    <div className='student-form-container'>
      <div className='card border-0 rounded-3 my-5 student-card'>
        <div className='card-body p-4 p-sm-5 student-card-body'>
          <h3 className='card-title text-center mb-3  fs-3'>Adauga Student</h3>
          <form
            className='student-form needs-validation'
            id='add-student-form'
            noValidate
          >
            <div className='student-email-and-name'>
              <div className='form-floating mb-3'>
                <input
                  type='email'
                  className={
                    emailFieldErrorBool
                      ? 'form-control is-invalid'
                      : 'form-control'
                  }
                  id='floatingStudentEmail'
                  placeholder='nume.prenume@student.usv.ro'
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailFieldErrorBool(false)
                    setDisabledAddBtn(false)
                  }}
                />
                <label htmlFor='floatingStudentEmail'>Email</label>
                <div
                  className={
                    emailFieldErrorBool
                      ? 'invalid-feedback student-form-invalid-feedback'
                      : 'invalid-feedback student-form-valid-feedback'
                  }
                >
                  {emailFieldErrorMessage}
                </div>
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
                    setDisabledAddBtn(false)
                  }}
                />
                <label htmlFor='floatingStudentName'>Nume complet</label>
                <div
                  className={
                    emailFieldErrorBool
                      ? 'invalid-feedback student-form-invalid-feedback'
                      : 'invalid-feedback student-form-valid-feedback'
                  }
                  style={{ visibility: 'hidden' }}
                >
                  Ceva
                </div>
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
                  setDisabledAddBtn(false)
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
                  setDisabledAddBtn(false)
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
                    setDisabledAddBtn(false)
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
                    setDisabledAddBtn(false)
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
                    setDisabledAddBtn(false)
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
                    setDisabledAddBtn(false)
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
                    setDisabledAddBtn(false)
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
            <div className='d-grid div-btn-add-student'>
              <button
                disabled={disabledAddBtn}
                className='btn btn-primary fw-bold btn-add-student'
                type='submit'
                onClick={addStudent}
              >
                Adauga
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddStudent
