import { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Message } from 'primereact/message'
import { confirmDialog } from 'primereact/confirmdialog'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import './GeneralSettings.css'

const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)
  return `${day}.${month}.${year}`
}
function GeneralSettings() {
  const axiosPrivate = useAxiosPrivate()
  const [spreadsheet, setSpreadsheet] = useState({})
  const [googleSpreadsheetId, setGoogleSpreadsheetId] = useState('')
  const [disabledEditBtn, setDisabledEditBtn] = useState(true)
  const [disabledResetBtn, setDisabledResetBtn] = useState(false)
  const [invalidSpreadsheetBool, setInvalidSpreadsheetBool] = useState(false)
  const [invalidSpreadsheetMessage, setInvalidSpreadsheetMessage] = useState('')

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
      const response = await axiosPrivate.get(`/certificates`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const generateReport = async () => {
    try {
      const certificates = await getCertificates()

      // Define all fields that need to be exported
      const allFields = Object.keys(fields)

      const dates = certificates.map(
        (certificate) => new Date(certificate.createdAt)
      )
      let formattedStartDate = '?'
      let formattedEndDate = '?'
      if (dates.length !== 0) {
        formattedStartDate = formatDate(new Date(Math.min(...dates)))
        formattedEndDate = formatDate(new Date(Math.max(...dates)))
      }

      const dataToExport = certificates.map((certificate) => {
        certificate.createdAt = formatDate(certificate.createdAt)
        return allFields.map((key) => certificate[key] || '-')
      })

      // Create custom header rows
      const titleRow = ['Raport Adeverințe']
      const periodRow = [`Perioada ${formattedStartDate} - ${formattedEndDate}`]
      const headersRow = allFields.map((key) => fields[key])

      // Add custom rows and data
      const worksheetData = [titleRow, periodRow, headersRow, ...dataToExport]

      // Calculate column widths based on the longest text in each column
      const colWidths = allFields.map((key, colIndex) => {
        const maxFieldLength = Math.max(
          ...worksheetData.map((row) => row[colIndex]?.toString().length || 0)
        )
        return { wch: maxFieldLength }
      })

      const ws = XLSX.utils.aoa_to_sheet(worksheetData)

      // Set column widths
      ws['!cols'] = colWidths

      // Merge title cells
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: allFields.length - 1 } },
      ]

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
      return true
    } catch (error) {
      console.log(error)
      toast.error('Eroare generare raport adeverințe.', {
        autoClose: false,
        theme: 'colored',
      })
      return false
    }
  }

  const getSpreadsheet = async () => {
    try {
      const response = await axiosPrivate.get('/spreadsheet')
      setSpreadsheet(response.data)
      setGoogleSpreadsheetId(response.data.googleSpreadsheetId)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteAllCertificates = async () => {
    try {
      await axiosPrivate.delete('/certificates')
      return true
    } catch (error) {
      console.error(error)
      toast.error('Eroare ștergere adeverințe.', {
        autoClose: false,
        theme: 'colored',
      })
      return false
    }
  }

  const deleteAllStudents = async () => {
    try {
      await axiosPrivate.delete('/students')
      return true
    } catch (error) {
      console.error(error)
      toast.error('Eroare ștergere studenți.', {
        autoClose: false,
        theme: 'colored',
      })
      return false
    }
  }

  const resetApp = async () => {
    try {
      setDisabledResetBtn(true)
      toast.dismiss()
      let result = false
      result =
        (await generateReport()) &&
        (await deleteAllCertificates()) &&
        (await deleteAllStudents())
      setDisabledResetBtn(false)
      if (result) {
        toast.info('Aplicație resetată cu succes.', {
          autoClose: false,
          theme: 'colored',
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const editSpreadsheet = async (e) => {
    e.preventDefault()
    setDisabledEditBtn(true)
    setInvalidSpreadsheetBool(false)
    toast.dismiss()
    try {
      await axiosPrivate.put('/spreadsheet', {
        ...spreadsheet,
        googleSpreadsheetId: googleSpreadsheetId,
      })
      toast.success('Spreadsheet actualizat cu succes.', {
        autoClose: 5000,
        theme: 'colored',
      })
    } catch (error) {
      if (error.response?.status === 400) {
        setInvalidSpreadsheetBool(true)
        setInvalidSpreadsheetMessage('Id-ul spreadsheet-ului este invalid.')
        toast.error('Id-ul spreadsheet-ului este invalid.', {
          autoClose: false,
          theme: 'colored',
        })
      } else {
        console.error(error)
        toast.error('Eroare actualizare spreadsheet.', {
          autoClose: false,
          theme: 'colored',
        })
      }
    } finally {
      setDisabledEditBtn(false)
    }
  }
  useEffect(() => {
    getSpreadsheet()
    return () => {
      toast.dismiss()
    }
  }, [])

  return (
    <div className='general-settings'>
      <div className='general-settings-item'>
        <span className='general-settings-item-title'> Setări Spreadsheet</span>
        <div className='spreadsheet-form-container'>
          <div className='card border-0 rounded-3 my-5 spreadsheet-card'>
            <div className='card-body p-4 p-sm-5 spreadsheet-card-body'>
              <form
                className='spreadsheet-form needs-validation'
                id='edit-spreadsheet-form'
                noValidate
                onSubmit={editSpreadsheet}
              >
                <div className='form-floating mb-3'>
                  <input
                    type='text'
                    className={
                      invalidSpreadsheetBool
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    id='floatingSpreadsheetId'
                    placeholder='Spreadsheet Id'
                    required
                    value={googleSpreadsheetId}
                    onChange={(e) => {
                      setGoogleSpreadsheetId(e.target.value)
                      setDisabledEditBtn(false)
                      setInvalidSpreadsheetBool(false)
                    }}
                  />
                  <label htmlFor='floatingSpreadsheetId'>
                    Google Spreadsheet Id
                  </label>
                  <div
                    className={
                      invalidSpreadsheetBool
                        ? 'invalid-feedback spreadsheet-form-invalid-feedback'
                        : 'invalid-feedback spreadsheet-form-valid-feedback'
                    }
                  >
                    {invalidSpreadsheetMessage}
                  </div>
                </div>
                <hr className='my-4' />
                <div className='d-grid div-btn-edit-spreadsheet'>
                  <button
                    disabled={disabledEditBtn}
                    className='btn btn-primary fw-bold btn-edit-spreadsheet'
                    type='submit'
                    onSubmit={editSpreadsheet}
                  >
                    Salvează
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className='general-settings-item'>
        <span className='general-settings-item-title'> Resetare aplicație</span>
        <Message
          severity='warn'
          text='Atenție, resetarea aplicației presupune ștergerea tuturor studenților și a adeverințelor din baza de date. Înainte de resetare se va emite automat un raport cu toate adeverințele create până acum.'
        />
        <div className='d-grid div-btn-reset-app'>
          <button
            disabled={disabledResetBtn}
            className='btn btn-primary btn-danger fw-bold btn-reset-app'
            type='button'
            onClick={() => {
              confirmDialog({
                message: `Sunteți sigur că doriți să resetați aplicația?`,
                header: 'Confimare resetare aplicație',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                acceptLabel: 'Da',
                rejectLabel: 'Nu',
                accept: () => {
                  resetApp()
                },
                reject: () => {},
              })
            }}
          >
            Resetează
          </button>
        </div>
      </div>
    </div>
  )
}

export default GeneralSettings
