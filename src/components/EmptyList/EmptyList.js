import { useEffect, useState } from 'react'
import file_not_found from './images/file_not_found.png'
import completed_list from './images/completed_list.png'
import './EmptyList.css'

function EmptyList({ message, visibility, positive }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(visibility)
  }, [visibility])
  return (
    <div
      className={
        isVisible ? 'empty-list-container' : 'empty-list-container-hidden'
      }
    >
      <img
        src={positive ? completed_list : file_not_found}
        alt='image empty list'
      />
      <span className='empty-list-message-container'>
        <p>{message}</p>
        {positive ? (
          <img
            src='https://static-00.iconduck.com/assets.00/party-popper-emoji-255x256-sdlllvsx.png'
            alt=''
          />
        ) : (
          <></>
        )}
      </span>
    </div>
  )
}

export default EmptyList
