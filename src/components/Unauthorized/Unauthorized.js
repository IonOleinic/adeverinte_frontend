import { ImBlocked } from 'react-icons/im'
import './Unauthorized.css'

function Unauthorized() {
  return (
    <div className='unauthorized-container'>
      <div className='unauthorized'>
        <ImBlocked className='unauthorized-icon' size={100} />
        <p>Nu sunteți autorizat ca să puteți viziona aceasă pagină.</p>
      </div>
    </div>
  )
}

export default Unauthorized
