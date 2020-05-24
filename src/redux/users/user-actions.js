export function getUsers() {
  return {
    type: 'LOAD_USERS',
  };
}

export function usersFailure() {
  return {
    type: 'USERS_FAILURE',
  };
}

export function usersSuccess(users) {
  return {
    type: 'USERS_SUCCESS',
    users,
  };
}

export function userSuccess(user) {
  return {
    type: 'USER_SUCCESS',
    user,
  };
}

export function getUser(id) {
  console.log(id);

  return {
    type: 'LOAD_USER',
    id,
  };
}
