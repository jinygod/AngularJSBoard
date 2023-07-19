angular.module('app', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'main.html',
        controller: 'PostController',
        controllerAs: 'postCtrl'
    })
    .when('/post/:id', {
        templateUrl: 'postdetail.html',
        controller: 'PostDetailController',
        controllerAs: 'postDetailCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}])
  
.controller('PostController', ['$http', '$location', function($http, $location) {
    var vm = this;

    vm.posts = [];
    vm.currentPage = 1;
    vm.pageSize = 10;

    vm.fetchPosts = function() {
        $http.get('http://localhost:3001/posts')
        .then(function(response) {
            vm.posts = response.data.sort((a, b) => b.id - a.id);
        }, function(error) {
            console.log('Error fetching posts:', error);
        });
    };

    vm.formatDate = function(dateString) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        var date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    vm.handlePostClick = function(post) {
        $location.path('/post/' + post.id);
    };

	vm.prevPage = function() {
		if (vm.currentPage > 1) {
			vm.currentPage--;
		}
	};
	
	vm.nextPage = function() {
		if (vm.currentPage < vm.totalPages) {
			vm.currentPage++;
		}
	};	

    vm.goToPage = function(pageNumber) {
        vm.currentPage = pageNumber;
    };

    vm.navigate = function() {
        $location.path('/write');
    };

    vm.fetchPosts();

    Object.defineProperties(vm, {
        totalPages: {
            get: function() {
                return Math.ceil(vm.posts.length / vm.pageSize);
            }
        },
        visiblePageNumbers: {
            get: function() {
                var currentPageGroup = Math.ceil(vm.currentPage / 10);
                var startPage = (currentPageGroup - 1) * 10 + 1;
                var endPage = Math.min(vm.totalPages, currentPageGroup * 10);
                return Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);
            }
        },
        paginatedPosts: {
            get: function() {
                var startIndex = (vm.currentPage - 1) * vm.pageSize;
                var endIndex = startIndex + vm.pageSize;
                return vm.posts.slice(startIndex, endIndex);
            }
        }
    });
}])
.controller('PostDetailController', ['$http', '$routeParams', function($http, $routeParams) {
    var vm = this;

    vm.post = {};

    vm.fetchPost = function() {
        $http.get('http://localhost:3001/posts/' + $routeParams.id)
        .then(function(response) {
            vm.post = response.data;
        }, function(error) {
            console.log('Error fetching post:', error);
        });
    };

    vm.fetchPost();
}]);
