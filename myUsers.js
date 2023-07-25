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
      // id 값 그대로 사용하여 해당 사용자 정보를 가져옴
      $scope.fName = $scope.users[id].fName;
      $scope.lName = $scope.users[id].lName;
      $scope.editUserId = id; // 수정할 사용자 ID 저장 (별도 변수 추가)
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

  $scope.test = function() {
    if($scope.passw1 !== $scope.passw2){
      $scope.error = true;
    } else{
      $scope.error = false;
    }

    if(
      $scope.edit &&
      (!$scope.fName.length ||
        !$scope.lName.length ||
        !$scope.passw1.length ||
        !$scope.passw2.length ||
        $scope.error)
    ){
      $scope.incomplete = true;
    } else{
      $scope.incomplete = false;
    }
  }

  // 사용자 조회
  $scope.getUsers = function () {
    $http.get('http://localhost:3001/api/users').then(
      function (response) {
        $scope.users = response.data; // 서버에서 받아온 사용자 리스트를 그대로 사용
  
        console.log($scope.users); // 데이터 확인 로깅
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
