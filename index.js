const btn = document.querySelector('#search-button')
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const Index_URL = BASE_URL + '/api/v1/users'
const friends = []
const FRIEND_BY_PAGE = 12
let filteredFriends = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('.pagination')
// render friend list
function renderFriendList(data) {
  let rawHTML = ''
  data.forEach(friend => {
    rawHTML += `<div class="col-sm-2">
        <div class="mb-2">
          <div class="card">
            <img src="${friend.avatar}" class="card-img-top" alt="avatar"
              id="avatar-photo" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id='${friend.id}'>
            <div class="card-body">
              <h5 class="card-title" id="avatar-name">${friend.name} ${friend.surname}</h5>
              <button type="button" class="btn btn-success btn-sm add-to-best" data-id='${friend.id}'>Add To Best Friend</button>
            </div>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML
}

// click photo to get relative modal
function showMovieModal(id) {

  const modalEmail = document.querySelector('#modal-email')
  const modalAge = document.querySelector('#modal-age')
  const modalBday = document.querySelector('#modal-bday')
  const modalAvatar = document.querySelector('#modal-avatar')

  axios(Index_URL + '/' + id).then((response) => {
    modalEmail.innerText = response.data.email
    modalAge.innerText = response.data.age
    modalBday.innerText = response.data.birthday
    modalAvatar.innerHTML = `<img src= '${response.data.avatar
      }' alt='avatar'>`
    // console.log(response.data.email)

  })

}

dataPanel.addEventListener('click', function ClickPhoto(event) {
  if (event.target.matches('.card-img-top')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.add-to-best')) {
    addToLocal(Number(event.target.dataset.id))
  }
})

// add BestFriend to Local Storage
function addToLocal(id) {
  const list = JSON.parse(localStorage.getItem('My Best Friend')) || []
  const friend = friends.find((friend) => friend.id === id)
  if (list.some((friend) => friend.id === id)) {
    return alert('already in your best friend list!')
  }
  list.push(friend)
  localStorage.setItem('My Best Friend', JSON.stringify(list))

}

// search bar (Form hv a submit event)
searchForm.addEventListener('submit', function searchButtonOnclick(event) {
  event.preventDefault()
  const input = searchInput.value.trim().toLowerCase()

  if (input.length === 0) {
    return alert('Please input something')
  }

  filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(input))
  renderPaginator(filteredFriends.length)
  renderFriendList(getFriendByPage(1))
})

// pagination
function getFriendByPage(page) {
  const data = filteredFriends.length ? filteredFriends : friends
  const startIndex = (page - 1) * FRIEND_BY_PAGE
  return data.slice(startIndex, startIndex + FRIEND_BY_PAGE)
}

// generate paginator
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / FRIEND_BY_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// when click paginator
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderFriendList(getFriendByPage(page))
})
axios(Index_URL).then((response) => {
  const friend = response.data.results
  friends.push(...friend)
  renderPaginator(friends.length)
  renderFriendList(getFriendByPage(3))
})