import React from 'react'

const CardInfoPost = ({post}) => {
  return (
    <div className="cardinfopost">
   
    {post.attributes && Object.keys(post.attributes).length > 0 ? (
      Object.entries(post.attributes).map(([key, value]) => (
        <li key={key}>
          {key}: {value}
        </li>
      ))
    ) : (
      <li>No hay atributos disponibles</li>
    )}

</div>
  )
}

export default CardInfoPost