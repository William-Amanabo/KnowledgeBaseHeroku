import React, { useState, useRef, useEffect } from "react";
import card from "../img/icons/332-id-card.svg";
import uploadPic from "../img/icons/050-folder-3.svg";
import axios from "axios";

export default function Register({
  setMessages,
  history
}: {
  setMessages?: React.Dispatch<React.SetStateAction<any[]>>,
  history:any
}) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const picRef = useRef(null);
  const previewRef = useRef(null);
  const uploadRef = useRef(null);

  const uploadButton = {
    background: `url(${uploadPic})`,
  };

  const handleChange = (value: string, check: string) => {
    if (check === "name") setName(value);
    if (check === "email") setEmail(value);
    if (check === "username") setUsername(value);
    if (check === "password") setPassword(value);
    if (check === "confirmPassword") setConfirmPassword(value);
  };

  const fileChange = (e) => {
    e.preventDefault()
    var image = e.target.files[0];
    var blob = URL.createObjectURL(image);
    previewRef.current.style.background=`url(${blob})`;
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    //console.log("picRef.current", picRef.current);
    /* Button animation */
    if (e.target !== null) {
      let x = e.clientX - e.target.offsetLeft;
      let y = e.clientY - e.target.offsetTop ;

      let ripples = document.createElement("span");
      //console.log("x",x,'y',y)
      ripples.style.left = x + "px";
      //ripples.style.top = y + "px";
      e.target.appendChild(ripples);

      setTimeout(() => {
        ripples.remove();
      }, 2000);
    }

    var picFile = picRef.current.files[0];
    if (picFile !== undefined) {
      var formData = new FormData();
      formData.append("userImage", picFile);

      axios
        .post("/users/register", {
          username,
          name,
          email,
          confirmPassword,
          password,
          userImage: picFile.name,
        })
        .then((res) => {
          //console.log("this is res from users/registration", res);
          if (res.data !== "") setMessages(res.data);
          if (!res.data) {
            axios.post("/users/login", { username, password }).then((res) => {
              localStorage.setItem("userId", `${res.data.user._id}`);
              localStorage.setItem("userImage", `${res.data.user.userImage}`);
              axios({
                method: "post",
                url: "/users/register",
                data: formData,
              }).then((res) => {
                //console.log("resArray from axios login users/register post image",res);
                if (!res.data) {
                  setMessages([
                    { success: "You are now registered and Logged in" },
                  ]);
                  setTimeout(() => {
                    history.push('/');
                    //window.location.href = "/";
                  }, 3000);
                } else {
                  setMessages(res.data);
                  setTimeout(() => {
                    history.push('/');
                    //window.location.href = "/";
                  }, 3000);
                }
              });
            });
          }
        });
    } else {
      axios
        .post("/users/register", {
          username,
          name,
          email,
          confirmPassword,
          password,
        })
        .then((res) => {
          //console.log("res from axios.post users/register", res);
          setMessages(res.data);
        });
    }
  };

  useEffect(() => {
    uploadRef.current.addEventListener("click", () => {
      picRef.current.click();
    });
  }, []);

  return (
    <>
      <div className="card">
        <div className="container form">
          <img src={card} alt="" />
          <div className="form-container">
            <div className="form-component">
              <p>Name:</p>
              <input
                type="text"
                id="name"
                onChange={(e) => {
                  handleChange(e.target.value, "name");
                }}
              />
            </div>
            <div className="form-component">
              <p>Email:</p>
              <input
                type="email"
                id="email"
                onChange={(e) => {
                  handleChange(e.target.value, "email");
                }}
              />
            </div>
            <div className="form-component">
              <p>Username:</p>
              <input
                type="text"
                id="username"
                onChange={(e) => {
                  handleChange(e.target.value, "username");
                }}
              />
            </div>
            <div className="form-component">
              <p>Password:</p>
              <input
                type="password"
                id="password"
                onChange={(e) => {
                  handleChange(e.target.value, "password");
                }}
              />
            </div>
            <div className="form-component">
              <p>Confirm:</p>
              <input
                type="password"
                id="confirmPassword"
                onChange={(e) => {
                  handleChange(e.target.value, "confirmPassword");
                }}
              />
            </div>
            <div className="form-component">
              <div
                className="btn upload"
                style={uploadButton}
                ref={uploadRef}
              ></div>
              <input
                type="file"
                id="pic"
                ref={picRef}
                accept="image/x-png,image/gif,image/jpeg"
                onChange={(e) => {
                  fileChange(e);
                }}
              />
              <div  className="preview" ref={previewRef}></div>
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
          <div className="page-title">Register</div>
          <div className="line-1"></div>
          <div className="line-2"></div>
          <div className="line-3"></div>
        </div>
    </>
  );
}
