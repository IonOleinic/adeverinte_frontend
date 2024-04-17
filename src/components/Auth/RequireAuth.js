import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import Unauthorized from '../Unauthorized/Unauthorized'
import useAuth from '../../hooks/useAuth'

function RequireAuth({ allowedRoles = [] }) {
  const { auth } = useAuth()
  const location = useLocation()

  return auth?.roles?.find((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : auth.accessToken ? (
    <Unauthorized />
  ) : (
    <Navigate to='/signin' state={{ from: location }} replace />
  )
}

export default RequireAuth
