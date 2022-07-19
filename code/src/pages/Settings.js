import React, { useEffect } from "react";
import './Settings.css';
import {Input} from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import { useState, useRef} from "react";
import pfp1 from "../images/pfp1.png";
import pfp2 from "../images/pfp2.png";
import pfp3 from "../images/pfp3.png";
import pfp4 from "../images/pfp4.png";
import pfp5 from "../images/pfp5.png";
import {useMoralis, useMoralisWeb3Api} from "react-moralis"



const Settings = () => {
  const [selectedPFP, setSelectedPFP] = useState();
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState();
  const inputFile = useRef(null);
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  const [lover, setLove] = useState();
  const pfps = [pfp1,pfp2,pfp3,pfp4,pfp5]; 
  const {account, isAuthenticated, Moralis} = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  //const [pfps, setPfps] = useState([])

  // const User = Moralis.Object.extend("_User");
  // const query = new Moralis.Query(User);
  const user = Moralis.User.current();
 

  useEffect(()=>{
    const fetchNFTS = async()=>{
      const options = {
        chain: "ropsten",
        address: account
      }
      const ropstenNFTS = await Web3Api.account.getNFTs(options);
      const images = ropstenNFTS.result.map(
        (e) => resovleLink(JSON.parse(e.metadata)?.image)
      );
      //setPfps(images);
    }
    fetchNFTS();

    
    
  },[isAuthenticated, account])

  const resovleLink = (url) => {
    if(!url || !url.includes("ipfs://")) return url;
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  }

  const onBannerClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };

  const saveEdits = async () => {
    const myDetails = user;
    const LoverDs = Moralis.Object.extend("LoverDs");
    
    const newLover = new LoverDs();

    if(bio) {
      myDetails.set("boi", bio);
      newLover.set("boi", bio)
    }
    if(selectedPFP) {
      myDetails.set("pfp", selectedPFP);
      newLover.set("pfp", selectedPFP)
    }
    if(username) {
      myDetails.set("username", username);
      newLover.set("username", username)
    }
    if(lover) {
      myDetails.set("loverAddr", lover);
    }
    if(theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      myDetails.set("banner", file.ipfs());
    }

    
    newLover.set("addr", account)
    

    await myDetails.save();
    await newLover.save();
    window.location.reload();

  }

  return (
    <>
      <div className="pageIdentify">个人资料⌨️</div>

      <div className="settingsPage" >
        <Input
          label="昵称🥳"
          name="NameChange"
          width="100%"
          labelBgColor="aliceblue"
          value={user.attributes.username}
          onChange={(e)=> setUsername(e.target.value)}
        />

        <Input
          label="简介💫"
          name="bioChange"
          width="100%"
          labelBgColor="aliceblue "
          value={user.attributes.boi}
          onChange={(e) => setBio(e.target.value)}
        />

        <Input
          label="另一半地址💞"
          name="lover"
          width="100%"
          labelBgColor="aliceblue "
          value= {user.attributes.loverAddr?user.attributes.loverAddr:"另一半地址"}
          onChange={(e) => setLove(e.target.value)}
        />

        <div className="pfp">
          Profile Image (Your NFTs)
          <div className="pfpOptions">
            {
              pfps.map((e,i)=>{
                return(
                <>
                  <img src={e} 
                      className={selectedPFP === e ? "pfpOptionSelected":"pfpOption"} 
                      onClick={()=>setSelectedPFP(pfps[i])}>
                  </img>
                </>
                )
              })
            }
          </div>
        </div>

        <div className="pfp">
          Profile Banner
          <div className="pfpOptions">
            <img
              src={selectedFile === defaultImgs[1]?user.attributes.banner:selectedFile}
              onClick={onBannerClick}
              className="banner"
            ></img>
            <input
              type="file"
              name="file"
              ref={inputFile}
              onChange={changeHandler}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="save" onClick={()=>saveEdits()}>
          保存修改
        </div>

      </div>

    </>
  );
};

export default Settings;

