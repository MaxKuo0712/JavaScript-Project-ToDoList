settingDateOption(); //網頁載入，處理日期選項

//處理Button加入列表
let addList = document.querySelector("form button");
let section = document.querySelector("section");

loadData(); //載入localStorage資料

//按下「加入列表」的事件
addList.addEventListener("click", e => {
    e.preventDefault();

    //取得input資訊
    let form = e.target.parentElement;
    let todoText = form.children[0];
    let todoMonth = form.children[1];
    let todoDay = form.children[3];

    let addTodoText = todoText.value;
    let addTodoMonth = todoMonth.value;
    let addTodoDay = todoDay.value;

    if((addTodoText == "") || (addTodoMonth == "") || (addTodoDay == "")){
        if ((addTodoText == "")) {
            alert("請輸入內容");
            return;
        }
        if ((addTodoMonth == "")) {
            alert("請輸入月份");
            return;
        }
        if ((addTodoDay == "")) {
            alert("請輸入日期");
            return;
        }
    } else {
        //增加TodoList內容
        let todoList = document.createElement("div");
        addChildren(todoList, addTodoText, addTodoMonth, addTodoDay);

        //建立Check圖、功能及動畫
        addCheckBotton(todoList);

        //建立Trash圖、功能及動畫
        addTrashBotton(todoList);
    }

    //放入localstorage儲存
    let myTodo = {
        todoText: addTodoText,
        todoMonth: addTodoMonth,
        todoDay: addTodoDay
    }

    let getTodoList = localStorage.getItem("todoList"); //取得目前localStorage內的todoList資料

    if(getTodoList == null) {
        //如果localStorage內為null，則放入目前欲新增的todoList內容
        localStorage.setItem("todoList", JSON.stringify([myTodo]));
    } else {
        //如果localStorage內不為null，則加入目前todoList的資料
        let myListArray = JSON.parse(getTodoList); //將localStorage取得的資料轉為array取出
        myListArray.push(myTodo); //將目前欲新增的todoList資料push進array
        /**
         * localStorage.clear(); 
         * 為什麼不需要先clear後，再放入？ 
         * Ans：已被覆蓋，因為localStorage是key-value資料型態
         * key-value資料型態：鍵是唯一的，但值可以重複；若鍵重複，則前一個鍵會被覆蓋掉
         */
        localStorage.setItem("todoList", JSON.stringify(myListArray)) //將資料放入localStorage
    }
    //送出後清除
    todoText.value = "";
    todoMonth.value = "";
    todoDay.value = "";

    //按下「加入列表」後，排序現在列表的資料
    sortTodoList(); //針對localStorage進行排序
    removeDate(); //移除畫面上列表資料
    loadData(); //重新載入資料

});

//網頁載入，載入localStorage內的資料，並呈現出來
function loadData() {
    let myTodoList = localStorage.getItem("todoList");

    if (myTodoList !== null) {
        let myTodoListArray = JSON.parse(myTodoList);
    
        myTodoListArray.forEach( storageItem => {
    
            //增加TodoList內容
            let addTodoText = storageItem.todoText;
            let addTodoMonth = storageItem.todoMonth;
            let addTodoDay = storageItem.todoDay;  
            let todoList = document.createElement("div");
            addChildren(todoList, addTodoText, addTodoMonth, addTodoDay);
    
            //建立Check圖、功能及動畫
            addCheckBotton(todoList);
    
            //建立Trash圖、功能及動畫
            addTrashBotton(todoList);
        });
    }
}

//網頁載入，處理日期選項
function settingDateOption() {
    let configMonth = document.querySelector("select.month");
    let configDay = document.querySelector("select.day");

    const monthAndDay = {}; //用來記錄月與整個月天數的Hash Table: 月：key, 整個月天數：Value
    const totalMonth = 12; //總共幾個月


    for (let monthCount = 1; monthCount <= totalMonth; monthCount++) {
        //增加月份的option
        let addMonth = monthCount; //欲增加的月份
        let monthOption = document.createElement("option");
        monthOption.classList.add("monthOption");
        monthOption.value = addMonth;
        monthOption.text = addMonth.toString();
        configMonth.appendChild(monthOption);

        //2月最多只有29天
        const February = 2;
        if (monthCount == February) {
            monthAndDay[addMonth] = 29;
        }

        //Hash table加入月份對應最大日期 ex：1月有31天, 2月有28天...
        //7月與8月是分隔點，7月大8月大
        const july = 7;
        const August = 8;

        //判斷月份是大(31天)，還是小(30天)
        if (monthAndDay[addMonth] == null) {
            if (monthCount <= july) {
                if ((monthCount % 2) == 0) {
                    monthAndDay[addMonth] = 30;
                } else {
                    monthAndDay[addMonth] = 31;
                }
            } else if (monthCount >= August) {
                if ((monthCount % 2) == 0) {
                    monthAndDay[addMonth] = 31;
                } else {
                    monthAndDay[addMonth] = 30;
                }
            }
        }
    }

    //當月份被選取時，觸發日期的改變，依照選取月份，帶入當月的總天數
    configMonth.addEventListener("click", () => {

        //清除前一次的天數
        let resetDay = document.querySelectorAll(".dayOption");
        resetDay.forEach( (e) => {
            e.remove();
        });

        const dayOfMonth = monthAndDay[configMonth.value]; //取得對應的當月總天數

        //增加日期的option
        for (let dayCount = 1; dayCount <= dayOfMonth; dayCount++) {
            let addDay = dayCount;
            let dayOption = document.createElement("option");
            dayOption.classList.add("dayOption");
            dayOption.value = addDay;
            dayOption.text = addDay.toString();
            configDay.appendChild(dayOption);
        }
    });
}

