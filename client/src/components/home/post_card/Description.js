import React from 'react';

const Description = ({ post }) => {

  return (
    <div className="description">

      <div className="body1">
        {post.attributes && Object.keys(post.attributes).length > 0 ? (
          Object.entries(post.attributes).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))
        ) : (
          <li>No hay atributos disponibles</li>
        )}
      </div>


      <div className="body2">
        <div ><i className="fas fa-comment"></i> Commentairesvalue={post.comments.length || '0'}  </div>
        <div ><i className="fas fa-thumbs-up"></i> Likesvalue={post.likes.length || '0'} </div>
        <div ><i className="fas fa-map"></i> Communevalue={post.commune || 'Non spécifié'} </div>
        <div ><i className="fas fa-envelope"></i> Emailvalue={post.email || 'Non spécifié'} </div>
        <div ><i className="fas fa-user-circle"></i> Informacion del vendedorvalue={post.informacion || 'Non spécifié'} </div>
        <div ><i className="fas fa-comments"></i> Permitir comentariosvalue={post.comentarios || 'Non spécifié'} </div>
        <div ><i className="fas fa-eye"></i> Contador de visitasvalue={post.contadordevisitas || 'Non spécifié'} </div>
        <div ><i className="fas fa-clock"></i> Duracion del anunciovalue={post.duraciondelanuncio || 'Non spécifié'} </div>
      </div>


    </div>

  );
};

export default Description;
