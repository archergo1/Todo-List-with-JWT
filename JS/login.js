const { default: axios } = require("axios");

const loginEmail = document.querySelector(".login_mail");
const loginPassword = document.querySelector(".login_password");
const loginConfirm = document.querySelector(".login_confirm");

let authorization = localStorage.getItem("authorization");
let nickname =localStorage.getItem("nickname");

loginPassword.addEventListener('keydown', enter)
function enter(e){
    if(e.keyCode !== 13){
        return;
    }
    login()
}

init()
function init(){
    if(authorization!==null || nickname!==null){
        location.href ="todolist.html";
        // 如果登入成功，則可以導到todolist page
    }
    else { return; }
}


loginConfirm.addEventListener('click', login);
function login(){
    let obj = {
        user:{}
    };

    obj.user.email = loginEmail.value;
    obj.user.password = loginPassword.value;
      if(obj.user.email ==""|| obj.user.password ==""){
        alert("請輸入正確資訊")
        return;
        }
    axios
        .post('https://todoo.5xcamp.us/users/sign_in', obj)
        .catch(function(error){
            alert(error.response.data.message);
            return;
        })
        .then(function(response){
            alert(response.data.message);
            
            localStorage.setItem("authorization", authorization);
            localStorage.setItem("nickname", nickname);
            location.href = "todolist.html";
        })
}
