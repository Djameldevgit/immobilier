import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadIcon from '../../images/loading.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import Carousel from '../Carousel';
 
import { POSTAPROVE_TYPES } from '../../redux/actions/postaproveAction';

import CardHeaderaprove from './post_card/CardHeaderaprove';
import PostsdeunUsuario from './PostsdeunUsuario';
 import { getTotalPostsCountUser } from '../../redux/actions/postAction';


const Postspendientess = () => {
  const { homePostsAprove, auth , usercountposts} = useSelector((state) => state); 
  const user = auth
 
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [postsPendientes, setPostsPendientes] = useState([]);
  useEffect(() => {
    if (user) {
        dispatch(getTotalPostsCountUser({auth,user})); // Llamamos a la acción para obtener la cuenta de posts
    }
}, [dispatch, user]);

  // Filtrar los posts que están pendientes
  useEffect(() => {
    const postspedientes = homePostsAprove.posts.filter((p) => p.estado === 'pendiente');
    setPostsPendientes(postspedientes);
  }, [homePostsAprove.posts]);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`posts?limit=${homePostsAprove.page * 9}`, auth.token);

    dispatch({
      type: POSTAPROVE_TYPES.GET_POSTS_PENDIENTES,
      payload: { ...res.data, page: homePostsAprove.page + 1 },
    });

    setLoad(false);
  };

  return (
    <div className="container mt-4">
      
    
      <h5 className="mb-3">Total de posts pendientes: {postsPendientes.length}</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
    
          <tr>
            <th>#</th>
            <th>Imagen</th>
            <td>Total posts</td>
            <th>Títre</th>
            <th>Nom</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {postsPendientes.length > 0 ? (
            postsPendientes.map((post, index) => (
              <tr key={post._id}>
                <td>{index + 1}</td>
                <td className="carousel-td">
                  {post.images.length > 0 ? (
                    <Carousel images={post.images} id={post._id} />
                  ) : (
                    <span>No hay imágenes</span>
                  )}
                </td>
                <td> {usercountposts}</td>  
                <td>{post.content}</td>
              <td>{post.user.username}</td> 
                <td>{post.estado}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td><CardHeaderaprove post={post} /></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No hay posts pendientes</td>
            </tr>
          )}
        </tbody>


      </table>



      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}
 

      <LoadMoreBtn result={homePostsAprove.result} page={homePostsAprove.page} load={load} handleLoadMore={handleLoadMore} />

       </div>
    </div>
  );
};

export default Postspendientess;