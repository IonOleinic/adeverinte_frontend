import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import PrintCertificatesPage from '../PrintCertificatesPage/PrintCertificatesPage'
import CertificateRow from '../CertificateRow/CertificateRow'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Calendar } from 'primereact/calendar'
import { toast } from 'react-toastify'
import { Paginator } from 'primereact/paginator'
import { IoPrintOutline } from 'react-icons/io5'
import { AiOutlineUndo } from 'react-icons/ai'
import { Tooltip } from 'react-tooltip'
import useAuth from '../../../hooks/useAuth'
import './ManageCertificates.css'
import useLoading from '../../../hooks/useLoading'
import LoadingLayer from '../../LoadingLayer/LoadingLayer'
import EmptyList from '../../EmptyList/EmptyList'

function ManageCertificates() {
  const { isLoading, setIsLoading } = useLoading() // Use useLoading hook
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [faculty, setFaculty] = useState('') // Add this line
  const [secretarName, setSecretarName] = useState('') // Add this line
  const [certificates, setCertificates] = useState([])
  const [selectedCertificates, setSelectedCertificates] = useState([])

  const [filters, setFilters] = useState({
    registrationNr: '',
    studentEmail: '',
    printed: '',
    startDate: '',
    endDate: '',
  })
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)

  const resetFilters = () => {
    setFilters({
      registrationNr: '',
      studentEmail: '',
      printed: '',
      startDate: '',
      endDate: '',
    })
  }

  useEffect(() => {
    const getFaculty = async () => {
      try {
        const response = await axiosPrivate.get('/faculties') // Change this line
        if (response.data[0]) setFaculty(response.data[0])
      } catch (error) {
        console.log(error)
      }
    }

    getFaculty()
  }, [certificates])

  const getSecretarName = async () => {
    try {
      const response = await axiosPrivate.get(`/user?email=${auth.email}`)
      let secretarName = ''
      if (response.data.title) {
        secretarName += response.data.title + ' '
      }
      secretarName +=
        response.data.firstName + ' ' + response.data.lastName.toUpperCase()
      setSecretarName(secretarName)
    } catch (error) {
      console.log(error)
    }
  }

  const updateCertificate = async (certificate) => {
    try {
      await axiosPrivate.put(
        `/certificate/${encodeURIComponent(certificate.registrationNr)}`,
        certificate
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSecretarName()
  }, [auth.email])

  const getCertificates = async () => {
    try {
      setIsLoading(true)
      const response = await axiosPrivate.get('/certificates')
      setCertificates(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
      toast.error('Eroare la încărcarea adeverințelor', {
        autoClose: false,
        theme: 'colored',
      })
    } finally {
      setIsLoading(false)
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
          : true) && // If printed filter is not defined, include all records
        (filters.startDate
          ? new Date(certificate.createdAt) >=
            filters.startDate.setHours(0, 0, 0, 0)
          : true) &&
        (filters.endDate
          ? new Date(certificate.createdAt) <=
            filters.endDate.setHours(23, 59, 59, 999)
          : true)
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

  const printCertificates = async (certificates) => {
    if (certificates.length === 0) {
      return
    }
    if (!faculty) {
      toast.dismiss()
      toast.error('Facultatea nu este setată', {
        theme: 'colored',
        autoClose: false,
      })
      return
    }
    const printWindow = window.open('', '_blank')
    printWindow.document.write(
      '<html><head><title>Adeverinte</title></head><body style="margin:0px;">'
    )
    printWindow.document.write('<div id="print-content"></div>')
    printWindow.document.write('</body></html>')
    // Render the certificates inside the print window
    const printContent = ReactDOM.createRoot(
      printWindow.document.getElementById('print-content')
    )
    await printContent.render(
      <React.StrictMode>
        <PrintCertificatesPage
          certificates={certificates}
          faculty={faculty}
          secretarName={secretarName}
        />
      </React.StrictMode>
    )
    // Close the document and trigger printing
    printWindow.document.close()
    printWindow.print()

    certificates.map((cert) => {
      return updateCertificate({ ...cert, printed: true, selected: false })
    })
    getCertificates()
  }

  useEffect(() => {
    getCertificates()
    toast.dismiss()
    return () => {
      toast.dismiss()
    }
  }, [])

  useEffect(() => {
    setSelectedCertificates(displayedCertificates.map((cert) => cert.selected))
  }, [displayedCertificates])

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
        <div className='manage-certificates-toolbar-item search-certificates-by-nr'>
          <label htmlFor='search-by-nr'>Nr:</label>
          <input
            type='text'
            placeholder='nr înregistrare'
            id='search-by-nr'
            className='form-control'
            value={filters.registrationNr}
            onChange={(e) => {
              handleFilterChange('registrationNr', e.target.value)
            }}
          />
        </div>
        <div className='manage-certificates-toolbar-item search-certificates-by-email'>
          <label htmlFor='search-by-email'>Email:</label>
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
        <div className='manage-certificates-toolbar-item search-certificates-by-printed'>
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
        <div className='manage-certificates-toolbar-item search-certificates-by-date'>
          <label htmlFor='search-by-start-date'>Data:</label>
          <Calendar
            id='search-by-start-date'
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.value)}
            dateFormat='dd/mm/yy'
          />
          <p>-</p>
          <Calendar
            id='search-by-end-date'
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.value)}
            dateFormat='dd/mm/yy'
          />
        </div>
        <div className='manage-certificates-toolbar-item'>
          <Tooltip id={`tooltip-btn-print-selected-certificates`} />
          <button
            data-tooltip-id={`tooltip-btn-print-selected-certificates`}
            data-tooltip-content={'Printează adeverințele selectate'}
            data-tooltip-place='left'
            className='btn btn-primary btn-print-selected-certificates'
            disabled={selectedCertificates.filter((cert) => cert).length === 0}
            onClick={() => {
              printCertificates(
                displayedCertificates.filter(
                  (cert, index) => selectedCertificates[index]
                )
              )
            }}
          >
            <IoPrintOutline size={23} />
            <p>Printează</p>
          </button>
        </div>
        <div className='manage-certificates-toolbar-item'>
          <Tooltip id={`tooltip-btn-reset-certificates-filters`} />
          <button
            data-tooltip-id={`tooltip-btn-reset-certificates-filters`}
            data-tooltip-content={'Resetează filtrele'}
            data-tooltip-place='left'
            className='btn-reset-filters'
            onClick={() => {
              resetFilters()
            }}
          >
            <AiOutlineUndo size={23} />
          </button>
        </div>
      </div>
      <div className='manage-certificates-list'>
        {displayedCertificates.length === 0 ? (
          <EmptyList
            message={'Nu sa găsit nici o adeverință :('}
            visibility={!isLoading}
          />
        ) : (
          <>
            <div className='manage-certificates-table-container'>
              <table className='manage-certificates-table'>
                <thead>
                  <tr className='certificate-row certificate-row-header'>
                    <th className='certificate-row-item certificate-row-checkbox'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value=''
                        checked={
                          selectedCertificates.length > 0
                            ? selectedCertificates.every((cert) => cert)
                            : false
                        }
                        id='flexCheckDefault'
                        onChange={(e) => {
                          setSelectedCertificates(
                            selectedCertificates.map(() => e.target.checked)
                          )
                        }}
                      />
                    </th>
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
                    <th className='certificate-row-item certificate-row-buttons'>
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCertificates.map((certificate, index) => (
                    <CertificateRow
                      key={certificate.registrationNr}
                      certificate={certificate}
                      deleteCertificate={deleteCertificate}
                      printCertificate={printCertificates}
                      selectedCertificates={selectedCertificates}
                      setSelectedCertificates={setSelectedCertificates}
                      index={index}
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
                rowsPerPageOptions={[10, 20, 50]}
                onPageChange={onPageChange}
              />
            </div>
            <div className='manage-certificates-statistics'>
              <p>{`Selectate: ${
                selectedCertificates.filter((cert) => cert).length
              }`}</p>
              <p>{`Rezultate: ${filteredCertificates.length} / ${certificates.length}`}</p>
            </div>
            <div className='manage-certificates-page-nr'>
              <p>{`Pagina ${Math.ceil(first / rows + 1)} / ${Math.ceil(
                filteredCertificates.length / rows
              )}`}</p>
            </div>
          </>
        )}
        <LoadingLayer />
      </div>
    </div>
  )
}

export default ManageCertificates
