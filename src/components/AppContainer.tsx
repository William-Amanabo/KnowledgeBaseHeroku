import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import axios from "axios";
import { ReactComponent as Switches } from "../img/icons/switch.svg";
import menu from "../img/icons/088-menu-1.svg";

interface PropTypes {
  children?: any;
  userId?: string;
  userImage?: string;
  setMessages?: React.Dispatch<React.SetStateAction<any[]>>;
  theme: string;
  /* history:History */
}

export default function AppContainer({
  children,
  userId,
  userImage,
  setMessages,
  /* history */
}: PropTypes) {
  const appContainerAnimations = () => {
    /* Sidebar Nav */

    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".links");
    const t1 = gsap.timeline({ paused: true });
    t1.to(sidebar, 0.3, { x: 0 });
    t1.reversed(true);
    if (hamburger){

      hamburger.addEventListener("click", () => {
        t1.reversed() ? t1.play() : t1.reverse();
        //console.log("button clicked");
      });

      hamburger.addEventListener('mouseout',()=>{
        t1.reversed()? t1.play(): t1.reverse();
        //console.log("button clicked")
      })
    }
      
    /* Circles animation */

    const circles = document.querySelectorAll(".circle");
    const t2 = gsap.timeline();
    circles.forEach((circle) => {
      t2.to(
        circle,
        { scale: 1.4, yoyo: true, repeat: -1, duration: 3, yoyoEase: "none" },
        "-=0.75"
      );
    });

    /* Switch and theme animation */

    const themeSwitch = document.querySelector(".switch");
    const switchBall = themeSwitch
      ? themeSwitch.children[0].querySelector(".switch-button")
      : null;
    const t4 = gsap.timeline({ paused: true });
    if (switchBall) t4.to(switchBall, { x: "400%", duration: 0.3 });
    t4.reversed(true);
    if (themeSwitch)
      themeSwitch.addEventListener("click", () => {
        //console.log("switch event listener added");
        const dark = () => {
          t4.play();
          window.localStorage.setItem("theme", "dark");
          return;
        };
        const light = () => {
          t4.reverse();
          window.localStorage.setItem("theme", "light");
          return;
        };

        t4.reversed() ? dark() : light();
        document.body.classList.toggle("dark-theme");
      });
  };

  const switchDiv = useRef(null);

  useEffect(() => {
    appContainerAnimations();
    if (window.localStorage.getItem("theme") === "dark"){
      switchDiv.current.click();
    }else{
      window.localStorage.setItem("theme", "light");
    }
      
  }, []);

  const logout = () => {
    axios.get("users/logout").then((res) => {
      setMessages(res.data);
      window.localStorage.removeItem("userId");
      window.localStorage.removeItem("userImage");
      setTimeout(() => {
        //history.push('/');
        window.location.href = "/";
      }, 5000);
    });
  };

  var navLinks = userId ? (
    <>
      <li className="btn">
        <Link to={"/"}>
          Home
        </Link>
      </li>
      <li className="btn">
        <Link to={"/addArticle"}>
          Add Article
        </Link>
      </li>
      <li className="btn">
          <img src={"/users/userImage/" + userImage} alt="logout" />
          <a
            href=""
            onClick={() => {
              logout();
            }}
          >
            Logout
          </a>
      </li>
    </>
  ) : (
    <>
      <li className="btn">
        <Link to={"/"}>
        Home
        </Link>
      </li>
      <li className="btn">
        <Link to={"/login"}>
          Login
        </Link>
      </li>
      <li className="btn">
        <Link to={"/register"}>
          Register
        </Link>
      </li>
    </>
  );

  return (
    <div>
      <div>
        <header>
          <nav>
            <Link to={"/"}>
              <div className="logo">
                <p>
                  Knowledge<strong className="blue">Base</strong>
                </p>
              </div>
            </Link>
            <div className="links">
              <ul>{navLinks}</ul>
            </div>
            <div className="hamburger btn">
              <img src={menu} alt="" />
            </div>
          </nav>
        </header>
        <main>{children}</main>

        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className=" circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-6"></div>
      </div>
      <div className="black-screen no-touch"></div>
      <div className="switch" ref={switchDiv}>
        <Switches />
      </div>
    </div>
  );
}
