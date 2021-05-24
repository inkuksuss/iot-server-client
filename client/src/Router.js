/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { useCookies, withCookies } from 'react-cookie';
import LandingPage from 'components/LandingPage/LandingPage'
import LoginPage from 'components/LoginPage/LoginPage';
import JoinPage from 'components/JoinPage/JoinPage';
import PythonPage from 'components/PythonPage/PythonPage';
import Auth from './hoc/auth'
import Header from 'components/Header/Header';
import LoggedHeader from "components/Header/LoggedHeader";
import ProductPage from "components/Product/ProduectPage";
import MyPage from 'components/MyPage/MyPage';
import DevicePage from 'components/Device/DevicePage';


function Routers (props) {
  
  const { cookies } = props;
  const [ cookie , setCookie ] = useState('');
  
  useEffect(() => {
    setCookie(cookies.get('access_token') || false);
  }, [cookie])
  
  const isLogged = cookie

  return (
    <Router>
        <>
          {isLogged ? <LoggedHeader /> : <Header />}
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, null)} />
            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route exact path="/join" component={Auth(JoinPage, false)} />
            <Route exact path="/me" component={Auth(MyPage, true)} />
            <Route exact path='/data/:id' component={Auth(DevicePage, true)} />
            <Route exact path='/data/product/:id' component={Auth(ProductPage, true)} />
          </Switch>
        </>
      </Router>
  );
};

export default withCookies(Routers);
