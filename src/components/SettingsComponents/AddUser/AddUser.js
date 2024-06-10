import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useRoles from '../../../hooks/useRoles'
import './AddUser.css'

function AddUser() {
  const navigate = useNavigate()
  const { roles } = useRoles()
  const axiosPrivate = useAxiosPrivate()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [title, setTitle] = useState('')
  const [userRoles, setUserRoles] = useState('')

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

  const [disabledAddBtn, setDisabledAddBtn] = useState(true)

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

  const addUser = async (e) => {
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
    if (!checkPassword(password)) {
      setInvalidPasswordBool(true)
      setInvalidPasswordMessage(
        'Parola trebuie să conțină cel puțin 8 caractere, o literă mare, o literă mică, un număr și un caracter special.'
      )
      return
    }
    if (password != confirmPassword) {
      setInvalidConfirmPasswordBool(true)
      setInvalidConfirmPasswordMessage('Parola nu coincide!')
      return
    }
    const form = document.getElementById('add-user-form')
    if (!form.checkValidity()) {
      e.stopPropagation()
      if (!verifyUserData()) {
        form.classList.remove('was-validated')
        return
      }
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
    form.classList.add('was-validated')

    if (form.checkValidity()) {
      try {
        let roles = [JSON.parse(userRoles)]
        await axiosPrivate.post('/register', {
          email,
          lastName,
          firstName,
          title,
          password,
          roles,
        })

        toast.success(`A fost adaugat utilizatorul ${lastName} ${firstName}`)
        setTimeout(() => {
          navigate('/settings/manage-users')
        }, 500)
      } catch (error) {
        console.log(error)
        form.classList.remove('was-validated')
        if (error.response?.status === 409) {
          setInvalidUserEmailBool(true)
          setInvalidUserEmailMessage(
            'Un utilizator cu acest email există deja.'
          )
        } else if (error.response?.status === 500) {
          setServerErrorBool(true)
          setServerErrorMessage('Eroare server.')
        } else {
          setServerErrorBool(true)
          setServerErrorMessage('Eroare server.')
        }
      }
    }
  }

  const verifyUserData = () => {
    let valid = true
    if (
      email.split('@')[1] !== 'student.usv.ro' &&
      email.split('@')[1] !== 'usm.ro'
    ) {
      setInvalidUserEmailMessage('Email-ul trebuie sa aparțină domeniului USV')
      setInvalidUserEmailBool(true)
      valid = false
    }
    return valid
  }

  function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return re.test(str)
  }

  useEffect(() => {
    toast.dismiss()
    return () => {
      toast.dismiss()
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

  return (
    <div className='user-form-container'>
      <div className='card border-0 rounded-3 my-5 user-card'>
        <div className='card-body p-4 p-sm-5 user-card-body'>
          <h3 className='card-title text-center mb-3  fs-3'>
            Adaugă utilizator
          </h3>
          <form
            className='user-form needs-validation'
            id='add-user-form'
            noValidate
            onSubmit={addUser}
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
                required
                autoComplete='new-password'
                minLength={8}
                value={password}
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
                placeholder='Password'
                required
                minLength={8}
                value={confirmPassword}
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
                value={userRoles}
                onChange={(e) => {
                  setUserRoles(e.target.value)
                  setDisabledAddBtn(false)
                }}
              >
                <option value={''}>Selecteaza...</option>
                <option disabled value={roles.Admin}>{`Admin`}</option>
                <option value={roles.Secretar}>{`Secretar(ă)`}</option>
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
            <div className='d-grid div-btn-add-user'>
              <button
                disabled={disabledAddBtn}
                className='btn btn-primary fw-bold btn-add-user'
                type='submit'
                onSubmit={addUser}
              >
                Adaugă
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddUser
