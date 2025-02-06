
import Carousel from '../../Carousel'
import {Link} from 'react-router-dom'
const CardBody = ({ post }) => {

  return (
    <div className="cardbody">

      <div className='imagecarousel'>
        {
          post.images.length > 0 && <Carousel images={post.images} id={post._id} />
        }
      </div>
      <div className="btnpost">
        <Link to={`/post/${post._id}`} className="post-card__link">
          <button className="post-card__button">Voir détails</button>
        </Link>
      </div>
    </div>
  )
}

export default CardBody
