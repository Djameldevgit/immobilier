import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, updateUserStatus, blockUser } from '../../../redux/actions/userAction';
 
const UserManagement = ({reason}) => {
    const dispatch = useDispatch();
    const { auth, homeUsers } = useSelector(state => state);
    //const {user} = auth
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado para bloqueo
    const [showBlockForm, setShowBlockForm] = useState(false); // Controla la visibilidad del formulario de bloqueo

    const filteredUsers = homeUsers.users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (auth.token) {
            dispatch(getUsers(auth.token));
        }
    }, [auth.token, dispatch]);

    const handleUpdateStatus = (user, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active'; // Cambia entre 'active' y 'suspended'
        dispatch(updateUserStatus(user, newStatus, auth.token));
    };

    const getStatusButtonColor = (status) => {
        switch (status) {
            case 'active':
                return 'btn-success'; // Verde para activo
            case 'suspended':
                return 'btn-danger';  // Rojo para suspendido
            case 'banned':
                return 'btn-secondary';  // Gris para baneado
            default:
                return 'btn-primary'; // Azul por defecto
        }
    };

    const handleBlockUser = (user) => {
        if (!user) {
            console.error('El usuario no está definido');
            return;
        }
        setSelectedUser(user); // Selecciona el usuario
        setShowBlockForm(true); // Muestra el formulario de bloqueo
        dispatch(blockUser({user, auth,reason})); // Despachar la acción de bloquear al usuario
    };
    return (
        <div className="user-management">
            <h1>Gestión de Usuarios</h1>
            <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="user-list">
                {filteredUsers.map(user => (
                    <li key={user._id}>
                        <span>{user.username} - {user.status}</span>
                        {user.suspendedAt && <small> (Suspendido el: {new Date(user.suspendedAt).toLocaleDateString()})</small>}
                        <button 
                            className={`btn ${getStatusButtonColor(user.status)}`}
                            onClick={() => handleUpdateStatus(user._id, user.status)}
                        >
                            {user.status === 'active' ? 'Suspender' : user.status === 'suspended' ? 'Reactivar' : 'Baneado'}
                        </button>
                        {/* Botón para abrir el formulario de bloqueo */}
                        <button 
                            className="btn btn-warning ml-2"
                            onClick={() => handleBlockUser(user)}
                        >
                            Bloquear
                        </button>
                    </li>
                ))}
            </ul>

            {/* Formulario para bloquear al usuario seleccionado */}
            {showBlockForm && selectedUser && (
                <div className="block-user-modal">
                    <h2>Bloquear a {selectedUser.username}</h2>
                    
                    <button 
                        className="btn btn-secondary"
                        onClick={() => setShowBlockForm(false)}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
