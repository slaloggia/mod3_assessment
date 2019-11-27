let imageId = 4065 //Enter the id from the fetched image here

const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

const likeURL = `https://randopic.herokuapp.com/likes/`

const commentsURL = `https://randopic.herokuapp.com/comments/`


function main() {  
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')
    // fetch image data
    // render image and info
    fetchImage()
    imgListeners()


  })
}


function fetchImage() {
  fetch(imageURL)
  .then(resp => resp.json())
  .then(image => renderImage(image))
}

// ***Frontend functions***

function renderImage(image) {
  const imgCard = document.getElementById('image_card')
  const imgPic = document.getElementById('image')
  imgPic.src = image.url

  const imgName = document.getElementById('name')
  imgName.innerText = image.name

  const likeCount = document.getElementById('likes')
  likeCount.innerText = `${image.like_count}`
  
  const comments = image.comments
  
  comments.forEach(printComment)
}

function printComment(comment) {
  const commentList = document.getElementById('comments')
  const commentLi = document.createElement('li')
  commentLi.innerText = comment.content

  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'delete_btn'
  deleteBtn.dataset.id = comment.id
  deleteBtn.innerText = 'x'

  commentLi.appendChild(deleteBtn)


  commentList.appendChild(commentLi)
}

function grabFormData() {
  const content = document.getElementById('comment_input').value 
  return {content}
}

// ***Backend functions***

function addLike(imageId) {
   configObj = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: imageId
    })
  }

  fetch('https://randopic.herokuapp.com/likes', configObj)
  .then(resp => resp.json())
  .then(data => console.log(data))
  .catch(err => console.log(err.message))
}

function addComment(data) {
  const comment = data.content
  const configObj = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    image_id: imageId,
    content: comment  
    })
  }

  fetch('https://randopic.herokuapp.com/comments', configObj)
  .then(resp => resp.json())
  .then(data => console.log(data))
  .catch(err => console.log(err.message))
}

function removeComment(commentId) {
  fetch(`https://randopic.herokuapp.com/comments/${commentId}`, {method: 'DELETE'})
  .then(resp => resp.json())
  .then(data => console.log(data))

}

// ***Listeners***

function imgListeners() {
  document.addEventListener('click', (event) => {
  // if target is like button:
  //  increase count in view
  // create new like in database
  if (event.target.id === 'like_button') {
    const likeCount = document.getElementById('likes')
    likeCount.innerText = parseInt(likeCount.innerText) +1
    addLike(imageId) 
    // usually I would probably add a dataset id to the like button and grab that, but we already have an imageId constant, so
  }
  // if target is form submit:
  // grab form data
  // render comment to browser
  // create new comment in database
  if (event.target.id === 'submit_btn') {
    event.preventDefault()
    const form = document.getElementById('comment_form')
    data = grabFormData()
    form.reset()
    printComment(data)
    addComment(data)
  }

  if (event.target.className === 'delete_btn') {
    event.preventDefault()
    const commentId = event.target.dataset.id
    removeComment(commentId)
    event.target.parentNode.remove()
  }
  })
}



main()
