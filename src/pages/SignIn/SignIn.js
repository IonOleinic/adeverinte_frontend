import React from 'react'
import { FaGoogle } from 'react-icons/fa'
import './SignIn.css'

function SignIn() {
  return (
    <div className='signin'>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-9 col-md-7 col-lg-5 mx-auto'>
            <div className='card border-0 shadow rounded-3 my-5'>
              <div className='card-body p-4 p-sm-5'>
                <h3 className='card-title text-center mb-3  fs-3'>Sign In</h3>
                <form>
                  <div className='form-floating mb-3'>
                    <input
                      type='email'
                      className='form-control'
                      id='floatingInput'
                      placeholder='name@example.com'
                    />
                    <label htmlFor='floatingInput'>Email address</label>
                  </div>
                  <div className='form-floating mb-3'>
                    <input
                      type='password'
                      class='form-control'
                      id='floatingPassword'
                      placeholder='Password'
                    />
                    <label htmlFor='floatingPassword'>Password</label>
                  </div>

                  <div className='form-check mb-3'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value=''
                      id='rememberPasswordCheck'
                    />
                    <label
                      className='form-check-label'
                      htmlFor='rememberPasswordCheck'
                    >
                      Remember password
                    </label>
                  </div>
                  <div className='d-grid'>
                    <button
                      className='btn btn-primary btn-signin text-uppercase fw-bold'
                      type='submit'
                    >
                      Sign in
                    </button>
                  </div>
                  <hr className='my-4' />
                  <div className='d-grid mb-2'>
                    <button
                      className='btn btn-google btn-signin text-uppercase fw-bold'
                      type='submit'
                    >
                      <FaGoogle /> <p>Sign in with Google</p>
                    </button>
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
