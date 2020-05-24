const INITIAL_STATE = {
  isLoading: false,
  comments: null,
  error: null,
};

const commentsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOAD_COMMENTS': {
      return {
        ...state,
        isLoading: true,
      };
    }

    case 'COMMENTS_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        comments: action.comments,
      };
    }

    case 'COMMENTS_FAILURE': {
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

export default commentsReducer;
