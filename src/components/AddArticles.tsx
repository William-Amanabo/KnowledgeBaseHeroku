import React, { useState, useRef, useEffect } from "react";
import editPic from "../img/icons/224-notebook-1.svg";
import uploadPic from "../img/icons/050-folder-3.svg";
import axios from "axios";

export default function AddArticles({userId, setMessages,history}:{userId:string,setMessages?:React.Dispatch<React.SetStateAction<any[]>>,history:any}) {

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const picRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const previewRef = useRef(null);
  const uploadRef = useRef(null);

  const uploadButton = {
    background: `url(${uploadPic})`,
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    /* Button animation */
    if (e.target !== null) {
      let x = e.clientX - e.target.offsetLeft;
      let ripples = document.createElement("span");
      ripples.style.left = x + "px";
      e.target.appendChild(ripples);

      setTimeout(() => {
        ripples.remove();
      }, 2000);
    }

    //console.log("picRef.current", picRef.current);
    var picFile = picRef.current.files[0];

    if (picFile !== undefined) {
      var formData = new FormData();
      formData.append("pic", picFile);

      axios
        .all([
          axios.post("/articles/add", {
            title: title,
            body: body,
            pic: picFile.name,
          }),
          axios({
            method: "post",
            url: "/articles/add",
            data: formData,
          }),
        ])
        .then((resArr) => {
          //console.log("resArray from axios.all add article", resArr);
          if(resArr[0].data[0].success){
            setMessages(resArr[0].data);
            setTimeout(() => {
              history.push('/');
              //window.location.href = "/";
            }, 3000);
          }else{
            setMessages(resArr[0].data);
          }
        });
    } else {
      axios
        .post("/articles/add/", {
          title: title,
          body: body,
        })
        .then((res) => {
          //console.log("res from axios.post articles/add", res);
          if(res.data[0].success){
            setMessages(res.data);
            setTimeout(() => {
              history.push('/');
              //window.location.href = "/";
            }, 3000);
          }else{
            setMessages(res.data);
          }

        });
    }
  };
  const handleChange = (value: string, type: string): void => {
    if (type === "title") setTitle(value);
    else setBody(value);
  };

  useEffect(() => {
    axios.get("/articles/add").then((res: any) => {
      //console.log("this is article gotten from articles/add", res);
      if (res.data[0]) {
        if (res.data[0].error) {
          setMessages(res.data);
          window.localStorage.removeItem('userId');
          window.localStorage.removeItem("userImage");
          setTimeout(() => {
            history.push('/login');
            //window.location.href = "/login";
          }, 3000);
        }
      }
    });
    if(!userId){
      setMessages([{error:'You are Unauthorized'}]);
      window.localStorage.removeItem('userId');
      window.localStorage.removeItem("userImage");
          setTimeout(() => {
            history.push('/');
            //window.location.href = "/login";
          }, 3000);
    }
    uploadRef.current.addEventListener('click',()=>{
      picRef.current.click()
    })
  }, []);

  const fileChange = (e) =>{
    var image = e.target.files[0]
        var blob = URL.createObjectURL(image)
        
        previewRef.current.style.background=`url(${blob})`;
  }

  

  return (
    <>
      <div className="card">
        <div className="container form">
          <img src={editPic} alt="" />
          <div className="form-container article">
            <div className="form-component">
              <p>Title</p>
              <input
                type="text"
                id="title"
                onChange={(e) => {
                  handleChange(e.target.value, "title");
                }}
                ref={titleRef}
              />
            </div>
            <div className="form-component">
              <p>Body</p>
              <textarea
                id="body"
                onChange={(e) => {
                  handleChange(e.target.value, "body");
                }}
                ref={bodyRef}
              />
            </div>
            <div className="form-component">
              <div className="btn upload" style={uploadButton} ref={uploadRef}></div>
              <input type="file" id="pic" ref={picRef} accept="image/x-png,image/gif,image/jpeg" onChange={(e)=>{fileChange(e)}}/>
              <div  className="preview" ref={previewRef}></div>
            </div>
          </div>
          <button
            type="submit"
            className="form-submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            SUBMIT
          </button>
        </div>
      </div>
      <div className="page-info">
          <div className="page-title">Add Article</div>
          <div className="line-1"></div>
          <div className="line-2"></div>
          <div className="line-3"></div>
        </div>
    </>
  );
}
