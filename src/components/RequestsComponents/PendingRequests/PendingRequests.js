import React, { useState, useEffect, useMemo, useCallback } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import PendingRequestRow from '../PendingRequestRow/PendingRequestRow'
import { LuRefreshCcw } from 'react-icons/lu'
import { Paginator } from 'primereact/paginator'
import { Tooltip } from 'react-tooltip'
import { toast } from 'react-toastify'
import useLoading from '../../../hooks/useLoading'
import './PendingRequests.css'
import LoadingLayer from '../../LoadingLayer/LoadingLayer'
import EmptyList from '../../EmptyList/EmptyList'

function PendingRequests() {
  const axiosPrivate = useAxiosPrivate()
  const { isLoading, setIsLoading } = useLoading() // Use useLoading hook
  const [pendingRequests, setPendingRequests] = useState([])
  const [filters, setFilters] = useState({
    studentEmail: '',
    certificatePurpose: '',
  })
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)

  const getPendingRequests = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axiosPrivate.get(
        '/certificate-requests?processed=false'
      )
      setPendingRequests(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
      toast.error('Eroare la încărcarea cererilor', {
        autoClose: false,
        theme: 'colored',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadRequestsFromSpreadsheet = async () => {
    try {
      setIsLoading(true)
      const response = await axiosPrivate.get(
        '/load-certificate-requests-from-spreadsheet'
      )
      setPendingRequests(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
      toast.error('Eroare la încărcarea cererilor', {
        autoClose: false,
        theme: 'colored',
      })
    } finally {
      setIsLoading(false)
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

  const displayedRequests = useMemo(() => {
    return filteredRequests.slice(first, first + rows)
  }, [filteredRequests, first, rows])

  useEffect(() => {
    loadRequestsFromSpreadsheet()
  }, [])

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const handleFilterChange = (filter, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }))
  }

  useEffect(() => {
    toast.dismiss()
    return () => toast.dismiss()
  }, [])

  return (
    <div className='pending-requests'>
      <div className='pending-requests-toolbar'>
        <div className='pending-requests-toolbar-item btn-refresh-requests'>
          <Tooltip id={`tooltip-btn-refresh-requests`} />
          <button
            data-tooltip-id={`tooltip-btn-refresh-requests`}
            data-tooltip-content={'Refresh'}
            data-tooltip-place='left'
            className='btn-refresh-requests'
            onClick={loadRequestsFromSpreadsheet}
          >
            <LuRefreshCcw size={19} />
          </button>
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
        {pendingRequests.length === 0 ? (
          <EmptyList
            message={'Toate cererile au fost procesate'}
            visibility={!isLoading}
            positive={true}
          />
        ) : displayedRequests.length === 0 ? (
          <EmptyList
            message={'Nu sa găsit nici o cerere conform filtrării'}
            visibility={!isLoading}
          />
        ) : (
          <>
            <div className='pending-requests-table-container'>
              <table className='pending-requests-table'>
                <thead>
                  <tr className='pending-request-row pending-request-row-header'>
                    <th className='pending-request-row-item pending-request-row-date'>
                      Data creării
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
                  {displayedRequests.map((request) => (
                    <PendingRequestRow
                      key={request.id}
                      request={request}
                      getPendingRequests={getPendingRequests}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className='pending-requests-paginator'>
              <Paginator
                first={first}
                rows={rows}
                totalRecords={filteredRequests.length}
                rowsPerPageOptions={[10, 20, 50]}
                onPageChange={onPageChange}
              />
            </div>
            <div className='pending-requests-statistics'>
              <p>{`Rezultate: ${filteredRequests.length} / ${pendingRequests.length}`}</p>
            </div>
            <div className='pending-requests-page-nr'>
              <p>{`Pagina ${Math.ceil(first / rows + 1)} / ${Math.ceil(
                filteredRequests.length / rows
              )}`}</p>
            </div>
          </>
        )}
        <LoadingLayer />
      </div>
    </div>
  )
}

export default PendingRequests
