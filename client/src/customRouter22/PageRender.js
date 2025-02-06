import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from '../components/NotFound'
import { useSelector } from 'react-redux'

const PageRender = () => {
    const { page, id } = useParams()
    const { auth } = useSelector(state => state)
    const [Component, setComponent] = useState(null)

    useEffect(() => {
        let pageName = page; // Usa solo el nombre de la página

        const loadComponent = async () => {
            try {
                const module = await import(`../pages/${pageName}`)
                setComponent(() => module.default) // Establece el componente cargado dinámicamente
            } catch (err) {
                setComponent(() => NotFound) // Muestra NotFound si falla
            }
        }

        if (auth.token) loadComponent()
    }, [page, auth.token])

    if (!auth.token) return <NotFound /> // Si no está autenticado, redirigir a NotFound
    if (!Component) return <h1>Cargando...</h1> // Mientras carga, mostrar un mensaje

    return <Component id={id} />
}

export default PageRender

