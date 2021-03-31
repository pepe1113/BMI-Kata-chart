// 本班總計 350 人，請用圓餅圖顯示，「已完成」、「未完成」BMI kata 的比例
// 請用折線圖顯示每天各有幾人投稿，或是觀看老師範例程式碼，討論細節
// 魔王題： 每組差不多都是 10 人，請顯示全部 27 組 Gauge Chart 圖的任務達成率，Code 力求精簡
// 魔王題： 請用長條圖，修改 x 軸單位為組別編號，顯示各組投稿人數

let data = [];
axios.get('https://raw.githubusercontent.com/hexschool/js-traninging-week6API/main/data.json')
    .then(function(response) {
        data = response.data;
        completePie(data)
        dailyPeople(data)

        renderGroup(data)
        renderGauge()
        renderBar()
    })

//完成比例圓餅圖
function completePie(arr) {
    var chart = c3.generate({
        bindto: '.completeC3',
        data: {
            columns: [
                ['完成', arr.length],
                ['未完成', 350 - arr.length],
            ],
            type: 'pie',
        }
    });
}

//每日完成人數線條圖
let dailyTotalArr = ['每日完成人數']
let dateArr

function dailyPeople(arr) {
    //{2021/3/10:2, 2021/3/11:3...}
    let dailyNum = {}
    arr.forEach(function(item, index) {
        let arr = item.timestamp.split(' ')
        if (dailyNum[arr[0]] == undefined) {
            dailyNum[arr[0]] = 1
        } else {
            dailyNum[arr[0]] += 1
        }
    })

    //['x',2,3,4,5...]
    dateArr = Object.keys(dailyNum)
    dateArr.forEach(function(item, index) {
        dailyTotalArr.push(dailyNum[item])
    })
    dateArr.unshift('x')
    timeseries()
}
//線條圖C3設定
function timeseries() {
    var chart = c3.generate({
        bindto: '.dailyTotalC3',
        data: {
            x: 'x',
            xFormat: '%Y/%m/%d',
            columns: [dateArr, dailyTotalArr]
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            }
        }
    });
}

// Gauge Chart 圖的任務達成率
//[['第1組',80],...]
let groupData = {}
let groupSuccessArr = []
let groupArr


function renderGroup(arr) {
    arr.forEach(function(i) {
        if (i.jsGroup !== '未分組') {
            if (groupData[i.jsGroup] == undefined) {
                groupData[i.jsGroup] = 1
            } else {
                groupData[i.jsGroup] += 1
            }
        }
    })

    groupArr = Object.keys(groupData)
    groupArr.forEach(function(i) {
        let arr = [i, (groupData[i] / 10) * 100]
        groupSuccessArr.push(arr)
    })
}

function renderGauge() {
    const successRate = document.querySelector('.successRate')
    successRate.innerHTML = ''
    groupSuccessArr.forEach(function(i) {
        successRate.innerHTML += `
        <li>
        <h3>第${i[0]}組任務達成率</h3>
        <div class="successRate${i[0]}"></div>
        </li>`
        setTimeout(() => {
            gauge(i[0], i[1]);
        })
    })

}

function gauge(group, rate) {
    var chart = c3.generate({
        bindto: `.successRate${group}`,
        data: {
            columns: [
                [`第${group}組`, rate]
            ],
            type: 'gauge',
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        size: {
            width: 200
        }
    });
}

let barData = []
let barX = []

function renderBar() {
    barData.push('投稿人數')
    barX.push('x')
    groupArr.forEach(function(i, index) {
        barData.push(groupData[i])
        barX.push(`第${i}組`)
    })
    bar()
}

function bar() {
    var chart = c3.generate({
        bindto: '.groupSuccessNum',
        data: {
            x: 'x',
            columns: [barX, barData],
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category'
            }
        },
        bar: {
            width: {
                ratio: 0.4
            }
        },
        color: { pattern: ['#ffbb78'] }
    });
}