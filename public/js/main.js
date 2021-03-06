/**
 * Created by Samuel on 1/10/2016.
 */

var app = angular.module("tradingDisplayApp", ["firebase","chart.js"]);


app.controller("tradingDisplayController", ["$scope", "$firebaseArray","$interval","$http",
    function ($scope, $firebaseArray,$interval,$http) {
        //Remark: firebase details removed after the competition ended, in order to make the code open-source
        var messagesRef = new Firebase("");
        // download the data from a Firebase reference into a (pseudo read-only) array
        // all server changes are applied in realtime
        $scope.messages = $firebaseArray(messagesRef);
        var query = messagesRef.orderByChild("fr").limitToLast(10);

        $scope.filteredMessages = $firebaseArray(query);
        $scope.recentTrans = [];
        $scope.$watch("filteredMessages", function (oldValue, newValue) {
            for (var i = 0; i < 10; ++i) {
                $scope.recentTrans[i] = {};

                var date = new Date($scope.filteredMessages[9 - i].fr);
                var hours = String(date.getHours());
                // console.log(hours);
                if (hours.length === 1) {
                    hours = '0' + hours;
                }
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                $scope.recentTrans[i].time = formattedTime;
                $scope.recentTrans[i].orderType = $scope.filteredMessages[9 - i].message.order_type;
                $scope.recentTrans[i].price = $scope.filteredMessages[9 - i].message.price;
                $scope.recentTrans[i].qty = $scope.filteredMessages[9 - i].message.qty;
                $scope.recentTrans[i].side = $scope.filteredMessages[9 - i].message.side;
                $scope.recentTrans[i].status = $scope.filteredMessages[9 - i].message.status;
                $scope.recentTrans[i].ticker = $scope.filteredMessages[9 - i].message.symbol;
            }
        }, true);


        // var itv = $interval($http({
        //     method: 'GET',
        //     url: 'http://cis2016-dashboard.herokuapp.com/api/teams',
        //     headers: {"Host":"cis2016-dashboard.herokuapp.com",    "cache-control": "no-cache",
        //         "postman-token": "1b57b4ca-ce0f-7290-8a96-d6f47d34850d"}
        // }).then(function successCallback(response) {
        //     console.log(response);
        // }, function errorCallback(response) {
        //     // called asynchronously if an error occurs
        //     // or server returns response with an error status.
        // }), 3000);

    }
]);



app.controller("BarCtrl", ["$scope","$interval","$http",function ($scope,$interval,$http) {
  $scope.labels = ['0001','0005', '0386', '0388', '3988'];
  $scope.series = ['Holding', 'Reserved'];

  $scope.data = [
    [5, 65, 59, 80, 81],
    [6, 28, 48, 40, 19]
  ];

//   setInterval(function(){

//     $scope.data[0][0]++;
        
//   },3000);
    $scope.itv = $interval(
        $http({
            method: 'GET',
            url: 'http://localhost:3000/getStocksInfo',
        }).then(function successCallback(response) {
            obj=response.data;
            console.log(obj);
            $scope.data[0][0] = obj["0001"].actualHold;
            $scope.data[0][1] = obj["0005"].actualHold;
            $scope.data[0][2] = obj["0386"].actualHold;
            $scope.data[0][3] = obj["0388"].actualHold;
            $scope.data[0][4] = obj["3988"].actualHold;
            $scope.data[1][0] = obj["0001"].reserved;
            $scope.data[1][1] = obj["0005"].reserved;
            $scope.data[1][2] = obj["0386"].reserved;
            $scope.data[1][3] = obj["0388"].reserved;
            $scope.data[1][4] = obj["3988"].reserved;

            
            
            
            
            // [ [obj["0001"].actualHold,obj["0005"].actualHold,obj["0386"].actualHold,obj["0388"].actualHold,obj["3988"].actualHold],
            //                 [obj["0001"].reserved,obj["0005"].reserved,obj["0386"].reserved,obj["0388"].reserved,obj["3988"].reserved]];
            // console.log($scope.data);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        })
        , 1000);

}]);

app.controller("DoughnutCtrl", ["$scope","$interval","$http",function ($scope,$interval,$http) {
  $scope.labels = ["Holdings", "Cash"];
  $scope.data = [300, 500];
//   setInterval(function(){

//     $scope.data[0]+=100;
        
//   },3000);
    // $scope.itv = $interval(
        setInterval(
            function(){
        $http({
            method: 'GET',
            url: 'http://localhost:3000/getTeamInfo',
        }).then(function successCallback(response) {
            // console.log(response.data);
            // console.log("success");
            obj=response.data;
            // console.log( obj.holdings,obj.cash);
            $scope.data[0]=obj.holdings;
            $scope.data[1]=obj.cash;
            //  = [ obj.holdings,obj.cash ];
        }, function errorCallback(response) {
            // console.log("fail");
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        })}
        , 1000);
        // , 3000);
}]);



