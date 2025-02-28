import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getPost } from '../../redux/actions/postAction'
import LoadIcon from '../../images/loading.gif'
import PostCard from '../../components/PostCard'


const Post = () => {
    const { id } = useParams()
    const [post, setPost] = useState([])

    const { auth, detailPost } = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPost({detailPost, id, auth}))

        if(detailPost.length > 0){
            const newArr = detailPost.filter(post => post._id === id)
            setPost(newArr)
        }
    },[detailPost, dispatch, id, auth])

    return (
        <div>
            {
                post.length === 0 &&
               <div className='imagedetails'>
                 <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
               </div>
               
            }

            {
                
                post.map(item => (
                <div className="postdetalle">
                    <PostCard key={item._id} post={item} cl />
                    </div>
                ))
            }
        </div>
    )
}

export default Post
