import { useState, useRef} from "react";
import './Rightbar.css';
import { defaultImgs } from "../defaultimgs";
import ipfsimg from "../images/ipfs-logo.png"
import {Input, Checkbox, Logo, Icon} from "web3uikit";
import {Link} from 'react-router-dom';
import ipfsLogo from "../images/ipfs-logo.png";
import Web3StorageLogo from "../images/web3storage.png"

import {useMoralis, useWeb3ExecuteFunction} from "react-moralis"
// import { Button} from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.css';

const Rightbar = () => {

  const [lovername, setLovername] = useState();
  const [loverpfp, setLoverpfp] = useState();
  const [ptoken, setPtoken] = useState(false);
  const [hist, setHist] = useState(false);

  const {Moralis} = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const user = Moralis.User.current();
  //console.log(Moralis.User.current())

  const onHeart = async (event) => {
    setHist(!hist);
    // return <FileTransactions/>;
    const US = Moralis.Object.extend("LoverDs");
    console.log(US)
    const query = new Moralis.Query(US);
    // alert(user.attributes.loverAddr.toLowerCase())
    query.equalTo("addr", user.attributes.loverAddr.toLowerCase());
    const res = await query.find();
    console.log(res[res.length-1].attributes.pfp)
    setLoverpfp(res[res.length-1].attributes.pfp)
    setLovername(res[res.length-1].attributes.username)
    
  }
  const onToken = async (event) => {
    user.set("ptoken", ptoken);
    await user.save();
    
  }

  function goWeb3Storage() {
    window.location.href="https://web3.storage/account/"
  }


  return (
    <div style={{ height: document.body.clientHeight - 50, overflow: 'auto' }}>
    <div className="rightbarContent" >

        <div className="sidermenuItems">
              <img src={user.attributes.pfp? user.attributes.pfp : ipfsimg} className="profilePic"></img>
              <div className="profile">
                <div className="who">
                  {user.attributes.username}
                </div>
                <div className="accWhen">
                  {`${user.attributes.ethAddress.slice(0, 4)}...${user.attributes.ethAddress.slice(38)}`}
                </div>
              </div>
              {hist&&"💘"}
              {hist&&<img src={ loverpfp? loverpfp:ipfsimg} className="profilePic"></img>}
              {
                hist&&
                <div className="profile">
                <div className="who">
                  {lovername}
                </div>
                <div className="accWhen">
                  {`${user.attributes.loverAddr.toLowerCase().slice(0, 4)}...${user.attributes.loverAddr.toLowerCase().slice(38)}`}
                </div>
              </div> 
              }
        </div>
        <div className="sidermenuItems">
            {<div className="Heart" onClick={()=>onHeart()}>
                心动
            </div>}
        </div>
              
        

        <Link to="/settings" className="link">
          <div className="sidermenuItems">
            <Icon fill="#252526" size={33} svg="edit" />
            编辑个人信息✒️
          </div>
        </Link>
        <div className="sidermenuItems"
          onClick={()=>{
            Moralis.User.logOut().then(()=>{
              window.location.reload();
            })
          }}> 
            <Icon fill="#252526" size={33} svg="chevronRightX2" />
            Logout🚪
        </div>

        <div className="sidermenuItems">
            {<div className="Heart" onClick={()=>onToken()}>
                设置Token
            </div>}
            <Input
              labelBgColor=" #fae9e9"
              label="你的Token"
              name="Test Password Input"
              onBlur={function noRefCheck(){}}
              onChange={(e)=> setPtoken(e.target.value)}
              type="password"
              value={user.attributes.ptoken}
            />
        </div>

        
        <div className="sidermenuItems" onClick={goWeb3Storage}>
          <div className="accWhen">
            💭还没有token吗？快来web3.storage看看吧！
          </div>
        </div>

        <div className="mydetails">
          <img src={ipfsLogo} className="profilePic"></img>
          <img src={Web3StorageLogo} className="profilePic"></img>
          <Icon fill="pink" size={50} svg="fil"/>
          <Logo theme="icon" color="blue" size={45}/> 
        </div> 

        
        
    </div>
    </div>
  );
};

export default Rightbar;

