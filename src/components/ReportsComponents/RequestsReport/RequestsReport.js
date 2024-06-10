import { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel'
import { toast } from 'react-toastify'
import './RequestsReport.css'

function RequestsReport() {
  const axiosPrivate = useAxiosPrivate()
  const [serverErrorBool, setServerErrorBool] = useState(false)
  const [serverErrorMessage, setServerErrorMessage] = useState('')
  const [disabledGenerateBtn, setDisabledGenerateBtn] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [exportedFieldsAccess, setExportedFieldsAccess] = useState(true)
  const [exportedFields, setExportedFields] = useState({
    studentEmail: true,
    date: true,
    certificatePurpose: true,
    handledBy: true,
    accepted: true,
    rejectedReason: true,
  })

  const fields = {
    studentEmail: 'Email student',
    date: 'Data',
    accepted: 'Acceptată',
    handledBy: 'Procesată de',
    rejectedReason: 'Motiv respingere',
    certificatePurpose: 'Scopul adeverinței',
  }

  const generateReport = async (e) => {
    e.preventDefault()
    setDisabledGenerateBtn(true)
    setServerErrorBool(false)
    toast.dismiss()
    try {
      const response = await axiosPrivate.get(
        `/requests-report?start_date=${startDate}&end_date=${endDate}&fields=${JSON.stringify(
          fields
        )}&exportedFields=${JSON.stringify(exportedFields)}`,
        {
          responseType: 'blob', // Specifică tipul răspunsului ca blob pentru fișiere
        }
      )
      const now = new Date()
      const formattedDate =
        now.getFullYear() +
        ('0' + (now.getMonth() + 1)).slice(-2) +
        ('0' + now.getDate()).slice(-2) +
        '_' +
        ('0' + now.getHours()).slice(-2) +
        ('0' + now.getMinutes()).slice(-2) +
        ('0' + now.getSeconds()).slice(-2)
      // Creează un URL pentru fișierul descărcat
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `raport_cereri_${formattedDate}.xlsx`) // Setează numele fișierului
      document.body.appendChild(link)
      link.click()

      // Curăță URL-ul după descărcare
      window.URL.revokeObjectURL(url)
      toast.success('Raport cereri generat cu succes.', {
        autoClose: false,
        theme: 'colored',
      })
    } catch (error) {
      console.log(error)
      setServerErrorBool(true)
      setServerErrorMessage('Eroare generare raport.')
      toast.error('Eroare generare raport.', {
        autoClose: false,
        theme: 'colored',
      })
    } finally {
      setDisabledGenerateBtn(false)
    }
  }

  useEffect(() => {
    toast.dismiss()
    return () => {
      toast.dismiss()
    }
  }, [])
  return (
    <div className='requests-report'>
      <div className='requests-report-form-container'>
        <div className='card border-0 rounded-3 my-5 report-card'>
          <div className='card-body p-4 p-sm-5 report-card-body'>
            <h3 className='card-title text-center mb-3  fs-3'>Raport Cereri</h3>
            <form
              className='report-form needs-validation'
              id='requests-report-form'
              noValidate
              onSubmit={generateReport}
            >
              <label htmlFor='selectedFields' className='form-label'>
                Câmpuri exportate
              </label>
              <div className='form-floating mb-3 exported-fields-container'>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='emailChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.studentEmail}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        studentEmail: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='emailChecked'>
                    Email student
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='dateChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.date}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        date: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='dateChecked'>
                    Data
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='acceptedChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.accepted}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        accepted: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='acceptedChecked'>
                    Acceptată
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='handledByChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.handledBy}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        handledBy: e.target.checked,
                      })
                    }}
                  />
                  <label
                    className='form-check-label'
                    htmlFor='handledByChecked'
                  >
                    Procesată de
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='rejectedChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.rejectedReason}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        rejectedReason: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='rejectedChecked'>
                    Motiv respingere
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='purposeChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.certificatePurpose}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        certificatePurpose: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='purposeChecked'>
                    Scopul
                  </label>
                </div>
              </div>
              <div className='form-floating mb-3 report-form-item'>
                <FloatLabel>
                  <Calendar
                    inputId='start_date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.value)}
                    dateFormat='dd/mm/yy'
                  />
                  <label htmlFor='start_date'>Data început</label>
                </FloatLabel>
              </div>

              <div className='form-floating mb-3 report-form-item'>
                <FloatLabel>
                  <Calendar
                    inputId='end_date'
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.value)
                    }}
                    dateFormat='dd/mm/yy'
                  />
                  <label htmlFor='end_date'>Data sfârșit</label>
                </FloatLabel>
              </div>
              <div
                className={
                  serverErrorBool
                    ? 'invalid-feedback report-form-invalid-feedback'
                    : 'invalid-feedback report-form-valid-feedback'
                }
              >
                {serverErrorMessage}
              </div>
              <hr className='my-4' />
              <div className='d-grid div-btn-generate-report'>
                <button
                  disabled={disabledGenerateBtn}
                  className='btn btn-primary fw-bold btn-generate-report'
                  type='submit'
                  onSubmit={generateReport}
                >
                  Generează
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestsReport
