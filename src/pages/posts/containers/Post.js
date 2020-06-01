import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import './Post.css';

import ErrorModal from '../../../components/organisms/error-modal/ErrorModal';
import Spinner from '../../../components/atoms/spinner/Spinner';
import Card from '../../../components/atoms/card/Card';
import CommentsList from '../components/CommentsList';
import Button from '../../../components/atoms/form-elements/button/Button';

import { getPost, setError } from '../../../redux/posts/posts-actions';
import {
  getComments,
  cancelComments,
} from '../../../redux/comments/comments-actions';

import {
  getPostSelector,
  postsLoading,
  postsErrorSelector,
  getPostAuthorSelector,
} from '../../../redux/posts/posts-selectors';
import {
  getAllComments,
  commentsLoadingSelector,
} from '../../../redux/comments/comments.selectors';

const Post = () => {
  const [triggerComments, setTriggerComments] = useState(false);
  const postId = useParams().id;
  const history = useHistory();
  const dispatch = useDispatch();

  const error = useSelector((state) => postsErrorSelector(state));
  const isLoading = useSelector((state) => postsLoading(state));
  const author = useSelector((state) => getPostAuthorSelector(state));
  const post = useSelector((state) => getPostSelector(state));
  const comments = useSelector((state) => getAllComments(state));
  const commentsLoading = useSelector((state) =>
    commentsLoadingSelector(state)
  );

  useEffect(() => {
    dispatch(getPost(postId));
  }, [postId, dispatch]);

  useEffect(() => {
    return () => dispatch(cancelComments());
  }, [dispatch]);

  const loadComments = () => {
    dispatch(getComments(postId));
    setTriggerComments(true);
  };

  const clearError = () => {
    dispatch(setError());
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

export default Post;
