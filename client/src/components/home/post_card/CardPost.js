import Carousel from '../../Carousel'
import { Link, useHistory,useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import { deletePost } from '../../../redux/actions/postAction'
import { BASE_URL } from '../../../utils/config'


const CardPost = ({ post }) => {
  const { auth, socket } = useSelector(state => state)
  const dispatch = useDispatch()

  const history = useHistory()

  const handleEditPost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } })
  }

  const handleDeletePost = () => {
    if (window.confirm("Are you sure want to delete this post?")) {
      dispatch(deletePost({ post, auth, socket }))
      return history.push("/")
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)
  }

  const location = useLocation(); // Detecta la URL actual

  return (
    <div className='cardpost'>
      <div className="cardheader">

        <div className="cardheader-descripction">
          <div className='category'>{post.category}</div>
          <div className='subcategory'>{post.subCategory}</div>
          <div className='title'>title{post.title}</div>

          <div className="nav-item dropdown">
            <div className="nav-item dropdown">
              <span className="material-icons" id="moreLink" data-toggle="dropdown">
                more_horiz
              </span>
            </div>

            <div className="post-menu">
              {
                auth.user._id === post.user._id &&
                <>
                  <div className="dropdown-item" onClick={handleEditPost}>
                    <span className="material-icons">create</span> Edit Post
                  </div>
                  <div className="dropdown-item" onClick={handleDeletePost} >
                    <span className="material-icons">delete_outline</span> Remove Post
                  </div>
                </>
              }
              <div className="dropdown-item" onClick={handleCopyLink}>
                <span className="material-icons">content_copy</span> Copy Link
              </div>
            </div>
          </div>

        </div>



      </div>
      <div className="card-moment">
        <small >
          {moment(post.createdAt).fromNow()}
        </small>
      </div>


      <div className="cardbody">
        <div className='imagecarousel'>
          {
            post.images.length > 0 && <Carousel images={post.images} id={post._id} />
          }
        </div>
      </div>
      {location.pathname === "/" && (
        <div className="btnpost">
          <Link to={`/post/${post._id}`} className="post-card__link">
            <button className="post-card__button">Voir détails</button>
          </Link>
        </div>
      )}
    </div>

  )
}
export default CardPost
