var liczsieci = angular.module('liczsieci', []);
liczsieci.controller('ctrl1', function($scope) {
  $scope.first = 1;
  $scope.second = 1;

  $scope.updateValue = function() {
    $scope.calculation = $scope.first + ' + ' + $scope.second + " = " + (+$scope.first + +$scope.second)
  };

  $scope.groups =[];

  $scope.addGroup = function() {
    var i = 2;
    var cnt = 1;
    while (+$scope.enteredGroup+2 > i) {
      i*=2;
      cnt+=1;
    }
    $scope.groups.push({
      "count": +$scope.enteredGroup,
      "maxHosts": i,
      "power":cnt
    });
    $scope.currentHosts += +$scope.enteredGroup + 2;
  };

  $scope.removeGroup = function(group) {
    var i = $scope.groups.indexOf(group);
    $scope.currentHosts -= (+$scope.groups[i].count + 2);
    //console.log($scope.groups[i].count);
    $scope.groups.splice(i,1);

  };

  $scope.ip1 = 10;
  $scope.ip2 = 0;
  $scope.ip3 = 0;
  $scope.ip4 = 0;
  $scope.currentHosts = 0;
  $scope.maxAddr = 'n';
  $scope.addIpAddress = function() {

    if($scope.mask != undefined) {
    $scope.maxAddr = Math.pow(2,(32 - +$scope.mask));
    $scope.completeIp = $scope.ip1 + '.' + $scope.ip2 + '.' + $scope.ip3 + '.' + $scope.ip4 + '/' + $scope.mask +
    ' Mozesz przydzielic: ' + $scope.maxAddr + ' adresow.';
      }  else {
        $scope.completeIp = $scope.ip1 + '.' + $scope.ip2 + '.' + $scope.ip3 + '.' + $scope.ip4;
      }

  };

liczBroadcast = function(adressiecigr, liczbaHostowGr) {
  var max = 255;
  var min = 0;
  var broadcast = adressiecigr;
//  console.log(broadcast);
//  console.log(liczbaHostow/256);
  if (liczbaHostowGr/256 > 1) { //stan gdy mamy do zaadresowania ponad 256 hostow
    var iloscPetli = liczbaHostowGr/256; //obliczami ilosc potrzebnych petli
    for (var i = 0; i < iloscPetli; i++) {
      broadcast[3]+=255; //dodajemy i-ta pule
      var offset = broadcast[3]-255; // obliczamy ile adresow nie miesci sie w 255
      if(broadcast[3] > 255) { //zwiekszamy wartosc oktetu wezej
        broadcast[3] = offset;
        broadcast[2] += 1;
        if (broadcast[2] > 255) {
          broadcast[2] = 0;
          broadcast[1] += 1;;
            if (broadcast[1] > 255) {
              broadcast[1] = 0;
              broadcast[0] += 1;
            }
        }
      }
    } //end  for
  } else { //stan gdy do zaadresowania jest ponizej 256 hostow
    broadcast[3]+=liczbaHostowGr-1; //dodajemy liczbe hostow
    var offset = broadcast[3]-255; // obliczamy ile adresow nie miesci sie w 255
    if(broadcast[3] > 255) { //zwiekszamy wartosc oktetu wezej
      broadcast[3] = offset;
      broadcast[2] += 1;
      if (broadcast[2] > 255) {
        broadcast[2] = 0;
        broadcast[1] += 1;;
          if (broadcast[1] > 255) {
            broadcast[1] = 0;
            broadcast[0] += 1;
          }
      }
    }
  } //koniec ifa
//  console.log(broadcast);
  return broadcast;
}
  $scope.liczgrupy = function() {
    $scope.items = [];
//    console.log($scope.groups[0]);
    for (var i = 0; i < $scope.groups.length;i++) {
      var adresygr = [];
      //liczenie podsieci dla group
      if (i == 0) {
          var adressieci = [$scope.ip1, $scope.ip2, $scope.ip3, $scope.ip4]; //adres sieci 1
          var maska = 32 - $scope.groups[i].power;
          var broadcast = liczBroadcast(adressieci, $scope.groups[i].maxHosts);
          adressieci = [$scope.ip1, $scope.ip2, $scope.ip3, $scope.ip4];
          var hoststart = [$scope.ip1, $scope.ip2, $scope.ip3, $scope.ip4+1];
          var hostend = [broadcast[0], broadcast[1], broadcast[2], broadcast[3]-1];
          console.log(adressieci);
          console.log(broadcast);
          $scope.items.push({
            "nrGr": i+1,
            "adres": adressieci,
            "maska": maska,
            "hostStart": hoststart,
            "hostEnd": hostend,
            "broadcast": broadcast
          });
      }
      else {
        var lastBroadcast = [$scope.items[i-1].broadcast[0], $scope.items[i-1].broadcast[1], $scope.items[i-1].broadcast[2], $scope.items[i-1].broadcast[3]];
        console.log(lastBroadcast);
        var adressieci = liczBroadcast(lastBroadcast,2);
        var maska = 32 - $scope.groups[i].power;
        var broadcast = liczBroadcast(adressieci, $scope.groups[i].maxHosts);
        var hoststart = [adressieci[0], adressieci[1], adressieci[2], adressieci[3]+1];
        var hostend = [broadcast[0], broadcast[1], broadcast[2], broadcast[3]-1];
        $scope.items.push({
          "nrGr": i+1,
          "adres": adressieci,
          "maska": maska,
          "hostStart": hoststart,
          "hostEnd": hostend,
          "broadcast": broadcast
        });
      }
      console.log($scope.items);
    }

  };
});
