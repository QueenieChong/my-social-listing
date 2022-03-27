const btn = document.querySelector('#search-button')
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const Index_URL = BASE_URL + '/api/v1/users'
const friends = JSON.parse(localStorage.getItem('My Best Friend')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

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
              <button type="button" class="btn btn-danger btn-sm remove-fr-best" data-id='${friend.id}'>X</button>
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
  } else if (event.target.matches('.remove-fr-best')) {
    removeFromFriendList(Number(event.target.dataset.id))
  }
})


function removeFromFriendList(id) {
  const removedItemIndex = friends.findIndex((friend) => friend.id === id)
  friends.splice(removedItemIndex, 1)
  localStorage.setItem('My Best Friend', JSON.stringify(friends))
  renderFriendList(friends)
}
renderFriendList(friends)