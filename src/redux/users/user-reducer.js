const INITIAL_STATE = {
  isLoading: false,
  users: null,
  currentUser: null,
  error: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOAD_USERS': {
      return {
        ...state,
        isLoading: true,
      };
    }

    case 'USERS_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        users: action.users,
      };
    }

    case 'USER_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        currentUser: action.user,
      };
    }

    case 'USERS_Failure': {
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

export default userReducer;
