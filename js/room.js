/* 取得元素 */
const room = document.querySelector('#room')

/* 定義資料 */
const token = 'Dy6L0VMd6jDv0BBEeZLsSV3CK9ebQi4uFLy6xxu7i6UWTxJtiT7grJ0uZqKn'
const hexAPI = 'https://challenge.thef2e.com/api/thef2e2019/stage6/'
let getParameter = new URL(location.href)
let roomID = getParameter.searchParams.get('roomID')
let roomData = {}
const getData = () => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  axios.get(hexAPI+'room/'+roomID)
      .then((res) => {
        roomsData = res.data.room[0]
        render(roomsData)
        console.log(roomsData)
      })

}
const render = (data) => {
  // 字串處理
  let tempBed = ''
  let tempImage = ''
  let hasAmenities = []
  let strAmenities = ''
  Object.keys(data.amenities).map((item) => {
    if (data.amenities[item] === true) {
      hasAmenities.push(item)
    }
  })
  hasAmenities.forEach((item) => {
    let str = ''
    switch(item){
      case 'Wi-Fi':
        str = '<span class="material-icons">wifi</span>'
        break;
      case 'Air-Conditioner':
        str = '<span class="material-icons">ac_unit</span>'
        break;
      case 'Breakfast':
        str = '<span class="material-icons">free_breakfast</span>'
        break;
      case 'Child-Friendly':
        str = '<span class="material-icons">child_friendly</span>'
        break;
      case 'Great-View':
        str = '<span class="material-icons">panorama</span>'
        break;
      case 'Mini-Bar':
        str = '<span class="material-icons">local_bar</span>'
        break;
      case 'Pet-Friendly':
        str = '<span class="material-icons">pets</span>'
        break;
      case 'Refrigerator':
        str = '<span class="material-icons">kitchen</span>'
        break;
      case 'Room-Service':
        str = '<span class="material-icons">room_service</span>'
        break;
      case 'Smoke-Free':
        str = '<span class="material-icons">smoke_free</span>'
        break;
      case 'Sofa':
        str = '<span class="material-icons">airline_seat_recline_extra</span>'
        break;
      case 'Television':
        str = '<span class="material-icons">personal_video</span>'
        break;
    }
    strAmenities += str
  })
  data.descriptionShort.Bed.forEach((item) => {
    tempBed += `。${item}`
  })
  data.imageUrl.forEach((item) => {
    tempImage += `
      <img src="${item}" alt="" class="custom__listImg object--fit rounded mr-3">
    `
  });

  // 字串填入
  let temp = `
    <div class="col-4">
      <h4 class="font-weight-bold">${data.name}</h4>
    </div>
    <div class="col-4 mb-3">
      <img src="${data.imageUrl[0]}" alt="" class="custom__img">
    </div>
    <div class="col-4">
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
          <p class="font-weight-bold">${strAmenities}</p>
        </div>
        <div class="col-6">
          <p class="font-weight-bold">其他</p>
          
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

getData()
