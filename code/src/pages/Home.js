import React from "react";
import "./Home.css";
import { useState, useRef} from "react";
import { defaultImgs } from "../defaultimgs";
import {TextArea, Icon, Card, Illustration, Form, Checkbox, Loading} from "web3uikit";
import { Button, Container } from "react-bootstrap";
import CardsFeed from "../components/CardsFeed";
import {useMoralis, useWeb3ExecuteFunction} from "react-moralis"
import TweetData from "../contractABIs/Tweets.json";
import html2canvas from "html2canvas";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

const Home = () => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [theFile, setTheFile] = useState();
  const [tweet, setTweet] = useState();
  const [sendingd, setSendingStated] = useState(false);

  const {Moralis} = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const user = Moralis.User.current();

  const onImageClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const imgBlob = new Blob([u8arr], { type: mime });
    return new File([imgBlob], 'test', {type:mime});
  }

  async function saveCard(e) {
    setSendingStated(true)
    console.log(e)
    const n = document.getElementsByClassName("cardShot")[0];

    if(e.data[5].inputResult === "onChain") {
      alert("!!")
      html2canvas(n).then( async canvas => {
        const imgUrl = canvas.toDataURL();
        const imgFile = dataURLtoBlob(imgUrl);
        //获取截图base64 
        console.log(imgFile);
        if(user.attributes.ptoken) {
          const client = new Web3Storage({ token: user.attributes.ptoken });
          const rootCid = await client.put([imgFile]);
          console.log(rootCid)
          const LoveTrans = Moralis.Object.extend("LoveTrans");
          const newTran = new LoveTrans();
          newTran.set("tranAcc", user.attributes.ethAddress);
          newTran.set("ipfslink", "https://"+rootCid+".ipfs.dweb.link")
          newTran.set("title", e.data[1].inputResult)
          await newTran.save();
        }else {
          alert("请先设置Token")
          return;
        }
        
      });
    }

    const LoveCards = Moralis.Object.extend("LoveCards");
    
    const newCard = new LoveCards();
    // console.log(e.data[0].inputResult);
    newCard.set("feelingImg", e.data[0].inputResult);
    newCard.set("feeling", e.data[1].inputResult);
    newCard.set("location", e.data[2].inputResult);
    newCard.set("cardDate", e.data[3].inputResult);
    newCard.set("cardTxt", e.data[4].inputResult);
    newCard.set("saveWay", e.data[5].inputResult);
    newCard.set("carderAcc", user.attributes.ethAddress);

    if(theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      newCard.set("cardImg", file.ipfs());
    }

    await newCard.save();
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
          description="You And Me = World"
          onClick={function noRefCheck(){}}
          setIsSelected={function noRefCheck(){}}
          title="爱情卡片"
          tooltipText={<span style={{width: 200}}>'把我们的点点滴滴永远记录'</span>}
        >
          {/* <div>
            <Illustration
              height="180px"
              logo="servers"
              width="100%"
            />
          </div> */}
          <Form
            buttonConfig={{
              //onClick: saveCard,
              theme: 'primary'
            }}
            data={[

              {
                name: '心情',
                selectOptions: [
                  {
                    id: '😀',
                    label: '😀'
                  },
                  {
                    id: '😎',
                    label: '😎'
                  },
                  {
                    id: '😄',
                    label: '😄'
                  },
                  {
                    id: '🥰',
                    label: '🥰'
                  },
                  {
                    id: '😜',
                    label: '😜'
                  },
                  {
                    id: '🤨',
                    label: '🤨'
                  },
                  {
                    id: '🤤',
                    label: '🤤'
                  },
                ],
                type: 'select',
                value: '🥰',
                validation: {
                  required: true
                }
              },

              {
                inputWidth: '100%',
                name: '标题💞',
                type: 'text',
                value: '',
                validation: {
                  required: true
                },
              },
              {
                inputWidth: '100%',
                name: '地点🗺️',
                type: 'text',
                value: '',
                validation: {
                  required: true
                },
              },
              {
                name: '日期⏳',
                type: 'date',
                value: '',
                validation: {
                  required: true
                },
              },
              {
                inputWidth: '100%',
                name: '说点什么吧💌',
                type: 'textarea',
                validation: {
                  required: true
                },
                value: '说点什么吧🥰',
                validation: {
                  required: true
                },
              },

              {
                name: '保存方式🎫',
                selectOptions: [
                  {
                    id: 'online',
                    label: 'onLine'
                  },
                  {
                    id: 'onchain',
                    label: 'onChain'
                  },
                ],
                type: 'select',
                value: '',
                validation: {
                  required: true
                },
              },
              
            ]}

            onSubmit={saveCard}
            title="记录我们的爱情卡片💓📔"
          />

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
       
      
       

        <CardsFeed profile={false}/>
      </div>
    </>
  );
};

export default Home;
