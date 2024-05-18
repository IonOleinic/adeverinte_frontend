import useRoles from '../../../hooks/useRoles'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useLoading from '../../../hooks/useLoading'
import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import LoadingLayer from '../../LoadingLayer/LoadingLayer'
import { Paginator } from 'primereact/paginator'
import UserRow from '../UserRow/UserRow'
import { LiaPlusSolid } from 'react-icons/lia'
import './ManageUsers.css'
import { useNavigate } from 'react-router-dom'
function ManageUsers() {
  const navigate = useNavigate()
  const { setIsLoading } = useLoading() // Use useLoading hook
  const { roles } = useRoles()
  const axiosPrivate = useAxiosPrivate()
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({
    email: '',
    role: '',
  })
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)

  const getUsers = async () => {
    toast.dismiss()
    try {
      setIsLoading(true)
      const response = await axiosPrivate.get('/users')
      setUsers(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
      toast.error('Eroare la încărcarea utilizatorilor', {
        autoClose: false,
        theme: 'colored',
      })
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getUsers()
    toast.dismiss()
    return () => {
      toast.dismiss()
    }
  }, [])

  const deleteUser = async (id) => {
    try {
      const response = await axiosPrivate.get(`/user/${id}`)
      await axiosPrivate.delete(`/user/${id}`)
      toast.warning(
        `Utilizatorul ${response.data?.lastName} ${response.data?.firstName} a fost șters.`
      )
      getUsers()
    } catch (error) {
      console.error(error)
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        (filters.role ? user.roles[0] == filters.role : true)
      )
    })
  }, [users, filters])

  const displayedUsers = useMemo(() => {
    return filteredUsers.slice(first, first + rows)
  }, [filteredUsers, first, rows])

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
    <div className='manage-users'>
      <div className='manage-users-toolbar'>
        <div className='manage-users-toolbar-item search-users-by-email'>
          <label htmlFor='search-by-email'>Email:</label>
          <input
            type='text'
            placeholder='cauta dupa email'
            id='search-by-email'
            className='form-control'
            value={filters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
          />
        </div>
        <div className='manage-users-toolbar-item search-users-by-role'>
          <label htmlFor='search-by-role'>Rol:</label>
          <select
            className='form-control'
            id='search-by-role'
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <option value={''}>*</option>
            <option value={roles.Admin}>Admin</option>
            <option value={roles.Secretar}>{`Secretar(ă)`}</option>
          </select>
        </div>
        <div className='manage-users-toolbar-item'>
          <label htmlFor='btn-add-user'>Adauga</label>
          <button
            id='btn-add-user'
            className='btn btn-primary btn-toolbar-add-user'
            type='button'
            onClick={() => {
              navigate('/settings/manage-users/add-user')
            }}
          >
            <LiaPlusSolid size={22} />
          </button>
        </div>
      </div>
      <div className='manage-users-list'>
        <div className='manage-users-table-container'>
          <table className='manage-users-table'>
            <thead>
              <tr className='user-row user-row-header'>
                <th className='user-row-item user-row-avatar'>Avatar</th>
                <th className='user-row-item user-row-fullname'>
                  Nume Complet
                </th>
                <th className='user-row-item user-row-email'>Email</th>
                <th className='user-row-item user-row-title'>Titlu</th>
                <th className='user-row-item user-row-role'>Rol</th>
                <th className='user-row-item user-row-buttons'>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <UserRow key={user.id} user={user} deleteUser={deleteUser} />
              ))}
            </tbody>
          </table>
        </div>
        <div className='manage-users-paginator'>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filteredUsers.length}
            rowsPerPageOptions={[10, 20, 50]}
            onPageChange={onPageChange}
          />
        </div>
        <LoadingLayer />
      </div>
    </div>
  )
}

export default ManageUsers
