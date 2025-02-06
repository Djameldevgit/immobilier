import React from 'react';
import Carousel from '../../Carousel';
import { Link } from 'react-router-dom';

const CardBody = ({ post }) => {
  return (
    <div className="post-card">
      {/* Encabezado de la tarjeta */}
      <div className="post-card-header">
        <div className="post-card-category">
          {post.category}
        </div>
        <div className="post-card-subcategory">
          {post.subCategory}
        </div>
       
      </div>

      {/* Carrusel de imágenes */}
      <div className="post-card-carousel">
        {post.images.length > 0 && <Carousel images={post.images} id={post._id} />}
      </div>

      {/* Botón de acción */}
      <div className="post-card-actions">
        <Link to={`/post/${post._id}`} className="post-card__link">
          <button className="post-card__button">Voir détails</button>
        </Link>
      </div>
    </div>
  );
};
 
export default CardBody;
/*
<div>
        {post.images.length > 0 && <Carousel images={post.images} id={post._id} />}
      </div>*/