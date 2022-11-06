const registerEmail = document.querySelector(".register_email");
const registerNickname = document.querySelector(".register_nickname");
const registerPassword = document.querySelector(".register_password");
const registerPasswordCheck = document.querySelector(".register_password_check");

const checkPassword = document.querySelector(".check_result");
const register = document.querySelector(".register_register");


registerPasswordCheck.addEventListener('keydown', entry);
function entry(e) {
    if(e.keyCode !== 13){
        return;
    }
    registerAPI();
}


// 輸入正確密碼
registerPasswordCheck.oninput = match;
function match(e){
    if(registerPassword.value === registerPasswordCheck.value){
        checkPassword.innerHTML = "";
    }else {
        checkPassword.innerHTML = "與密碼不符";
    }
}

// 送出註冊
register.addEventListener('click', registerAPI);
function registerAPI(e) {
    const emailRule =  
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (registerPassword.value !== registerPasswordCheck.value){
        alert("請輸入正確密碼")
    }
    if (registerPassword.value.length <5){
        alert("密碼需大於六個字元")
        return;
    }
    if (!emailRule.test(registerEmail.value)){
        alert("Email格式不正確")
        registerEmail.focus()
        return;
    }

    let obj = { user:{} };
    obj.user.email = registerEmail.value;
    obj.user.nickname = registerNickname.value;
    obj.user.password = registerPassword.value;

    
axios.post("https://todoo.5xcamp.us/users", obj)
     .then(function(res){
     alert(res.data.message);   
     let authorization = res.headers.authorization;
     let nickname = res.data.nickname;
     console.log(authorization)   
     console.log(nickname);
     localStorage.setItem("authorization", authorization);
     localStorage.setItem("nickname", nickname);
     location.href = "todolist.html";
    }
)
console.log(1)
}





