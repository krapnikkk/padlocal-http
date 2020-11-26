import axios from "axios";
const MessageHandler = {
    postUrl: "",
    post: (message: object) => {
        if (MessageHandler.postUrl) {
            axios.post(MessageHandler.postUrl, message)
              .then( ()=>{
                
              })
              .catch( (e:Error)=> {
                console.log(e.message);
              });
        }
    }
}

export default MessageHandler;