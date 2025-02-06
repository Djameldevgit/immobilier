import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { blockUser, unblockUser, deleteUser, viewUserDetails, editUser } from '../../../redux/actions/userAction';
 
const ActionUsers = ({ user }) => {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch(); // Hook para despachar acciones

  const handleUserAction = (action, user) => {
    switch (action) {
      case 'ver':
        dispatch(viewUserDetails(user)); // Acción para ver detalles
        break;
      case 'editar':
        dispatch(editUser(user)); // Acción para editar usuario
        break;
      case 'eliminar':
        dispatch(deleteUser(user._id, auth.token)); // Acción para eliminar usuario
        break;
      case 'bloquear':
        dispatch(blockUser(user._id, auth.token)); // Acción para bloquear usuario
        break;
      case 'desbloquear':
        dispatch(unblockUser(user._id, auth.token)); // Acción para desbloquear usuario
        break;
      default:
        break;
    }
  };

  return (
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
  );
};

export default ActionUsers;
