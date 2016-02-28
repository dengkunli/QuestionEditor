/**
 * Created by Daniel on 2/25/16.
 */

angular.module('test', [])
    .controller('qController', function($scope) {
        $scope.questions = [

            // This is a Multiple Choice Question with Single Answer
            {
                type: 'qe-radio',
                questionNo: 1,
                content: {
                    title: 'How many continents are there in the world ?',
                    choices: [
                        {
                            choiceNo: 1,
                            description: '5'
                        },
                        {
                            choiceNo: 2,
                            description: '6'
                        },
                        {
                            choiceNo: 3,
                            description: '7'
                        },
                        {
                            choiceNo: 4,
                            description: '8'
                        }
                    ]
                },
                answer: 3
            },

            // This is a Multiple Choice Question with One or More Answers
            {
                type: 'qe-checkbox',
                questionNo: 2,
                content: {
                    title: 'Which of the following are instruments ?',
                    choices: [
                        {
                            choiceNo: 1,
                            description: 'Guitar'
                        },
                        {
                            choiceNo: 2,
                            description: 'Pencil'
                        },
                        {
                            choiceNo: 3,
                            description: 'Piano'
                        },
                        {
                            choiceNo: 4,
                            description: 'Car'
                        }
                    ]
                },
                answer: [1,3]
            },

            // This is a Text-Input Question
            {
                type: 'qe-text-input',
                questionNo: 3,
                content: {
                    title: 'What do you like to have for dinner tonight ?'
                },
                answer: 'Don\'t know, say maybe a chili pizza.'
            }
        ];
});

angular.module('app', ['test', 'questionEditor'])
    .controller('appController', function($scope) {

    });

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});