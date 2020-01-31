import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Intro from "./components/Intro/Intro";
import Instructions from "./components/Instructions/Instructions";
import Block from "./components/Block/Block";
import Board from "./components/Board/Board";
import Intro_Survey from "./components/Intro_Survey/Intro_Survey";
import Survey from "./components/Survey/Survey";
import QuizBlock from "./components/QuizBlock/QuizBlock";

import * as serviceWorker from './serviceWorker';


const RefreshRoute = ({ component: Component, isDataAvailable, ...rest }) => (    
  <Route
    {...rest}
    render={props =>
       (props.location.state!=undefined) ? ( // if props location state is defined return page, else return to intro
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      )
    }
  />
);


const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Intro} exact />
                <Route path="/Instructions" component={Instructions} exact />
                <Route path="/Block" component={Block} exact />
                <Route path="/Board" component={Board} exact />
                <Route path="/Intro_Survey" component={Intro_Survey} exact />
                <Route path="/Survey" component={Survey} exact />
                <Route path="/QuizBlock" component={QuizBlock} exact />
            </Switch>
        </BrowserRouter>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

