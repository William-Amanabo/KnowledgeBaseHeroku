import React, { useState, useRef, useEffect } from "react";
import editPic from "../img/icons/224-notebook-1.svg";
import uploadPic from "../img/icons/050-folder-3.svg";
import axios from "axios";

export default function EditArticles({match,setMessages,history}:{match:any,setMessages?:React.Dispatch<React.SetStateAction<any[]>>,history?:any}) {
  const id = match.params.id;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const picRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const previewRef = useRef(null);
  const uploadRef = useRef(null);
  const [backupPic,setBackupPic] = useState('');

  const uploadButton = {
    background: `url(${uploadPic})`,
  };

  const handleSubmit = (e) => {
    e.preventDefault()
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

    //var pic:HTMLInputElement = document.getElementById('pic');
    //console.log("picRef.currrent", picRef.current);
    var picFile = picRef.current.files[0];

    if (picFile !== undefined) {
      var formData = new FormData();
      formData.append("pic", picFile);

      axios
        .all([
          axios.post("/articles/edit/" + id, {
            title: title,
            body: body,
            pic: picFile.name,
            deletePic: backupPic,
          }),
          axios({
            method: "post",
            url: "/articles/edit/" + id,
            data: formData,
          }),
        ])
        .then((resArr) => {
          //console.log("resArray from axios.all", resArr);
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
        .post("/articles/edit/" + id, {
          title: title,
          body: body,
          pic: backupPic,
        })
        .then((res) => {
          //console.log("res from axios.post articles/edit", res);
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
    const id = match.params.id;
    axios.get("/articles/edit/" + id).then((res: any) => {
      //console.log("this is article gotten from articles/edit/id", res);
      titleRef.current.value = res.data.title;
      bodyRef.current.value = res.data.body;
      previewRef.current.style.background=`url('/articles/pic/${res.data.pic}')`;
      setBackupPic(res.data.pic);
      if (res.data[0]) {
        if (res.data[0].error) {
          setMessages(res.data);
          setTimeout(() => {
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem("userImage");
            history.push('/');
            //window.location.href = "/login";
          }, 3000);
        }
      }
    });
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
          <div className="page-title">Edit Article</div>
          <div className="line-1"></div>
          <div className="line-2"></div>
          <div className="line-3"></div>
        </div>
    </>
  );
}
