import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadIcon from '../../../images/loading.gif';
import LoadMoreBtn from '../../LoadMoreBtn';
import { getDataAPI } from '../../../utils/fetchData';
import { USER_TYPES } from '../../../redux/actions/userAction';
import UserCard from '../../UserCard';
const ListUsers3h = () => {
  const { homeUsers, auth } = useSelector((state) => state);

  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  // Manejar la carga de más usuarios
  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`users/active-last-3h?limit=${homeUsers.activeLast3hUsers.page * 9}`, auth.token);

    dispatch({
      type: USER_TYPES.GET_ACTIVE_USERS_LAST_3H,
      payload: res.data.users,
      page: homeUsers.activeLast3hUsers.page + 1,
    });

    setLoad(false);
  };

  // Manejar acciones del usuario
  const handleUserAction = async (action, user) => {
    try {
      let res;
      switch (action) {
        case 'ver':
          console.log(`Ver detalles de ${user.username}`);
          break;
        case 'editar':
          console.log(`Editar usuario ${user.username}`);
          break;
        case 'eliminar':
          console.log(`Eliminar usuario ${user.username}`);
          break;
        case 'bloquear':
          res = await getDataAPI(`users/block/${user._id}`, auth.token);
          alert(res.msg);
          break;
        case 'desbloquear':
          res = await getDataAPI(`users/unblock/${user._id}`, auth.token);
          alert(res.msg);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      alert('Error en la acción del usuario');
    }
  };

  return (
    <div className="container mt-5">
      <div>
        <h5>Total usuarios en las últimas: 3h</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>user</th>
              <th>Email</th>
              <th>Fecha de Registro</th> {/* Nueva columna para la fecha de registro */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {homeUsers.activeLast3hUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td><UserCard user={user} /></td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td> {/* Mostrar la fecha de registro */}
                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id={`dropdownMenuButton${user._id}`}
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Acciones
                    </button>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby={`dropdownMenuButton${user._id}`}>
                      <button className="dropdown-item" onClick={() => handleUserAction('ver', user)}>
                        Ver detalles
                      </button>
                      <button className="dropdown-item" onClick={() => handleUserAction('editar', user)}>
                        Editar usuario
                      </button>
                      <button className="dropdown-item" onClick={() => handleUserAction('eliminar', user)}>
                        Eliminar usuario
                      </button>
                      <button className="dropdown-item" onClick={() => handleUserAction('bloquear', user)}>
                        Bloquear usuario
                      </button>
                      <button className="dropdown-item" onClick={() => handleUserAction('desbloquear', user)}>
                        Desbloquear usuario
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}

      <LoadMoreBtn
        result={homeUsers.activeLast3hUsers.result}
        page={homeUsers.activeLast3hUsers.page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default ListUsers3h;
