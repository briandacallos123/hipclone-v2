import ManageLayout from '@/layouts/manage'
import { Box, Container } from '@mui/material'
import React from 'react'

const ManageLayoutView = ({ children }) => {
  return (
    <ManageLayout>
     {children}
    </ManageLayout>
  )
}

export default ManageLayoutView