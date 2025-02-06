import React, { useState } from 'react';
import Select from 'react-select';
 
import { useDispatch, useSelector } from 'react-redux';
import { createDenuncia } from '../../../redux/actions/userAction';
 
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useParams } from 'react-router-dom';
 
// Opciones de denuncia
const optionsDenonciation = [
    { label: 'Harcèlement (تحرش)', value: 'Harcèlement' },
    { label: 'Fraude (احتيال)', value: 'Fraude' },
    { label: 'Discours de haine (خطاب الكراهية)', value: 'Discours de haine' },
    { label: 'Spam (بريد مؤذي)', value: 'Spam' },
    { label: 'Usurpation d\'identité (انتحال الشخصية)', value: 'Usurpation d\'identité' },
    { label: 'content explicite (محتوى غير لائق)', value: 'content explicite' },
    { label: 'Violation du droit d\'auteur (انتهاك حقوق الطبع)', value: 'Violation du droit d\'auteur' },
    { label: 'Informations fausses (معلومات كاذبة)', value: 'Informations fausses' },
    { label: 'content violent (محتوى عنيف)', value: 'content violent' },
    { label: 'Incitation à la violence (تحريض على العنف)', value: 'Incitation à la violence' },
    { label: 'Publicité non autorisée (إعلان غير مصرح)', value: 'Publicité non autorisée' },
];

const StatusModalDenuncia = ({post}) => {
    const [razonesSeleccionadas, setRazonesSeleccionadas] = useState([]); // Estado para las razones seleccionadas
    const dispatch = useDispatch();
    const { auth  ,homePosts  } = useSelector(state => state); // Obtener el estado de autenticación
    
   // const { id } = useParams();

    // Obtener los posts del estado global
    
  
    // Buscar el post por el ID
    //const post = homePosts.posts.find(p => p._id === id);

    const handleChange = (selectedOptions) => {
        setRazonesSeleccionadas(selectedOptions);
    };
 
  
    
    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Convertir las razones seleccionadas en un array de strings
        const razones = razonesSeleccionadas.map(option => option.value);

        // Validar que se seleccionen razones antes de enviar
        if (razones.length === 0) {
            return alert('Por favor selecciona al menos una razón.');
        }

        // Enviar la acción para crear la denuncia
        dispatch(createDenuncia({ razones, auth,  post }));


        // Opcional: también puedes cerrar el modal después del envío
        dispatch({ type: GLOBALTYPES.MODALDENUNCIA, payload: false });
    };

    return (
        <div className="status_modal">
            <form onSubmit={handleSubmit}>
                <div className="status_header">
                    <h5 className="m-0">Bloqueos de usuarios</h5>
                    <span onClick={() => dispatch({ type: GLOBALTYPES.MODALDENUNCIA, payload: false })}>&times;</span>
                </div>
                <div className="status_body">
                    <div className="card-header">
                        <strong className="m-0 mb-2 text-danger">Seleccione la razón de la denuncia</strong>
                    </div>

                    <Select
                        options={optionsDenonciation}
                        isMulti
                        onChange={handleChange}
                        value={razonesSeleccionadas} // Mantener valores sincronizados
                        placeholder="Selecciona las razones"
                    />
                </div>

                <div className="status_footer">
                    <button className="btn btn-secondary w-100" type="submit">
                        Enviar denuncia
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StatusModalDenuncia;
