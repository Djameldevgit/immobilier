import React, { useState } from 'react';

const ReportForm = () => {
    const [selectedReasons, setSelectedReasons] = useState([]);

    const reportOptions = [
        'Contenido inapropiado',
        'Lenguaje ofensivo',
        'Imágenes no permitidas',
        'Publicidad engañosa',
        'Producto falso',
        'Contenido fraudulento',
        'Incitación al odio',
        'Estafa o fraude',
        'Producto dañado',
        'Comportamiento abusivo',
        'Spam o contenido irrelevante',
        'Información incorrecta',
        'Violación de términos y condiciones',
        'Contenido explícito',
        'Violación de derechos de autor',
        'Precio sospechoso',
        'Problema con el vendedor'
    ];

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedReasons([...selectedReasons, value]);
        } else {
            setSelectedReasons(selectedReasons.filter(reason => reason !== value));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí iría la lógica para enviar los motivos seleccionados al backend
        console.log('Motivos seleccionados:', selectedReasons);
        // Reiniciar el formulario si lo deseas
        setSelectedReasons([]);
    };

    return (
        <div className="report-form">
            <h3>Denunciar publicación</h3>
            <form onSubmit={handleSubmit}>
                {reportOptions.map((option, index) => (
                    <div key={index} className="checkbox-item">
                        <label>
                            <input
                                type="checkbox"
                                value={option}
                                onChange={handleCheckboxChange}
                                checked={selectedReasons.includes(option)}
                            />
                            {option}
                        </label>
                    </div>
                ))}

                <button type="submit" className="btn btn-primary">Enviar reporte</button>
            </form>
        </div>
    );
};

export default ReportForm;
