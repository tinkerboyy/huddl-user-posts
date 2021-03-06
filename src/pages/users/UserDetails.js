import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './UserDetails.css';
import Card from '../../components/atoms/card/Card';
import {
  currentUserCompanySelector,
  currentUserSelector,
  usersLoadingSelector,
} from '../../redux/users/user-selectors';
import { getUser } from '../../redux/users/user-actions';
import Spinner from '../../components/atoms/spinner/Spinner';

const UserDetails = () => {
  const dispatch = useDispatch();
  const id = useParams().id;

  const isLoading = useSelector((state) => usersLoadingSelector(state));
  const user = useSelector((state) => currentUserSelector(state));
  const company = useSelector((state) => currentUserCompanySelector(state));

  useEffect(() => {
    dispatch(getUser(id));
  }, [id, dispatch]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <Spinner>Loading User</Spinner>
        </div>
      )}
      {!isLoading && user && (
        <div className="user-details">
          <div className="user-details__block">
            <Card className="user-details__content">
              <h1 className="user-details__header">User Details</h1>

              <div className="user-details-wr">
                <div className="user-details__info">
                  <div className="user-details__label">Name:</div>
                  <h2>{user.name}</h2>
                </div>
              </div>
              <div className="user-details-wr">
                <div className="user-details__info">
                  <div className="user-details__label">User Name:</div>
                  <h2>{user.username}</h2>
                </div>
              </div>
              <div className="user-details-wr">
                <div className="user-details__info">
                  <div className="user-details__label">Email:</div>
                  <h2>{user.email}</h2>
                </div>
              </div>
              <div className="user-details-wr">
                <div className="user-details__info">
                  <div className="user-details__label">Website:</div>
                  <h2>{user.website}</h2>
                </div>
              </div>
              <div className="user-details-wr">
                <div className="user-details__info">
                  <div className="user-details__label">Company Name:</div>
                  <h2>{company.name}</h2>
                </div>
              </div>
              <div className="user-details-wr">
                <div className="user-details__info">
                  <div className="user-details__label">Business:</div>
                  <h2>{company.bs}</h2>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserDetails;
