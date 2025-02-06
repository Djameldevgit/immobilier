import React from 'react'

const CardInfoPostUser  = ({post}) => {
  return (
    <div className="cardinfopostuser">
   
    {post.username}
    {post.email}
  </div>
  )
}

export default CardInfoPostUser
