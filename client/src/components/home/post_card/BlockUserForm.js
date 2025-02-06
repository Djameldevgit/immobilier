import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { blockUser } from '../../../redux/actions/userAction';

const BlockUserForm = ({ user }) => {
    const { auth } = useSelector(state => state); // Asegúrate de obtener correctamente el auth
    const dispatch = useDispatch();
    const [checkedReasons, setCheckedReasons] = useState({
        spam: false,
        harassment: false,
        inappropriateContent: false,
    });

    const reasons = [
        { id: 'spam', label: 'Spam' },
        { id: 'harassment', label: 'Acoso' },
        { id: 'inappropriateContent', label: 'Contenido inapropiado' },
    ];

    /*  const handleChange = (event) => {
        const { id, checked } = event.target;
        setCheckedReasons((prev) => ({
            ...prev,
          [id]: checked,
        }));
    };
*/
    const handleSubmit = (event) => {
        event.preventDefault();
        const selectedReasons = Object.keys(checkedReasons)
            .filter((key) => checkedReasons[key])
            .map((key) => key);

        const reasonText = selectedReasons.join(', ') || 'No especificado';

        // Enviar acción para bloquear el usuario
        dispatch(blockUser(auth, user)); // Asegúrate de que auth y user se pasen correctamente
    };

    return (
        <form className="block-user-form" onSubmit={handleSubmit}>
            <span onClick={() => dispatch({
                type: GLOBALTYPES.MODALBLOCUSER, payload: false
            })}>
                &times;
            </span>
            <h2>Bloquear Usuario</h2>
            {reasons.map((reason) => (
                <div key={reason.id} className="reason-checkbox">
                    <input
                        type="checkbox"
                        id={reason.id}
                        checked={checkedReasons[reason.id]}
                        onChange={handleChange}
                    />
                    <label htmlFor={reason.id}>{reason.label}</label>
                </div>
            ))}
            <button type="submit" className="submit-button">Bloquear Usuario</button>
        </form>
    );
};

export default BlockUserForm;
