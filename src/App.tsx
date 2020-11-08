import React, { useState, useEffect } from "react";
//import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import AppContainer from "./components/AppContainer";
import Articles from "./components/Articles";
import Login from "./components/Login";
import Register from "./components/Register";
import Edit from "./components/EditArticle";
import Add from "./components/AddArticles";

/* var Articles = lazy(()=>import('./components/Articles'));
const Login = lazy(()=>import('./components/Login'));
const Register = lazy(()=>import('./components/Register'));
const Edit = lazy(()=>import('./components/EditArticle'));
const Add = lazy(()=>import('./components/AddArticles')) */

const App = () => {
  let userId = window.localStorage.getItem("userId");
  let userImage = window.localStorage.getItem("userImage");
  let theme = window.localStorage.getItem("theme");
  const [messages, setMessages] = useState([]);
  const messageObject = (
    <div className="messages">
      {messages.map((message, i) => {
        const info = message.error ? (
          <div className="error" key={i}>
            <p>{message.error}</p>
          </div>
        ) : (
          <div className="success" key={i}>
            <p>{message.success}</p>
          </div>
        );
        return info;
      })}
    </div>
  );
  useEffect(() => {
    setTimeout(() => {
      setMessages([]);
    }, 11000);
  }, [messages]);
  return (
    <Router>
      {/* <Suspense fallback={AppContainer}> */}
      <AppContainer
        userId={userId}
        setMessages={setMessages}
        userImage={userImage}
        theme={theme}
      >
        {messageObject}
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <Articles {...props} userId={userId} setMessages={setMessages} />
            )}
          ></Route>
          <Route
            path="/login"
            render={(props) => (
              <Login setMessages={setMessages} history={props.history} />
            )}
          ></Route>
          <Route
            path="/register"
            render={(props) => (
              <Register setMessages={setMessages} history={props.history} />
            )}
          ></Route>
          <Route
            exact
            path="/editArticle/:id"
            render={(props) => (
              <Edit {...props} userId={userId} setMessages={setMessages} />
            )}
          />
          <Route
            exact
            path="/addArticle"
            render={(props) => (
              <Add
                userId={userId}
                setMessages={setMessages}
                history={props.history}
              />
            )}
          />
          <Route
            render={(props) => (
              <Articles {...props} userId={userId} setMessages={setMessages} notFound={true}/>
            )}
          ></Route>
        </Switch>
      </AppContainer>
      {/*  </Suspense> */}
    </Router>
  );
};

export default App;
