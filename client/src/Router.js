/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import LandingPage from 'components/LandingPage/LandingPage'
import LoginPage from 'components/LoginPage/LoginPage';
import JoinPage from 'components/JoinPage/JoinPage';
import Auth from './hoc/auth'
import Header from 'components/Header/Header';
import LoggedHeader from "components/Header/LoggedHeader"
import { useSelector } from 'react-redux';
import MyPage from 'components/MyPage/MyPage';


export default () => {
  const isLogged = useSelector(state => state.user.userData.isAuth);
  return (
    <Router>
        <>
          {isLogged ? <LoggedHeader /> : <Header />}
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, true)} />
            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route exact path="/join" component={Auth(JoinPage, false)} />
            <Route exact path="/me" component={Auth(MyPage, true)} />
            <Route exact path="/:id/controller" component={Auth(JoinPage, true)} />
          </Switch>
        </>
      </Router>
  );
};

