﻿var tyH = document.querySelector('.typeHeight');
var tyW = document.querySelector('.typeWeight');
var tyN = document.querySelector('.typeName');
var pus = document.querySelector('#push');
var uni = document.querySelector('.unit');
var rel = document.querySelector('.reload');
var res = document.querySelector('.result');
var des = document.querySelector('.description');
var ans = document.querySelector('.answer');
var lis = document.querySelector('.list');



//107.12.25
//firebase
var config = {
  // 請輸入你的 config
  apiKey: "AIzaSyDo_M9xiNmJeWxcJhsElfeJ2PSbI7Hp-HQ",
  authDomain: "project-cf76e.firebaseapp.com",
  databaseURL: "https://project-cf76e.firebaseio.com",
  projectId: "project-cf76e",
  storageBucket: "project-cf76e.appspot.com",
  messagingSenderId: "56584802778"
};
firebase.initializeApp(config);
var bmiCalculator = firebase.database().ref('bmiCalculator');
var memo = [];
var memoKey = [];
//107.12.25

//將按鈕變回送出
function reType() {
  uni.setAttribute('style', 'display:none');
  rel.setAttribute('style', 'display:none');
  des.setAttribute('style', 'display:none');
  ans.textContent = '看結果';
  pus.setAttribute('class', 'send');
  pus.setAttribute('style', 'border:');
  ans.setAttribute('style', 'font-size: 20px');
}

//將按鈕變成重整
function reSult() {
  uni.setAttribute('style', 'display:');
  rel.setAttribute('style', 'display:');
  des.setAttribute('style', 'display:');
  pus.setAttribute('class', 'result');
  ans.setAttribute('style', 'font-size: 30px');
}

//總運作
function typeandprintResult(e) {

  //檢查輸入是否為空
  if (tyH.value.length == 0 ||
    tyW.value.length == 0 ||
    tyN.value.length == 0) {
    alert('尚有值未輸入');
    return;
  }
  //檢查輸入是否為負數、0、或是文字
  else if (tyH.value <= 0 ||
    isNaN(parseFloat(tyH.value)) == true ||
    isFinite(parseFloat(tyH.value)) == false ||
    tyW.value <= 0 ||
    isNaN(parseFloat(tyW.value)) == true ||
    isFinite(parseFloat(tyW.value)) == false) {
    alert('輸入錯誤，請重新輸入');
    tyH.value = '';
    tyW.value = '';
    return;
  }
  else if (tyN.value.length > 4) {
    alert('名字太長，請重新輸入(4個字以內)');
    tyN.value = '';
    return;
  }
  else {
    if (ans.textContent == '看結果') {
      //按扭轉換
      reSult();
      //顯示結果&存入陣列
      memo.push(judgeColor(parseFloat((tyH.value) / 100), parseFloat(tyW.value), tyN.value));
      console.log(memo);
      //107.12.25
      //存入firebase
      bmiCalculator.push(judgeColor(parseFloat((tyH.value) / 100), parseFloat(tyW.value), tyN.value));
      //107.12.25
    }
    else if (e.path[1].className == 'reload' || e.path[0].className == 'reload') {
      //按扭轉換
      reType();
      //新增列表
      renewList();
      //輸入歸零
      tyH.value = '';
      tyW.value = '';
      tyN.value = '';
    }

  }
}

//判斷結果
function judgeColor(height, weight, name) {
  var bmi = (weight / (height * height)).toFixed(2);
  var time = new Date();
  var color = '';
  var description = '';

  if (bmi <= 15) {
    color = 'rgb(7, 52, 252)';
    description = '紙片人';
  }
  else if (bmi > 15 && bmi <= 16) {
    color = 'rgb(6, 116, 241)';
    description = '骨瘦如柴';
  }
  else if (bmi > 16 && bmi <= 18.5) {
    color = 'rgb(14, 203, 250)';
    description = '有點輕';
  }
  else if (bmi > 18.5 && bmi <= 25) {
    color = 'greenyellow';
    description = '正常';
  }
  else if (bmi > 25 && bmi <= 30) {
    color = 'rgb(232, 248, 4)';
    description = '發福';
  }
  else if (bmi > 30 && bmi <= 35) {
    color = 'rgb(252, 144, 2)';
    description = '該減肥了';
  }
  else if (bmi > 35 && bmi <= 40) {
    color = 'rgb(247, 32, 3)';
    description = '很肥';
  }
  else {
    color = 'rgb(247, 4, 214)';
    description = '肥到沒救';
  }

  changeColor(color);
  ans.textContent = bmi;
  des.textContent = description;
  return {
    color: color,
    description: description,
    bmi: bmi,
    weight: weight,
    height: height,
    day: time.getDate(),
    month: time.getMonth() + 1,
    year: time.getFullYear(),
    hours: time.getHours(),
    minutes: time.getMinutes(),
    name: name
  };
}


//改顏色
function changeColor(color) {
  rel.setAttribute('style', 'background:' + color);
  uni.setAttribute('style', 'color:' + color);
  des.setAttribute('style', 'color:' + color);
  ans.setAttribute('style', 'color:' + color);
  pus.setAttribute('style', 'border:5px solid ' + color);
}


//新增記錄
function renewList() {
  lis.innerHTML = '';


  //107.12.25
  //firebase
  memo = [];
  bmiCalculator.once('value', function (snapshot) {
    snapshot.forEach(function (item) {
      memo.push(item.val());
    })
    console.log(Object.keys(snapshot.val()));
    memoKey = Object.keys(snapshot.val());
    for (var i = 0; i < memo.length; i++) {
      memo[i].key = memoKey[i];
    }
    memo.reverse();

    memo.forEach(function (value, i) {
      var str = document.createElement('li');

      str.innerHTML = '<p>' + value.description + '</p><span>BMI</span><p>' +
        value.bmi + '</p><span>體重</span><p>' +
        value.weight + 'kg</p><span>身高</span><p>' +
        value.height + 'm</p><span>名字</span><p>' +
        value.name + '</p><span class="time">' +
        value.month + '-' + value.day + '-' + value.hours + ':' + value.minutes + '-' + value.year +
        '</span><div data-num="' + i + '"><img data-num="' + i + '" src="images/icons_loop.png" alt=""></div>';

      str.setAttribute('data-key', value.key);
      str.setAttribute('style', 'border-left:5px solid ' + value.color);
      lis.appendChild(str);
    });
  })
  //107.12.25


}


//刪除
function deLete(e) {
  var str = e.target.nodeName;
  var vit = e.target.dataset.num;
  if (str !== 'DIV' && str !== 'IMG') {
    return;
  }
  var key = e.path[2].dataset.key;
  bmiCalculator.child(key).remove();
  memo.splice(vit, 1);
  var key = e.target.dataset.num;
  bmiCalculator.child(key).remove();
  renewList();
}

renewList();

//監聽按下送出
pus.addEventListener('click', typeandprintResult);

//監聽刪除
lis.addEventListener('click', deLete);