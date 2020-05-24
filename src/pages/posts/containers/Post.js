import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import './Post.css';

import ErrorModal from '../../../components/organisms/error-modal/ErrorModal';
import Spinner from '../../../components/atoms/spinner/Spinner';
import Card from '../../../components/atoms/card/Card';
import CommentsList from '../components/CommentsList';

import { getPost, setError } from '../../../redux/posts/posts-actions';
import { getComments } from '../../../redux/comments/comments-actions';

import {
  getPostSelector,
  postsLoading,
  postsErrorSelector,
  getPostAuthorSelector,
} from '../../../redux/posts/posts-selectors';
import {
  getAllComments,
  commentsLoading,
} from '../../../redux/comments/comments.selectors';
import Button from '../../../components/atoms/form-elements/button/Button';

const Post = ({
  post,
  getPost,
  error,
  isLoading,
  author,
  getComments,
  comments,
  commentsLoading,
  setError,
}) => {
  const history = useHistory();
  const postId = useParams().id;
  const [triggerComments, setTriggerComments] = useState(false);

  useEffect(() => {
    getPost(postId);
  }, [getPost, postId]);

  const loadComments = () => {
    getComments(postId);
    setTriggerComments(true);
  };

  const clearError = () => {
    setError();
    history.push('/home');
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spinner>Loading Post</Spinner>
        </div>
      )}
      {post && !isLoading && (
        <div className="post">
          <div className="post-info">
            <Card className="post-content">
              <div className="post-content-wr">
                <div className="post-content__info">
                  <h2>{post.title}</h2>
                </div>
              </div>
              <div className="post-content-wr">
                <div className="post-content__info">
                  <span>Author:&nbsp;</span> <h3>{author && author}</h3>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      <div className="center comments-display">
        {!commentsLoading && !isLoading && !triggerComments && (
          <Button onClick={loadComments}>Load Comments</Button>
        )}
        {commentsLoading && <Spinner> Loading Comments</Spinner>}
      </div>

      {comments && triggerComments && !commentsLoading && (
        <CommentsList items={comments} />
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPost: (id) => dispatch(getPost(id)),
    getComments: (id) => dispatch(getComments(id)),
    setError: () => dispatch(setError()),
  };
};

const mapStateToProps = (state) => {
  return {
    post: getPostSelector(state),
    isLoading: postsLoading(state),
    error: postsErrorSelector(state),
    author: getPostAuthorSelector(state),
    comments: getAllComments(state),
    commentsLoading: commentsLoading(state),
  };
};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(Post);
