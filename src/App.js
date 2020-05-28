import React, { Suspense, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';

import ErrorBoundary from './components/atoms/error-boundary/ErrorBoundary';
import Spinner from './components/atoms/spinner/Spinner';
import Home from './pages/home/containers/Home';
import Posts from './pages/posts/containers/posts';
import MainNavigation from './components/molecules/Navigation/Navigation';
import Post from './pages/posts/containers/Post';
import UserDetails from './pages/users/UserDetails';

import { getUsers } from './redux/users/user-actions';
import { getAllUsersSelector } from './redux/users/user-selectors';
//mport NotFound from './pages/not-found/NotFound';

function App() {
  const dispatch = useDispatch();
  const users = useSelector((state) => getAllUsersSelector(state));

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const routes = (
    <Switch>
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/users/:id">
            <UserDetails />
          </Route>
          <Route exact path="/posts">
            <Posts />
          </Route>
          <Route exact path="/posts/:id">
            <Post />
          </Route>
          {/* <Route exact path="/not-found">
            <NotFound />
          </Route> */}
          <Route
            exact
            path="/"
            render={() => users && <Redirect to="/posts" />}
          />
          {/* <Redirect to="/not-found" /> */}
        </Suspense>
      </ErrorBoundary>
    </Switch>
  );

  return (
    <div>
      <MainNavigation />
      <main>{routes}</main>
    </div>
  );
}

export default App;
