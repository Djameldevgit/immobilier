import React from 'react'
import { useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes'


const Categories = () => {
    const dispatch = useDispatch();
    return (
        <div className="cardcategory">
            <div className='formcategory'>
                <div
                    className="text"
                    onClick={() => dispatch({ type: GLOBALTYPES.VENTE, payload: 'true' })}
                >
                    <i className="fas fa-tag me-2 text-success"></i>
                    Vente
                </div>

                <div
                    className="text"
                    onClick={() => dispatch({ type: GLOBALTYPES.LOCATION, payload: 'true' })}
                >
                    <i className="fas fa-map-marker-alt me-2 text-success"></i>
                    Location
                </div>

                <div
                    className="text"
                    onClick={() => dispatch({ type: GLOBALTYPES.LOCATIONVACANCES, payload: 'true' })}
                >
                    <i className="fas fa-map-marker-alt me-2 text-success"></i>
                    Location Vacances
                </div>

                <div
                    className="text"
                    onClick={() => dispatch({ type: GLOBALTYPES.ECHANGE, payload: 'true' })}
                >
                    <i className="fas fa-map-marker-alt me-2 text-success"></i>
                    Echange
                </div>

                <div
                    className="text"
                    onClick={() => dispatch({ type: GLOBALTYPES.CHERCHELOCATION, payload: 'true' })}
                >
                    <i className="fas fa-map-marker-alt me-2 text-success"></i>
                    Cherche Location
                </div>

                <div
                    className="text"
                    onClick={() => dispatch({ type: GLOBALTYPES.CHERCHEACHAT, payload: 'true' })}
                >
                    <i className="fas fa-map-marker-alt me-2 text-success"></i>
                    Cherche Achat
                </div>
            </div>
        </div>

    )
}

export default Categories
