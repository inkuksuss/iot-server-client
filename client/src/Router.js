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
import PythonPage from 'components/PythonPage/PythonPage';
import Auth from './hoc/auth'
import Header from 'components/Header/Header';
import LoggedHeader from "components/Header/LoggedHeader"
import { useSelector } from 'react-redux';
import MyPage from 'components/MyPage/MyPage';
import DevicePage from 'components/Device/DevicePage';


export default () => {
  const isLogged = useSelector(state => state.user.userData.isAuth);
  const userId = useSelector(state => state.user.userData.id);
  return (
    <Router>
        <>
          {isLogged ? <LoggedHeader match={userId}/> : <Header />}
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, null)} />
            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route exact path="/join" component={Auth(JoinPage, false)} />
            <Route exact path="/me" component={Auth(MyPage, true)} />
            <Route exact path='/data/:id' component={Auth(DevicePage, true)} />
            {/* <Route exact path="/python" component={PythonPage} /> */}
          </Switch>
        </>
      </Router>
  );
};

