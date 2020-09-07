/* 取得元素 */
const rooms = document.querySelector('#rooms')

/* 定義資料 */
const token = 'Dy6L0VMd6jDv0BBEeZLsSV3CK9ebQi4uFLy6xxu7i6UWTxJtiT7grJ0uZqKn'
const hexAPI = 'https://challenge.thef2e.com/api/thef2e2019/stage6/'
let roomsData = []
const getData = () => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  axios.get(hexAPI+'rooms')
       .then((res) => {
         roomsData = res.data.items
         render(roomsData)
       })
}
const render = (data) => {
  let temp = ''
  // 自定義參數網址參數 roomID
  // 須注意網頁路徑，若指定網頁並帶參數，直接 .html後面加上 ?參數= 即可
  data.forEach((item) => {
    temp += `
    <div class="col-md-6 col-lg-4 mb-3">
      <a href="room.html?roomID=${item.id}" class="card text-decoration-none">
        <div class="card-header p-0 border-0">
          <img src="${item.imageUrl}" alt="" class="custom__roomImg object--fit">
        </div>
      </a>
    </div>`
  })
  rooms.innerHTML = temp
}

getData()




