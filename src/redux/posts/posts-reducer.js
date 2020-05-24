const INITIAL_STATE = {
  isLoading: true,
  posts: [],
  currentUser: null,
  error: null,
  post: null,
};

const postsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOAD_POSTS': {
      return {
        ...state,
        isLoading: true,
      };
    }

    case 'POSTS_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        posts: action.posts,
      };
    }

    case 'POSTS_FAILURE': {
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    }
    case 'LOAD_POST': {
      return {
        ...state,
        isLoading: true,
      };
    }

    case 'POST_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        post: action.post,
      };
    }

    case 'POST_FAILURE': {
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    }
    default:
      return state;
  }
};

export default postsReducer;
