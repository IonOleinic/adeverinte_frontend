import React, { useEffect, useState } from 'react'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { axiosPrivate } from '../../../api/api'
import { toast } from 'react-toastify'
import './CertificateOptions.css'

function CertificateOptions() {
  const [NR, setNR] = useState('')
  const [mask, setMask] = useState('')
  const [invalidMaskBool, setinvalidMaskBool] = useState(false)
  const [invalidMaskMessage, setinvalidMaskMessage] = useState('')
  const [disabledSaveBtn, setDisabledSaveBtn] = useState(true)

  const getLastUsedMask = async () => {
    try {
      const response = await axiosPrivate.get('/last-used-mask')
      setMask(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCertificateOptions = async () => {
    try {
      const response = await axiosPrivate.get('/certificate-options')
      setNR(response.data.NR)
      setMask(response.data.mask)
    } catch (error) {
      console.log(error)
    }
  }

  const saveOptions = async (e) => {
    toast.dismiss()
    setDisabledSaveBtn(true)
    e.preventDefault()
    const form = document.getElementById('certificate-options-form')
    if (!form.checkValidity()) {
      e.stopPropagation()
    }
    form.classList.add('was-validated')

    if (form.checkValidity()) {
      try {
        await axiosPrivate.put('/certificate-options', {
          NR,
          mask,
        })
        toast.success('Optiunile au fost salvate cu succes.', {
          theme: 'colored',
          autoClose: false,
        })
      } catch (error) {
        console.log(error)
        if (error.response.status === 400) {
          form.classList.remove('was-validated')
          setinvalidMaskBool(true)
          setinvalidMaskMessage('Masca introdusa nu este valida')
          toast.error('Eroare. Masca introdusa nu este valida.', {
            theme: 'colored',
            autoClose: false,
          })
        }
      }
    }
  }
  useEffect(() => {
    getLastUsedMask()
    getCertificateOptions()
    return () => {
      toast.dismiss()
    }
  }, [])

  return (
    <div className='certificate-options'>
      <div className='certificate-options-info'>
        <IoInformationCircleOutline
          size={45}
          className='certificate-options-info-icon'
        />
        <div>
          <p>
            {`Atenție, pentru a putea crea o adeverință, trebuie să setati numarul
          NR, necesar generarii adeverinței. De asemenea, ca administrator
          puteti seta masca numarului de inregistrare.
          `}
          </p>
          <p>{`Va rog sa respectati formatul.`}</p>
          <p>{`Exemplu: NR.A.i/[data]`}</p>
        </div>
      </div>
      <div className='certificate-options-form-container'>
        <div className='card border-0 rounded-3 my-5 certificate-options-card'>
          <div className='card-body p-4 p-sm-5 certificate-options-card-body'>
            <h3 className='card-title text-center mb-3  fs-3'>
              Optiuni adeverinte
            </h3>
            <form
              className='certificate-options-form needs-validation'
              id='certificate-options-form'
              noValidate
            >
              <div className='form-floating mb-3'>
                <input
                  type='number'
                  min={1}
                  className='form-control'
                  id='floatingCertificateNumber'
                  placeholder='NR'
                  required
                  value={NR}
                  onChange={(e) => {
                    setNR(e.target.value)
                    setDisabledSaveBtn(false)
                    setinvalidMaskBool(false)
                    toast.dismiss()
                  }}
                />
                <label htmlFor='floatingCertificateNumber'>NR</label>
              </div>

              <div className='form-floating mb-3'>
                <input
                  type='text'
                  className={
                    invalidMaskBool ? 'form-control is-invalid' : 'form-control'
                  }
                  id='floatingCertificateMask'
                  placeholder='NR.A.i/[data]'
                  required
                  value={mask}
                  onChange={(e) => {
                    setMask(e.target.value)
                    setDisabledSaveBtn(false)
                    setinvalidMaskBool(false)
                    toast.dismiss()
                  }}
                />
                <label htmlFor='floatingCertificateMask'>Masca</label>
                <div
                  className={
                    invalidMaskBool
                      ? 'invalid-feedback certificate-options-form-invalid-feedback'
                      : 'invalid-feedback certificate-options-form-valid-feedback'
                  }
                >
                  {invalidMaskMessage}
                </div>
              </div>

              <hr className='my-4' />
              <div className='d-grid div-btn-save-certificate-options'>
                <button
                  disabled={disabledSaveBtn}
                  className='btn btn-primary fw-bold btn-save-certificate-options'
                  type='submit'
                  onClick={saveOptions}
                >
                  Salveaza
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificateOptions
