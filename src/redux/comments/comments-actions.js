export function getComments(postId) {
  return {
    type: 'LOAD_COMMENTS',
    postId,
  };
}

export function commentsFailure() {
  return {
    type: 'COMMENTS_FAILURE',
  };
}

export function commentsSuccess(comments) {
  return {
    type: 'COMMENTS_SUCCESS',
    comments,
  };
}

export function setError(error) {
  return {
    type: 'SET_ERROR_COMMENTS',
  };
}

export function cancelComments() {
  return {
    type: 'CANCEL_COMMENTS',
  };
}
