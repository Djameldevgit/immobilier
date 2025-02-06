import React from 'react'
 
const DescriptionHeader = ({post}) => {
  return (
    <div className="description-header">
    <div className='category'>{post.category}</div>
    <div className='subcategory'>{post.subCategory}</div>
    <div className='title'>title{post.title}</div>
</div>
  )
}

export default DescriptionHeader