import React from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import more from "../img/icons/112-more-2.svg";
import close from "../img/icons/237-cancel.svg";
import edit from "../img/icons/169-edit.svg";
import deleteSVG from "../img/icons/104-trash-1.svg";

interface PropTypes {
  addToRefs?: any;
  image: any;
  title: any;
  text: any;
  userImage: any;
  userName: any;
  date: any;
  owner?: boolean;
  id: string;
  setMessages?: React.Dispatch<React.SetStateAction<any[]>>;
  history?:any;
  deleteCard?:Function
}

export default function Card({
  image,
  title,
  text,
  userImage,
  userName,
  date,
  addToRefs,
  owner,
  id,
  setMessages,
  history,
  deleteCard
}: PropTypes) {
  const handleEdit = (e) => {
    e.preventDefault()
    history.push("/editArticle/" + id);
    //window.location.href = "/editArticle/" + id;
  };
  const handleDelete = (e) => {
    e.preventDefault()
    //console.log("Testing delete ReactDOM.findDOMNode(this).parentNode ", ReactDOM.findDOMNode(e).parentNode);
    axios.delete("/articles/" + id).then((res) => {
      //console.log('res from handleDelete',res)
      setMessages(res.data);
      deleteCard(id);
      /* setTimeout(() => { 
        history.push('/');
        //window.location.href = "/";
        
        //ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
      }, 3000); */
    });
  };

  return (
    <div className="card" ref={addToRefs}>
      <div className="container">
        <img src={"/articles/pic/" + image} alt="" className="image" />
        <div className="content">
          <div className="title">{title}</div>
          <div className="summary">{text}</div>
          <div className="user-details">
            <div>
              <img
                src={"/users/userImage/" + userImage}
                alt=""
                className="user-img"
              />{" "}
              {/* TODO set handled user image */}
              <div className="user-info">
                <p className="user-name">{userName}</p>
                <p className="date">{date}</p>
              </div>
            </div>
            <div className="misc">
              <div className="btn more">
                <img src={more} alt="" />
              </div>
              {owner ? (
                <>
                  <div
                    className="btn edit"
                    onClick={(e) => {
                      handleEdit(e);
                    }}
                  >
                    <img src={edit} alt="" />
                  </div>
                  <div
                    className="btn delete"
                    onClick={(e) => {
                      handleDelete(e);
                    }}
                  >
                    <img src={deleteSVG} alt="" />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="close btn">
          <img src={close} alt="" className="close btn" />
        </div>
      </div>
    </div>
  );
}
