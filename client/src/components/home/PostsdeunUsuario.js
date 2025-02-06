import React, { useState, useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
 import { getTotalPostsCountUser } from '../../redux/actions/postAction';
 
const PostsdeunUsuario = () => {
    const dispatch = useDispatch();
    const {auth,usercountposts} = useSelector(state=>state)
    const {user} = auth
   
    useEffect(() => {
        if (user) {
            dispatch(getTotalPostsCountUser(user,auth)); // Llamamos a la acción para obtener la cuenta de posts
        }
    }, [dispatch, user]);

    return (
        <div>
            <h2>User Profile</h2>
            <p>Total posts: {usercountposts}</p> {/* Mostramos la cantidad total de posts */}
        </div>
    );
};

 

export default PostsdeunUsuario
