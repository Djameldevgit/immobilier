import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { createPost } from '../../../redux/actions/postAction';
   import { imageShow, videoShow } from '../../../utils/mediaShow';
 import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
 import { createPost,updatePost } from '../../../redux/actions/postAction';
const Location= () => {
    const { auth, theme, socket, statusimmobilier, } = useSelector((state) => state);
    
   
    const dispatch = useDispatch()

    const initilastate = {
        content: '',
        category: 'immobilier',
        subCategory: 'location',
        attributes: {
            nombre: '',
            edad: '',
        }
    }
 

    const [postData, setPostData] = useState(initilastate)
    const [images, setImages] = useState([])

    const [stream, setStream] = useState(false)
    const videoRef = useRef()
    const refCanvas = useRef()
    const [tracks, setTracks] = useState('')

    const handleChangeImages = e => {
        const files = [...e.target.files]
        let err = ""
        let newImages = []

        files.forEach(file => {
            if (!file) return err = "File does not exist."

            if (file.size > 1024 * 1024 * 5) {
                return err = "The image/video largest is 5mb."
            }

            return newImages.push(file)
        })

        if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        setImages([...images, ...newImages])
    }

    const deleteImages = (index) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleStream = () => {
        setStream(true)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    videoRef.current.srcObject = mediaStream
                    videoRef.current.play()

                    const track = mediaStream.getTracks()
                    setTracks(track[0])
                }).catch(err => console.log(err))
        }
    }

    const handleCapture = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;

        refCanvas.current.setAttribute("width", width)
        refCanvas.current.setAttribute("height", height)

        const ctx = refCanvas.current.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0, width, height)
        let URL = refCanvas.current.toDataURL()
        setImages([...images, { camera: URL }])
    }

    const handleStopStream = () => {
        tracks.stop()
        setStream(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const { content, category, subCategory, attributes } = postData;
    
        if (!content || !category || !subCategory || !attributes.nombre || !attributes.edad) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: "Todos los campos son obligatorios." },
            });
        }
    
        if (images.length === 0) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: "Por favor agrega una foto o video." },
            });
        }
    
        if (statusimmobilier.location.onEdit) {
            dispatch(updatePost({ postData, images, auth, statusimmobilier:statusimmobilier.location }));
        } else {
            dispatch(createPost({ postData, images, auth, socket }));
        }
    
        // Resetear estado
        setPostData(initilastate);
        setImages([]);
        if (tracks) tracks.stop();
        dispatch({ type: GLOBALTYPES.LOCATION, payload: false });
    };
    

    useEffect(() => {
        if (statusimmobilier.location.onEdit) {
            setPostData({
                content: statusimmobilier.location.content || "",
                category: statusimmobilier.location.category || "",
                subCategory: statusimmobilier.location.subCategory || "",
                attributes: {
                    nombre: statusimmobilier.location.attributes?.nombre || "",
                    edad: statusimmobilier.location.attributes?.edad || "",
                },
            });
            setImages(statusimmobilier.location.images || []);
        }
    }, [statusimmobilier.location]);
    



    const handleChangeInput = (e) => {
        const { name, value } = e.target;
    
        if (name.startsWith("attributes.")) {
            const key = name.split(".")[1];
            setPostData((prev) => ({
                ...prev,
                attributes: {
                    ...prev.attributes,
                    [key]: value,
                },
            }));
        } else {
            setPostData((prev) => ({ ...prev, [name]: value }));
        }
    };
    

    /* const handleChangeInput = (e) => {
       const { name, value} = e.target;
         setPostData({ ...postData, [name]: value });
          };*/




    return (
        <div className="status_modal">
            <form onSubmit={handleSubmit}>
                <div className="status_header">
                    <h5 className="m-0">Create Post location</h5>
                    <span onClick={() => dispatch({
                        type: GLOBALTYPES.LOCATION, payload: false
                    })}>
                        &times;
                    </span>
                </div>

                <div className="status_body">
                    <div className='from-group'  >
                        <input name="content" className='form-control' value={postData.content}
                            placeholder='content'
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div className='from-group'>
                        <input name="category" value={postData.category}
                            className='form-control'
                            onChange={handleChangeInput}
                            placeholder='category'
                        />
                    </div>
                    <div className='from-group'>
                        <input name="subCategory" value={postData.subCategory}
                            className='form-control'
                            onChange={handleChangeInput}
                            placeholder='Sub category'
                        />
                    </div>
                    <div className='from-group'>
                        <input name="attributes.nombre" value={postData.attributes.nombre}
                            className='form-control'
                            onChange={handleChangeInput}
                            placeholder='nombre'
                        />
                    </div>
                    <div className='from-group'>
                        <input name="attributes.edad" value={postData.attributes.edad}
                            className='form-control'
                            onChange={handleChangeInput}
                            placeholder='edad'
                        />
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

                </div>

                <div className="status_footer">
                    <button className="btn btn-secondary w-100" type="submit">
                        Post
                    </button>
                </div>

            </form>
        </div>
    )
}

export default Location
