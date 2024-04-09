import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../../api/api'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './AddCertificate.css'

function AddCertificate() {
  const navigate = useNavigate()
  const [studentEmail, setStudentEmail] = useState('')
  const [certificatePurpose, setCertificatePurpose] = useState('')
  const [invalidStudentEmailBool, setInvalidStudentEmailBool] = useState(false)
  const [invalidStudentEmailMessage, setInvalidStudentEmailMessage] =
    useState('')
  const [invalidCertificatePurposeBool, setInvalidCertificatePurposeBool] =
    useState(false)
  const [
    invalidCertificatePurposeMessage,
    setInvalidCertificatePurposeMessage,
  ] = useState('')
  const [serverErrorBool, setServerErrorBool] = useState(false)
  const [serverErrorMessage, setServerErrorMessage] = useState('')
  const [disabledAddBtn, setDisabledAddBtn] = useState(true)

  const AddCertificate = async (e) => {
    e.preventDefault()
    setInvalidStudentEmailBool(false)
    setInvalidCertificatePurposeBool(false)
    setServerErrorBool(false)
    if (certificatePurpose.length < 5) {
      setInvalidCertificatePurposeBool(true)
      setInvalidCertificatePurposeMessage(
        'Scopul adeverinței trebuie să aibă minim 5 caractere'
      )
      return
    }
    const form = document.getElementById('add-certificate-form')
    if (!form.checkValidity()) {
      e.stopPropagation()
      setDisabledAddBtn(true)
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
    form.classList.add('was-validated')

    if (form.checkValidity()) {
      try {
        await axiosPrivate.post('/certificate', {
          studentEmail,
          certificatePurpose,
        })

        const response = await axiosPrivate.get(
          `/student?email=${studentEmail}`
        )
        toast.success(
          `A fost adaugată o nouă adeverință pentru ${response.data?.fullName}`
        )
        setTimeout(() => {
          navigate('/certificates/manage-certificates')
        }, 500)
      } catch (error) {
        console.log(error)
        form.classList.remove('was-validated')
        if (error.response.status === 404) {
          setInvalidStudentEmailBool(true)
          setInvalidStudentEmailMessage(
            'Nu s-a gasit nici un student cu acest email'
          )
        } else if (error.response.status === 500) {
          setServerErrorBool(true)
          setServerErrorMessage(
            'Nu s-a putut genera numar de înregistrare. Setati numar NR si apoi reincercati.'
          )
          toast.error(
            `Eroare. Setati numar NR de la optiuni si apoi reincercati.`,
            { theme: 'colored', autoClose: false }
          )
        }
      }
    }
  }
  useEffect(() => {
    setServerErrorBool(false)
  }, [studentEmail, certificatePurpose])

  useEffect(() => {
    return () => {
      setTimeout(() => {
        toast.dismiss()
      }, 2000)
    }
  }, [])

  useEffect(() => {
    if (invalidStudentEmailBool || invalidCertificatePurposeBool) {
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
  }, [invalidStudentEmailBool, invalidCertificatePurposeBool])

  useEffect(() => {
    toast.dismiss()
  }, [studentEmail, certificatePurpose])

  return (
    <div className='add-certificate'>
      <div className='add-certificate-info'>
        <IoInformationCircleOutline
          size={45}
          className='add-certificate-info-icon'
        />
        <div>
          <p>
            {`Atenție, pentru a putea crea o adeverință, trebuie să fie setat numarul de inregistrare
          NR, necesar generarii adeverinței.
          `}
          </p>
        </div>
      </div>
      <div className='add-certificate-form-container'>
        <div className='card border-0 rounded-3 my-5 certificate-card'>
          <div className='card-body p-4 p-sm-5 certificate-card-body'>
            <h3 className='card-title text-center mb-3  fs-3'>
              Adaugă adeverință
            </h3>
            <form
              className='certificate-form needs-validation'
              id='add-certificate-form'
              noValidate
              onSubmit={AddCertificate}
            >
              <div className='form-floating mb-3'>
                <input
                  type='email'
                  className={
                    invalidStudentEmailBool
                      ? 'form-control is-invalid'
                      : 'form-control'
                  }
                  id='floatingStudentEmail'
                  placeholder='Email student'
                  required
                  value={studentEmail}
                  onChange={(e) => {
                    setStudentEmail(e.target.value)
                    setDisabledAddBtn(false)
                    setInvalidStudentEmailBool(false)
                  }}
                />
                <label htmlFor='floatingStudentEmail'>Email student</label>
                <div
                  className={
                    invalidStudentEmailBool
                      ? 'invalid-feedback certificate-form-invalid-feedback'
                      : 'invalid-feedback certificate-form-valid-feedback'
                  }
                >
                  {invalidStudentEmailMessage}
                </div>
              </div>

              <div className='form-floating mb-3'>
                <input
                  type='text'
                  className={
                    invalidCertificatePurposeBool
                      ? 'form-control is-invalid'
                      : 'form-control'
                  }
                  id='floatingCertificatePurpose'
                  placeholder='Scop adeverință'
                  required
                  minLength={5}
                  value={certificatePurpose}
                  onChange={(e) => {
                    setCertificatePurpose(e.target.value)
                    setDisabledAddBtn(false)
                    setInvalidCertificatePurposeBool(false)
                  }}
                />
                <label htmlFor='floatingCertificatePurpose'>
                  Scop adeverință
                </label>
                <div
                  className={
                    invalidCertificatePurposeBool
                      ? 'invalid-feedback certificate-form-invalid-feedback'
                      : 'invalid-feedback certificate-form-valid-feedback'
                  }
                >
                  {invalidCertificatePurposeMessage}
                </div>
              </div>
              <div
                className={
                  serverErrorBool
                    ? 'invalid-feedback certificate-form-invalid-feedback'
                    : 'invalid-feedback certificate-form-valid-feedback'
                }
              >
                {serverErrorMessage}
              </div>
              <hr className='my-4' />
              <div className='d-grid div-btn-add-certificate'>
                <button
                  disabled={disabledAddBtn}
                  className='btn btn-primary fw-bold btn-add-certificate'
                  type='submit'
                  onSubmit={AddCertificate}
                >
                  Adaugă
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCertificate
