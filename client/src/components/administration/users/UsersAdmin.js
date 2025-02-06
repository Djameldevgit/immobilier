import React from 'react'
import ListUsers24h from './ListUsers24h';
import ListUsers3h from './ListUsers3h';
import ListUsersTotal from './ListUsersTotal';
 

const UsersAdmin = () => {
  return (
    <div>
      
      <ListUsersTotal/>
      <ListUsers3h/>
      <ListUsers24h  />
      
    </div>
  )
}

export default UsersAdmin
