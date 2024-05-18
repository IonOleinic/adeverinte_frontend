import { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Calendar } from 'primereact/calendar'
import * as XLSX from 'xlsx'
import { FloatLabel } from 'primereact/floatlabel'
import useAuth from '../../../hooks/useAuth'
import useRoles from '../../../hooks/useRoles'
import { toast } from 'react-toastify'
import './RequestsReport.css'

const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)
  return `${day}.${month}.${year}`
}

function RequestsReport() {
  // const { auth } = useAuth()
  // const { roles } = useRoles()
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

  const getRequests = async () => {
    try {
      const response = await axiosPrivate.get(
        `/certificate-requests?start-date=${startDate}&end-date=${endDate}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      setServerErrorBool(true)
      setServerErrorMessage('Eroare server.')
    }
  }

  const generateReport = async (e) => {
    e.preventDefault()
    setDisabledGenerateBtn(true)
    setServerErrorBool(false)
    toast.dismiss()
    try {
      const requests = await getRequests()
      const selectedFields = Object.keys(exportedFields).filter(
        (key) => exportedFields[key]
      )

      const dates = requests.map((request) => new Date(request.date))
      const formatedStartDate = startDate
        ? formatDate(startDate)
        : formatDate(new Date(Math.min(...dates)))
      const formatedEndDate = endDate
        ? formatDate(endDate)
        : formatDate(new Date(Math.max(...dates)))

      const dataToExport = requests.map((request) => {
        request.date = formatDate(request.date)
        request.accepted = request.accepted ? 'Da' : 'Nu'
        const filteredRequest = []
        selectedFields.forEach((key) => {
          const fieldKey = key.replace('Checked', '')
          filteredRequest.push(request[fieldKey] || '-')
        })
        return filteredRequest
      })

      // Create custom header rows
      const titleRow = ['Raport Cereri']
      const periodRow = [`Perioada ${formatedStartDate} - ${formatedEndDate}`]
      const headersRow = selectedFields.map(
        (key) => fields[key.replace('Checked', '')]
      )

      // Add custom rows and data
      const worksheetData = [titleRow, periodRow, headersRow, ...dataToExport]

      // Calculate column widths based on the longest text in each column
      const colWidths = selectedFields.map((key, colIndex) => {
        const maxFieldLength = Math.max(
          ...worksheetData
            .slice(2)
            .map((row) => row[colIndex].toString().length)
        )
        return { wch: maxFieldLength }
      })

      const ws = XLSX.utils.aoa_to_sheet(worksheetData)

      // Set column widths
      ws['!cols'] = colWidths

      // Merge title cells
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }]

      // Merge period cells
      ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 2 } })

      // Center-align title and period
      ws['A1'].s = { alignment: { horizontal: 'center' } } // Title
      ws['A2'].s = { alignment: { horizontal: 'center' } } // Period

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Raport Cereri')

      const now = new Date()
      const formattedDate =
        now.getFullYear() +
        ('0' + (now.getMonth() + 1)).slice(-2) +
        ('0' + now.getDate()).slice(-2) +
        '_' +
        ('0' + now.getHours()).slice(-2) +
        ('0' + now.getMinutes()).slice(-2) +
        ('0' + now.getSeconds()).slice(-2)

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], { type: 'application/octet-stream' })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'
      a.href = url
      a.download = `raport_cereri_${formattedDate}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Raport generat cu succes.', {
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

  // useEffect(() => {
  //   if (auth.roles?.includes(roles.Admin)) {
  //     setExportedFieldsAccess(true)
  //     setExportedFields({
  //       registrationNr: true,
  //       date: true,
  //       fullName: true,
  //       studyDomain: true,
  //       studyProgram: true,
  //       educationForm: true,
  //       studyCycle: true,
  //       studyYear: true,
  //       financing: true,
  //       certificatePurpose: true,
  //     })
  //   } else {
  //     setExportedFieldsAccess(false)
  //     setExportedFields({
  //       registrationNr: true,
  //       date: true,
  //       fullName: true,
  //       studyDomain: false,
  //       studyProgram: false,
  //       educationForm: false,
  //       studyCycle: false,
  //       studyYear: false,
  //       financing: false,
  //       certificatePurpose: true,
  //     })
  //   }
  // }, [roles, auth])

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
