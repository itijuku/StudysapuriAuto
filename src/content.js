const cookieNative = document.cookie.split(";");
let cookie = []
for(c of cookieNative){
    cookie.push(c.split("="));
}

cookie = Object.fromEntries(cookie);

const token = decodeURIComponent(cookie[" qlearn_access_token"]);

let url = window.location.href;

check(url);

setInterval(function(){
    const nowUrl = window.location.href;
    if(nowUrl !== url){
        url = nowUrl;
        check(url);
    }
},100)

function check(_url){
    const urlToken = _url.split("/");

    if(urlToken.includes("questions")){ 
        const topicId = urlToken[urlToken.indexOf("questions") - 1];
        const nowQIndex = Number(urlToken[urlToken.indexOf("questions") + 1])-1;

        fetch(`https://learn.studysapuri.jp/v1/topic/${topicId}/contents?sections=true`,{
            method:"GET",
            headers:{
                "Authorization":`Token ${token}`
            }
        })
        .then(res=>res.json())
        .then(data=>getAnswer(data))
        
        function getAnswer(data){
            const localData = data["questions"][nowQIndex]["choices"];
            const arrayData = Object.entries(localData);
            let answerId = "";
            for(const a of arrayData){
                if(a[1]["correct"]){
                    answerId = a[1]["id"];
                    break;
                }
            }

            let button = document.querySelector(`button[value="${answerId}"]`);
            const checkInterval = setInterval(function(){
                button = document.querySelector(`button[value="${answerId}"]`);
                if(button){
                    clearInterval(checkInterval);
                    console.log("get button");
                    button.click();

                    setTimeout(function(){
                        const sendButton = document.querySelector(".RaisedButton--BU1aR.AnswerChoices__Button--qXmrH.btn.btn-primary--p7JPl")
                    
                        sendButton.click();

                        setTimeout(function(){
                            const nextButton = document.querySelector(".RaisedButton--BU1aR.AnswerChoices__Button--qXmrH.btn.btn-primary--p7JPl")
                        
                            nextButton.click();
                        },25)
                    },25)
                }
            },20)
        }
    }
}
