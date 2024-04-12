import React, { useState, useEffect, useRef } from 'react'
import { LiaCheckSolid } from 'react-icons/lia'
import { LiaTimesSolid } from 'react-icons/lia'
import { LiaSave } from 'react-icons/lia'
import { toast } from 'react-toastify'
import { axiosPrivate } from '../../../api/api'
import { Dialog } from 'primereact/dialog'
import { confirmDialog } from 'primereact/confirmdialog'
import './PendingRequestRow.css'

const getFormatedDate = (date) => {
  const dateObj = new Date(date)
  return `${dateObj.getDate()}.${addZero(
    dateObj.getMonth() + 1
  )}.${dateObj.getFullYear()}`
}

const getFullNameFromEmail = (email) => {
  const fullName = email.split('@')[0]
  let firstName = fullName.split('.')[0]
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
  let lastName = fullName.split('.')[1].replace(/\d+/g, '')
  lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1)
  return `${lastName} ${firstName}`
}

const addZero = (number) => {
  return number < 10 ? `0${number}` : number
}

function PendingRequestRow({ request, getPendingRequests }) {
  const [student, setStudent] = useState({})
  const [certificatePurpose, setCertificatePurpose] = useState(
    request.certificatePurpose
  )
  const [btnSavePurposeVisible, setBtnSavePurposeVisible] = useState(false)
  const [invalidCertificatePurposeBool, setInvalidCertificatePurposeBool] =
    useState(false)
  const [rejectDialogVisible, setRejectDialogVisible] = useState(false)
  const purposeFormRef = useRef()
  const purposeInputRef = useRef()

  const saveRequest = async (e) => {
    e.preventDefault()
    toast.dismiss()
    setInvalidCertificatePurposeBool(false)
    if (certificatePurpose.trim() === request.certificatePurpose) {
      purposeInputRef.current.blur()
      return
    }
    const form = purposeFormRef.current
    form.classList.add('was-validated')
    if (certificatePurpose.length < 5) {
      form.classList.remove('was-validated')
      setInvalidCertificatePurposeBool(true)
      toast.error('Scopul adeverinței trebuie să aibă minim 5 caractere', {
        theme: 'colored',
        autoClose: false,
      })
      return
    }
    try {
      request.certificatePurpose = certificatePurpose.trim()
      await axiosPrivate.put(`/certificate-request/${request.id}`, request)
      setBtnSavePurposeVisible(false)
      purposeInputRef.current.blur()
      setTimeout(() => form.classList.remove('was-validated'), 1000)
    } catch (error) {
      console.log(error)
    }
  }

  const getStudent = async () => {
    try {
      const response = await axiosPrivate.get(
        `/student?email=${request.studentEmail}`
      )
      setStudent(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getStudent()
  }, [request.studentEmail])

  const createCertificate = async (request) => {
    try {
      await axiosPrivate.post('/certificate', {
        studentEmail: request.studentEmail,
        certificatePurpose: request.certificatePurpose,
      })
      request.accepted = true
      request.handledBy = 'admin'
      await axiosPrivate.put(`/certificate-request/${request.id}`, request)
      toast.success(
        `A fost adaugată o nouă adeverință pentru ${student?.fullName}`
      )
      getPendingRequests()
    } catch (error) {
      console.error(error)
      toast.error('Cererea nu a putut fi procesată', {
        theme: 'colored',
        autoClose: false,
      })
    }
  }

  return (
    <>
      <tr className='pending-request-row'>
        <td className='pending-request-row-item pending-request-row-date'>
          {getFormatedDate(request.date)}
        </td>
        <td className='pending-request-row-item pending-request-row-email'>
          {request.studentEmail}
        </td>
        <td className='pending-request-row-item pending-request-fullname'>
          {student.fullName || getFullNameFromEmail(request.studentEmail)}
        </td>
        <td className='pending-request-row-item pending-request-study-domain'>
          {student.studyDomain || '-'}
        </td>
        <td className='pending-request-row-item pending-request-row-purpose'>
          <form
            ref={purposeFormRef}
            className='request-row-purpose-form needs-validation'
            id='request-row-purpose-form'
            noValidate
            onSubmit={saveRequest}
          >
            <input
              ref={purposeInputRef}
              type='text'
              required
              placeholder=''
              className={
                invalidCertificatePurposeBool
                  ? 'form-control pending-request-row-purpose-input is-invalid'
                  : 'form-control pending-request-row-purpose-input'
              }
              value={certificatePurpose}
              onFocus={() => setBtnSavePurposeVisible(true)}
              onBlur={() => {
                setTimeout(() => {
                  setBtnSavePurposeVisible(false)
                  setCertificatePurpose(request.certificatePurpose)
                }, 150)
              }}
              onChange={(e) => {
                setCertificatePurpose(e.target.value)
                setInvalidCertificatePurposeBool(false)
                setBtnSavePurposeVisible(true)
                purposeFormRef.current.classList.remove('was-validated')
                toast.dismiss()
              }}
            />
            <button
              className={
                btnSavePurposeVisible
                  ? 'btn btn-primary btn-save-purpose'
                  : 'btn btn-primary btn-save-purpose btn-save-purpose-hidden'
              }
              type='submit'
              onClick={saveRequest}
            >
              <LiaSave size={20} />
            </button>
          </form>
        </td>
        <td className='pending-request-row-item pending-request-row-buttons'>
          <button
            disabled={student.email ? false : true}
            className='pending-request-row-button pending-request-row-accept'
            onClick={(e) => {
              createCertificate(request)
            }}
          >
            <LiaCheckSolid size={23} />
          </button>
          <button
            className='pending-request-row-button pending-request-row-reject'
            onClick={() => {
              setRejectDialogVisible(true)
            }}
          >
            <LiaTimesSolid size={23} />
          </button>
        </td>
      </tr>
      <Dialog
        header='Motiv respingere cerere'
        visible={rejectDialogVisible}
        style={{ width: '50vw' }}
        onHide={() => setRejectDialogVisible(false)}
      >
        <p className='m-0'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Dialog>
    </>
  )
}

export default PendingRequestRow
