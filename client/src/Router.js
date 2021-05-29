/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { withCookies } from 'react-cookie';
import LandingPage from 'components/LandingPage/LandingPage'
import LoginPage from 'components/LoginPage/LoginPage';
import JoinPage from 'components/JoinPage/JoinPage';
import Header from 'components/Header/Header';
import LoggedHeader from "components/Header/LoggedHeader";
import ProductPage from "components/Product/ProduectPage";
import MyPage from 'components/MyPage/MyPage';
import DevicePage from 'components/Device/DevicePage';
import { TransitionGroup, CSSTransition } from "react-transition-group"

function Routers (props) {
  const { cookies } = props;
  const [ cookie , setCookie ] = useState('');

  useEffect(() => {
    setCookie(cookies.get('access_token') || false);
  }, [cookie]) // 웹페이지로부터 쿠키를 가져옴
  
  const isLogged = cookie;

  return (
    <Router>
        <>
          <Route
            render={({location}) => {
              console.log(location)
              return (
                <>
                  {isLogged ? <LoggedHeader /> : <Header />}
                  <TransitionGroup className="transition_group">
                  <CSSTransition key={location.key} timeout={{enter: 1000, exit: 1000}} classNames="slide">
                  <section className="route-section">
                  <Switch location={location}>
                    <Route exact path="/" component={LandingPage} /> 
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/join" component={JoinPage} />
                    <Route exact path="/me" component={MyPage} />
                    <Route exact path='/data/:id' component={DevicePage} />
                    <Route exact path='/data/product/:id' component={ProductPage} />
                  </Switch>
                  </section>
                  </CSSTransition>
                  </TransitionGroup>
                </>
              )
            }}
          >
          </Route>
        </>
      </Router>
  );
};

export default withCookies(Routers);
