import { DeleteData, EditData } from "../actions/globalTypes";
import { POSTAPROVE_TYPES } from "../actions/postaproveAction";



const initialState = {
  loading: false,
  posts: [],
  countpostspendientes: [],
  userPublishedPostsCount: [], // Aquí agregas el total de posts por usuario

  countposts:[],
  result: 0,
  page: 2
}

const postaproveReducer = (state = initialState, action) => {
  switch (action.type) {

    case POSTAPROVE_TYPES.CREATE_POST_PENDIENTE:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };

    case POSTAPROVE_TYPES.GET_POSTS_PENDIENTES:
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        page: action.payload.page,
       
      };

      case POSTAPROVE_TYPES.GET_USER_PUBLISHED_POSTS_COUNT:
    return {
        ...state,
        userPublishedPostsCount: action.payload // Aquí almacenas el conteo de posts
    };
    case POSTAPROVE_TYPES.GET_POSTS_PENDIENTES_COUNT: 
      return {
        ...state,
        countpostspendientes: action.payload, // Aquí actualizas el número de posts pendientes
      };
      case POSTAPROVE_TYPES.GET_POSTS_COUNT: 
      return {
        ...state,
        countposts: action.payload, // Aquí actualizas el número de posts pendientes
      };
    case POSTAPROVE_TYPES.DECREMENT_POSTS_PENDIENTES_COUNT:
      return {
        ...state,
        countpostspendientes: state.countpostspendientes - 1, // Disminuye el contador
      };
    case POSTAPROVE_TYPES.LOADING_POSTS_PENDIENTE:
      return {
        ...state,
        loading: action.payload
      };


    case POSTAPROVE_TYPES.APROVE_POST_PENDIENTE:
      const updatedpost = state.posts.map((post) =>
        post._id === action.payload._id
          ? { ...post, estado: 'aprovado' }
          : post
      );
      return {
        ...state,
        posts: updatedpost,
      };
    case POSTAPROVE_TYPES.DELETE_POST_PENDIENTE:
      return {
        ...state,
        posts: DeleteData(state.posts, action.payload._id)
      };
      case POSTAPROVE_TYPES.UPDATE_POST://La clave de esta acción es que, cuando el reducer recibe la acción UPDATE_POST, busca el post por su _id en el array de posts y lo reemplaza por el nuevo post que llega en action.payload.
      return {
          ...state,
          posts: EditData(state.posts, action.payload._id, action.payload)
      };
    default:
      return state;
  }
}
 
export default postaproveReducer