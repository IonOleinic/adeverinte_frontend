import React, { useState, useEffect, useRef } from 'react'
import { LiaCheckSolid } from 'react-icons/lia'
import { LiaTimesSolid } from 'react-icons/lia'
import { LiaSave } from 'react-icons/lia'
import { toast } from 'react-toastify'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Dialog } from 'primereact/dialog'
import { Tooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom'
import './PendingRequestRow.css'

const getFormatedDate = (date) => {
  const dateObj = new Date(date)
  return `${dateObj.getDate()}.${addZero(
    dateObj.getMonth() + 1
  )}.${dateObj.getFullYear()} ${addZero(dateObj.getHours())}:${addZero(
    dateObj.getMinutes()
  )}`
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
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const [student, setStudent] = useState({})
  const [certificatePurpose, setCertificatePurpose] = useState(
    request.certificatePurpose
  )
  const [rejectedReason, setRejectedReason] = useState('')
  const [btnSavePurposeVisible, setBtnSavePurposeVisible] = useState(false)
  const [invalidCertificatePurposeBool, setInvalidCertificatePurposeBool] =
    useState(false)
  const [rejectDialogVisible, setRejectDialogVisible] = useState(false)
  const purposeFormRef = useRef()
  const purposeInputRef = useRef()

  const [invalidRejectReasonBool, setInvalidRejectReasonBool] = useState(false)
  const [invalidRejectReasonMessage, setInvalidRejectReasonMessage] =
    useState('')
  const [btnRejectRequestDisabled, setBtnRejectRequestDisabled] =
    useState(false)
  const [btnAcceptDisabled, setBtnAcceptDisabled] = useState(false)
  const [btnAcceptTooltip, setBtnAcceptTooltip] = useState('Accepta')
  const [btnRejectTooltip, setBtnRejectTooltip] = useState('Refuză')

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

  useEffect(() => {
    if (!student.id || certificatePurpose.length < 5) {
      if (!student.id) {
        setRejectedReason('Studentul nu există în baza de date')
        setBtnAcceptTooltip('Studentul nu există în baza de date')
        setBtnAcceptDisabled(true)
      } else if (certificatePurpose.length < 5) {
        setRejectedReason('Scopul este invalid')
        setBtnAcceptTooltip('Scopul este invalid')
        setBtnAcceptDisabled(true)
      }
    } else {
      setBtnAcceptDisabled(false)
      setRejectedReason('')
      setBtnAcceptTooltip('Acceptă')
    }
  }, [student, certificatePurpose])

  const acceptRequest = async (request) => {
    setBtnAcceptDisabled(true)
    setBtnAcceptTooltip('Se procesează...')
    toast.dismiss()

    if (certificatePurpose.length < 5) {
      const form = purposeFormRef.current
      form.classList.remove('was-validated')
      setInvalidCertificatePurposeBool(true)
      setBtnAcceptTooltip('Sopul este invalid')
      toast.error('Scopul adeverinței trebuie să aibă minim 5 caractere', {
        theme: 'colored',
        autoClose: false,
      })
      return
    }
    try {
      request.accepted = true
      request.handledBy = 'admin'
      request.certificatePurpose = certificatePurpose
      await axiosPrivate.post('/certificate', {
        studentEmail: request.studentEmail,
        certificatePurpose: request.certificatePurpose,
      })
      await axiosPrivate.put(`/certificate-request/${request.id}`, request)
      toast.success(
        `A fost adaugată o nouă adeverință pentru ${student?.fullName}`
      )
      getPendingRequests()
    } catch (error) {
      console.error(error)
      if (error.response.status === 500) {
        toast.error(
          `Eroare. Setati numar NR de la optiuni si apoi reincercati.`,
          { theme: 'colored', autoClose: false }
        )
      } else {
        toast.error('Cererea nu a putut fi procesată', {
          theme: 'colored',
          autoClose: false,
        })
      }
    }
    // setBtnAcceptDisabled(false)
  }

  const rejectRequest = async (e) => {
    e.preventDefault()
    toast.dismiss()
    setInvalidRejectReasonBool(false)
    setBtnRejectRequestDisabled(true)
    const form = document.getElementById('reject-request-form')
    form.classList.add('was-validated')
    if (rejectedReason.trim().length < 5) {
      form.classList.remove('was-validated')
      setInvalidRejectReasonBool(true)
      setInvalidRejectReasonMessage(
        'Motivul respingerii trebuie să aibă minim 5 caractere'
      )
      toast.error('Motivul respingerii trebuie să aibă minim 5 caractere', {
        theme: 'colored',
        autoClose: false,
      })
      return
    }
    try {
      request.accepted = false
      request.rejectedReason = rejectedReason
      request.handledBy = 'admin'
      await axiosPrivate.put(`/certificate-request/${request.id}`, request)
      setRejectDialogVisible(false)
      getPendingRequests()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <tr className='pending-request-row'>
        <td className='pending-request-row-item pending-request-row-date'>
          <p>{getFormatedDate(request.date)}</p>
        </td>
        <td
          className={`pending-request-row-item pending-request-row-email ${
            student.id ? 'pending-request-row-email-clickable' : ''
          }`}
          onClick={() => {
            if (student.id) {
              navigate(`/students/manage-students/edit-student/${student.id}`)
            }
          }}
        >
          <p>{request.studentEmail}</p>
        </td>
        <td className='pending-request-row-item pending-request-fullname'>
          <p>
            {student.fullName || getFullNameFromEmail(request.studentEmail)}
          </p>
        </td>
        <td className='pending-request-row-item pending-request-study-domain'>
          <p>{student.studyDomain || '-'}</p>
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
              placeholder='Scop adeverință'
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
          <Tooltip
            id={`tooltip-btn-accept-${request.id}`}
            // style={{
            //   display: !btnAcceptDisabled ? 'none' : 'revert',
            // }}
          />
          <button
            data-tooltip-id={`tooltip-btn-accept-${request.id}`}
            data-tooltip-content={btnAcceptTooltip}
            data-tooltip-place='left'
            disabled={btnAcceptDisabled}
            className='pending-request-row-button pending-request-row-accept'
            onClick={(e) => {
              acceptRequest(request)
            }}
          >
            <LiaCheckSolid size={23} />
          </button>
          <Tooltip id={`tooltip-btn-reject-${request.id}`} />
          <button
            data-tooltip-id={`tooltip-btn-reject-${request.id}`}
            data-tooltip-content={btnRejectTooltip}
            data-tooltip-place='left'
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
        style={{ minWidth: '500px', minHeight: '250px' }}
        onHide={() => {
          setRejectDialogVisible(false)
          toast.dismiss()
        }}
      >
        <form
          className='reject-request-form needs-validation'
          id='reject-request-form'
          noValidate
          onSubmit={rejectRequest}
        >
          <div className='form-floating mb-3'>
            <input
              id='floatingRejectReason'
              type='text'
              required
              placeholder='Motiv respingere cerere'
              className={
                invalidRejectReasonBool
                  ? 'form-control is-invalid'
                  : 'form-control'
              }
              value={rejectedReason}
              onChange={(e) => {
                setBtnRejectRequestDisabled(false)
                setRejectedReason(e.target.value)
                setInvalidRejectReasonBool(false)
                toast.dismiss()
              }}
            />
            <label htmlFor='floatingRejectReason'>Motiv respingere</label>
            <div
              className={
                invalidRejectReasonBool
                  ? 'invalid-feedback reject-request-form-invalid-feedback'
                  : 'invalid-feedback reject-request-form-valid-feedback'
              }
            >
              {invalidRejectReasonMessage}
            </div>
          </div>
          <button
            disabled={btnRejectRequestDisabled}
            className={'btn btn-primary btn-reject-request'}
            type='submit'
            onSubmit={rejectRequest}
          >
            Respinge cerere
          </button>
        </form>
      </Dialog>
    </>
  )
}

export default PendingRequestRow
