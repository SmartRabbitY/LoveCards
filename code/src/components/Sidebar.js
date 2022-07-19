import React, { useEffect, useState } from "react";
import './Sidebar.css';
import KeepAlive, { withAliveScope } from "react-activation"
import {Link} from 'react-router-dom';
import {Logo, Icon, Card, Illustration} from "web3uikit";
import ipfsLogo from "../images/ipfs-logo.png";
import Web3StorageLogo from "../images/web3storage.png"
import { defaultImgs } from "../defaultimgs";
import {useMoralis, useMoralisWeb3Api} from "react-moralis";


const Sidebar = () => {
  const {Moralis, account} = useMoralis();
  const user = Moralis.User.current();
  const [tweetAtr, setTweetAtr] = useState();

  const LoveTrans = Moralis.Object.extend("LoveTrans");
  const query = new Moralis.Query(LoveTrans);
  useEffect(()=>{
    async function getTrans() {
      try {
        
        query.equalTo("tranAcc", account);
        
        const results = await query.find();
        setTweetAtr(results);

      } catch (error) {
        console.log(error);
      }
    }
    getTrans();
  })

  return (

    <div style={{width:'520px', height: '1100px', overflow: 'auto',  }}>
    {
     <div className="siderbarContent">
        <Link to="/" className="link">
          <div className="sidermenuItems">
            <div style={{'font-size': '40px', 'textAlign':'center'}}>💌💒⬅️</div>
          </div>
        </Link>
        <Link to="/pool" className="link">
          <div className="sidermenuItems">
            <div style={{'font-size': '30px', 'textAlign':'center'}}>💝许愿池🌠</div>
          </div>
        </Link>
        <div className="sidermenuItems">

        <div className="sidertrends">   
        <div style={{'fontSize':'20px', 'padding':'10px'}}>链上🪢的记忆🖼️</div>       
          {
            tweetAtr?.map((e,i)=>{
            return(
              <div>
              <div
                style={{
                  width: '300px'
                }}
              >
                <div style={{'padding':'20px'}}>
                <Card
                  description="点击去到ipfs"
                  onClick={function GoIPFS(){
                    window.location.href=e.attributes.ipfslink
                  }}
                  setIsSelected={function noRefCheck(){}}
                  title={e.attributes.title}
                  tooltipText={<span style={{width:100}}>永久储存在IPFS上了哦</span>}
                >
                  <img src={e.attributes.ipfslink+"/test"} className="trendImg"></img>
                </Card>
              </div>
              </div>

              </div>
              
            );
          })}
        
        </div>
        </div>


     </div>
    }
    </div>
    
  );
};

export default Sidebar;

