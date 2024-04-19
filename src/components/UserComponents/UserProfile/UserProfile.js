import React, { useEffect, useState, useRef } from 'react'
import './UserProfile.css'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import useRoles from '../../../hooks/useRoles'
import userAvatar from './images/user-avatar.png'
import { IoSettingsOutline } from 'react-icons/io5'
import { LuUser } from 'react-icons/lu'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { IoIosOptions } from 'react-icons/io'
import { IoIosLogOut } from 'react-icons/io'
import { confirmDialog } from 'primereact/confirmdialog'
import useLogout from '../../../hooks/useLogout'

function UserProfile() {
  const logout = useLogout()
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [user, setUser] = useState({})
  const { roles } = useRoles()
  const [userMainRole, setUserMainRole] = useState('User')
  const [userMenuVisible, setUserMenuVisible] = useState(false)
  const userMenuRef = useRef()

  useClickOutside(userMenuRef, () => {
    setUserMenuVisible(false)
  })
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(`/user?email=${auth.email}`)
        setUser(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [auth.email])

  useEffect(() => {
    if (user.roles?.includes(roles.Admin)) {
      setUserMainRole('Admin')
    } else if (user.roles?.includes(roles.Secretar)) {
      setUserMainRole('Secretar')
    }
  }, [roles, user.roles])

  return (
    <div className='user-profile-container'>
      <div
        className='user-profile-top'
        onClick={(e) => setUserMenuVisible((prev) => !prev)}
        ref={userMenuRef}
      >
        <img src={userAvatar} alt='user avatar' className='user-profile-img' />
        <div className='user-profile-info'>
          <h5 className='user-profile-name'>{`${user.firstName} ${user.lastName}`}</h5>
          <p className='user-profile-role'>{userMainRole}</p>
        </div>
      </div>
      <div
        className={
          userMenuVisible
            ? 'user-profile-menu'
            : 'user-profile-menu user-profile-menu-hidden'
        }
        onBlur={(e) => setUserMenuVisible(false)}
      >
        <ul className='user-profile-menu-list'>
          <li
            className='user-profile-menu-list-item'
            onClick={(e) => setUserMenuVisible(false)}
          >
            <LuUser size={22} />
            <p>Profil</p>
          </li>
          <li
            className='user-profile-menu-list-item'
            onClick={(e) => setUserMenuVisible(false)}
          >
            <IoSettingsOutline size={20} />
            <p>Setări</p>
          </li>
          <li
            className='user-profile-menu-list-item'
            onClick={(e) => setUserMenuVisible(false)}
          >
            <IoIosOptions size={20} />
            <p>Preferințe</p>
          </li>
          <li
            className='user-profile-menu-list-item singn-out-btn'
            onClick={(e) => {
              setUserMenuVisible(false)
              confirmDialog({
                message: `Sunteți sigur că doriți să vă delogați?`,
                header: 'Confimare delogare',
                icon: 'pi pi-sign-out',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                acceptLabel: 'Da',
                rejectLabel: 'Nu',
                accept: () => {
                  logout()
                },
                reject: () => {},
              })
            }}
          >
            <IoIosLogOut size={20} />
            <p>Delogare</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserProfile
