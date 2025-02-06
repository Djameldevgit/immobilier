import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getcountPosts , POSTAPROVE_TYPES} from '../../../redux/actions/postaproveAction';
 
import { getDataAPI } from '../../../utils/fetchData';
 
const PostsTotalCount = () => {
    const { homePostsAprove, auth } = useSelector((state) => state);

    const dispatch = useDispatch();
  
    useEffect(() => {
      const fetchpostsaprove = async () => {
        try {
          const res = await getDataAPI('countposts', auth.token);
  
          dispatch({
            type: POSTAPROVE_TYPES.GET_POSTS_COUNT,
            payload: res.data.countposts
        });
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchpostsaprove();
    }, [auth.token, dispatch]);
  
    useEffect(() => {
      if (auth.token) {
        dispatch(getcountPosts(auth.token));
      }
    }, [dispatch, auth.token]);
  
  
    return (
      <div  >
      <h4 >Total posts:  <strong className='text-danger'>{homePostsAprove.countposts}</strong> </h4>
    </div>
    );
  };
  
export default PostsTotalCount
