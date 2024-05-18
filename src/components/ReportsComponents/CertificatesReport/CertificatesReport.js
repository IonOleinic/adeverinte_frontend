import { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Calendar } from 'primereact/calendar'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import { FloatLabel } from 'primereact/floatlabel'
import useAuth from '../../../hooks/useAuth'
import useRoles from '../../../hooks/useRoles'
import './CertificatesReport.css'

const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)
  return `${day}.${month}.${year}`
}

function CertificatesReport() {
  const { auth } = useAuth()
  const { roles } = useRoles()
  const axiosPrivate = useAxiosPrivate()
  const [serverErrorBool, setServerErrorBool] = useState(false)
  const [serverErrorMessage, setServerErrorMessage] = useState('')
  const [disabledGenerateBtn, setDisabledGenerateBtn] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [exportedFieldsAccess, setExportedFieldsAccess] = useState(true)
  const [exportedFields, setExportedFields] = useState({
    registrationNr: true,
    createdAt: true,
    fullName: true,
    studyDomain: true,
    studyProgram: true,
    educationForm: true,
    studyCycle: true,
    studyYear: true,
    financing: true,
    certificatePurpose: true,
  })

  const fields = {
    registrationNr: 'Nr înregistrare',
    createdAt: 'Data',
    fullName: 'Nume complet',
    studyDomain: 'Domeniu de studii',
    studyProgram: 'Program de studii',
    educationForm: 'Forma de învățământ',
    studyCycle: 'Ciclu de studii',
    studyYear: 'An',
    financing: 'Finanțare',
    certificatePurpose: 'Scopul',
  }

  const getCertificates = async () => {
    try {
      const response = await axiosPrivate.get(
        `/certificates?start-date=${startDate}&end-date=${endDate}`
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
      const certificates = await getCertificates()
      console.log(certificates)
      const selectedFields = Object.keys(exportedFields).filter(
        (key) => exportedFields[key]
      )

      const dates = certificates.map(
        (certificate) => new Date(certificate.createdAt)
      )
      let formattedStartDate = '?'
      let formattedEndDate = '?'
      if (dates.length !== 0) {
        formattedStartDate = startDate
          ? formatDate(startDate)
          : formatDate(new Date(Math.min(...dates)))
        formattedEndDate = endDate
          ? formatDate(endDate)
          : formatDate(new Date(Math.max(...dates)))
      }

      const dataToExport = certificates.map((certificate) => {
        certificate.createdAt = formatDate(certificate.createdAt)
        const filteredCertificate = []
        selectedFields.forEach((key) => {
          const fieldKey = key.replace('Checked', '')
          filteredCertificate.push(certificate[fieldKey] || '-')
        })
        return filteredCertificate
      })

      // Create custom header rows
      const titleRow = ['Raport Adeverințe']
      const periodRow = [`Perioada ${formattedStartDate} - ${formattedEndDate}`]
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
      XLSX.utils.book_append_sheet(wb, ws, 'Raport Adeverințe')

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
      a.download = `raport_adeverinte_${formattedDate}.xlsx`
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

  useEffect(() => {
    if (auth.roles?.includes(roles.Admin)) {
      setExportedFieldsAccess(true)
      setExportedFields({
        registrationNr: true,
        createdAt: true,
        fullName: true,
        studyDomain: true,
        studyProgram: true,
        educationForm: true,
        studyCycle: true,
        studyYear: true,
        financing: true,
        certificatePurpose: true,
      })
    } else {
      setExportedFieldsAccess(false)
      setExportedFields({
        registrationNr: true,
        createdAt: true,
        fullName: true,
        studyDomain: false,
        studyProgram: false,
        educationForm: false,
        studyCycle: false,
        studyYear: false,
        financing: false,
        certificatePurpose: true,
      })
    }
  }, [roles, auth])

  useEffect(() => {
    toast.dismiss()
    return () => {
      toast.dismiss()
    }
  }, [])
  return (
    <div className='certificates-report'>
      <div className='certificates-report-form-container'>
        <div className='card border-0 rounded-3 my-5 report-card'>
          <div className='card-body p-4 p-sm-5 report-card-body'>
            <h3 className='card-title text-center mb-3  fs-3'>
              Raport Adeverințe
            </h3>
            <form
              className='report-form needs-validation'
              id='certificates-report-form'
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
                    id='nrChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.registrationNr}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        registrationNr: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='nrChecked'>
                    Nr înregistrare
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='dateChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.createdAt}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        createdAt: e.target.checked,
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
                    id='nameChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.fullName}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        fullName: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='nameChecked'>
                    Nume complet
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='domainChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.studyDomain}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        studyDomain: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='domainChecked'>
                    Domeniu de studii
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='programChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.studyProgram}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        studyProgram: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='programChecked'>
                    Program de studii
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='edFormChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.educationForm}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        educationForm: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='edFormChecked'>
                    Forma de învățământ
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='cycleChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.studyCycle}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        studyCycle: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='cycleChecked'>
                    Ciclu de studii
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='yearChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.studyYear}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        studyYear: e.target.checked,
                      })
                    }}
                  />
                  <label className='form-check-label' htmlFor='yearChecked'>
                    An
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='financingChecked'
                    disabled={!exportedFieldsAccess}
                    checked={exportedFields.financing}
                    onChange={(e) => {
                      setExportedFields({
                        ...exportedFields,
                        financing: e.target.checked,
                      })
                    }}
                  />
                  <label
                    className='form-check-label'
                    htmlFor='financingChecked'
                  >
                    Finanțare
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

export default CertificatesReport
