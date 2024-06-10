import { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Calendar } from 'primereact/calendar'
import { toast } from 'react-toastify'
import { FloatLabel } from 'primereact/floatlabel'
import useAuth from '../../../hooks/useAuth'
import useRoles from '../../../hooks/useRoles'
import './CertificatesReport.css'

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

  const generateReport = async (e) => {
    e.preventDefault()
    setDisabledGenerateBtn(true)
    setServerErrorBool(false)
    toast.dismiss()
    try {
      const response = await axiosPrivate.get(
        `/certificates-report?start_date=${startDate}&end_date=${endDate}&fields=${JSON.stringify(
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
      link.setAttribute('download', `raport_adeverinte_${formattedDate}.xlsx`) // Setează numele fișierului
      document.body.appendChild(link)
      link.click()

      // Curăță URL-ul după descărcare
      window.URL.revokeObjectURL(url)
      toast.success('Raport adeverinte generat cu succes.', {
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
