import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { deletePost } from "../../../redux/actions/postAction";
import Avatar from "../../Avatar";
import moment from "moment";

const CardHeader = ({ post }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleEditPost = () => {

    if (post.subCategory === 'vente') {
      dispatch({ type: GLOBALTYPES.VENTE, payload: { ...post, onEdit: true } });

    }

    if (post.subCategory === 'location') {
      dispatch({ type: GLOBALTYPES.LOCATION, payload: { ...post, onEdit: true } });

    }
  };



  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost({ post, auth, socket }));
      return history.push("/");
    }
  };

  const handleCopyLink = () => {

  };

  return (
    <div className="post-card-header">
      <div>
        <small className="text-muted">{moment(post.createdAt).fromNow()}</small>

      </div>

      <div className="nav-item dropdown">
        <span className="material-icons" id="moreLink" data-toggle="dropdown">
          more_horiz
        </span>

        <div className="dropdown-menu">
          {auth.user._id === post.user._id && (
            <>
              <div className="dropdown-item" onClick={handleEditPost}>
                <span className="material-icons">create</span> Edit Post
              </div>
              <div className="dropdown-item" onClick={handleDeletePost}>
                <span className="material-icons">delete_outline</span> Remove Post
              </div>
            </>
          )}

          <div className="dropdown-item" onClick={handleCopyLink}>
            <span className="material-icons">content_copy</span> Copy Link
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
