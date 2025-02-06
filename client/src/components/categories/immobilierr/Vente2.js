import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPost, updatePost } from '../../../redux/actions/postAction';

import { imageShow, videoShow } from '../../../utils/mediaShow';

import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { FormCheck } from 'react-bootstrap';
import Select from 'react-select';
import communesjson from "../../../json/communes.json"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';  // Importar los estilos predeterminados




const Vente = () => {
    const { auth, theme, socket, statusImmobilierReducer } = useSelector((state) => state);
    const { vente } = statusImmobilierReducer
    const dispatch = useDispatch();


    const [images, setImages] = useState([]);
   
    const [postData, setPostData] = useState({
        category: "immobilier",
       subCategory:"Vente",
        duraciondelanuncio: "",
        postData: {
            superficie: "",
            etage: "",
            piece: "",
      
        },
    });
   
 

    const [selectedWilaya, setSelectedWilaya] = useState([]);
    const [selectedCommune, setSelectedCommune] = useState([]);
    const [stream, setStream] = useState(false);
    const videoRef = useRef();
    const refCanvas = useRef();
    const [tracks, setTracks] = useState('');




    const conditiondepeyement = [
        { label: 'Promesse de vente possible', value: 'Promesse de vente possible' },
        { label: 'Crédit bancaire possible ', value: 'Crédit bancaire possible ' },
        { label: 'Paiement par tranche possible', value: 'Paiement par tranche possible' },
    ];
    const specifications = [
        { label: 'Electricité', value: 'Electricité' },
        { label: 'Garage', value: 'Garage' },
        { label: 'Immeuble', value: 'Immeuble' },
        { label: 'Gaz', value: 'Gaz' },
        { label: 'Eau', value: 'Eau' },
    ];
    const papiers = [
        { label: 'Permet de construire', value: 'Permet de construire' },
        { label: 'Decision', value: 'Decision' },
        { label: "Act dans l'indivision", value: "Act dans l'indivision" },
        { label: 'Act notarié', value: 'Act notarié' },
        { label: 'Livret foncier', value: 'Livret foncier' },
        { label: 'Papie timbre', value: 'Papie timbre' },
    ];



    const handleWilayaChange = (event) => {
        const selectedWilaya = event.target.value;
        setSelectedWilaya(selectedWilaya);

        const wilayaEncontrada = communesjson.find((wilaya) => wilaya.wilaya === selectedWilaya);
        const communes = wilayaEncontrada && wilayaEncontrada.commune ? wilayaEncontrada.commune : [];

        if (communes.length > 0) {
            setSelectedCommune(communes[0]);
        } else {
            setSelectedCommune('');
        }
    };

    const handleCommuneChange = (event) => {
        setSelectedCommune(event.target.value);
    };

    const wilayasOptions = communesjson.map((wilaya, index) => (
        <option key={index} value={wilaya.wilaya}>
            {wilaya.wilaya}
        </option>
    ));

    const communesOptions = communesjson.find((wilaya) => wilaya.wilaya === selectedWilaya)?.commune?.map((commune, index) => (
        <option key={index} value={commune}>
            {commune}
        </option>
    ));











    const handleChangeSpecifications = (selectedOptions) => {
        // Verifica si `selectedOptions` es un array
        const selectedValues = Array.isArray(selectedOptions)
            ? selectedOptions.map(option => option.value)  // Si es array, mapea los valores
            : [selectedOptions.value];  // Si es un solo objeto, convierte a array

        setpostData({ ...postData, specifications: selectedValues });
    };
    const handleChangeSelectconditiondepeyement = (selectedOptions) => {
        // Verifica si `selectedOptions` es un array
        const selectedValues = Array.isArray(selectedOptions)
            ? selectedOptions.map(option => option.value)  // Si es array, mapea los valores
            : [selectedOptions.value];  // Si es un solo objeto, convierte a array

        setpostData({ ...postData, conditiondepeyement: selectedValues });
    };
    const handleChangeSelectpapiers = (selectedOptions) => {
        // Verifica si `selectedOptions` es un array
        const selectedValues = Array.isArray(selectedOptions)
            ? selectedOptions.map(option => option.value)  // Si es array, mapea los valores
            : [selectedOptions.value];  // Si es un solo objeto, convierte a array

        setpostData({ ...postData, papiers: selectedValues });
    };




    const handleChangeImages = e => {
        const files = [...e.target.files];
        let err = '';
        let newImages = [];

        files.forEach(file => {
            if (!file) return (err = 'File does not exist.');

            if (file.size > 1024 * 1024 * 5) {
                return (err = 'The image/video largest is 5mb.');
            }

            return newImages.push(file);
        });

        if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
        setImages([...images, ...newImages]);
    };

    const deleteImages = index => {
        const newArr = [...images];
        newArr.splice(index, 1);
        setImages(newArr);
    };

    const handleStream = () => {
        setStream(true);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(mediaStream => {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();

                    const track = mediaStream.getTracks();
                    setTracks(track[0]);
                })
                .catch(err => console.log(err));
        }
    };

    const handleCapture = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;

        refCanvas.current.setAttribute('width', width);
        refCanvas.current.setAttribute('height', height);

        const ctx = refCanvas.current.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        let URL = refCanvas.current.toDataURL();
        setImages([...images, { camera: URL }]);
    };

    const handleStopStream = () => {
        tracks.stop();
        setStream(false);
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (images.length === 0)
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: 'Please add your photo.' },
            });

        if (vente.onEdit) {
            dispatch(updatePost({ postData,postData, images, auth, vente }));
        } else {
            dispatch(createPost({ postData,postData, images, auth, socket }));
        }

        setPostData(postData);
        setpostData(postData);
        setImages([]);
        if (tracks) tracks.stop();
        dispatch({ type: GLOBALTYPES.VENTE, payload: false });
    };
    useEffect(() => {
        if (vente.onEdit) {
            setPostData({
                ...vente,
                postData: {
                    ...vente.postData,
                },
            });
        }
    }, [vente]);
    /*
    useEffect(() => {
        if (vente.onEdit) {
            setPostData({
                category: vente.category || "",
                setCategory: vente.setCategory || "",
                description: vente.description || "",
                price: vente.price || "",
                unidaddeprecio: vente.unidaddeprecio || "",
                oferta: vente.oferta || "",
                change: vente.change || "",
                wilaya: vente.wilaya || "",
                commune: vente.commune || "",
                quartier: vente.quartier || "",
                email: vente.email || "",
                telefono: vente.telefono || "",
                contadordevisitas: vente.contadordevisitas || "",
                informacion: vente.informacion || "",
                comentarios: vente.comentarios || "",
            })

            setImages(vente.images || []);
            setpostData({
                superficie: vente.superficie || "",
                piece: vente.piece || "",
                etage: vente.etage || "",

                promoteurimmobilier: vente.promoteurimmobilier || "",
                parlepromoteurimmobilier: vente.parlepromoteurimmobilier || "",

                conditiondepeyement: vente.conditiondepeyement || "",
                specifications: vente.specifications || "",
                papiers: vente.papiers || "",

            });
        }
    }, [vente]);

    /*
    
        useEffect(() => {
            if (vente.onEdit) {
    
                setPostData({
                    category: vente.vategory || "",
                    subCategory: vente.subCategory || "",
                    superficie: vente.superficie || "",
                    piece: vente.piece || "",
                    etage: vente.etage || "",
    
                    promoteurimmobilier: vente.promoteurimmobilier || "",
                    parlepromoteurimmobilier: vente.parlepromoteurimmobilier || "",
    
                    duraciondelanuncio: vente.duraciondelanuncio || "",
                    conditiondepeyement: vente.conditiondepeyement || "",
                    specifications: vente.specifications || "",
    
                    description: vente.description || "",
                    price: vente.price || "",
                    unidaddeprecio: vente.unidaddeprecio || "",
                    oferta: vente.oferta || "",
                    change: vente.change || "",
                    wilaya: vente.wilaya || "",
                    commune: vente.commune || "",
                    quartier: vente.quartier || "",
                    email: vente.email || "",
                    telefono: vente.telefono || "",
                    contadordevisitas: vente.contadordevisitas || "",
                    informacion: vente.informacion || "",
                    comentarios: vente.comentarios || "",
    
                    papiers: vente.papiers || "",
                });
                setImages(vente.images || []); // Asegurar imágenes
    
    
    
            }
        }, [vente]);
    */



        const handleChangeInput = (e, customValue = null) => {
            const { name, value, type, checked } = e.target || {};
            const updatedValue = customValue !== null ? customValue : (type === 'checkbox' ? checked : value);
    
            if (name.startsWith("postData.")) {
                const attributeName = name.split(".")[1];
                setPostData({
                    ...postData,
                    postData: {
                        ...postData.postData,
                        [attributeName]: updatedValue,
                    },
                });
            } else {
                setPostData({ ...postData, [name]: updatedValue });
            }
        };
    return (
        <div className='status_modal' >
            <form onSubmit={handleSubmit}>
                <div className="status_header">
                    <h5 className="m-0">Annonces Vente Immobilière</h5>
                    <span onClick={() => dispatch({
                        type: GLOBALTYPES.VENTE, payload: false
                    })}>
                        &times;
                    </span>
                </div>

                <div className="status_body">

                    <div className="form-group">
                        <label className="text-primary">Category:</label>
                        <input
                            className='form-control'
                            type="text"
                            name="category"
                            value={postData.category}
                            onChange={handleChangeInput}
                            placeholder="Category"
                        // readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-primary">Sub Category:</label>
                        <input
                            className='form-control'
                            type="text"
                            name="subCategory"
                            value={postData.subCategory}
                            onChange={handleChangeInput}
                            placeholder="sub Category"
                        // readOnly
                        />
                    </div>

                    <div className="form-group">

                        <select
                            onChange={handleChangeInput}
                            value={postData.attributes.subCategory}
                            name="subCategory"
                            className="form-control"
                            required
                        >
                            <option value="">Sélectionner une sub catégorie</option>
                            <option value="Appartement">Appartement</option>
                            <option value="Terrain">Terrain</option>
                            <option value="Villa">Villa</option>
                            <option value="Local">Local</option>
                            <option value="Carcasse">Carcasse</option>
                            <option value="Niveau de villa">Niveau de Villa</option>
                            <option value="Terrain Agricole">Terrain Agricole</option>
                            <option value="Immeuble">Immeuble</option>
                            <option value="Duplex">Duplex</option>
                            <option value="Studio">Studio</option>
                            <option value="Hangar">Hangar</option>
                            <option value="Bungalow">Bungalow</option>
                            <option value="Usine">Usine</option>
                            <option value="Autre">Autre</option>

                        </select>
                        <small className='text-danger'>Ce champ est requis</small>
                    </div>

                    {postData.subCategory === "Appartement" && (

                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>
                            <div className="form-group"  >
                                <input
                                    type="number"
                                    name="etage"
                                    value={postData.attributes.etage}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Etage(s)"
                                />
                            </div>
                            <div className="form-group">
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="piece"
                                        value={postData.piece}
                                        onChange={handleChangeInput}
                                        className="form-control"
                                        placeholder="Pièces"
                                    />
                                </div>
                            </div>
                            <div className="form-group" >
                                <div className="form-group" >
                                    <FormCheck
                                        type="checkbox"
                                        name="promoteurimmobilier"
                                        checked={postData.attributes.promoteurimmobilier}
                                        onChange={handleChangeInput}
                                        label="Promotion immobilière"
                                    />
                                </div>

                                <div className="form-group"  >
                                    <FormCheck
                                        type="checkbox"
                                        name="parlepromoteurimmobilier"
                                        checked={postData.attributes.parlepromoteurimmobilier}
                                        onChange={handleChangeInput}
                                        label="Parle du promoteur immobilier"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}




                    {postData.subCategory === "Terrain" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>

                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>


                        </div>
                    )}


                    {postData.subCategory === "Villa" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>
                            <div className="form-group"  >
                                <input
                                    type="number"
                                    name="etage"
                                    value={postData.attributes.etage}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Etage(s)"
                                />
                            </div>
                            <div className="form-group">
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="piece"
                                        value={postData.piece}
                                        onChange={handleChangeInput}
                                        className="form-control"
                                        placeholder="Pièces"
                                    />
                                </div>
                            </div>
                            <div className="form-group" >
                                <div className="form-group" >
                                    <FormCheck
                                        type="checkbox"
                                        name="promoteurimmobilier"
                                        checked={postData.attributes.promoteurimmobilier}
                                        onChange={handleChangeInput}
                                        label="Promotion immobilière"
                                    />
                                </div>

                                <div className="form-group"  >
                                    <FormCheck
                                        type="checkbox"
                                        name="parlepromoteurimmobilier"
                                        checked={postData.attributes.parlepromoteurimmobilier}
                                        onChange={handleChangeInput}
                                        label="Parle du promoteur immobilier"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}



                    {postData.subCategory === "Local" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>
                            <div className="form-group"  >
                                <input
                                    type="number"
                                    name="etage"
                                    value={postData.attributes.etage}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Etage(s)"
                                />
                            </div>
                            <div className="form-group">
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="piece"
                                        value={postData.piece}
                                        onChange={handleChangeInput}
                                        className="form-control"
                                        placeholder="Pièces"
                                    />
                                </div>
                            </div>
                            <div className="form-group" >
                                <div className="form-group" >
                                    <FormCheck
                                        type="checkbox"
                                        name="promoteurimmobilier"
                                        checked={postData.attributes.promoteurimmobilier}
                                        onChange={handleChangeInput}
                                        label="Promotion immobilière"
                                    />
                                </div>

                                <div className="form-group"  >
                                    <FormCheck
                                        type="checkbox"
                                        name="parlepromoteurimmobilier"
                                        checked={postData.attributes.parlepromoteurimmobilier}
                                        onChange={handleChangeInput}
                                        label="Parle du promoteur immobilier"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}


                    {postData.subCategory === "Carcasse" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>
                            <div className="form-group"  >
                                <input
                                    type="number"
                                    name="etage"
                                    value={postData.attributes.etage}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Etage(s)"
                                />
                            </div>


                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}


                    {postData.subCategory === "Niveau de villa" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>
                            <div className="form-group"  >
                                <input
                                    type="number"
                                    name="etage"
                                    value={postData.attributes.etage}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Etage(s)"
                                />
                            </div>
                            <div className="form-group">
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="piece"
                                        value={postData.piece}
                                        onChange={handleChangeInput}
                                        className="form-control"
                                        placeholder="Pièces"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}


                    {postData.subCategory === "Terrain Agricole" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>

                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {postData.subCategory === "Immeuble" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>
                            <div className="form-group"  >
                                <input
                                    type="number"
                                    name="etage"
                                    value={postData.attributes.etage}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Etage(s)"
                                />
                            </div>



                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}


                    {postData.subCategory === "Duplex" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>

                            <div className="form-group">
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="piece"
                                        value={postData.piece}
                                        onChange={handleChangeInput}
                                        className="form-control"
                                        placeholder="Pièces"
                                    />
                                </div>
                            </div>
                            <div className="form-group" >
                                <div className="form-group" >
                                    <FormCheck
                                        type="checkbox"
                                        name="promoteurimmobilier"
                                        checked={postData.attributes.promoteurimmobilier}
                                        onChange={handleChangeInput}
                                        label="Promotion immobilière"
                                    />
                                </div>

                                <div className="form-group"  >
                                    <FormCheck
                                        type="checkbox"
                                        name="parlepromoteurimmobilier"
                                        checked={postData.attributes.parlepromoteurimmobilier}
                                        onChange={handleChangeInput}
                                        label="Parle du promoteur immobilier"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {postData.subCategory === "Studio" && (
                        <div>
                            <div className='form-group'>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="superficie"
                                        value={postData.attributes.superficie}
                                        onChange={handleChangeInput}
                                        className="form-control"
                                        placeholder="Superficie en M²"
                                    />
                                </div>
                                <div className="form-group"  >
                                    <input
                                        type="number"
                                        name="etage"
                                        value={postData.attributes.etage}
                                        onChange={handleChangeInput}
                                        className="form-control"
                                        placeholder="Etage(s)"
                                    />
                                </div>

                                <div className="form-group" >
                                    <div className="form-group" >
                                        <FormCheck
                                            type="checkbox"
                                            name="promoteurimmobilier"
                                            checked={postData.attributes.promoteurimmobilier}
                                            onChange={handleChangeInput}
                                            label="Promotion immobilière"
                                        />
                                    </div>

                                    <div className="form-group"  >
                                        <FormCheck
                                            type="checkbox"
                                            name="parlepromoteurimmobilier"
                                            checked={postData.attributes.parlepromoteurimmobilier}
                                            onChange={handleChangeInput}
                                            label="Parle du promoteur immobilier"
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}


                    {postData.subCategory === "Hangar" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>
                            <div className="form-group"  >
                                <input
                                    type="number"
                                    name="etage"
                                    value={postData.attributes.etage}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Etage(s)"
                                />
                            </div>


                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}


                    {postData.subCategory === "Bungalow" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>


                            <div className="form-group">
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="piece"
                                        value={postData.piece}
                                        onChange={handleChangeInput}
                                        className="form-control"
                                        placeholder="Pièces"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {postData.subCategory === "Usine" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>

                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {postData.subCategory === "Autre" && (
                        <div className='form-group'>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="superficie"
                                    value={postData.attributes.superficie}
                                    onChange={handleChangeInput}
                                    className="form-control"
                                    placeholder="Superficie en M²"
                                />
                            </div>


                            <div className="form-group">
                                <label className="text-primary">Spécifications</label>
                                <div className="form-group">
                                    <Select
                                        placeholder="Conditions de paiement"
                                        value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
                                        options={conditiondepeyement}
                                        onChange={handleChangeSelectconditiondepeyement}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="Spécifications"
                                        value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
                                        options={specifications}
                                        onChange={handleChangeSpecifications}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        placeholder="paiers"
                                        value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
                                        options={papiers}
                                        onChange={handleChangeSelectpapiers}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-group">

                        <textarea name="description" value={postData.description}
                            onChange={handleChangeInput}
                            placeholder='Description...'
                        />
                    </div>
                    <div className="card-body form-group">
                        <label className="text-primary">Prix  </label>
                        <div style={{ padding: '0 20px' }}>
                            <Slider
                                min={500}
                                max={2000000}
                                step={500}
                                value={postData.price || 0} // Si no hay precio, el slider empieza en 0
                                onChange={(value) => handleChangeInput('price', value)} // Usamos customValue
                                trackStyle={{ backgroundColor: '#44EB00', height: 10 }}
                                handleStyle={{
                                    borderColor: '#00AF72',
                                    height: 20,
                                    width: 20,
                                    marginLeft: -10,
                                    marginTop: -5,
                                    backgroundColor: '#007bff',
                                }}
                                railStyle={{ backgroundColor: '#ccc', height: 10 }}
                            />
                        </div>
                        <div style={{ marginTop: 10 }}>
                            {postData.price}
                        </div>
                    </div>

                    <div className="form-group">

                        <select
                            multiple={false}
                            name="unidaddeprecio"
                            value={postData.unidaddeprecio}
                            onChange={handleChangeInput}
                            className="form-control"
                        >
                            <option  >Unité de prix</option>
                            <option value="DA">DA</option>
                            <option value="Millions">Millions</option>
                            <option value="Milliard">Milliard</option>
                            <option value="DA (m²)">DA (m²)</option>
                            <option value="Millions (m²) ">Millions (m²)</option>

                        </select>
                    </div>

                    <div className="form-group">

                        <select
                            multiple={false}
                            name="oferta"
                            value={postData.oferta}
                            onChange={handleChangeInput}
                            className="form-control"
                        >
                            <option >Type D'offre</option>
                            <option value="Fixe">Fixe</option>
                            <option value="Négociable">Négociable</option>
                            <option value="Offert">Offert</option>

                        </select>
                    </div>

                    <div className="form-group">

                        <select
                            multiple={false}
                            name="change"
                            value={postData.change}
                            onChange={handleChangeInput}
                            className="form-control"
                        >
                            <option  >Changee</option>

                            <option value="J'accepte l'échange">J'accepte l'échange</option>
                            <option value="Pas d'échanges">Pas d'échanges </option>

                        </select>
                    </div>


                    <div className="form-group">
                        <small className='text-primary'>Adresse du bien obligatoire</small>
                        <select
                            multiple={false}
                            className="form-control"
                            name="wilaya"
                            value={selectedWilaya}
                            onChange={handleWilayaChange}

                        >
                            <option value="">Sélectionnez une wilaya</option>
                            {wilayasOptions}
                        </select>
                        <small className='text-danger'>Ce champ est requis</small>
                    </div>


                    <div className="form-group">

                        <select
                            multiple={false}
                            className="form-control"
                            name="commune"
                            value={selectedCommune}
                            onChange={handleCommuneChange}

                        >
                            <option value="">Sélectionnez la commune</option>
                            {communesOptions}
                        </select>
                        <small className='text-danger'>Ce champ est requis</small>
                    </div>


                    <div className="form-group">

                        <input onChange={handleChangeInput} value={postData.quartier} name="quartier" type="text" className="form-control" placeholder='Quartier' />

                    </div>

                    <div className="form-group">

                        <input onChange={handleChangeInput} value={postData.telefono} name="telefono" type="number" className="form-control" placeholder='Téléphone' />

                    </div>


                    <div className="form-group">

                        <input onChange={handleChangeInput} value={postData.email} name="email" type="email" className="form-control" placeholder='Adresse mail ' />

                    </div>



                    <div>
                        <label className="text-primary">Options Générales</label>
                        <div className="form-group">
                            <FormCheck
                                type="checkbox"
                                checked={postData.contadordevisitas}
                                onChange={(e) => setPostData({ ...postData, contadordevisitas: e.target.checked })}
                                label="Afficher lo compteur des visites"
                            />
                        </div>
                        <div className="form-group">
                            <FormCheck
                                type="checkbox"
                                checked={postData.informacion}
                                onChange={(e) => setPostData({ ...postData, informacion: e.target.checked })}
                                label="Autoriser les informations de contact"
                            />
                        </div>

                        <div className="form-group">
                            <FormCheck
                                type="checkbox"
                                checked={postData.comentarios}
                                onChange={(e) => setPostData({ ...postData, comentarios: e.target.checked })}
                                label="Activer les commentaires"
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-primary">Durée de l' annonces</label>
                            <select
                                multiple={false}
                                onChange={handleChangeInput} value={postData.duraciondelanuncio} name="duraciondelanuncio" className="form-control" >

                                <option value="nepasdesactiver">Ne pas désactiver</option>
                                <option value="15 jour">15 Jours</option>
                                <option value="1 mois">1 Mois</option>
                                <option value="3 mois">3 Mois</option>
                                <option value="6 mois">6 Mois</option>

                            </select>
                        </div>


                    </div>


                    <div className="show_images">
                        {
                            images.map((img, index) => (
                                <div key={index} id="file_img">
                                    {
                                        img.camera ? imageShow(img.camera, theme)
                                            : img.url
                                                ? <>
                                                    {
                                                        img.url.match(/video/i)
                                                            ? videoShow(img.url, theme)
                                                            : imageShow(img.url, theme)
                                                    }
                                                </>
                                                : <>
                                                    {
                                                        img.type.match(/video/i)
                                                            ? videoShow(URL.createObjectURL(img), theme)
                                                            : imageShow(URL.createObjectURL(img), theme)
                                                    }
                                                </>
                                    }
                                    <span onClick={() => deleteImages(index)}>&times;</span>
                                </div>
                            ))
                        }
                    </div>

                    {
                        stream &&
                        <div className="stream position-relative">
                            <video autoPlay muted ref={videoRef} width="100%" height="100%"
                                style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />

                            <span onClick={handleStopStream}>&times;</span>
                            <canvas ref={refCanvas} style={{ display: 'none' }} />
                        </div>
                    }

                    <div className="input_images">
                        {
                            stream
                                ? <i className="fas fa-camera" onClick={handleCapture} />
                                : <>
                                    <i className="fas fa-camera" onClick={handleStream} />

                                    <div className="file_upload">
                                        <i className="fas fa-image" />
                                        <input type="file" name="file" id="file"
                                            multiple accept="image/*,video/*" onChange={handleChangeImages} />
                                    </div>
                                </>
                        }

                    </div>



                    <div className="status_footer">
                        <button className="btn btn-secondary w-100" type="submit">
                            Post
                        </button>
                    </div>
                </div>
            </form >
        </div >
    )
}

export default Vente