//移除列表
function removeDate() {
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }
}

//新增列表
function addChildren(todoList, addTodoText, addTodoMonth, addTodoDay) {
    let todoText = document.createElement("p");
    let todoDate = document.createElement("p");

    //add HTML Tag calssName
    todoList.classList.add("todo");
    todoText.classList.add("todo-text");
    todoDate.classList.add("todo-date");

    //放入內容
    todoText.innerText = addTodoText;
    todoDate.innerText = addTodoMonth + " / " + addTodoDay;

    //新增
    todoList.appendChild(todoText);
    todoList.appendChild(todoDate);
    section.appendChild(todoList);
}

//建立Check圖、功能及動畫
function addCheckBotton(todoList) {
    let checkBotton = document.createElement("button"); //建立一個Botton
    checkBotton.classList.add("checkBotton"); //幫增加的Botton加上class
    checkBotton.innerHTML = '<i class="fas fa-check-square"></i>'; //帶入fontawesome的圖
    todoList.appendChild(checkBotton); //增加子項目

    //加入的放大特效
    todoList.style.animation = "scaleUp 0.3s forwards";

    //確認完成效果
    checkBotton.addEventListener("click", e => {
        let checkItem = e.target.parentElement;
        checkItem.classList.toggle("done");

        //Check表示已完成，會從localStorage內去除
        let dbTodoListAry = JSON.parse(localStorage.getItem("todoList"));
        dbTodoListAry.forEach( storageItem => {
            let storageTodoText = storageItem.todoText;
            let storageTodoMonth = storageItem.todoMonth;
            let storageTodoDay = storageItem.todoDay;

            if ((storageTodoText + storageTodoMonth + " / " + storageTodoDay) == checkItem.textContent) {
                dbTodoListAry.shift(storageItem);
                localStorage.setItem("todoList", JSON.stringify(dbTodoListAry));
            }
        });
    });
}

//建立Trash圖、功能及動畫
function addTrashBotton(todoList) {
    let trashBotton = document.createElement("button"); //建立一個Botton
    trashBotton.classList.add("trashBotton"); //幫增加的Botton加上class
    trashBotton.innerHTML = '<i class="fas fa-trash-alt"></i>'; //帶入fontawesome的圖
    todoList.appendChild(trashBotton); //增加子項目

    //刪除效果
    trashBotton.addEventListener("click", e => {
        let deleteItem = e.target.parentElement;

        deleteItem.style.animation = "scaleDown 0.3s forwards"; //刪除的縮小特效

        // deleteItem.remove(); // 錯誤做法，因為他不會等動畫0.3秒結束才執行
        deleteItem.addEventListener("animationend", () => {
            deleteItem.remove();

            //刪除localStorage內的資料
            let storageArry = JSON.parse(localStorage.getItem("todoList"));

            storageArry.forEach( (storageItem) => {
                let storageTodoText = storageItem.todoText;
                let storageTodoMonth = storageItem.todoMonth;
                let storageTodoDay = storageItem.todoDay;

                if( (storageTodoText + storageTodoMonth + " / " + storageTodoDay) == deleteItem.textContent) {
                    storageArry.shift(storageItem);
                    localStorage.setItem("todoList", JSON.stringify(storageArry));
                }
            });
        });
    });
}

//排序列表
function sortTodoList() {
    let localStorageTodoList = JSON.parse(localStorage.getItem("todoList"));
    localStorage.setItem("todoList", JSON.stringify(mergeSort(localStorageTodoList)));
}

//合併排序法
function mergeSort(array) {
    
    if (array.length === 1) {
        return array;
    }

    let cutNum = Math.floor(array.length / 2);
    let leftArray = array.slice(0, cutNum);
    let rightArray = array.slice(cutNum, array.length);

    return mergeSortByTime(mergeSort(leftArray), mergeSort(rightArray));
}
function mergeSortByTime(left, right) {
    let result = [];

    let leftCount = 0;
    let rightCount = 0;

    while (left.length && right.length) {
        if (Number(left[0].todoMonth) < Number(right[0].todoMonth)) {
            result.push(left.shift());
        } else if (Number(left[0].todoMonth) > Number(right[0].todoMonth)) {
            result.push(right.shift());

        } else if (Number(left[0].todoMonth) == Number(right[0].todoMonth)) {

            if (Number(left[0].todoDay) > Number(right[0].todoDay)) {
                result.push(right.shift());
                
            } else if (Number(left[0].todoDay) < Number(right[0].todoDay)) {
                result.push(left.shift());
            }
        }
    }
    // result = left.length ? result.concat(left) : result.concat(right)

    while ((leftCount < left.length) || (rightCount < right.length)) {
        if ((leftCount < left.length)) {
            result.push(left[leftCount]);
            leftCount++;
        } else if ((rightCount < right.length)) {
            result.push(right[rightCount]);
            rightCount++;
        }
    }

    return result;
}