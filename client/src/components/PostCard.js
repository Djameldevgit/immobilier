import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CardHeader from './home/post_card/CardHeader';
import CardBody from './home/post_card/CardBody';
 import CardFooter from './home/post_card/CardFooter';  
 
 
import Description from './home/post_card/Description';
import CardHeaderaprove from './home/post_card/CardHeaderaprove';
import Informaciondecontacto from "./home/post_card/Informaciondecontacto";
import Comments from "./home/Comments";
import InputComment from "./home/InputComment";
 import StatusModalDenuncia from "./home/post_card/StatusModalDenuncia"; 
 
import DescriptionHeader from "./home/post_card/DescriptionHeader";
      //  {showComments && <CardFooter post={post} />}
   

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

  

  const renderInformacionContacto = () => {
    if (!showInfo) return null;
    return <Informaciondecontacto post={post} />;
  };

  return (
    <div  >
       <CardHeader post={post} />
   <DescriptionHeader post={post}  />
    <CardBody post={post}  theme={theme} /> 
    <CardFooter post={post} isPostDetailPage={isPostDetailPage} />
    
      {isPostDetailPage && <Description post={post}   />}
      {showInfo && renderInformacionContacto()}
    
       {isPostDetailPage && <Comments post={post} />}
      {isPostDetailPage && <InputComment post={post} />}
 
       {showComments && <CardFooter post={post} />}
   
    </div>
  );
};

export default PostCard;
