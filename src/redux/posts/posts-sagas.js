import { takeLatest, put, all, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  postsFailure,
  postsSuccess,
  postFailure,
  postSuccess,
} from './posts-actions';

function* handleGetPosts() {
  try {
    const { data } = yield call(
      axios.get,
      'https://jsonplaceholder.typicode.com/posts'
    );
    yield put(postsSuccess(data));
  } catch (e) {
    yield put(postsFailure());
  }
}

function* handleGetPost({ id }) {
  try {
    const { data } = yield call(
      axios.get,
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    yield put(postSuccess(data));
  } catch (e) {
    yield put(postFailure());
  }
}

export function* onGetPosts() {
  yield takeLatest('LOAD_POSTS', handleGetPosts);
}

export function* onGetPost() {
  yield takeLatest('LOAD_POST', handleGetPost);
}

export function* postsSagas() {
  yield all([call(onGetPosts), call(onGetPost)]);
}
