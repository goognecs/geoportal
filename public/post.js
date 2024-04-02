$(document).ready(function () {

  // jQuery methods go here...
  function getPostList() {
    $.get('/post/list').done(data => {
      $('#post-list-form').html(data)
      $('#post-list').html(data)
    })
  }

  getPostList()

}); 
