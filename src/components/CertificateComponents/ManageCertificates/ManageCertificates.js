import React, { useState, useEffect, useMemo } from 'react'
import CertificateRow from '../CertificateRow/CertificateRow'
import { axiosPrivate } from '../../../api/api'
import { toast } from 'react-toastify'
import './ManageCertificates.css'

function ManageCertificates() {
  const [certificates, setCertificates] = useState([])
  const [filters, setFilters] = useState({
    registrationNr: '',
    studentEmail: '',
    printed: '',
  })

  const getCertificates = async () => {
    try {
      const response = await axiosPrivate.get('/certificates')
      setCertificates(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const filteredCertificates = useMemo(() => {
    return certificates.filter((certificate) => {
      return (
        certificate.registrationNr
          .toLowerCase()
          .includes(filters.registrationNr.toLowerCase()) &&
        certificate.studentEmail
          .toLowerCase()
          .includes(filters.studentEmail.toLowerCase()) &&
        (filters.printed // Check if printed filter is defined
          ? certificate.printed
            ? filters.printed === 'true'
            : filters.printed === 'false'
          : true) // If printed filter is not defined, include all records
      )
    })
  }, [certificates, filters])

  const deleteCertificate = async (registrationNr) => {
    try {
      await axiosPrivate.delete(
        `/certificate/${encodeURIComponent(registrationNr)}`
      )
      toast.warning(`Adeverința ${registrationNr} a fost ștearsă.`)
      getCertificates()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCertificates()
  }, [])

  const handleFilterChange = (filter, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }))
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
            value={filters.registrationNr}
            onChange={(e) => {
              handleFilterChange('registrationNr', e.target.value)
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
            value={filters.studentEmail}
            onChange={(e) => {
              handleFilterChange('studentEmail', e.target.value)
            }}
          />
        </div>
        <div className='manage-certificates-toolbar-item search-students-by-printed'>
          <label htmlFor='search-by-printed'>Printată:</label>
          <select
            className='form-control'
            id='search-by-printed'
            value={filters.printed}
            onChange={(e) => {
              handleFilterChange('printed', e.target.value)
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
                Printată
              </th>
              <th className='certificate-row-item certificate-row-buttons'></th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.map((certificate) => (
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
