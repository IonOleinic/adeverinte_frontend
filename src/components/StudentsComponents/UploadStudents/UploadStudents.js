import * as XLSX from 'xlsx'
import { IoWarningSharp } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
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
  const [disabledUploadBtn, setDisabledUploadBtn] = useState(true)
  const [successStudentsCount, setSuccessStudentsCount] = useState(0)
  const [fileProcessed, setFileProcessed] = useState(false)

  const uploadStudents = async () => {
    toast.dismiss()
    console.log(students.length)
    setDisabledUploadBtn(true)
    setSuccessStudentsCount(0)
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

          console.log('Chunk uploaded successfully')
        } catch (error) {
          console.log('Error uploading chunk: ', error)
        }
      }
      if (failedStudentsCount > 0) {
        toast.info(
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
    return () => {
      setTimeout(() => {
        toast.dismiss()
      }, 2000)
    }
  }, [])

  return (
    <div className='upload-students'>
      <div className='upload-students-top'>
        <div className='upload-students-main'>
          <div className='upload-students-warning'>
            <IoWarningSharp size={45} color='gold' />
            <p>
              Atenție, la încărcarea unui nou fișier, lista internă cu toți
              studenții din baza de date va fi resetată.
            </p>
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
                onClick={uploadStudents}
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
      <div
        className={
          failedStudents.length > 0
            ? 'failed-students-table-container'
            : 'failed-students-table-container-hidden'
        }
      >
        <h3>Studenți neîncarcați:</h3>
        <table className='failed-students-table'>
          <thead>
            <tr className='failed-student-row failed-student-row-header'>
              <th className='failed-student-row-item failed-student-row-excel-index'>
                Rând excel
              </th>
              <th className='failed-student-row-item failed-student-row-fullname'>
                Nume Complet
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
            {failedStudents.map((student) => (
              <FailedStudentRow key={student.excelIndex} student={student} />
            ))}
          </tbody>
        </table>
      </div>
      <LoadingLayer />
    </div>
  )
}

export default UploadStudents
