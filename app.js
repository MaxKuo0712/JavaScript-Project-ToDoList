settingDateOption(); //網頁載入，處理日期選項

//處理Button加入列表
let section = document.querySelector("section");
let addList = document.querySelector("form button");

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
        //增加List
        let todoList = document.createElement("div");
        todoList.classList.add("todo");

        let todoText = document.createElement("p");
        todoText.classList.add("todo-text");
        todoText.innerText = addTodoText;

        let todoDate = document.createElement("p");
        todoDate.classList.add("todo-date");
        todoDate.innerText = addTodoMonth + " / " + addTodoDay;

        todoList.appendChild(todoText);
        todoList.appendChild(todoDate);
        section.appendChild(todoList);

        //建立check圖及垃圾桶圖
        let checkBotton = document.createElement("button");
        let trashBotton = document.createElement("button");

        checkBotton.classList.add("checkBotton");
        trashBotton.classList.add("trashBotton");

        checkBotton.innerHTML = '<i class="fas fa-check-square"></i>';
        trashBotton.innerHTML = '<i class="fas fa-trash-alt"></i>';

        todoList.appendChild(checkBotton);
        todoList.appendChild(trashBotton);

        //加入的放大特效
        todoList.style.animation = "scaleUp 0.3s forwards";

        //確認完成效果
        checkBotton.addEventListener("click", e => {
            let checkItem = e.target.parentElement;
            checkItem.classList.toggle("done");
        });

        //刪除效果
        trashBotton.addEventListener("click", e => {
            let deleteItem = e.target.parentElement;
            deleteItem.style.animation = "scaleDown 0.3s forwards"; //刪除的縮小特效
            // deleteItem.remove(); // 錯誤做法，因為他不會等動畫0.3秒結束才執行
            deleteItem.addEventListener("animationend", () => {
                deleteItem.remove();
            });
        });
    }
    
    //送出後清除
    todoText.value = "";
    todoMonth.value = "";
    todoDay.value = "";
});


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
