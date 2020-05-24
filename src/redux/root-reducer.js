import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './users/user-reducer';
import postsReducer from './posts/posts-reducer';
import commentsReducer from './comments/comments-reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'],
};

const rootReducer = combineReducers({
  users: userReducer,
  posts: postsReducer,
  comments: commentsReducer,
});

export default persistReducer(persistConfig, rootReducer);
