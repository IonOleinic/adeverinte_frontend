import { CiEdit } from 'react-icons/ci'
import { CiTrash } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import useRoles from '../../../hooks/useRoles'
import { confirmDialog } from 'primereact/confirmdialog'
import { useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import userAvatar from './images/user-avatar-black.png'
import './UserRow.css'

function UserRow({ user, deleteUser }) {
  const { auth } = useAuth()
  const { roles } = useRoles()
  const [profileImage, setProfileImage] = useState(userAvatar)
  const [userMainRole, setUserMainRole] = useState('User')
  const [allowEdit, setAllowEdit] = useState(true)
  const [allowDelete, setAllowDelete] = useState(true)

  useEffect(() => {
    if (user.roles?.includes(roles.Admin)) {
      setUserMainRole('Admin')
    } else if (user.roles?.includes(roles.Secretar)) {
      setUserMainRole('Secretar(ă)')
    }
  }, [roles, user])

  useEffect(() => {
    if (user.profileImage) {
      setProfileImage(user.profileImage)
    } else {
      setProfileImage(userAvatar)
    }
  }, [user.profileImage])

  useEffect(() => {
    if (user.roles?.includes(roles.Admin)) {
      if (auth.email === user.email) {
        setAllowDelete(false)
      } else {
        setAllowEdit(false)
        setAllowDelete(false)
      }
    }
  }, [roles, user.roles, auth])

  const navigate = useNavigate()
  return (
    <tr className='user-row'>
      <td className='user-row-item user-row-avatar'>
        <img src={profileImage} alt='user avatar' />
      </td>
      <td className='user-row-item user-row-fullname'>
        <p>{`${user.lastName} ${user.firstName}`}</p>
      </td>
      <td className='user-row-item user-row-email'>
        <p>{user.email}</p>
      </td>
      <td className='user-row-item user-row-study-title'>
        <p>{user.title || '-'}</p>
      </td>
      <td className='user-row-item user-row-study-role'>
        <p>{userMainRole}</p>
      </td>
      <td className='user-row-item user-row-buttons'>
        <Tooltip id={`tooltip-btn-edit-${user.id}`} />
        <button
          data-tooltip-id={`tooltip-btn-edit-${user.id}`}
          data-tooltip-content={
            allowEdit ? 'Editează utilizatorul' : 'Nu aveți permisiunea'
          }
          data-tooltip-place='left'
          className='user-row-button user-row-edit'
          disabled={!allowEdit}
          onClick={(e) => {
            navigate(`/settings/manage-users/edit-user/${user.id}`)
          }}
        >
          <CiEdit size={23} />
        </button>
        <Tooltip id={`tooltip-btn-delete-${user.id}`} />
        <button
          data-tooltip-id={`tooltip-btn-delete-${user.id}`}
          data-tooltip-content={
            allowDelete ? 'Șterge utilizatorul' : 'Nu aveți permisiunea'
          }
          data-tooltip-place='left'
          className='user-row-button user-row-delete'
          disabled={!allowDelete}
          onClick={() => {
            confirmDialog({
              message: `Sunteți sigur că doriți să ștergeți utilizatorul ${user.lastName} ${user.firstName}?`,
              header: 'Confimare ștergere utilizator',
              icon: 'pi pi-trash',
              defaultFocus: 'reject',
              acceptClassName: 'p-button-danger',
              acceptLabel: 'Da',
              rejectLabel: 'Nu',
              accept: () => {
                deleteUser(user.id)
              },
              reject: () => {},
            })
          }}
        >
          <CiTrash size={23} />
        </button>
      </td>
    </tr>
  )
}

export default UserRow
