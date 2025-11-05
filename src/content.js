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
            let type = "";
            if(Array.isArray(data["questions"])){
                console.log(nowQIndex)
                type = data["questions"][0]["answer_type"];
            }else{
                type = data["questions"]["answer_type"];
            }

            console.log(type)
            if(type !== "grouped_choices"){
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
                            },35)
                        },35)
                    }
                },25)
            }else{
                const localData = data["questions"];
                let answerId = [];
                for(const lq of localData[nowQIndex]["choices"]){
                    if(lq["correct"]){
                        answerId.push(lq["id"]);
                        console.log(lq["id"],lq["body"][0]["text"]);
                    }
                }

                let ultag = document.querySelector(".QuizChoiceList--iW4vr");

                const getUltag = setInterval(function(){
                    ultag = document.querySelector(".QuizChoiceList--iW4vr");

                    if(ultag){
                        clearInterval(getUltag);
                        ultag = ultag.querySelectorAll("li");
                        get();
                        async function get() {
                            for(const li of ultag){
                                console.log(li)
                                const button1 = li.querySelector("button");
                                button1.click();
                                await new Promise(resolve => setTimeout(resolve, 20));
                                const wrapper = document.querySelector(".QuizDropdown__Menu--EPeAX.dropdown-menu--N1V_1.show--QuX7k");
                                const buttons = wrapper.querySelectorAll("button");
                                for(const b of buttons){
                                    if(answerId.includes(b.value)){
                                        b.click();
                                        break;
                                    }
                                }
                            }

                            const sendButton = document.querySelector(".RaisedButton--BU1aR.AnswerChoices__Button--qXmrH.btn.btn-primary--p7JPl")                        
                            sendButton.click();
                            await new Promise(resolve => setTimeout(resolve, 50));

                            const nextButton = document.querySelector(".RaisedButton--BU1aR.AnswerChoices__Button--qXmrH.btn.btn-primary--p7JPl")
                            nextButton.click();

                            await new Promise(resolve => setTimeout(resolve, 50));

                            const nextButton2 = document.querySelector(".RaisedButton--BU1aR.AnswerChoices__Button--qXmrH.btn.btn-primary--p7JPl")
                            nextButton2.click();

                            await new Promise(resolve => setTimeout(resolve, 25));
                        }
                    }
                })
            }
        }
    }
}
