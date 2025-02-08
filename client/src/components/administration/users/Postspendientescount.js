
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  getcountpostspendientes, POSTAPROVE_TYPES } from '../../../redux/actions/postaproveAction';
import { getDataAPI } from '../../../utils/fetchData';
 
const Postspendientescount = () => {

  const { homePostsAprove, auth } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchpostsaprove = async () => {
      try {
        const res = await getDataAPI('countpostspendientes', auth.token);

        dispatch({
          type: POSTAPROVE_TYPES.GET_POSTS_PENDIENTES_COUNT,
          payload: res.data.countpostspendientes
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchpostsaprove();
  }, [auth.token, dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getcountpostspendientes(auth.token));
    }
  }, [dispatch, auth.token]);


  return (
    <div  >
      <h4 >Total posts pendientes: <strong className='text-danger'>{homePostsAprove.countpostspendientes}</strong> </h4>
    </div>
  );
};

export default Postspendientescount


