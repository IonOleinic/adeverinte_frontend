import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import './EditFaculty.css'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

function EditFaculty() {
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const [facultyId, setFacultyId] = useState(-1)
  const [fullName, setFullName] = useState('')
  const [shortName, setShortName] = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [deanName, setDeanName] = useState('')
  const [chiefSecretarName, setChiefSecretarName] = useState('')

  const [disabledEditBtn, setDisabledEditBtn] = useState(true)

  const [invalidFullNameBool, setInvalidFullNameBool] = useState(false)
  const [invalidFullNameMessage, setInvalidFullNameMessage] = useState('')

  const [invalidShortNameBool, setInvalidShortNameBool] = useState(false)
  const [invalidShortNameMessage, setInvalidShortNameMessage] = useState('')

  const [invalidAcademicYearBool, setInvalidAcademicYearBool] = useState(false)
  const [invalidAcademicYearMessage, setInvalidAcademicYearMessage] =
    useState('')

  const [invalidDeanNameBool, setInvalidDeanNameBool] = useState(false)
  const [invalidDeanNameMessage, setInvalidDeanNameMessage] = useState('')

  const [invalidChiefSecretarNameBool, setInvalidChiefSecretarNameBool] =
    useState(false)
  const [invalidChiefSecretarNameMessage, setInvalidChiefSecretarNameMessage] =
    useState('')

  const [serverErrorBool, setServerErrorBool] = useState(false)
  const [serverErrorMessage, setServerErrorMessage] = useState('')

  const getFaculty = async () => {
    //TO DO => remake to get a single faculty by id from params !!!
    try {
      const response = await axiosPrivate.get(`/faculties`)
      const faculty = response.data[0]
      if (faculty) {
        setFacultyId(faculty.id)
        setFullName(faculty.fullName)
        setShortName(faculty.shortName)
        setAcademicYear(faculty.academicYear)
        setDeanName(faculty.deanName)
        setChiefSecretarName(faculty.chiefSecretarName)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const resetInputs = () => {
    toast.dismiss()
    setInvalidFullNameBool(false)
    setInvalidShortNameBool(false)
    setInvalidAcademicYearBool(false)
    setInvalidDeanNameBool(false)
    setInvalidChiefSecretarNameBool(false)
    setServerErrorBool(false)
    setDisabledEditBtn(true)
  }

  const editFaculty = async (e) => {
    e.preventDefault()
    resetInputs()
    if (fullName.length < 5) {
      setInvalidFullNameBool(true)
      setInvalidFullNameMessage(
        'Numele complet al facultății trebuie să aibă minim 5 caractere'
      )
      return
    }
    if (shortName.length < 2) {
      setInvalidShortNameBool(true)
      setInvalidShortNameMessage(
        'Numele scurt trebuie să aibă minim 2 caractere'
      )
      return
    }
    if (academicYear.length < 9) {
      setInvalidAcademicYearBool(true)
      setInvalidAcademicYearMessage(
        'Anul academic trebuie să aibă minim 9 caractere'
      )
      return
    }
    if (deanName.length < 9) {
      setInvalidDeanNameBool(true)
      setInvalidDeanNameMessage(
        'Numele decanului trebuie să aibă minim 5 caractere'
      )
      return
    }
    if (chiefSecretarName.length < 9) {
      setInvalidChiefSecretarNameBool(true)
      setInvalidChiefSecretarNameMessage(
        'Numele secretarei-șef trebuie să aibă minim 5 caractere'
      )
      return
    }
    const form = document.getElementById('edit-faculty-form')
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
        await axiosPrivate.put(`/faculty/${facultyId}`, {
          fullName,
          shortName,
          academicYear,
          deanName,
          chiefSecretarName,
        })
        toast.success(`A fost editată facultatea ${shortName}`)
        setTimeout(() => {
          navigate('/settings')
        }, 500)
      } catch (error) {
        console.log(error)
        form.classList.remove('was-validated')
        if (error.response.status === 500) {
          setServerErrorBool(true)
          setServerErrorMessage('Eroare server')
          toast.error('Eroare server', { theme: 'colored', autoClose: false })
        }
      }
    }
  }

  useEffect(() => {
    getFaculty()
  }, [])

  useEffect(() => {
    return () => {
      setTimeout(() => {
        toast.dismiss()
      }, 2000)
    }
  }, [])

  useEffect(() => {
    if (
      invalidFullNameBool ||
      invalidShortNameBool ||
      invalidAcademicYearBool ||
      invalidDeanNameBool ||
      invalidChiefSecretarNameBool
    ) {
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
  }, [
    invalidFullNameBool,
    invalidShortNameBool,
    invalidAcademicYearBool,
    invalidDeanNameBool,
    invalidChiefSecretarNameBool,
  ])

  return (
    <div className='faculty-form-container'>
      <div className='card border-0 rounded-3 my-5 faculty-card'>
        <div className='card-body p-4 p-sm-5 faculty-card-body'>
          <h3 className='card-title text-center mb-3  fs-3'>
            Editează facultatea
          </h3>
          <form
            className='faculty-form needs-validation'
            id='edit-faculty-form'
            noValidate
            onSubmit={editFaculty}
          >
            <div className='form-floating mb-3'>
              <input
                type='text'
                className={
                  invalidFullNameBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingFullName'
                placeholder='Nume complet'
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  setDisabledEditBtn(false)
                  setInvalidFullNameBool(false)
                }}
              />
              <label htmlFor='floatingFullName'>Nume complet</label>
              <div
                className={
                  invalidFullNameBool
                    ? 'invalid-feedback faculty-form-invalid-feedback'
                    : 'invalid-feedback faculty-form-valid-feedback'
                }
              >
                {invalidFullNameMessage}
              </div>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='text'
                className={
                  invalidShortNameBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingShortName'
                placeholder='Nume scurt'
                required
                minLength={2}
                value={shortName}
                onChange={(e) => {
                  setShortName(e.target.value)
                  setDisabledEditBtn(false)
                  setInvalidShortNameBool(false)
                }}
              />
              <label htmlFor='floatingShortName'>Nume scurt</label>
              <div
                className={
                  invalidShortNameBool
                    ? 'invalid-feedback faculty-form-invalid-feedback'
                    : 'invalid-feedback faculty-form-valid-feedback'
                }
              >
                {invalidShortNameMessage}
              </div>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='text'
                className={
                  invalidAcademicYearBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingAcademicYear'
                placeholder='An academic'
                required
                minLength={2}
                value={academicYear}
                onChange={(e) => {
                  setAcademicYear(e.target.value)
                  setDisabledEditBtn(false)
                  setInvalidAcademicYearBool(false)
                }}
              />
              <label htmlFor='floatingAcademicYear'>An academic</label>
              <div
                className={
                  invalidAcademicYearBool
                    ? 'invalid-feedback faculty-form-invalid-feedback'
                    : 'invalid-feedback faculty-form-valid-feedback'
                }
              >
                {invalidAcademicYearMessage}
              </div>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='text'
                className={
                  invalidDeanNameBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingDeanName'
                placeholder='Nume Decan'
                required
                minLength={2}
                value={deanName}
                onChange={(e) => {
                  setDeanName(e.target.value)
                  setDisabledEditBtn(false)
                  setInvalidDeanNameBool(false)
                }}
              />
              <label htmlFor='floatingDeanName'>Nume Decan</label>
              <div
                className={
                  invalidDeanNameBool
                    ? 'invalid-feedback faculty-form-invalid-feedback'
                    : 'invalid-feedback faculty-form-valid-feedback'
                }
              >
                {invalidDeanNameMessage}
              </div>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='text'
                className={
                  invalidChiefSecretarNameBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingChiefSecretarName'
                placeholder='Nume secretara-sef'
                required
                minLength={2}
                value={chiefSecretarName}
                onChange={(e) => {
                  setChiefSecretarName(e.target.value)
                  setDisabledEditBtn(false)
                  setInvalidChiefSecretarNameBool(false)
                }}
              />
              <label htmlFor='floatingChiefSecretarName'>
                Nume secretară-șef
              </label>
              <div
                className={
                  invalidChiefSecretarNameBool
                    ? 'invalid-feedback faculty-form-invalid-feedback'
                    : 'invalid-feedback faculty-form-valid-feedback'
                }
              >
                {invalidChiefSecretarNameMessage}
              </div>
            </div>

            <div
              className={
                serverErrorBool
                  ? 'invalid-feedback faculty-form-invalid-feedback'
                  : 'invalid-feedback faculty-form-valid-feedback'
              }
            >
              {serverErrorMessage}
            </div>
            <hr className='my-4' />
            <div className='d-grid div-btn-edit-faculty'>
              <button
                disabled={disabledEditBtn}
                className='btn btn-primary fw-bold btn-edit-faculty'
                type='submit'
                onSubmit={editFaculty}
              >
                Editează
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditFaculty
