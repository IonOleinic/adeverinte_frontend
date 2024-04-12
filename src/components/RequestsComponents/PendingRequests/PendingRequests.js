import React, { useState, useEffect, useMemo } from 'react'
import { axiosPrivate } from '../../../api/api'
import PendingRequestRow from '../PendingRequestRow/PendingRequestRow'
import { SlRefresh } from 'react-icons/sl'
import { LuRefreshCcw } from 'react-icons/lu'
import './PendingRequests.css'

function PendingRequests() {
  const [pendingRequests, setPendingRequests] = useState([])
  const [filters, setFilters] = useState({
    studentEmail: '',
    certificatePurpose: '',
  })

  const getPendingRequests = async () => {
    try {
      const response = await axiosPrivate.get('/pending-certificate-requests')
      setPendingRequests(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const loadRequestsFromSpreadsheet = async () => {
    try {
      const response = await axiosPrivate.get(
        '/load-certificate-requests-from-spreadsheet'
      )
      setPendingRequests(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const filteredRequests = useMemo(() => {
    return pendingRequests.filter((request) => {
      return (
        request.studentEmail
          .toLowerCase()
          .includes(filters.studentEmail.toLowerCase()) &&
        request.certificatePurpose
          ?.toLowerCase()
          .includes(filters.certificatePurpose.toLowerCase())
      )
    })
  }, [pendingRequests, filters])

  useEffect(() => {
    loadRequestsFromSpreadsheet()
  }, [])

  const handleFilterChange = (filter, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }))
  }

  return (
    <div className='pending-requests'>
      <div className='pending-requests-toolbar'>
        <div className='pending-requests-toolbar-item refresh-requests-btn'>
          <LuRefreshCcw size={19} onClick={loadRequestsFromSpreadsheet} />
        </div>
        <div className='pending-requests-toolbar-item search-requests-by-email'>
          <label htmlFor='search-by-email'>Email:</label>
          <input
            type='text'
            placeholder='cauta dupa email'
            id='search-by-email'
            className='form-control'
            value={filters.studentEmail}
            onChange={(e) => handleFilterChange('studentEmail', e.target.value)}
          />
        </div>
        <div className='pending-requests-toolbar-item search-requests-by-purpose'>
          <label htmlFor='search-by-purpose'>Scopul adeverinței:</label>
          <input
            type='text'
            placeholder='Scopul adeverinței'
            id='search-by-purpose'
            className='form-control'
            value={filters.certificatePurpose}
            onChange={(e) =>
              handleFilterChange('certificatePurpose', e.target.value)
            }
          />
        </div>
      </div>
      <div className='pending-requests-list'>
        <table className='pending-requests-table'>
          <thead>
            <tr className='pending-request-row pending-request-row-header'>
              <th className='pending-request-row-item pending-request-row-date'>
                Data
              </th>
              <th className='pending-request-row-item pending-request-row-email'>
                Email student
              </th>
              <th className='pending-request-row-item pending-request-fullname'>
                Nume Complet
              </th>
              <th className='pending-request-row-item pending-request-study-domain'>
                Domeniul de studiu
              </th>
              <th className='pending-request-row-item pending-request-row-purpose'>
                Scopul adeverinței
              </th>
              <th className='pending-request-row-item pending-request-row-buttons'>
                Actiuni
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <PendingRequestRow
                key={request.id}
                request={request}
                getPendingRequests={getPendingRequests}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PendingRequests
