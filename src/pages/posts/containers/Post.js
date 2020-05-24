import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import './Post.css';

import ErrorModal from '../../../components/error-modal/ErrorModal';
import Spinner from '../../../components/spinner/Spinner';
import Card from '../../../components/card/Card';
import CommentsList from '../components/CommentsList';

import { getPost } from '../../../redux/posts/posts-actions';
import { getComments } from '../../../redux/comments/comments-actions';

import { useParams } from 'react-router-dom';
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
import Button from '../../../components/form-elements/button/Button';

const Post = ({
  post,
  getPost,
  error,
  isLoading,
  author,
  getComments,
  comments,
  commentsLoading,
}) => {
  const postId = useParams().id;

  useEffect(() => {
    getPost(postId);
  }, [getPost, postId]);

  const loadComments = () => {
    getComments(postId);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={true} />
      {isLoading && !post && (
        <div className="center">
          <Spinner />
        </div>
      )}
      {post && (
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
                  <span>
                    <strong>Author:&nbsp;</strong>
                  </span>{' '}
                  <h3>{author && author}</h3>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      <div className="comments comments-display">
        <Button onClick={loadComments} disabled={isLoading || commentsLoading}>
          Load Comments
        </Button>
      </div>
      {comments && <CommentsList items={comments} />}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPost: (id) => dispatch(getPost(id)),
    getComments: (id) => dispatch(getComments(id)),
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
