import { Routes, Route, Navigate } from 'react-router-dom'
import ReportsNavbar from '../../components/ReportsComponents/ReportsNavbar/ReportsNavbar'
import NotFound from '../../components/NotFound/NotFound'
import CertificatesReport from '../../components/ReportsComponents/CertificatesReport/CertificatesReport'
import RequestsReport from '../../components/ReportsComponents/RequestsReport/RequestsReport'
import './Reports.css'

function Reports() {
  return (
    <>
      <ReportsNavbar />
      <div className='reports-container'>
        <Routes>
          <Route index element={<Navigate to='requests-report' />} />
          <Route path='requests-report' element={<RequestsReport />} />
          <Route path='certificates-report' element={<CertificatesReport />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default Reports
