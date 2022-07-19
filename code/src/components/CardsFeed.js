import React, { useEffect, useState } from "react";
import "./CardsFeed.css";
import filecoinOrbit from "../images/filecoinOrbit.jpeg";
import { defaultImgs } from "../defaultimgs";
import pfp4 from "../images/pfp4.png";
import pfp5 from "../images/pfp5.png";
import { Icon } from "web3uikit";
import { useMoralis } from "react-moralis";
import  Comments  from "./Comments";

const CardsFeed = (profile) => {
  
  const [tweetAtr, setTweetAtr] = useState();
  const [comments, setComments] = useState();
  const { Moralis, account } = useMoralis();
  const LoveCards = Moralis.Object.extend("LoveCards");
  const query = new Moralis.Query(LoveCards);

  useEffect(()=>{
    async function getTweets() {
      try {
        if(profile.profile) {
          query.equalTo("carderAcc", account);
        }
        const results = await query.find();
        setTweetAtr(results);

      } catch (error) {
        console.log(error);
      }
    }
    getTweets();
  }, [profile])

  

  return (
    <>
    {tweetAtr?.map((e,i)=>{
      return(
        <div className="feedTweet">
          {}
          <div className="completeTweet">
            <div className="who">
              <div style = {{'font-size': '40px'}}>
                {e.attributes.feelingImg}
              </div>
              {e.attributes.feeling}
              <div className="accWhen">{
                `${e.attributes.carderAcc.slice(0, 4)}...${e.attributes.carderAcc.slice(38)}.
                 ${e.attributes.cardDate?e.attributes.cardDate[0]:null}
                `
              }</div>
            </div>
            <div className="tweetContent">
                <div style={{'textAlign':'center'}}>
                ✏️{e.attributes.cardTxt}
                </div>
              
              {e.attributes.cardImg && (
                <div style={{'textAlign':'center'}}>
                  <img src={e.attributes.cardImg} className="tweetImg"></img>
                </div>
              )}

              <div style={{'textAlign':'center'}}>
                🌏{e.attributes.location}
              </div>
              
            </div>
           
          </div>
        </div>

      );

    }).reverse()
  }

      <div className="feedTweet">
        <img src={pfp5} className="profilePic"></img>
        <div className="completeTweet">
          <div className="who">
            Filecoin
            <div className="accWhen">0x42..314 · 1h</div>
          </div>
          <div className="tweetContent">
            Excited about the Filecoin Orbit swag!
            <img src={filecoinOrbit} className="tweetImg"></img>
          </div>
          <div className="interactions">
            <div className="interactionNums">
              <Icon fill="#3f3f3f" size={20} svg="messageCircle" />
            </div>
            <div className="interactionNums">
              <Icon fill="#3f3f3f" size={20} svg="star" />
              12
            </div>
            <div className="interactionNums">
              <Icon fill="#3f3f3f" size={20} svg="chainlink" />
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default CardsFeed;

