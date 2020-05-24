export function getPosts() {
  return {
    type: 'LOAD_POSTS',
  };
}

export function postsFailure() {
  return {
    type: 'POSTS_FAILURE',
  };
}

export function postsSuccess(posts) {
  return {
    type: 'POSTS_SUCCESS',
    posts,
  };
}

export function getPost(id) {
  return {
    type: 'LOAD_POST',
    id,
  };
}

export function postFailure() {
  return {
    type: 'POST_FAILURE',
  };
}

export function postSuccess(post) {
  return {
    type: 'POST_SUCCESS',
    post,
  };
}
