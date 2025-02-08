import React, { useEffect } from 'react';
import LoadIcon from '../../images/loading.gif';
import { useSelector, useDispatch } from 'react-redux';
import Postspendientess from '../../components/home/Postspendientess';
import Postspendientescount from '../../components/administration/users/Postspendientescount';
import { aprovarPostPendiente, getPostsPendientes } from '../../redux/actions/postaproveAction';
import { useHistory } from 'react-router-dom';
import { deletePost } from '../../redux/actions/postAction';
 
let scroll = 0;

const Postspendientes = () => {
  const { homePostsAprove, auth, socket } = useSelector(state => state);
  const dispatch = useDispatch();
  const history = useHistory();

  window.addEventListener('scroll', () => {
    if (window.location.pathname === '/') {
      scroll = window.pageYOffset;
      return scroll;
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: scroll, behavior: 'smooth' });
    }, 100);
  }, []);

  // Función para aprobar el post
  const handleAprove = (post) => {
    const confirmAction = window.confirm("¿Deseas aprobar esta agencia?");
    if (confirmAction) {
      dispatch(aprovarPostPendiente(post, 'aprovado', auth));
      history.push("/administracion/postspendientes");
    }
  };

  // Función para eliminar el post
  const handleDeletePost = (post) => {
    if (window.confirm("¿Realmente deseas eliminar este servicio?")) {
      dispatch(deletePost({ post, auth, socket }));
      history.push("/");
    }
  };
 
  // Función para editar el post
  const handleEditPost = (post) => {
    dispatch({ type: 'GLOBALTYPES.STATUS', payload: { ...post, onEdit: true } });
  };

  return (
    <div>
      

      {
        homePostsAprove.loading
          ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
          : (homePostsAprove.posts === 0 && homePostsAprove.posts.length === 0)
            ? <h2 className="text-center">Aucun résultat trouvé pour cette recherche</h2>
            : <Postspendientess
                posts={homePostsAprove.posts} 
                handleAprove={handleAprove} 
                handleDeletePost={handleDeletePost} 
                handleEditPost={handleEditPost} 
              />
      }
    </div>
  );
};

export default Postspendientes;




