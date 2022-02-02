settingDateOption();

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
    monthOption.value = addMonth;
    monthOption.text = addMonth.toString();
    configMonth.appendChild(monthOption);

    //2月最多只有29天
    const February = 2;
    if (month == February) {
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
    
    configDay.replaceChildren(); //清除前一次的天數

    //加入預設詞
    let dayFirstOption = document.createElement("option");
    dayFirstOption.value = "";
    dayFirstOption.text = "請選擇日期";
    configDay.appendChild(dayFirstOption);

    const dayOfMonth = monthAndDay[configMonth.value]; //取得對應的當月總天數
    
    //增加日期的option
    for (let dayCount = 1; dayCount <= dayOfMonth; dayCount++) {
        let addDay = dayCount;
        let dayOption = document.createElement("option");
        dayOption.value = addDay;
        dayOption.text = addDay.toString();
        configDay.appendChild(dayOption);
    }
});
}
