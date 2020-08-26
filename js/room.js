/* 取得元素 */
const room = document.querySelector('#room')
const submitData = document.querySelector('input[type="submit"]')
const personName = document.querySelector('#personName')
const personTel = document.querySelector('#personTel')
const checkInDate = document.querySelector('#checkInDate')
const checkOutDate = document.querySelector('#checkOutDate')
const deleteReservation = document.querySelector('#deleteReservation')

/* 定義資料 */
const token = 'Dy6L0VMd6jDv0BBEeZLsSV3CK9ebQi4uFLy6xxu7i6UWTxJtiT7grJ0uZqKn'
const hexAPI = 'https://challenge.thef2e.com/api/thef2e2019/stage6/'
let getParameter = new URL(location.href)
let roomID = getParameter.searchParams.get('roomID')
let roomData = {}
const booking = {
  name: '',
  tel: '',
  date: []
}
let selectStartDate = ''
let selectEndDate = ''



/* 日期處理 */
// 格式化日期 年-月-日
const formatDate = (selectDay) => {
  const date = new Date(selectDay)
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  let newDate = `${month}/${day}/${year}`
  return newDate
}

// 計算相差天數
const dateDiff = (start, end) => {
  let startDate = new Date(start);
  let endDate = new Date(end);
  // 把相差的毫秒數轉換為天數
  let days = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24); 
  return days;
};

// 退房日期必須 +1
const checkOutDateFn = (startDate) => {
  const date = new Date(startDate)
  date.setDate(date.getDate() + 1)
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  return `${month}/${day}/${year}`
}

// 初始化入住可選日期與退房日期
selectStartDate = checkOutDateFn(Date()) // 不能小於當日
selectEndDate = checkOutDateFn(checkOutDateFn(Date())) // 不能小於入住日
$('#checkInDate').datepicker({
  startDate: checkOutDateFn(Date()),
  endDate: '10/30/2020'
}).datepicker('update', checkOutDateFn(Date()));

$("#checkOutDate").datepicker('update', checkOutDateFn(checkOutDateFn(Date())));

// 使用者選擇訂房日期
const getCheckInData = (e) => {
  // 選擇入住日期
  selectStartDate = e.target.value
  // 變更退房日期
  // datepicker('destroy') 解除原有屬性設定
  $('#checkOutDate').datepicker('destroy')
  $('#checkOutDate').datepicker('update', checkOutDateFn(selectStartDate));
}

// 選擇退房日期
const getCheckOutData = (e) => {
  // 選擇退房日期
  selectEndDate = e.target.value

  // 變更退房日期
  $('#checkOutDate').datepicker('destroy');  
  $('#checkOutDate').datepicker({
    startDate: checkOutDateFn(selectStartDate),
    endDate: '10/31/2020'
  });  
}

// 入住與退房日期 - 陣列形式
// 相差一天 -> [入住日期, 退房日期]
// 相差兩天 -> [入住日期, 入住日期 +1, 退房日期]
const arrayDate = (selectDay, diff) => {
  const date = new Date(selectDay)
  let array = []
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  if (month < 10) {
    month = '0'+ month
  }
  if (day < 10) {
    day = '0'+ day
  }
  array.push(`${year}-${month}-${day}`)
  for(let i = 1; i <= diff ; i++){
    date.setDate(date.getDate() + 1);
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    if (month < 10) {
      month = '0'+ month
    }
    if (day < 10) {
      day = '0'+ day
    }
    array.push(`${year}-${month}-${day}`)
  }
  return array
}

