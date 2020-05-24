import React, { Suspense, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import MainNavigation from './components/Navigation/Navigation';
import Spinner from './components/spinner/Spinner';
import Home from './pages/home/containers/Home';
import Posts from './pages/posts/containers/posts';

import './App.css';
import { getUsers } from './redux/users/user-actions';
import Post from './pages/posts/containers/Post';
import UserDetails from './pages/users/UserDetails';

function App({ getUsers, users }) {
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div>
      <MainNavigation />
      <main>
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
              <Route
                exact
                path="/"
                render={() => users && <Redirect to="/posts" />}
              />
            </Suspense>
          </ErrorBoundary>
        </Switch>
      </main>
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
