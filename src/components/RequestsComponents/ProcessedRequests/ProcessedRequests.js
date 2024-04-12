import React, { useState, useEffect, useMemo } from 'react'
import { axiosPrivate } from '../../../api/api'
import './ProcessedRequests.css'
import ProcessedRequestRow from '../ProcessedRequestRow/ProcessedRequestRow'

function ProcessedRequests() {
  const [processedRequests, setProcessedRequests] = useState([])
  const [filters, setFilters] = useState({
    studentEmail: '',
    handledBy: '',
    accepted: '',
  })

  const deleteRequest = async (id) => {
    try {
      await axiosPrivate.delete(`/certificate-request/${id}`)
      getProcessedRequests()
    } catch (error) {
      console.error(error)
    }
  }

  const getProcessedRequests = async () => {
    try {
      const response = await axiosPrivate.get('/processed-certificate-requests')
      setProcessedRequests(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const filteredRequests = useMemo(() => {
    return processedRequests.filter((request) => {
      return (
        request.studentEmail
          .toLowerCase()
          .includes(filters.studentEmail.toLowerCase()) &&
        request.handledBy
          ?.toLowerCase()
          .includes(filters.handledBy.toLowerCase()) &&
        (filters.accepted // Check if printed filter is defined
          ? request.accepted
            ? filters.accepted === 'true'
            : filters.accepted === 'false'
          : true) // If printed filter is not defined, include all records
      )
    })
  }, [processedRequests, filters])

  useEffect(() => {
    getProcessedRequests()
  }, [])

  const handleFilterChange = (filter, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }))
  }

  return (
    <div className='processed-requests'>
      <div className='processed-requests-toolbar'>
        <div className='processed-requests-toolbar-item search-requests-by-email'>
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
        <div className='processed-requests-toolbar-item search-requests-by-handled-by'>
          <label htmlFor='search-by-handled-by'>Procesată de:</label>
          <input
            type='text'
            placeholder='nume utilzator'
            id='search-by-handled-by'
            className='form-control'
            value={filters.handledBy}
            onChange={(e) => handleFilterChange('handledBy', e.target.value)}
          />
        </div>
        <div className='processed-requests-toolbar-item search-requests-by-accepted'>
          <label htmlFor='search-by-accepted'>Acceptată:</label>
          <select
            className='form-control'
            id='search-by-accepted'
            value={filters.accepted}
            onChange={(e) => handleFilterChange('accepted', e.target.value)}
          >
            <option value={''}>*</option>
            <option value={'true'}>Da</option>
            <option value={'false'}>Nu</option>
          </select>
        </div>
      </div>
      <div className='processed-requests-list'>
        <table className='processed-requests-table'>
          <thead>
            <tr className='processed-request-row processed-request-row-header'>
              <th className='processed-request-row-item processed-request-row-date'>
                Data
              </th>
              <th className='processed-request-row-item processed-request-row-email'>
                Email student
              </th>
              <th className='processed-request-row-item processed-request-row-purpose'>
                Scopul adeverinței
              </th>
              <th className='processed-request-row-item processed-request-row-handled-by'>
                Procesată de
              </th>
              <th className='processed-request-row-item processed-request-row-accepted'>
                Acceptată
              </th>
              <th className='processed-request-row-item processed-request-row-rejected-reason'>
                Motiv respingere
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <ProcessedRequestRow
                key={request.id}
                request={request}
                deleteRequest={deleteRequest}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProcessedRequests
