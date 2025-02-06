import { GLOBALTYPES } from '../../globalTypes'
import { imageUpload } from '../../../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../../../utils/fetchData'
import { createNotify, removeNotify } from '../../notifyAction'

export const POSTAPROVE_TYPES = {
    CREATE_POST_PENDIENTE: 'CREATE_POST_PENDIENTE',
    APROVE_POST_PENDIENTE: 'APROVE_POST_PENDIENTE',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS_PENDIENTES: 'GET_POSTS_PENDIENTES',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST'
}

export const POST_TYPES_VENTE = {
    CREATE_POSTS_VENTE: 'CREATE_POSTS_VENTE',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS_VENTE: 'GET_POSTS_VENTE',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST'
}


export const createPostVentePendiente = ({ postData, images, auth, socket }) => async (dispatch) => {
    let media = []
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
        if (images.length > 0) media = await imageUpload(images)

        const res = await postDataAPI('posts', { postData, images: media }, auth.token)
 
        dispatch({
            type: POST_TYPES_VENTE.CREATE_POSTS_VENTE,
            payload: { ...res.data.newPost, user: auth.user }
        })

        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } })

        // Notify
        const msg = {
            id: res.data.newPost._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${res.data.newPost._id}`,
            category: postData.category,
            image: media[0].url
        }

        dispatch(createNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}
export const aprovarPostPendiente = (post, estado, auth) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        const res = await patchDataAPI(`aprovarpost/${post._id}/aprovado`, { estado }, auth.token);

        dispatch({
            type: POSTAPROVE_TYPES.APROVE_POST_PENDIENTE,
            payload: res.data,
        });

        /* dispatch({
             type: POSTAPROVE_TYPES.DECREMENT_POSTS_PENDIENTES_COUNT,
           });*/
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    } catch (error) {
        const errorMsg = error.response ? error.response.data.msg : 'Unexpected error occurred';
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: errorMsg },
        });
    }
};
export const updatePost = ({ postData, images, auth, vente }) => async (dispatch) => {
    let media = [];
    const imgNewUrl = images.filter(img => !img.url);
    const imgOldUrl = images.filter(img => img.url);

    console.log("Datos iniciales del post:", { postData, vente });

    if (
        vente.title === postData.title &&

        imgNewUrl.length === postData === 0 &&
        imgOldUrl.length === postData.vente.images.length
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
            `post/${vente._id}`,
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


export const getPostsPendientes = (token) => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES_VENTE.LOADING_POST, payload: true })
        const res = await getDataAPI('getpostspendientes', token)
    
        dispatch({
            type: POST_TYPES_VENTE.GET_POSTS_VENTE,
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
export const getPosts = (token) => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES_VENTE.LOADING, payload: true })
        const res = await getDataAPI('posts', token)
        
        dispatch({
            type: POST_TYPES_VENTE.GET_POSTS_VENTE,
            payload: {...res.data, page: 2}
        })

        dispatch({ type: POST_TYPES_VENTE.LOADING, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
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


