import { takeLatest, put, all, call } from 'redux-saga/effects';
import axios from 'axios';
import { usersSuccess, userSuccess, usersFailure } from './user-actions';

function* handleGetUsers() {
  try {
    const { data } = yield call(
      axios.get,
      'https://jsonplaceholder.typicode.com/users'
    );
    yield put(usersSuccess(data));
  } catch (e) {
    yield put(usersFailure());
  }
}

function* handleGetUser({ id }) {
  try {
    const { data } = yield call(
      axios.get,
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    yield put(userSuccess(data));
  } catch (e) {
    yield put(usersFailure());
  }
}

export function* onGetUsers() {
  yield takeLatest('LOAD_USERS', handleGetUsers);
}

export function* onGetUser() {
  yield takeLatest('LOAD_USER', handleGetUser);
}

export function* userSagas() {
  yield all([call(onGetUsers), call(onGetUser)]);
}
