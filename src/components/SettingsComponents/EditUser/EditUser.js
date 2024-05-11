import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useRoles from '../../../hooks/useRoles'
import useAuth from '../../../hooks/useAuth'
import './EditUser.css'

function AddUser() {
  const navigate = useNavigate()
  const { auth, setAuth } = useAuth()
  const { userId } = useParams()
  const { roles } = useRoles()
  const axiosPrivate = useAxiosPrivate()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [title, setTitle] = useState('')
  const [userRoles, setUserRoles] = useState('')
  const [useNewPassword, setUseNewPassword] = useState(false)

  const [invalidUserEmailBool, setInvalidUserEmailBool] = useState(false)
  const [invalidUserEmailMessage, setInvalidUserEmailMessage] = useState('')

  const [invalidFirstNameBool, setInvalidFirstNameBool] = useState(false)
  const [invalidFirstNameMessage, setInvalidFirstNameMessage] = useState('')

  const [invalidLastNameBool, setInvalidLastNameBool] = useState(false)
  const [invalidLastNameMessage, setInvalidLastNameMessage] = useState('')

  const [invalidPasswordBool, setInvalidPasswordBool] = useState(false)
  const [invalidPasswordMessage, setInvalidPasswordMessage] = useState('')

  const [invalidConfirmPasswordBool, setInvalidConfirmPasswordBool] =
    useState(false)
  const [invalidConfirmPasswordMessage, setInvalidConfirmPasswordMessage] =
    useState('')

  const [serverErrorBool, setServerErrorBool] = useState(false)
  const [serverErrorMessage, setServerErrorMessage] = useState('')

  const [disabledEditBtn, setDisabledAddBtn] = useState(true)

  useEffect(() => {
    setServerErrorBool(false)
  }, [email, lastName, firstName])

  const resetInputs = () => {
    toast.dismiss()
    setInvalidUserEmailBool(false)
    setInvalidLastNameBool(false)
    setInvalidFirstNameBool(false)
    setInvalidPasswordBool(false)
    setInvalidConfirmPasswordBool(false)
    setServerErrorBool(false)
    setDisabledAddBtn(true)
  }

  const editUser = async (e) => {
    e.preventDefault()
    resetInputs()
    if (lastName.length < 2) {
      setInvalidLastNameBool(true)
      setInvalidLastNameMessage('Numele trebuie să aibă minim 2 caractere')
      return
    }
    if (firstName.length < 2) {
      setInvalidFirstNameBool(true)
      setInvalidFirstNameMessage('Prenumele trebuie să aibă minim 2 caractere')
      return
    }
    if (useNewPassword) {
      if (password != confirmPassword) {
        setInvalidConfirmPasswordBool(true)
        setInvalidConfirmPasswordMessage('Parolele nu coincid!')
        return
      }
    }

    const form = document.getElementById('edit-user-form')
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
        if (useNewPassword) {
          await axiosPrivate.put(`/user/${userId}`, {
            email,
            lastName,
            firstName,
            title,
            password,
          })
        } else {
          await axiosPrivate.put(`/user/${userId}`, {
            email,
            lastName,
            firstName,
            title,
          })
        }
        toast.success(`A fost editt utilizatorul ${lastName} ${firstName}`)
        if (auth.email === email) {
          setAuth({ ...auth, lastName, firstName })
        }
        setTimeout(() => {
          navigate('/settings/manage-users')
        }, 500)
      } catch (error) {
        console.log(error)
        form.classList.remove('was-validated')
        if (error.response.status === 409) {
          setInvalidUserEmailBool(true)
          setInvalidUserEmailMessage(
            'Un utilizator cu acest email există deja.'
          )
        } else if (error.response.status === 500) {
          setServerErrorBool(true)
          setServerErrorMessage('Eroare server.')
        }
      }
    }
  }

  const getUser = async () => {
    try {
      const response = await axiosPrivate.get(`user/${userId}`)
      setEmail(response.data?.email)
      setLastName(response.data?.lastName)
      setFirstName(response.data?.firstName)
      setTitle(response.data?.title)
      setUserRoles(response.data?.roles[0].toString())
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [userId])

  useEffect(() => {
    return () => {
      setTimeout(() => {
        toast.dismiss()
      }, 2000)
    }
  }, [])

  useEffect(() => {
    if (invalidUserEmailBool || invalidLastNameBool || invalidFirstNameBool) {
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
  }, [invalidUserEmailBool, invalidLastNameBool, invalidFirstNameBool])

  useEffect(() => {
    if (password || confirmPassword) {
      setUseNewPassword(true)
    } else {
      setUseNewPassword(false)
    }
  }, [password, confirmPassword])

  return (
    <div className='user-form-container'>
      <div className='card border-0 rounded-3 my-5 user-card'>
        <div className='card-body p-4 p-sm-5 user-card-body'>
          <h3 className='card-title text-center mb-3  fs-3'>
            Editează utilizator
          </h3>
          <form
            className='user-form needs-validation'
            id='edit-user-form'
            noValidate
            onSubmit={editUser}
          >
            <div className='form-floating mb-3'>
              <input
                type='email'
                className={
                  invalidUserEmailBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingUserEmail'
                placeholder='Email utilzator'
                required
                readOnly
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setDisabledAddBtn(false)
                  setInvalidUserEmailBool(false)
                }}
              />
              <label htmlFor='floatingUserEmail'>Email utilizator</label>
              <div
                className={
                  invalidUserEmailBool
                    ? 'invalid-feedback user-form-invalid-feedback'
                    : 'invalid-feedback user-form-valid-feedback'
                }
              >
                {invalidUserEmailMessage}
              </div>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='text'
                className={
                  invalidLastNameBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingLastName'
                placeholder='Nume'
                required
                minLength={2}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  setDisabledAddBtn(false)
                  setInvalidLastNameBool(false)
                }}
              />
              <label htmlFor='floatingLastName'>Nume</label>
              <div
                className={
                  invalidLastNameBool
                    ? 'invalid-feedback user-form-invalid-feedback'
                    : 'invalid-feedback user-form-valid-feedback'
                }
              >
                {invalidLastNameMessage}
              </div>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='text'
                className={
                  invalidFirstNameBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingFirstName'
                placeholder='Prenume'
                required
                minLength={2}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  setDisabledAddBtn(false)
                  setInvalidFirstNameBool(false)
                }}
              />
              <label htmlFor='floatingFirstName'>Prenume</label>
              <div
                className={
                  invalidFirstNameBool
                    ? 'invalid-feedback user-form-invalid-feedback'
                    : 'invalid-feedback user-form-valid-feedback'
                }
              >
                {invalidFirstNameMessage}
              </div>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='text'
                className='form-control'
                id='floatingTitle'
                placeholder='Titlu'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setDisabledAddBtn(false)
                }}
              />
              <label htmlFor='floatingTitle'>Titlu</label>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='password'
                className={
                  invalidPasswordBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingPassword'
                placeholder='Password'
                minLength={5}
                value={password}
                autoComplete='new-password'
                onChange={(e) => {
                  setPassword(e.target.value)
                  setDisabledAddBtn(false)
                  setInvalidPasswordBool(false)
                }}
              />
              <label htmlFor='floatingPassword'>Parola</label>
              <div
                className={
                  invalidPasswordBool
                    ? 'invalid-feedback user-form-invalid-feedback'
                    : 'invalid-feedback user-form-valid-feedback'
                }
              >
                {invalidPasswordMessage}
              </div>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='password'
                className={
                  invalidConfirmPasswordBool
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                id='floatingConfirmPassword'
                placeholder='Confirm password'
                minLength={5}
                value={confirmPassword}
                autoComplete='new-password'
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setDisabledAddBtn(false)
                  setInvalidConfirmPasswordBool(false)
                }}
              />
              <label htmlFor='floatingConfirmPassword'>Confirma parola</label>
              <div
                className={
                  invalidConfirmPasswordBool
                    ? 'invalid-feedback user-form-invalid-feedback'
                    : 'invalid-feedback user-form-valid-feedback'
                }
              >
                {invalidConfirmPasswordMessage}
              </div>
            </div>

            <div className='form-floating'>
              <select
                className='form-select'
                id='floatingUserRoles'
                aria-label='Role'
                required
                readOnly
                value={userRoles}
                onChange={(e) => {
                  setUserRoles(e.target.value)
                  setDisabledAddBtn(false)
                }}
              >
                <option disabled value={''}>
                  Selecteaza...
                </option>
                <option disabled value={roles.Admin}>{`Admin`}</option>
                <option disabled value={roles.Secretar}>{`Secretar(ă)`}</option>
              </select>
              <label htmlFor='floatingUserRoles'>Rol</label>
            </div>

            <div
              className={
                serverErrorBool
                  ? 'invalid-feedback user-form-invalid-feedback'
                  : 'invalid-feedback user-form-valid-feedback'
              }
            >
              {serverErrorMessage}
            </div>
            <hr className='my-4' />
            <div className='d-grid div-btn-edit-user'>
              <button
                disabled={disabledEditBtn}
                className='btn btn-primary fw-bold btn-edit-user'
                type='submit'
                onSubmit={editUser}
              >
                Editează
              </button>
              <button
                type='button'
                className='btn btn-danger fw-bold btn-cancel-edit-user'
                onClick={() => {
                  navigate('/settings/manage-users')
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

export default AddUser
