import React, { useRef, useState, useEffect } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google'
import SiglaUSVNume from './images/usv-sigla-nume.jpg'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom'
import useAxios from '../../hooks/useAxios'
import useAuth from '../../hooks/useAuth'
import useLogout from '../../hooks/useLogout'
import './SignIn.css'

function SignIn() {
  const axios = useAxios()
  const logout = useLogout()
  const { auth, setAuth, persist, setPersist } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || { pathname: '/requests' }
  const signInRef = useRef()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [invalidCredentialsBool, setInvalidCredentialsBool] = useState(false)
  const [disabledSignInBtn, setDisabledSignInBtn] = useState(false)

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      await googleLogin(code)
    },
    onError: () => {
      toast.error('Eroare Logare!', {
        theme: 'colored',
        autoClose: false,
      })
    },
    flow: 'auth-code',
  })

  const googleLogin = async (code) => {
    try {
      const response = await axios.post('/auth/google', {
        code,
      })
      const accessToken = response.data.accessToken
      const roles = response.data.roles
      const email = response.data.email
      setAuth({ email, accessToken, roles })
      navigate(from, { replace: true })
    } catch (error) {
      console.log(error)
      if (!error.response) {
        toast.error('Eroare. Serverul nu raspunde!', {
          theme: 'colored',
          autoClose: false,
        })
      } else if (error.response.status === 401) {
        toast.error('Eroare logare. Datele introduse sunt incorecte!', {
          theme: 'colored',
          autoClose: false,
        })
      } else if (error.response.status === 500) {
        toast.error('Eroare server!', {
          theme: 'colored',
          autoClose: false,
        })
      } else {
        toast.error('Eroare logare!', {
          theme: 'colored',
          autoClose: false,
        })
      }
    }
  }

  const login = async (e) => {
    setDisabledSignInBtn(true)
    e.preventDefault()
    toast.dismiss()
    const form = signInRef.current
    if (!form.checkValidity()) {
      e.stopPropagation()
      setInvalidCredentialsBool(true)
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
    if (form.checkValidity()) {
      try {
        const response = await axios.post('/login', { email, password })
        form.classList.add('was-validated')
        const accessToken = response.data.accessToken
        const roles = response.data.roles
        setAuth({ email, accessToken, roles })
        navigate(from, { replace: true })
      } catch (error) {
        console.log(error)
        form.classList.remove('was-validated')
        if (!error.response) {
          toast.error('Eroare. Serverul nu raspunde!', {
            theme: 'colored',
            autoClose: false,
          })
        } else if (error.response.status === 401) {
          setInvalidCredentialsBool(true)
          toast.error('Eroare logare. Datele introduse sunt incorecte!', {
            theme: 'colored',
            autoClose: false,
          })
        } else if (error.response.status === 500) {
          toast.error('Eroare server!', {
            theme: 'colored',
            autoClose: false,
          })
        } else {
          toast.error('Eroare logare!', {
            theme: 'colored',
            autoClose: false,
          })
        }
      }
    }
    setDisabledSignInBtn(false)
  }

  useEffect(() => {
    setInvalidCredentialsBool(false)
  }, [email, password])

  useEffect(() => {
    localStorage.setItem('persist', persist)
  }, [persist])

  useEffect(() => {
    toast.dismiss()
    return () => toast.dismiss()
  }, [])
  return (
    <div className='signin'>
      <div className='sigin-usv-logo'>
        <img src={SiglaUSVNume} alt='Sigla USV cu nume' />
      </div>
      <div className='container signin-container'>
        <div className='row'>
          <div className='col-sm-9 col-md-7 col-lg-5 mx-auto'>
            <div className='card border-0 shadow rounded-3 my-5 signin-card'>
              <div className='card-body p-4 p-sm-5'>
                <h3 className='card-title text-center mb-3  fs-3'>
                  Autentificare
                </h3>
                <form
                  className='signin-form needs-validation'
                  ref={signInRef}
                  noValidate
                  onSubmit={login}
                >
                  <div className='form-floating mb-3'>
                    <input
                      type='email'
                      className={
                        invalidCredentialsBool
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                      id='floatingEmail'
                      placeholder='email'
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor='floatingEmail'>Adresa de email</label>
                  </div>
                  <div className='form-floating mb-3'>
                    <input
                      type='password'
                      className={
                        invalidCredentialsBool
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                      id='floatingPassword'
                      placeholder='Password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor='floatingPassword'>Parola</label>
                  </div>

                  <div className='form-check mb-3'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      checked={persist}
                      onChange={(e) => {
                        setPersist(e.target.checked)
                      }}
                      id='rememberPasswordCheck'
                    />
                    <label
                      className='form-check-label'
                      htmlFor='rememberPasswordCheck'
                    >
                      Păstrează-mă logat
                    </label>
                  </div>

                  <div className='d-grid'>
                    <button
                      disabled={disabledSignInBtn}
                      className='btn btn-primary btn-signin text-uppercase fw-bold'
                      type='submit'
                      onSubmit={login}
                    >
                      Intră în cont
                    </button>
                  </div>
                  <hr className='my-4' />
                  <div className='d-grid mb-2'>
                    <button
                      className='btn btn-google btn-signin text-uppercase fw-bold'
                      type='button'
                      onClick={handleGoogleLogin}
                    >
                      <FaGoogle /> <p>Autentificare cu Google</p>
                    </button>
                    {/* <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        console.log(credentialResponse)
                      }}
                      onError={() => {
                        console.log('Login Failed')
                      }}
                    /> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
