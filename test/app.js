/**
 * Created by Daniel on 2/25/16.
 */

angular.module('test', [])
    .controller('qController', function($scope) {
        $scope.questions = [
            {
                type: 'qe-radio',
                questionNo: 1,
                content: {
                    title: 'question one',
                    choices: [
                        {
                            choiceNo: 1,
                            description: 'choice one'
                        },
                        {
                            choiceNo: 2,
                            description: 'choice two'
                        }
                    ]
                }
            },
            {
                type: 'qe-radio',
                questionNo: 2,
                content: {
                    title: 'question two',
                    choices: [
                        {
                            choiceNo: 1,
                            description: 'choice one'
                        },
                        {
                            choiceNo: 2,
                            description: 'choice two'
                        }
                    ]
                }
            }
        ];
        $scope.questions = [];
});

angular.module('app', ['test', 'questionEditor'])
    .controller('appController', function($scope) {

    });

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});