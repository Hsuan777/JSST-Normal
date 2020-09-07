/* 取得元素 */
const roomInfo = document.querySelector('#roomInfo')
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
let bookingData = []
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
  endDate: '10/30/2020',
  // TODO:傳回來的資料若有預定資訊，則不能預約該日
  datesDisabled:['08/31/2020']
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
        bookingData = res.data.booking
        render(roomsData)
        renderBooking(bookingData)
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
    tempBed += `${item}`
  })
  data.imageUrl.forEach((item, index) => {
    if (index !== 0) {
      tempImage += `
        <img src="${item}" alt="" class="custom__roomImg__secondary object--fit">
      `
    }
  });

  // 房間資訊 - 字串填入
  let tempImages = `
    <div class="col-12 mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="d-flex align-items-center">
          <span class="badge badge-pill badge-danger mr-3">HOT</span>
          <span class="font-weight-bold"> 房型名稱 : ${data.name} </span>
        </h4>
        <button type="button" class="btn btn-primary px-4 py-1">預訂</button>
      </div>
    </div>
    <div class="col-md-12 col-lg-7">
      <img src="${data.imageUrl[0]}" alt="" class="custom__roomImg__primary object--fit">
    </div>
    <div class="col-md-12 col-lg-5">
      <div class="d-flex flex-column justify-content-between h-100">
      ${tempImage}
      </div>
    </div>`
    
  let temp = `
    <div class="col-md-12 col-lg-4 ml-auto mb-5">
      <div class="d-flex flex-column justify-content-end align-items-end">
        <h3 class="demarcation demarcation__price font-weight-bold text-secondary mb-5">總價 NT. ${data.normalDayPrice}</h3>
      </div>
      <div class="row demarcation demarcation__services text-secondary">
        <div class="col-6">
          <p class="font-weight-bold">房間設備</p>
          <div class="d-flex flex-column ">${strRoomAmenities}</div>
        </div>
        <div class="col-6">
          <p class="font-weight-bold">其他</p>
          <div class="d-flex flex-column">${strOtherService}</div>
        </div>
      </div>
    </div>
    
    <div class="col-12 mb-3">
      <div class="row">
        <div class="col-8">
          <p class="text-black-50 mb-5 pb-5"> ${data.description}</p>
          <div class="d-flex justify-content-between align-items-center position-relative mb-5">
            <p class="nowrap mb-0">checkIn 時間</p>
            <div class="progress w-75">
              <div class="progress-bar bg-transparent" role="progressbar" style="width: 62.5%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
              <div class="progress-bar bg-primary" role="progressbar" style="width: 16.66%" aria-valuenow="16.66" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <p class="custom__checkInEarly">
              <span class="custom__popovers text-center d-block">${data.checkInAndOut.checkInEarly}</span>
            </p>
            <p class="custom__checkInLate">
              <span class="custom__popovers text-center d-block">${data.checkInAndOut.checkInLate} </span>
            </p>
          </div>
          <div class="d-flex justify-content-between align-items-center position-relative">
            <p class="nowrap  mb-0">checkOut 時間</p>
            <div class="progress w-75">
              <div class="progress-bar bg-third" role="progressbar" style="width: 41.6%" aria-valuenow="41.6" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <p class="custom__checkOut">
              <span class="custom__popovers text-center d-block">${data.checkInAndOut.checkOut}</span>
            </p>
          </div>
        </div>
        <div class="col-4">
          <ul class="bg-secondary text-white py-3">
            <li class="mb-3"> 床型 : ${tempBed}</li>
            <li class="mb-3"> 人數 : 最低 ${data.descriptionShort.GuestMin} 人、最高 ${data.descriptionShort.GuestMax} 人</li>
            <li class="mb-3"> 獨立衛浴 : ${data.descriptionShort['Private-Bath']} 間</li>
            <li class="mb-3"> 坪數 : ${data.descriptionShort.Footage}</li>
            <li class="mb-3"> 假日(五~日)價格：${data.holidayPrice}</li>
            <li class="mb-3"> 平日(一~四)價格：${data.normalDayPrice}</li>
          </ul>
        </div>
      </div>
    </div>
    `
  $('#roomImages').html(tempImages)
  roomInfo.innerHTML = temp
}

// TODO:所有預約列表
const renderBooking = (data) => {
  let temp = ''
  // let newArray = []
  let personTel = [...(new Set(data.map((item)=> item.tel)))]
  console.log(personTel)
  // data.forEach(item => {
  //   let hasBooking = {
  //     name: '',
  //     date: []
  //   }
  //   if (item.tel)
  // })

  data.forEach((item) => {
    let str = `<li>${item.name} ${item.date}</li>`

    temp += str
  })
  $('#bookingData').html(temp)
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
    // TODO:房間只有一間，日期無法重複
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    axios.post(hexAPI+'room/' + roomID, booking)
        .then((res) => {
          console.log(res.data)
          $('#reservationInfo').text('預約成功!')
          // TODO:booking成功，會取回該預訂者資訊
          let tempBooking = ``
          $('hasBooking').text(tempBooking)
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