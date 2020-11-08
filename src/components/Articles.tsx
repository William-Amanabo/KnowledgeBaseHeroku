import React, { useEffect, useState } from "react";
import Card from "./Card";
import Axios from "axios";
import { gsap } from "gsap";


interface PropTypes {
  children?: any;
  userId?: string;
  setMessages?:React.Dispatch<React.SetStateAction<any[]>>,
  history:any;
  notFound?:boolean
}

const Articles = ({ userId,setMessages,history,notFound }: PropTypes) => {
  const [articles, setArticles] = useState([]);

  const deleteCard = (id:string) =>{
    var newArticles = articles.filter(article => {return article._id !== id});
    setArticles(newArticles);
  }


  var articlesMarkup = articles.length && typeof articles !== 'string' ? (
    articles.map((article) => {
      if (userId === article.author) {
        return (
          <Card
            image={article.pic}
            title={article.title}
            date={article.date}
            text={article.body}
            userName={article.authorName}
            userImage={article.userImage}
            key={article._id}
            id={article._id}
            owner={true}
            setMessages={setMessages}
            history={history}
            deleteCard={deleteCard}
          />
        );
      } else {
        return (
          <Card
            image={article.pic}
            title={article.title}
            date={article.date}
            text={article.body}
            userName={article.authorName}
            userImage={article.userImage}
            key={article._id}
            id={article._id}
          />
        );
      }
    })
  ) : (
    <div className="loading-container">
          <div className="loading-btn">LOADING</div>
        </div>
  );

  //console.log(articlesMarkup);

  useEffect(() => {
    if (notFound) setMessages([{error: "404 page not found !"}])
    Axios.get("/articles")
      .then((res) => {
        setArticles(res.data);
        //console.log("this is articles", articles);
      })
      .catch((err) => {
        //console.log(err);
      });
  }, []);

  useEffect(() => {
    var t3 = gsap.timeline();
    var cardList = document.querySelectorAll(".card");
    var blackScreen = document.querySelector(".black-screen");
    cardList.forEach((card) => {
      const originalClassName = card.className;
      var more = card.querySelector(".more");
      var close = card.querySelector(".close");

      /* card open animation */
      if (more)
        more.addEventListener("click", (e) => {
          e.preventDefault();

          t3.to(card, { y: -20, opacity: 0, duration: 0.3 }).then(() => {
            card.className = card.className + " expand";
            t3.to(blackScreen, {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              duration: 0.3,
            }).fromTo(
              card,
              { y: -20, opacity: 0, duration: 0.3 },
              { y: 0, opacity: 1 }
            );
          });
        });
        /* card close animation */
      if (close)
        close.addEventListener("click", (e) => {
          e.preventDefault();
          t3.to(card, { y: -20, opacity: 0, duration: 0.3 })
            .to(blackScreen, { backgroundColor: "transparent", duration: 0.3 })
            .then(() => {
              card.className = originalClassName;
              t3.fromTo(
                card,
                { y: -20, opacity: 0, duration: 0.5 },
                { y: 0, opacity: 1, duration: 0.3 }
              );
              t3.set(card, { display: "revert" });
            });
        });
    });
  }, [articlesMarkup]);

  //return <div></div>
  return <>{articlesMarkup}
    <div className="page-info">
          <div className="page-title">Articles</div>
          <div className="line-1"></div>
          <div className="line-2"></div>
          <div className="line-3"></div>
        </div>
  </>;
};

export default Articles;
