angular.module('app').component('writePost', {
    templateUrl: 'writepost.html',
    controller: function($http, $location) {
      this.title = '';
      this.context = '';
  
      this.submitPost = function() {
        const post = {
          title: this.title,
          author: '전성진',
          context: this.context,
          date: new Date().toISOString(),
          views: 0,
        };
  
        $http.post('http://localhost:3001/posts', post)
          .then(response => {
            console.log(response.data);
            alert('등록되었습니다.');
            $location.path('/');  // 글 작성후 '/' 경로로 이동
          })
          .catch(error => {
            console.error('An error occurred while creating a new post:', error);
          });
      };
    }
  });
  