 

import React ,{useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { USER_TYPES } from '../../../redux/actions/userAction';
import { getDataAPI } from '../../../utils/fetchData';
import { fetchTotalUsersCount    } from '../../../redux/actions/userAction';
 
const ListUsersTotal = () => {
  const { homeUsers, auth } = useSelector(state => state);
  const { totalUsersCount } = useSelector(state => state.homeUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
  
        
        const res = await getDataAPI('users/counttotal', auth.token);
        dispatch({ type: USER_TYPES.GET_TOTAL_USERS_COUNT, payload: res.data.counttotal });
      } catch (error) {
        console.error(error);
      }
    };

    fetchCounts();
  }, [auth.token, dispatch]);

  // Efecto para obtener el conteo total de usuarios
  useEffect(() => {
    if (auth.token) {
      dispatch(fetchTotalUsersCount(auth.token));
    }
  }, [dispatch, auth.token]);

  
  

  return (
    <div  >
      <h4 >Total users:  <strong className='text-danger'>{homeUsers.counttotal}</strong> </h4>
    </div>
  );
};

export default ListUsersTotal;
