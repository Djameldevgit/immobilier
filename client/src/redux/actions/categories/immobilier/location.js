import { GLOBALTYPES } from '../../globalTypes'
import { imageUpload } from '../../../../utils/imageUpload'
 import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI  } from '../../../../utils/fetchData'
import { createNotify,removeNotify } from '../../notifyAction'

  
 
export const POST_TYPES_VENTE = {
    CREATE_POST: 'CREATE_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST'
}
export const updatePostLocation = ({ postData, images, auth, location }) => async (dispatch) => {
    let media = [];
    const imgNewUrl = images.filter(img => !img.url);
    const imgOldUrl = images.filter(img => img.url);

    console.log("Datos iniciales del post:", { postData, location });

    if (
        location.title === postData.title &&
        
        imgNewUrl.length === postData === 0 &&
        imgOldUrl.length === postData.location.images.length
    ) {
      return;
    }
 try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        console.log("Iniciando subida de imágenes nuevas...");
   if (imgNewUrl.length > 0) {
            media = await imageUpload(imgNewUrl);
             }
        const res = await patchDataAPI(
            `post/${location._id}`,
            {
                ...postData,
                images: [...imgOldUrl, ...media]
            },
            auth.token
        );

        dispatch({ type: POST_TYPES_VENTE.UPDATE_POST, payload: res.data.newPost });
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });

    } catch (err) {
         dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response ? err.response.data.msg : err.message }
        });
    }
};
 
export const createPostLocation = ({ postData, images, auth, socket }) => async (dispatch) => {
          let media = []
        try {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
            if(images.length > 0) media = await imageUpload(images)
    
            const res = await postDataAPI('posts', { postData, images: media }, auth.token)
    
            dispatch({ 
                type: POST_TYPES_VENTE.CREATE_POST, 
                payload: {...res.data.newPost, user: auth.user} 
            })
    
            dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} })
    
            // Notify
            const msg = {
                id: res.data.newPost._id,
                text: 'added a new post.',
                recipients: res.data.newPost.user.followers,
                url: `/post/${res.data.newPost._id}`,
               content:postData.content, 
                image: media[0].url
            }
    
            dispatch(createNotify({msg, auth, socket}))
    
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }

export const getPostsLocation = (token) => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES_VENTE.LOADING_POST, payload: true })
        const res = await getDataAPI('posts', token)
console.log(res)
        dispatch({
            type: POST_TYPES_VENTE.GET_POSTS,
            payload: { ...res.data, page: 2 }
        })

        dispatch({ type: POST_TYPES_VENTE.LOADING_POST, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}
 
 
export const likePost = ({ post, auth, socket }) => async (dispatch) => {
    const newPost = { ...post, likes: [...post.likes, auth.user] }
    dispatch({ type: POST_TYPES_VENTE.UPDATE_POST, payload: newPost })

    socket.emit('likePost', newPost)

    try {
        await patchDataAPI(`post/${post._id}/like`, null, auth.token)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content,
            image: post.images[0].url
        }

        dispatch(createNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const unLikePost = ({ post, auth, socket }) => async (dispatch) => {
    const newPost = { ...post, likes: post.likes.filter(like => like._id !== auth.user._id) }
    dispatch({ type: POST_TYPES_VENTE.UPDATE_POST, payload: newPost })

    socket.emit('unLikePost', newPost)

    try {
        await patchDataAPI(`post/${post._id}/unlike`, null, auth.token)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const getPost = ({ detailPost, id, auth }) => async (dispatch) => {
    if (detailPost.every(post => post._id !== id)) {
        try {
            const res = await getDataAPI(`post/${id}`, auth.token)
            dispatch({ type: POST_TYPES_VENTE.GET_POST, payload: res.data.post })
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response.data.msg }
            })
        }
    }
}

export const deletePost = ({ post, auth, socket }) => async (dispatch) => {
    dispatch({ type: POST_TYPES_VENTE.DELETE_POST, payload: post })

    try {
        const res = await deleteDataAPI(`post/${post._id}`, auth.token)

        // Notify
        const msg = {
            id: post._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const savePost = ({ post, auth }) => async (dispatch) => {
    const newUser = { ...auth.user, saved: [...auth.user.saved, post._id] }
    dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } })

    try {
        await patchDataAPI(`savePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const unSavePost = ({ post, auth }) => async (dispatch) => {
    const newUser = { ...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } })

    try {
        await patchDataAPI(`unSavePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const getTotalPostsCountUser = ({ auth, user }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`user/${user._id}/count-posts`, auth.token);
        dispatch({
            type: 'GET_TOTAL_POSTS_USER',
            payload: res.data.counTotalPostsUser // Asumiendo que el servidor devuelve el número total en "totalPosts"
        });
    } catch (err) {
        console.error(err);
    }
};


