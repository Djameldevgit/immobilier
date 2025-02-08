import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'

export const POSTAPROVE_TYPES = {
    GET_POSTS_PENDIENTES: 'GET_POSTS_PENDIENTES',
    DECREMENT_POSTS_PENDIENTES_COUNT: 'DECREMENT_POSTS_PENDIENTES_COUNT',
    GET_POSTS_PENDIENTES_COUNT: 'GET_POSTS_PENDIENTES_COUNT',
    GET_POSTS_COUNT: 'GET_POSTS_COUNT',
    CREATE_POST_PENDIENTE: 'CREATE_POST_PENDIENTE',
    APROVE_POST_PENDIENTE: 'APROVE_POST_PENDIENTE',
    DELETE_POST_PENDIENTE: 'DELETE_POST_PENDIENTE',
    LOADING_POSTS_PENDIENTE: 'LOADING_POSTS_PENDIENTE',
    UPDATE_POST: 'UPDATE_POST',
    GET_USER_PUBLISHED_POSTS_COUNT: 'GET_USER_PUBLISHED_POSTS_COUNT',
}


export const createPostPendiente = ({ postData ,wilaya, commune, marca, modelo,  images, auth, socket }) => async (dispatch) => {
    let media = []
 
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        if (images.length > 0) media = await imageUpload(images)//Si hay imágenes, se suben a Cloudinary usando la función imageUpload(images) y se almacenan las URLs resultantes en media


        const res = await postDataAPI('crearpostpendiente', { ...postData, wilaya, commune, marca, modelo,  images: media }, auth.token)//Se envían el contenido del post y las URLs de las imágenes al servidor usando postDataAPI.


        dispatch({
            type: POSTAPROVE_TYPES.CREATE_POST_PENDIENTE,
            payload: { ...res.data.newPost, user: auth.user }
        })

        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } })

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        })
        // Notify
        const msg = {
            id: res.data.newPost._id,
            text: 'A ajouter une nouvelle publication.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${res.data.newPost._id}`,

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

export const getPostsPendientesss = (token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        const res = await getDataAPI('getpostspendientes', token);
      
        dispatch({
            type: POSTAPROVE_TYPES.GET_POSTS_PENDIENTES,
            payload: { ...res.data, page: 2 }
        });

        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};




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

export const deletePostPendiente = ({ post, auth, socket }) => async (dispatch) => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    dispatch({ type: POSTAPROVE_TYPES.DELETE_POST_PENDIENTE, payload: post })

    try {
        const res = await deleteDataAPI(`post/${post._id}`, auth.token)

        // Notify
        const msg = {
            id: post._id,
            text: 'suprimer une publication.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({ msg, auth, socket }))
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}
export const getcountPosts = (token) => async (dispatch) => {

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        const res = await getDataAPI('countposts', token);

        dispatch({
            type: POSTAPROVE_TYPES.GET_POSTS_COUNT,
            payload: res.data.countpoststotal
        });

        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};


// Acción para obtener usuarios activos en las últimas 24 horas
export const getcountpostspendientes = (token) => async (dispatch) => {

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        const res = await getDataAPI('countpostspendientess', token);
        dispatch({
            type: POSTAPROVE_TYPES.GET_POSTS_PENDIENTES_COUNT,
            payload: res.data.countpostspendientes
        });
        dispatch({
            type: POSTAPROVE_TYPES.DECREMENT_POSTS_PENDIENTES_COUNT,
            payload: res.data.countpostspendientes
        });

        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};

export const updatePost = ({ postData, wilaya, commune,marca,modelo, images, auth, status, estado }) => async (dispatch) => {
    let media = [];
    const imgNewUrl = images.filter((img) => !img.url);
    const imgOldUrl = images.filter((img) => img.url);
    
    
    // Verificar si hay cambios en los datos antes de proceder con la actualización
    if(status.postData=== postData
        && imgNewUrl.length === 0
        && imgOldUrl.length === status.images.length
    ) return;

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        // Subir nuevas imágenes si es necesario
        if (imgNewUrl.length > 0) media = await imageUpload(imgNewUrl);

        // Preparar los datos actualizados
        const updatedData = {
            content: postData.content,
            titre: postData.titre,
            titledemarque: postData.titledemarque,
            referencia: postData.referencia,
            marca,
            modelo,
            copie: postData.copie,
            memoire: postData.memoire,
            color: postData.color,
            etattelefono: postData.etattelefono,
            os: postData.os,
            appareil: postData.appareil,
            camerafrontal: postData.camerafrontal,
            talleecran: postData.talleecran,
            ram: postData.ram,
            doublepuces: postData.doublepuces,
           
           
            discripcionsmart: postData.discripcionsmart,
            pricesmartphone: postData.pricesmartphone,
            ofertasmart: postData.ofertasmart,
            changesmart: postData.changesmart,
           
            wilaya,  // Cambiado a array para selección múltiple
            commune,
            email: postData.email,

            informacion: false,
            comentarios: false,
            contadordevisitas: false,
            duraciondelanuncio: postData.duraciondelanuncio,
 
            images: [...imgOldUrl, ...media], // Incluir tanto las imágenes viejas como las nuevas
        };

        // Enviar los datos actualizados al servidor
        const res = await patchDataAPI(`post/${status._id}`, { updatedData, estado }, auth.token);

        // Despachar la acción para actualizar el post en el estado de Redux
        dispatch({ type: POSTAPROVE_TYPES.UPDATE_POST, payload: res.data.newPost });

        // Despachar alerta de éxito
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
        // Despachar alerta de error
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};


export const getUserPublishedPostsCount = ({ user, token }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`user/${user._id}/count-posts`, token);

        dispatch({
            type: POSTAPROVE_TYPES.GET_USER_PUBLISHED_POSTS_COUNT,
            payload: res.data.count
        });

    } catch (err) {
        console.error(err);
        throw err; // Maneja el error según lo necesites
    }
};
