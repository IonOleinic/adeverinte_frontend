import React, { useState, useEffect, useMemo } from 'react'
import CertificateRow from '../CertificateRow/CertificateRow'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { toast } from 'react-toastify'
import { Paginator } from 'primereact/paginator'
import './ManageCertificates.css'

function ManageCertificates() {
  const axiosPrivate = useAxiosPrivate()
  const [certificates, setCertificates] = useState([])
  const [filters, setFilters] = useState({
    registrationNr: '',
    studentEmail: '',
    printed: '',
  })
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(7)

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

  const displayedCertificates = useMemo(() => {
    return filteredCertificates.slice(first, first + rows)
  }, [filteredCertificates, first, rows])

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
  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
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
        <div className='manage-certificates-table-container'>
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
              {displayedCertificates.map((certificate) => (
                <CertificateRow
                  key={certificate.registrationNr}
                  certificate={certificate}
                  deleteCertificate={deleteCertificate}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className='manage-certificates-paginator'>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filteredCertificates.length}
            rowsPerPageOptions={[7, 10, 20]}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageCertificates
