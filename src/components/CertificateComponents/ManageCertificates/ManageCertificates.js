import React, { useState, useEffect } from 'react'
import CertificateRow from '../CertificateRow/CertificateRow'
import { axiosPrivate } from '../../../api/api'
import './ManageCertificates.css'

function ManageCertificates() {
  const [originalCertificates, setOriginalCertificates] = useState([])
  const [filteredCertificated, setFilteredCertificates] = useState([])
  const [registrationNrFilter, setRegistrationNrFilter] = useState('')
  const [studentEmailFilter, setStudentEmailFilter] = useState('')
  const [printedFilter, setPrintedFilter] = useState(undefined)

  const getCertificates = async () => {
    try {
      const response = await axiosPrivate.get('/certificates')
      setOriginalCertificates(response.data)
      setFilteredCertificates(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const deleteCertificate = async (registrationNr) => {
    try {
      await axiosPrivate.delete(
        `/certificate/${encodeURIComponent(registrationNr)}`
      )
      getCertificates()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCertificates()
  }, [])

  const filterCertificates = (
    registrationNrFilter,
    studentEmailFilter,
    printedFilter
  ) => {
    let filteredCertificates = originalCertificates
    if (registrationNrFilter) {
      filteredCertificates = filteredCertificates.filter((certificate) =>
        certificate.registrationNr.includes(registrationNrFilter)
      )
    }
    if (studentEmailFilter) {
      filteredCertificates = filteredCertificates.filter((certificate) =>
        certificate.studentEmail.includes(studentEmailFilter)
      )
    }
    if (printedFilter) {
      filteredCertificates = filteredCertificates.filter((certificate) => {
        if (printedFilter == 'true') {
          if (certificate.printed) return true
        } else if (printedFilter == 'false') {
          if (!certificate.printed) return true
        }
      })
    }
    setFilteredCertificates(filteredCertificates)
  }
  return (
    <div className='manage-certificates'>
      <div className='manage-certificates-toolbar'>
        <div className='manage-certificates-toolbar-item search-certificates-by-registration-nr'>
          <label htmlFor='search-by-registration-nr'>Nr înregistrare:</label>
          <input
            type='text'
            placeholder='nr înregistrare'
            id='search-by-registration-nr'
            className='form-control'
            value={registrationNrFilter}
            onChange={(e) => {
              filterCertificates(
                e.target.value,
                studentEmailFilter,
                printedFilter
              )
              setRegistrationNrFilter(e.target.value)
            }}
          />
        </div>
        <div className='manage-certificates-toolbar-item search-certificates-by-student-email'>
          <label htmlFor='search-by-email'>Email student:</label>
          <input
            type='text'
            placeholder='cauta dupa email'
            id='search-by-email'
            className='form-control'
            value={studentEmailFilter}
            onChange={(e) => {
              filterCertificates(
                registrationNrFilter,
                e.target.value,
                printedFilter
              )
              setStudentEmailFilter(e.target.value)
            }}
          />
        </div>
        <div className='manage-certificates-toolbar-item search-students-by-printed'>
          <label htmlFor='search-by-printed'>Printat:</label>
          <select
            className='form-control'
            id='search-by-printed'
            value={printedFilter}
            onChange={(e) => {
              filterCertificates(
                registrationNrFilter,
                studentEmailFilter,
                e.target.value
              )
              setPrintedFilter(e.target.value)
            }}
          >
            <option value={''}>*</option>
            <option value={'true'}>Da</option>
            <option value={'false'}>Nu</option>
          </select>
        </div>
      </div>
      <div className='manage-certificates-list'>
        <table className='manage-certificates-table'>
          <thead>
            <tr className='certificate-row certificate-row-header'>
              <th className='certificate-row-item certificate-row-registration-nr'>
                Nr înregistrare
              </th>
              <th className='certificate-row-item certificate-row-fullname'>
                Nume complet
              </th>
              <th className='certificate-row-item certificate-row-email'>
                Email
              </th>
              <th className='certificate-row-item certificate-row-purpose'>
                Scopul adeverinței
              </th>
              <th className='certificate-row-item certificate-row-printed'>
                Printat
              </th>
              <th className='certificate-row-item certificate-row-buttons'></th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificated.map((certificate) => (
              <CertificateRow
                key={certificate.registrationNr}
                certificate={certificate}
                deleteCertificate={deleteCertificate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageCertificates
