import { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

 
import PageRender from './customRouter/PageRender';
import PrivateRouter from './customRouter/PrivateRouter';
 

 
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'

import Alert from './components/alert/Alert'
import Header from './components/header/Header'
 

import { useSelector, useDispatch } from 'react-redux'
import { refreshToken } from './redux/actions/authAction'
 
import { getSuggestions } from './redux/actions/suggestionsAction'

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

import { getNotifies } from './redux/actions/notifyAction'
import statusCategoriesFormsImmobilier from './components/statusCategories/statusCategoriesImmobilier'
import Annonces from './pages/annonces'
 
import { getPosts } from './redux/actions/postAction';
import Postspendientes from './pages/administracion/postspendientes';
import { getPostsPendientesss } from './redux/actions/postaproveAction';
   
function App() {
  const { auth, status, modal, statusimmobilier } = useSelector(state => state)
  const statusImmobilier = statusimmobilier
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close()
  }, [dispatch])

  useEffect(() => {
    if (auth.token) {
      dispatch(getPostsPendientesss(auth.token))
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])


  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") { }
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") { }
      });
    }
  }, [])




  return (
    <Router>
      <Alert />

      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
          {auth.token && <Header />}
        
          {auth.token && <SocketClient />}


          <Route exact path="/" component={auth.token ? Home : Login} />
          <Route exact path="/register" component={Register} />

          {Object.entries(statusImmobilier).map(([category, isActive]) => (
            isActive && statusCategoriesFormsImmobilier[category]
          ))}
            <Route exact path="/administracion/postspendientes" component={Postspendientes} />

          <Route exact path="/annonces" component={Annonces} />

          <PrivateRouter exact path="/:page" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />
        </div>
      </div>
    </Router>
  );
}

export default App;
