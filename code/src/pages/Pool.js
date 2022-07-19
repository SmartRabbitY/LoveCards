import React ,{ useEffect }from "react";
import "./Home.css";
import { useState, useRef} from "react";
import { defaultImgs } from "../defaultimgs";
import {TextArea, Icon, Card, Illustration, Input, Loading} from "web3uikit";
import { Button, Container } from "react-bootstrap";
import CardsFeed from "../components/CardsFeed";
import {useMoralis, useWeb3ExecuteFunction} from "react-moralis"
import Dwetransfer from "./Dwetransfer.json"
import html2canvas from "html2canvas";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import { BigNumber, ethers } from "ethers";

const Home = () => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [theFile, setTheFile] = useState();
  const [wish, setWish] = useState();
  const [wishplace, setWishplace] = useState();
  const [tweet, setTweet] = useState();
  const [sendingd, setSendingStated] = useState(false);
  const [wishAttr, setWishAttr] = useState();
  const {Moralis} = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const user = Moralis.User.current();
  const WishCards = Moralis.Object.extend("WishCards");
  const query = new Moralis.Query(WishCards);
  useEffect(()=>{
    async function getWishs() {
      try {
        let results = await query.find();
        console.log(results)
        setWishAttr(results);

      } catch (error) {
        console.log(error);
      }
    }
    getWishs();
  },[])

  const onImageClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };


  async function saveCard(e) {
    setSendingStated(true)
    console.log(e)

    const WishCards = Moralis.Object.extend("WishCards");
    
    const newCard = new WishCards();
    newCard.set("wishText", wish);
    newCard.set("wishPlace", wishplace);
    newCard.set("carderAcc", user.attributes.ethAddress);

    if(theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      
      try {
        const path = file.ipfs();
        if(!path) return;
        
        const contractAddress = "0xb9A436aD74b2aD1e0908CC4BC5295BF0d92FF204";
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(contractAddress, Dwetransfer.abi, signer)
        const options2 = {value: ethers.utils.parseEther("0.1")};
        let tx = await contract.addTweet(path, options2);
        let rc = await tx.wait();
        const wishId = BigNumber.from(rc.events[0].args["id"]._hex).toNumber();
        console.log(wishId)
        newCard.set("wishId", wishId);
        newCard.set("imgurl", rc.events[0].args["fileUrl"]);
        newCard.set("wishId", wishId);
        newCard.set("OK", true);
        await newCard.save();
            
      } catch  {
          
          alert("Failed to send to IPFS");
      }
      
    }
    setSendingStated(false)
    //window.location.reload();

  }

  

  return (
    <>
    {/* <div className="pageIdentify" style={{'background-color': 'fae9e9','background-image': `url(${user.attributes.banner})`}}>💌</div> */}
      <div className="mainContent" style={{'background-color': 'fae9e9','background-image': `url(${user.attributes.banner})`}}>
      <div style={{'fontSize':'40px'}}>💌</div>
      <div className="cardShot"
        style={{
          width: '100%',
          padding: '20px'
        }}
        >
        <Card
          description="全世界都可以见证我们永恒的誓言"
          onClick={function noRefCheck(){}}
          setIsSelected={function noRefCheck(){}}
          title="许愿池"
          tooltipText={<span style={{width: 200}}>'把我们的点点滴滴永远记录'</span>}
        >
          <div style={{'fontSize':'30px','padding':'20px','color':'black', 'font-weight': '700'}}>
            🌌向着流星许下我们的愿望吧🌠</div>
          <div style={{'padding':'10px'}}>
          <Input
            label="许愿内容🌠"
            name="wish"
            width="100%"
            labelBgColor="aliceblue "
            onChange={(e) => setWish(e.target.value)}
          />
          </div>
          <div style={{'padding':'10px'}}>
          <Input
            label="许愿地点🌠"
            name="wishplace"
            width="100%"
            labelBgColor="aliceblue "
            onChange={(e) => setWishplace(e.target.value)}
          />
          </div>

          <div className style={{'textAlign':'center'}}>
            {selectedFile && (
                <img src={selectedFile} className="tweetImg" ></img>
            )}
          </div>
          
          
          <div className="imgDiv" onClick={onImageClick}>
                <input
                    type="file"
                    name="file"
                    ref={inputFile}
                    onChange={changeHandler}
                    style={{ display: "none"}}
                  />
                  
                  <div style={{'font-size':'40px'}}>📷</div>
                  
                  {/* <Icon fill="#1DA1F2" size={40} svg="image"></Icon> */}
          </div>

          <div className="save" onClick={()=>saveCard()}>
          发送愿望
          </div>

          {sendingd && 
            <div
              style={{
                backgroundColor: '#ECECFE',
                borderRadius: '8px',
                padding: '20px'
              }}
            >
              <Loading
                spinnerColor="#2E7DAF"
                text="UpLoading...."
              />
            </div>
          }
          
        </Card>
      </div>
       
      <div style={{'fontSize':'30px', 'padding':'30px 100px', 'font-weight': '700'}}>🌠🌌星河链🪢</div>       
        {
          wishAttr?.map((e,i)=>{
          return(
            <div>
            <div
              style={{
                width: '600px',
                'padding':'20px',
                'textAlign':'center',
                'marginLeft':'160px'
              }}
            >
              <Card
                description="点击去到ipfs"
                onClick={function GoIPFS(){
                  window.location.href=e.attributes.imgurl
                }}
                setIsSelected={function noRefCheck(){}}
                title={"这是星河链上第"+(e.attributes.wishId + 1)+"条愿望"}
                tooltipText={<span style={{width:100}}></span>}
              >
                <img src={e.attributes.imgurl} className="trendImg"></img>
                <div style={{'fontSize':'20px', 'padding':'20px', 'font-weight': '700', 'color':'black'}}>{e.attributes.wishText}</div>  
                <div style={{'fontSize':'20px', 'padding':'20px', 'font-weight': '700', 'color':'black'}}>🌌{e.attributes.wishPlace}</div>  
              </Card>
            </div>

            </div>
            
          );
        }).reverse()}
      
      </div>
          

        
      
    </>
  );
};

export default Home;
