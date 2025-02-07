import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
 
 
import CardFooter from './home/post_card/CardFooter';


import Description from './home/post_card/Description';
import CardHeaderaprove from './home/post_card/CardHeaderaprove';

import Comments from "./home/Comments";
import InputComment from "./home/InputComment";
import StatusModalDenuncia from "./home/post_card/StatusModalDenuncia";

 
import Informaciondecontacto from "./home/post_card/Informaciondecontacto";
import CardPost from "./home/post_card/CardPost";


const PostCard = ({ post, theme }) => {
  const location = useLocation();
  const isPostDetailPage = location.pathname.startsWith(`/post/${post._id}`);
  const isHomePage = location.pathname === '/'
  const postPendientes = location.pathname.startsWith('/administracion/postspendientes');

  const [showComments, setShowComments] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (isPostDetailPage) {
      setShowComments(post.comentarios === true);
      setShowInfo(post.informacion === true);
    }
  }, [isPostDetailPage, post.comentarios, post.informacion]);




  return (
    <div  >
    
   
      <CardPost post={post} theme={theme} />

      {isPostDetailPage && <Description post={post} />}


    
   

      {isPostDetailPage && <Informaciondecontacto post={post} />}
      {isPostDetailPage && <CardFooter post={post} />} 
        {isPostDetailPage && <InputComment post={post} />}
  {isPostDetailPage && <Comments post={post} />}
    </div>
  );
};

export default PostCard;
