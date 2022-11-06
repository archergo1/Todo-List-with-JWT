// 參考自https://www.youtube.com/watch?v=HEc1oM_a9JU&t=4296s
// 以及https://ithelp.ithome.com.tw/articles/10281200


// const apiUrl = "https://todoo.5xcamp.us/todos";
const authorization = localStorage.getItem('authorization');
const nickname = localStorage.getItem('nickname');
const name1 = document.querySelector('.nickname')
const signOut = document.querySelector('.sign_out');

name1.innerHTML = nickname

// 登出功能
signOut.addEventListener('click', out);
function out(e){
  e.preventDefault();
  localStorage.removeItem('authorization');
  localStorage.removeItem('nickname');
  location.href = 'index.html';
}

checkLocal();
function checkLocal() {
  if(authorization == null || nickname == null){
    location.href = 'index.html';
  }
  start();
}

function start(){
  axios
    .get(apiUrl, {headers: {authorization} })
    .then(function(response){
      todoData = response.data.todos;

    })
}


// 1. add new todo items
const inputText = document.querySelector(".inputText");
const addBtn = document.querySelector(".addBtn");
// 用來承接新增的資料
let todoData = [];

axios.get(apiUrl).
  then(function (response) {
  console.log(response);
  todoData = response.data;
  updateList();
});

// addBtn.addEventListener("click", addTodo);
// function addTodo() {
//   let todo = {
//     txt: inputText.value,
//     id: new Date().getTime(),
//     checked: "",
//   };

//   if (todo.txt != "") {
//     todoData.unshift(todo);
//     inputText.value = "";
//   }
//   updateList();
// }

addBtn.addEventListener('click', addTodo);
function addTodo() {
  let todo = {
    txt: inputText.value,
    id: new Date().getTime(),
    checked: '',
  };
  if (todo.txt != '') {
    todoData.unshift(todo);
    inputText.value = '';
  }
  axios.post(apiUrl, todo)
       .then(function (response) {
        axios.get(apiUrl)
          .then(function (response) {
          console.log(response.data);
          data = response.data;  
      })
    })

  updateList();
}

// 1.5 use "Enter" to submit new todo items
inputText.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    addTodo();
  }
});

// 2. render
// const todoList = document.querySelector("#todoList");
// // console.log(todoList);
// function render(arr) {
//   let str = "";
//   arr.forEach((item) => {
//     console.log(item);
//     str += `<li data-id = "${item.id}">
//               <label for="" class="checkbox">
//                 <input type="checkbox" ${item.checked}/>
//                 <span>${item.txt}</span>
//               </label>
//               <a href="#" class="delete"></a>
//         </li>`;
//   });

//   todoList.innerHTML = str;
// }

const todoList = document.getElementById('todoList');
function render(arr) {
  let str = '';
  arr.forEach((i) => {
    str += `
    <li data-id="${i.id}">
            <label class="checkbox" for="">
              <input type="checkbox" ${i.checked}/>
              <span>${i.txt}</span>
            </label>
            <a href="#" class="delete"></a>
          </li>
    `;
  });
  todoList.innerHTML = str;
}

// 3. tab alternation (css style)
// const tab = document.getElementById("tab");
// tab.addEventListener("click", changeTab);
// let toggleStatus = "all";
// function changeTab(e) {
//   toggleStatus = e.target.dataset.tab;

//   let tabs = document.querySelectorAll("#tab li");
//   tabs.forEach(function (item) {
//     item.classList.remove("active");
//   });
//   e.target.classList.add("active");
//   updateList();
// }

const tab = document.getElementById('tab');
let toggleStatus = 'all';
tab.addEventListener('click', changeTab);
function changeTab(e) {
  toggleStatus = e.target.dataset.tab;

  let tabs = document.querySelectorAll('#tab li');
  tabs.forEach((i) => {
    i.classList.remove('active');
  });
  e.target.classList.add('active');
  updateList();
}

//  4. delete single item and alter "checked" status
// todoList.addEventListener("click", deleteAndChecked);
// function deleteAndChecked(e) {
//   // 選取點到的元件最近id;
//   let id = e.target.closest("li").dataset.id;
//   // 刪除功能
//   if (e.target.classList.value == "delete") {
//     e.preventDefault();
//     todoData = todoData.filter(function (item) {
//       item.id != id;
//     });
//   } else {
//     // 切換checked狀態功能
//     todoData.forEach((item, index) => {
//       if (item.id == id) {
//         if (todoData[index].checked == "checked") {
//           todoData[index].checked = "";
//         } 
//         else {
//           todoData[index].checked = "checked";
//         }
//       }
//     });
//   }
//   updateList();
// }

todoList.addEventListener('click', deleteAndChecked);
function deleteAndChecked(e) {
  let id = e.target.closest('li').dataset.id;
  // console.log(id)
  if (e.target.classList.value == 'delete') {
    e.preventDefault();
    todoData = todoData.filter((i) => i.id != id);
    // 刪除 server 端資料
    axios.delete(`https://fathomless-brushlands-42339.herokuapp.com/todo2/${id}`)
          .then(function (res) {
            console.log(res.data);
          })

  } else {
    // 切換勾選狀態
    todoData.forEach((i, index) => {
      if (i.id == id) {
        if (todoData[index].checked == 'checked') {
          todoData[index].checked = '';
        axios.patch(`https://fathomless-brushlands-42339.herokuapp.com/todo2/${id}`, todoData[index])
              .then(function (res) {
                console.log(res.data);
              })
        } else {
          todoData[index].checked = 'checked';
          axios.patch(`https://fathomless-brushlands-42339.herokuapp.com/todo2/${id}`, todoData[index])
          .then(function (res) {
            console.log(res.data);
          })          
        }
      }
    });
  }
  updateList();
}


// 5. update todo list
// function updateList() {
//   let showData = [];
//   if (toggleStatus == "all") {
//     showData = todoData;
//   } else if (toggleStatus == "work") {
//     showData = todoData.filter(function (item) {
//       item.checked == "";
//     });
//   } else {
//     showData = todoData.filter(function (item) {
//       item.checked == "checked";
//     });
//   }

//   const workNum = document.getElementById("workNum");
//   let todoLength = todoData.filter((item) => item.checked == "");
//   workNum.textContent = todoLength.length;

//   render(showData);
// }

function updateList() {
  let showData = [];
  if (toggleStatus == 'all') {
    showData = todoData;
  } else if (toggleStatus == 'work') {
    showData = todoData.filter((i) => i.checked == '');
  } else {
    showData = todoData.filter((i) => i.checked == 'checked');
  }

  const workNum = document.getElementById('workNum');
  let todoLength = todoData.filter((i) => i.checked == '');
  workNum.textContent = todoLength.length;

  render(showData);
}


// init
updateList();


// 6. clear done items
// const deleteBtn = document.getElementById("deleteBtn");
// deleteBtn.addEventListener("click", function (e) {
//   e.preventDefault();
//   todoData = todoData.filter(function (item) {
//     item.checked != "checked";
//   });
//   updateList();
// });

const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', function (e) {
  e.preventDefault();
  todoData = todoData.filter((i) => i.checked != 'checked');
  todoData.forEach(function(item){
    let id = item.id;
    console.log(id)
  //   axios.delete(`https://fathomless-brushlands-42339.herokuapp.com/todo2/${id}`)
  // .then(function (res) {
  //   console.log(res.data);
  // })
  })
  
  updateList();
});














// 最後清空已完成的部分，做不出更新伺服器的功能，所以重新整理後，會回傳被清掉的已完成
//  好奇怪！ 清除功能時好時壞......，不知道是哪裡出了問題 
