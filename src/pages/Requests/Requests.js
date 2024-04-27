import { Routes, Route, Navigate } from 'react-router-dom'
import RequestsNavbar from '../../components/RequestsComponents/RequestsNavbar/RequestsNavbar'
import ProcessedRequests from '../../components/RequestsComponents/ProcessedRequests/ProcessedRequests'
import PendingRequests from '../../components/RequestsComponents/PendingRequests/PendingRequests'
import NotFound from '../../components/NotFound/NotFound'
import './Requests.css'

function Requests() {
  return (
    <>
      <RequestsNavbar />
      <div className='requests-container'>
        <Routes>
          <Route index element={<Navigate to='pending-requests' />} />
          <Route path='pending-requests' element={<PendingRequests />} />
          <Route path='edit-request/:id' element={<h1>Edit Request</h1>} />
          <Route path='processed-requests' element={<ProcessedRequests />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default Requests
