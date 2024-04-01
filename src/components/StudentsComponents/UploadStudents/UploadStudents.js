import React from 'react'
import { IoWarningSharp } from 'react-icons/io5'
import './UploadStudents.css'

function UploadStudents() {
  return (
    <div className='upload-students'>
      <div className='upload-students-warning'>
        <IoWarningSharp size={45} color='gold' />
        <p>
          Atenție, la încărcarea unui nou fișier, lista internă cu toți
          studenții din baza de date va fi resetată.
        </p>
      </div>
      <div className='upload-students-controls'>
        <div class='mb-3 upload-students-input-file'>
          <label htmlFor='formFile' className='form-label'>
            Alege un fisier Excel cu studenți
          </label>
          <input
            className='form-control form-control-lg'
            type='file'
            id='formFile'
          />
        </div>
        <div className='div-btn-upload-students'>
          <button type='button' className='btn btn-primary btn-upload-students'>
            Încarcă fișierul
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadStudents
