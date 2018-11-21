angular.module('testflite', ['ngRoute'])
    .controller('TestCtrl', ['$scope', '$http', function($scope, $http) {
        var resourceUrl = './test';
        $scope.tests = [];
        $scope.viewTest = null;
        $scope.newTest = null;
        $http.get(resourceUrl)
            .then(function(response) {
                $scope.tests = response.data;
            })
            .catch(function(err) {
                console.log('err loading tests');
            });

        $scope.selectTest = function(test) {
            $scope.viewTest = test;

        }
        $scope.hideSelectedTest = function() {
            $scope.viewTest = null;
        }

        $scope.deleteViewTest = function() {
            if ($scope.viewTest) {
                for (var i = 0; i < $scope.tests.length; i++) {
                    if ($scope.tests[i] == $scope.viewTest) {

                        $http.post(resourceUrl + '/' + $scope.viewTest.id)
                            .then(function(data) {
                                $scope.tests.splice(i, 1);
                                $scope.hideSelectedTest();
                            })
                            .catch(function(err) {
                                alert('Error deleting test');
                                console.log(err);
                            });
                        break;
                    }
                }
            }
        }

        $scope.addNewTest = function() {
            $scope.hideSelectedTest();
            if ($scope.newTest == null) {
                $scope.newTest = {
                    variations: [{}]
                };
            }

        }

        $scope.save = function() {
            if (isValidTest($scope.newTest)) {
                $http.post(resourceUrl, $scope.newTest)
                    .then(function(response) {
                        console.log('saved!');
                        $scope.tests.push(response.data);
                        $scope.discard();
                    })
                    .catch(function(err) {
                        alert('Unable to save test!');
                        console.warn(err);
                    });

            } else {
                alert('Test is not valid!');
            }
        }

        $scope.discard = function() {
            $scope.newTest = null;
        }

        $scope.addVariation = function() {

            $scope.newTest.variations.push({
                template: '',
                weight: 1,
                hits: 0,
                returns: 0
            });
        }

        $scope.removeVariation = function(variation) {
            if ($scope.newTest.variations) {
                var index = $scope.newTest.variations.indexOf(variation);
                if (index > -1) {
                    $scope.newTest.variations.splice(index, 1);
                }
            }
        }

        $scope.getAllVariations = function() {
            var test = $scope.viewTest;
            if (test == null) {
                return [];
            }
            var vars = [test.page];
            for (var i in test.variations) {
                vars.push(test.variations[i]);
            }

            return vars;
        }

        $scope.getPercentage = function(variation) {
            if (!variation || !variation.hits) {
                return "N/A";
            }
            var ratio = variation.returns / variation.hits;
            ratio = (parseFloat(Math.round(ratio * 100) / 100) * 100).toFixed(2);
            return ratio + '%';
        }


        var isValidTest = function(test) {
            if (test) {
                if (!isValidPage(test.page, test.dynamicWeight)) {
                    return false;
                }

                for (var i in test.variations) {
                    if (!isValidPage(test.variations[i], test.dynamicWeight)) {
                        return false;
                    }
                }

                if (test.name && test.destination) {
                    for (var i in $scope.tests) {
                        if ($scope.tests[i].destination == test.destination) {
                            return false;
                        }
                        if ($scope.tests[i].page.template == test.page.template) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
                return true;
            }
            return false;
        }

        var isValidPage = function(page, dynamicWeight) {
            if (page) {
                page.hits = 0;
                page.returns = 0;
                if (dynamicWeight) {
                    return !!page.template;
                }
                return page.template && page.weight > 0;
            }
            return false;
        }
    }]);