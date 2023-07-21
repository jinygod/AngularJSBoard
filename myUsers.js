angular.module('myApp', []).controller('userCtrl', function ($scope, $http) {
  $scope.fName = '';
  $scope.lName = '';
  $scope.passw1 = '';
  $scope.passw2 = '';
  $scope.users = [];
  $scope.edit = true;
  $scope.error = false;
  $scope.incomplete = false;
  $scope.hideform = true;

  $scope.editUser = function (id) {
    $scope.hideform = false;
    if (id == 'new') {
      $scope.edit = true;
      $scope.incomplete = true;
      $scope.fName = '';
      $scope.lName = '';
    } else {
      $scope.edit = false;
      $scope.fName = $scope.users[id - 1].fName;
      $scope.lName = $scope.users[id - 1].lName;
    }
  };

  $scope.$watch('passw1', function () {
    $scope.test();
  });
  $scope.$watch('passw2', function () {
    $scope.test();
  });
  $scope.$watch('fName', function () {
    $scope.test();
  });
  $scope.$watch('lName', function () {
    $scope.test();
  });

  $scope.test = function () {
    if ($scope.passw1 !== $scope.passw2) {
      $scope.error = true;
    } else {
      $scope.error = false;
    }
    $scope.incomplete = false;
    if (
      $scope.edit &&
      (!$scope.fName.length ||
        !$scope.lName.length ||
        !$scope.passw1.length ||
        !$scope.passw2.length)
    ) {
      $scope.incomplete = true;
    }
  };

  // 사용자 조회
  $scope.getUsers = function () {
    $http.get('http://localhost:3001/api/users').then(
      function (response) {
        $scope.users = response.data;
      },
      function (error) {
        console.error('Error fetching users:', error);
      }
    );
  };

    // 사용자 추가 또는 업데이트 함수
    $scope.saveUser = function () {
      console.log('saveUser() called'); 
      if ($scope.edit) {
        // 신규 사용자 등록
        const newUser = {
          fName: $scope.fName,
          lName: $scope.lName,
          passw1: $scope.passw1,
        };
        $http.post('http://localhost:3001/api/users', newUser).then(
          function (response) {
            // 등록 후 새로운 사용자 목록을 가져와서 화면 갱신
            $scope.getUsers();
            $scope.hideform = true;
            // 비밀번호 필드 초기화
            $scope.passw1 = '';
            $scope.passw2 = '';
          },
          function (error) {
            console.error('Error creating user:', error);
          }
        );
      } else {
        // 기존 사용자 수정
        const updatedUser = {
          fName: $scope.fName,
          lName: $scope.lName,
        };
        $http
          .put('http://localhost:3001/api/users/' + $scope.editUserId, updatedUser)
          .then(
            function (response) {
              // 수정 후 새로운 사용자 목록을 가져와서 화면 갱신
              $scope.getUsers();
              $scope.hideform = true;
            },
            function (error) {
              console.error('Error updating user:', error);
            }
          );
      }
    };


  // 초기 사용자 목록 호출
  $scope.getUsers();
});
