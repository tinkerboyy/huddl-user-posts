import React, { Suspense, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import './App.css';

import ErrorBoundary from './components/atoms/error-boundary/ErrorBoundary';
import Spinner from './components/atoms/spinner/Spinner';
import Home from './pages/home/containers/Home';
import Posts from './pages/posts/containers/posts';
import MainNavigation from './components/molecules/Navigation/Navigation';
import Post from './pages/posts/containers/Post';
import UserDetails from './pages/users/UserDetails';

import { getUsers } from './redux/users/user-actions';
import NotFound from './pages/not-found/NotFound';

function App({ getUsers, users }) {
  useEffect(() => {
    getUsers();
  }, [getUsers]);

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
          {/* <Route path="/not-found">
            <NotFound />
          </Route> */}
          <Route
            exact
            path="/"
            render={() => users && <Redirect to="/posts" />}
          />
          {/* <Route exact path="*" render={() => <Redirect to="/not-found" />} /> */}
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

const mapStateToProps = ({ users }) => {
  return {
    users,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUsers: () => dispatch(getUsers()),
});

const enhancer = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhancer(App);
