import React, { useState, useEffect } from 'react'
import { axiosPrivate } from '../../../api/api'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import './EditCertificate.css'

function EditCertificate() {
  const navigate = useNavigate()
  const { registrationNr } = useParams()
  const [studentEmail, setStudentEmail] = useState('')
  const [certificatePurpose, setCertificatePurpose] = useState('')
  const [fullName, setFullName] = useState('')
  const [printed, setPrinted] = useState(false)
  const [invalidCertificatePurposeBool, setInvalidCertificatePurposeBool] =
    useState(false)
  const [
    invalidCertificatePurposeMessage,
    setInvalidCertificatePurposeMessage,
  ] = useState('')
  const [serverErrorBool, setServerErrorBool] = useState(false)
  const [serverErrorMessage, setServerErrorMessage] = useState('')
  const [disabledEditBtn, setDisabledEditBtn] = useState(true)

  const getCertificate = async () => {
    try {
      const response = await axiosPrivate.get(
        `/certificate/${encodeURIComponent(registrationNr)}`
      )
      const certificate = response.data
      setStudentEmail(certificate.studentEmail)
      setCertificatePurpose(certificate.certificatePurpose)
      setFullName(certificate.fullName)
      setPrinted(certificate.printed)
    } catch (error) {
      console.error(error)
    }
  }

  const editCertificate = async (e) => {
    e.preventDefault()
    setInvalidCertificatePurposeBool(false)
    setServerErrorBool(false)
    setDisabledEditBtn(true)
    if (certificatePurpose.length < 5) {
      setInvalidCertificatePurposeBool(true)
      setInvalidCertificatePurposeMessage(
        'Scopul adeverinței trebuie să aibă minim 5 caractere'
      )
      return
    }
    const form = document.getElementById('edit-certificate-form')
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
        await axiosPrivate.put(
          `/certificate/${encodeURIComponent(registrationNr)}`,
          {
            fullName,
            studentEmail,
            certificatePurpose,
            printed,
          }
        )
        toast.success(
          `Adeverința ${registrationNr} a fost actualizată cu succes.`
        )
        setTimeout(() => {
          navigate('/certificates/manage-certificates')
        }, 500)
      } catch (error) {
        console.log(error)
        form.classList.remove('was-validated')
        if (error.response.status === 500) {
          setServerErrorBool(true)
          setServerErrorMessage('Eroare la server. Încearcă din nou')
        }
      }
    }
  }

  useEffect(() => {
    getCertificate()
  }, [registrationNr])

  useEffect(() => {
    return () => {
      setTimeout(() => {
        toast.dismiss()
      }, 2000)
    }
  }, [])

  useEffect(() => {
    if (invalidCertificatePurposeBool) {
      toast.error('Eroare. Verificati datele introduse.', {
        theme: 'colored',
        autoClose: false,
      })
    }
  }, [invalidCertificatePurposeBool])

  useEffect(() => {
    toast.dismiss()
  }, [certificatePurpose, printed])

  return (
    <div className='edit-certificate-form-container'>
      <div className='card border-0 rounded-3 my-5 certificate-card'>
        <div className='card-body p-4 p-sm-5 certificate-card-body'>
          <h3 className='card-title text-center mb-3  fs-3'>
            Editează adeverința
          </h3>
          <form
            className='certificate-form needs-validation'
            id='edit-certificate-form'
            noValidate
            onSubmit={editCertificate}
          >
            <div className='form-floating mb-3'>
              <input
                type='text'
                className='form-control'
                id='floatingCertificateRegistrationNr'
                placeholder='Nr inregistrare'
                required
                readOnly
                value={registrationNr}
                onChange={(e) => {
                  // setRegistrationNr(e.target.value)
                  // setDisabledEditBtn(false)
                }}
              />
              <label htmlFor='floatingCertificateRegistrationNr'>
                Nr înregistrare
              </label>
            </div>
            <div className='form-floating mb-3'>
              <input
                type='text'
                className='form-control'
                id='floatingCertificateFullName'
                placeholder='Nume complet'
                required
                readOnly
                value={fullName}
                onChange={(e) => {
                  // setFullName(e.target.value)
                  // setDisabledEditBtn(false)
                }}
              />
              <label htmlFor='floatingCertificateFullName'>Nume complet</label>
            </div>
            <div className='form-floating mb-3'>
              <input
                type='email'
                readOnly
                className='form-control'
                id='floatingStudentEmail'
                placeholder='Email student'
                required
                value={studentEmail}
                onChange={(e) => {
                  // setStudentEmail(e.target.value)
                  // setDisabledEditBtn(false)
                }}
              />
              <label htmlFor='floatingStudentEmail'>Email student</label>
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
                  setInvalidCertificatePurposeBool(false)
                  setDisabledEditBtn(false)
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
            <div className='form-floating mb-3'>
              <select
                className='form-control'
                id='floatingCertificatePrinted'
                placeholder='printată'
                required
                value={printed}
                onChange={(e) => {
                  setPrinted(e.target.value === 'true')
                  setDisabledEditBtn(false)
                }}
              >
                <option value='false'>Nu</option>
                <option value='true'>Da</option>
              </select>
              <label htmlFor='floatingCertificatePrinted'>Printată</label>
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
            <div className='d-grid div-btn-edit-certificate'>
              <button
                disabled={disabledEditBtn}
                className='btn btn-primary fw-bold btn-edit-certificate'
                type='submit'
                onSubmit={editCertificate}
              >
                Editează
              </button>
              <button
                type='button'
                className='btn btn-danger fw-bold btn-cancel-edit-certificate'
                onClick={() => {
                  navigate('/certificates/manage-certificates')
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

export default EditCertificate
