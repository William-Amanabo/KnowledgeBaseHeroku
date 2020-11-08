import React, { useState } from "react";
import card from "../img/icons/332-id-card.svg";
import axios from "axios";

export default function Login({
  setMessages,
  history
}: {
  setMessages?: React.Dispatch<React.SetStateAction<any[]>>,
  history:any
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    //console.log('this is e ',e);
    e.preventDefault()
    //console.log("username and password", username, password);
    if (username === "" || password === "") {
      setMessages([{ error: "Missing credentials" }]);
    } else {
      axios.post("/users/login", { username, password }).then((res) => {
        /* console.log(
          "%c this is response from /users/login",
          " color:green",
          res.data
        ); */
        if (res.data.messages) {
          setMessages(res.data.messages);
        }
        if (res.data.user) {
          //console.log(res.data.user._id);
          localStorage.setItem("userId", `${res.data.user._id}`);
          localStorage.setItem("userImage", `${res.data.user.userImage}`);
          setTimeout(() => {
            history.push('/');
            //window.location.href = "/";
          }, 3000);
        }
      });
    }

    if (e.target !== null) {
      let x = e.clientX - e.target.offsetLeft;
      let ripples = document.createElement("span");
      ripples.style.left = x + "px";
      e.target.appendChild(ripples);

      setTimeout(() => {
        ripples.remove();
      }, 2000);
    }
  };

  return (
    <>
      <div className="card">
        <div className="container form">
          <img src={card} alt="" />
          <div className="form-container">
            <div className="form-component">
              <p>Username:</p>
              <input
                type="text"
                id="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="form-component">
              <p>Password:</p>
              <input
                type="password"
                id="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
          <div
            className="form-submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            SUBMIT
          </div>
        </div>
      </div>
      <div className="page-info">
        <div className="page-title">Login</div>
        <div className="line-1"></div>
        <div className="line-2"></div>
        <div className="line-3"></div>
      </div>
    </>
  );
}
