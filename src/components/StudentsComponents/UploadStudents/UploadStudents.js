import * as XLSX from 'xlsx'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ProgressBar } from 'primereact/progressbar'
import { confirmDialog } from 'primereact/confirmdialog'
import { Message } from 'primereact/message'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useLoading from '../../../hooks/useLoading'
import LoadingLayer from '../../LoadingLayer/LoadingLayer'
import FailedStudentRow from '../FailedStudentRow/FailedStudentRow'
import './UploadStudents.css'

function UploadStudents() {
  const axios = useAxiosPrivate()
  const { setIsLoading } = useLoading()
  const [students, setStudents] = useState([])
  const [failedStudents, setFailedStudents] = useState([])
  const [successStudentsCount, setSuccessStudentsCount] = useState(0)
  const [processedStudentsCount, setProcessedStudentsCount] = useState(0)
  const [processedStudentsPercent, setProcessedStudentsPercent] = useState(0)
  const [disabledUploadBtn, setDisabledUploadBtn] = useState(true)
  const [fileProcessed, setFileProcessed] = useState(false)

  const uploadStudents = async () => {
    setDisabledUploadBtn(true)
    setSuccessStudentsCount(0)
    setProcessedStudentsCount(0)
    setProcessedStudentsPercent(0)
    setFailedStudents([])
    if (students.length === 0) {
      toast.error(
        'Nu a fost selectat niciun fișier sau fisierul nu are studenti.',
        {
          theme: 'colored',
          autoClose: false,
        }
      )
      return
    }
    try {
      setIsLoading(true)
      await axios.delete('/students')
      const chunkSize = 200
      let failedStudentsCount = 0
      for (let i = 0; i < students.length; i += chunkSize) {
        const chunk = students.slice(i, i + chunkSize)
        // Send this chunk to the backend
        try {
          const response = await axios.post('/student', chunk)
          console.log(response.data)
          if (response.data?.failedStudents) {
            failedStudentsCount += response.data.failedStudents.length
            setFailedStudents((prev) => [
              ...prev,
              ...response.data.failedStudents,
            ])
            setSuccessStudentsCount(
              (prev) =>
                prev + chunk.length - response.data.failedStudents.length
            )
          } else {
            setSuccessStudentsCount((prev) => prev + chunk.length)
          }
          setProcessedStudentsCount((prev) => prev + chunk.length)

          console.log('Chunk uploaded successfully')
        } catch (error) {
          console.log('Error uploading chunk: ', error)
        }
      }
      if (failedStudentsCount > 0) {
        toast.warning(
          `Au fost încărcați cu succes ${
            students.length - failedStudentsCount
          } studenți. A apărut o eroare la încărcarea a ${failedStudentsCount} studenți.`,
          {
            theme: 'colored',
            autoClose: false,
          }
        )
        return
      }
      toast.success(
        `Au fost încărcați cu succes ${students.length} de studenți.`,
        {
          theme: 'colored',
          autoClose: false,
        }
      )
    } catch (error) {
      console.error(error)
      toast.error('A apărut o eroare la încărcarea studenților', {
        theme: 'colored',
        autoClose: false,
      })
    } finally {
      setIsLoading(false)
      setDisabledUploadBtn(false)
      setFileProcessed(true)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files.length === 0) {
      // No file was selected
      setDisabledUploadBtn(true)
      return
    }
    setFileProcessed(false)
    setSuccessStudentsCount(0)
    setProcessedStudentsPercent(0)
    setProcessedStudentsCount(0)
    setDisabledUploadBtn(false)
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = function (evt) {
      const data = new Uint8Array(evt.target.result)
      const workbook = XLSX.read(data, { type: 'array' })

      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]

      const studentsData = XLSX.utils
        .sheet_to_json(worksheet, {
          header: [
            'email',
            'studyProgram',
            'studyCycle',
            'studyYear',
            'studyDomain',
            'educationForm',
            'financing',
            'fullName',
            'sex',
          ],
          range: 1,
          raw: false,
        })
        .map((student) => ({
          ...student,
          excelIndex: student.__rowNum__ + 1,
        }))
      setStudents(studentsData)
    }
    reader.readAsArrayBuffer(file)
  }

  useEffect(() => {
    toast.dismiss()
    return () => {
      toast.dismiss()
    }
  }, [])

  useEffect(() => {
    setProcessedStudentsPercent(
      Math.floor((processedStudentsCount * 100) / students.length)
    )
  }, [processedStudentsCount])

  return (
    <div className='upload-students'>
      <div className='upload-students-top'>
        <div className='upload-students-main'>
          <div className='upload-students-warning'>
            <Message
              severity='warn'
              text='Atenție, la încărcarea unui nou fișier, lista internă cu toți
              studenții din baza de date va fi resetată.'
            />
          </div>
          <div className='upload-students-controls'>
            <div className='mb-3 upload-students-input-file'>
              <label htmlFor='formFile' className='form-label'>
                Alege un fisier Excel cu studenți
              </label>
              <input
                className='form-control form-control-lg'
                type='file'
                id='formFile'
                accept='.xlsx'
                multiple={false}
                onChange={handleFileChange}
              />
            </div>
            <div className='div-btn-upload-students'>
              <button
                disabled={disabledUploadBtn}
                type='button'
                className='btn btn-primary fw-bold btn-upload-students'
                onClick={() => {
                  confirmDialog({
                    message: `Atenție, lista curentă cu studenti va fi resetată? Doriti să continuați?`,
                    header: 'Confimare încărcare studenți',
                    icon: 'pi pi-upload',
                    defaultFocus: 'reject',
                    acceptClassName: 'p-button-danger',
                    acceptLabel: 'Da',
                    rejectLabel: 'Nu',
                    accept: () => {
                      uploadStudents()
                    },
                    reject: () => {},
                  })
                }}
              >
                Încarcă fișierul
              </button>
            </div>
          </div>
        </div>
        <div className='upload-students-info'>
          <div className='upload-students-info-item'>
            <h4>Total :</h4>
            <p className='upload-students-info-total'>{students.length}</p>
          </div>
          <div className='upload-students-info-item'>
            <h4>Succes :</h4>
            <p
              className={
                fileProcessed
                  ? successStudentsCount > 0
                    ? 'upload-students-info-item-green'
                    : 'upload-students-info-item-red'
                  : ''
              }
            >
              {successStudentsCount}
            </p>
          </div>
          <div className='upload-students-info-item'>
            <h4>Neîncarcați :</h4>
            <p
              className={
                fileProcessed
                  ? failedStudents.length == 0
                    ? 'upload-students-info-item-green'
                    : 'upload-students-info-item-red'
                  : ''
              }
            >
              {failedStudents.length}
            </p>
          </div>
        </div>
      </div>

      <ProgressBar
        value={processedStudentsPercent}
        className={
          processedStudentsPercent > 0
            ? 'upload-students-progress-bar'
            : 'upload-students-progress-bar-hidden'
        }
      ></ProgressBar>

      <div
        className={
          failedStudents.length > 0
            ? 'failed-students-table-container'
            : 'failed-students-table-container-hidden'
        }
      >
        <div className='failed-students-top'>
          <h3>{`Studenți neîncarcați (${failedStudents.length}):`}</h3>
          <Message
            severity='error'
            className='failed-students-message'
            text='De regulă, un student nu poate fi încărcat din cauza detectării unor duplicate (email) sau din cauza lipsei datelor unor câmpuri (email, nume, domeniu, ciclu, an, forma de învățământ, finanțare sau sex).'
          />
        </div>
        <table className='failed-students-table'>
          <thead>
            <tr className='failed-student-row failed-student-row-header'>
              <th className='failed-student-row-item failed-student-row-index'>
                Nr.
              </th>
              <th className='failed-student-row-item failed-student-row-excel-index'>
                Rând excel
              </th>
              <th className='failed-student-row-item failed-student-row-fullname'>
                Nume complet
              </th>
              <th className='failed-student-row-item failed-student-row-email'>
                Email
              </th>
              <th className='failed-student-row-item failed-student-row-study-domain'>
                Domeniul de studii
              </th>
              <th className='failed-student-row-item failed-student-row-study-cycle'>
                Ciclu de studii
              </th>
              <th className='failed-student-row-item failed-student-row-study-year'>
                An
              </th>
            </tr>
          </thead>
          <tbody>
            {failedStudents.map((student, index) => (
              <FailedStudentRow
                key={student.excelIndex}
                student={student}
                index={index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>
      <LoadingLayer />
    </div>
  )
}

export default UploadStudents