/* 房型資訊 */
const getData = () => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  axios.get(hexAPI+'room/'+roomID)
      .then((res) => {
        roomsData = res.data.room[0]
        render(roomsData)
        // console.log(roomsData)
      })
}
const render = (data) => {
  // 床型暫存字串
  let tempBed = ''
  // 圖片暫存字串
  let tempImage = ''
  // 設施分類
  let hasAmenities = ['roomAmenities']
  let hasOtherService = ['otherService']
  const roomAmenities = ['Wi-Fi', 'Air-Conditioner', 'Child-Friendly', 'Mini-Bar', 'Pet-Friendly', 'Refrigerator', 'Sofa', 'Television']
  const otherService = ['Breakfast', 'Great-View', 'Smoke-Free']
  let strRoomAmenities = ''
  let strOtherService = ''
  Object.keys(data.amenities).forEach((item) => {
    // includes 回傳 true or false
    // indexOf 回傳 陣列中第幾個
    if (data.amenities[item] === true && roomAmenities.includes(item)) {
      hasAmenities.push(item)
    } else if (data.amenities[item] === true && otherService.includes(item)) {
      hasOtherService.push(item)
    }
  })
  const getStrOfAmenities = (data, type) => {
    data.forEach((item) => {
      let str = ''
      switch(item){
        case 'Wi-Fi':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">wifi</span>Wi-Fi</p>'
          break;
        case 'Air-Conditioner':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">ac_unit</span>冷氣</p>'
          break;
        case 'Breakfast':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">free_breakfast</span>附早餐</p>'
          break;
        case 'Child-Friendly':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">child_friendly</span>親子</p>'
          break;
        case 'Great-View':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">panorama</span>景觀</p>'
          break;
        case 'Mini-Bar':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">local_bar</span>Mini-Bar</p>'
          break;
        case 'Pet-Friendly':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">pets</span>寵物</p>'
          break;
        case 'Refrigerator':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">kitchen</span>冰箱</p>'
          break;
        case 'Room-Service':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">room_service</span>客房服務</p>'
          break;
        case 'Smoke-Free':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">smoke_free</span>禁菸</p>'
          break;
        case 'Sofa':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">airline_seat_recline_extra</span>沙發</p>'
          break;
        case 'Television':
          str = '<p class="d-flex align-items-center mr-2"><span class="material-icons mr-1">personal_video</span>電視</p>'
          break;
      }
      if (type === 'roomAmenities') {
        strRoomAmenities += str
      } else if (type === 'otherService') {
        strOtherService += str
      }
    })
  }
  
  // 字串處理
  getStrOfAmenities(hasAmenities, 'roomAmenities')
  getStrOfAmenities(hasOtherService, 'otherService')
  data.descriptionShort.Bed.forEach((item) => {
    tempBed += `。${item}`
  })
  data.imageUrl.forEach((item) => {
    tempImage += `
      <img src="${item}" alt="" class="custom__listImg object--fit rounded mr-3">
    `
  });

  // 房間資訊 - 字串填入
  let temp = `
    <div class="col-md-12 col-lg-4">
      <h4 class="font-weight-bold">${data.name}</h4>
    </div>
    <div class="col-md-12 col-lg-4 mb-3">
      <img src="${data.imageUrl[0]}" alt="" class="custom__img">
    </div>
    <div class="col-md-12 col-lg-4">
      <div class="d-flex flex-column justify-content-end align-items-end h-100">
        <p class="font-weight-bold">平日價格 : ${data.normalDayPrice}</p>
        <p class="font-weight-bold">價日價格 : ${data.holidayPrice}</p>
      </div>
    </div>
    <div class="col-12 mb-3 py-3 bg-light">
      ${tempImage}
    </div>
    <div class="col-12">
      <div class="row">
        <div class="col-6">
          <p class="font-weight-bold">房間設備</p>
          <div class="d-flex flex-wrap font-weight-bold">${strRoomAmenities}</div>
        </div>
        <div class="col-6">
          <p class="font-weight-bold">其他</p>
          <div class="d-flex flex-wrap font-weight-bold">${strOtherService}</div>
        </div>
      </div>
    </div>
    <div class="col-12 mb-3">
      <p class="font-weight-bold">簡介</p>
      ${data.description}
    </div>
    <div class="col-12 mb-3">
      <table class="table table-borderless">
        <tbody>
          <tr>
            <td width="250px" class="pl-0"> | 人數 : 最低 ${data.descriptionShort.GuestMin} 人、最高 ${data.descriptionShort.GuestMax} 人</td>
            <td width="150px"> | 坪數 : ${data.descriptionShort.Footage}</td>
            <td> | checkIn 時間 : 最早 ${data.checkInAndOut.checkInEarly}、最晚 ${data.checkInAndOut.checkInLate}</td>
          </tr>
          <tr>
            <td class="pl-0"> | 床型 : ${tempBed} </td>
            <td> | 獨立衛浴 : ${data.descriptionShort['Private-Bath']} 間</td>
            <td> | checkOut 時間 : ${data.checkInAndOut.checkOut}</td>
          </tr>
        </tbody>
      </table>
    </div>
    `
  room.innerHTML = temp
}

/* 預定房間 */
// 送出資料
const postData = (e) => {
  e.preventDefault()
  if (personName.value === ''){
    $('#reservationInfo').text('請填寫聯絡姓名!')
    $('#reservationModal').modal('show')
  } else if (personTel.value === '') {
    $('#reservationInfo').text('請填寫手機號碼!')
    $('#reservationModal').modal('show')
  } else if (checkInDate.value === '') {
    $('#reservationInfo').text('請選擇入住日期!')
    $('#reservationModal').modal('show')
  } else if (checkOutDate.value === '') {
    $('#reservationInfo').text('請選擇退房日期!')
    $('#reservationModal').modal('show')
  } else {
    booking.name = personName.value
    booking.tel = personTel.value 
    // 選擇的入住與退房
    booking.date = arrayDate(selectStartDate, dateDiff(selectStartDate, selectEndDate))
    // booking.date = ['2020-08-27', '2020-08-28']
    // TODO:房間只有一間，日期無法重複
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    axios.post(hexAPI+'room/' + roomID, booking)
        .then((res) => {
          console.log(res.data)
          $('#reservationInfo').text('預約成功!')
          $('#reservationModal').modal('show')
        })
  }
}

// 刪除資料
const deleteAllData = (e) => {
  e.preventDefault()
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  axios.delete(hexAPI + 'rooms')
      .then(() => {
        $('#reservationInfo').text('已取消所有預約，歡迎再次預約~') 
        $('#reservationModal').modal('show')
      })
}

/* 執行與監聽 */
getData()

// jQuery寫法
$("#checkInDate").on('focus', getCheckInData)
$("#checkOutDate").on('mousedown', getCheckOutData)

// 原始監聽寫法
submitData.addEventListener('click', postData)
deleteReservation.addEventListener('click', deleteAllData)