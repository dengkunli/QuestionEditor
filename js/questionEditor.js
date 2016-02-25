angular.module('questionEditor', [])
    /**
     * Root container for the current set of questions
     *
     * It will display all its containing questions one by one in the editing mode.
     * It provides a button at the bottom to insert a question.
     *
     * Currently supported question types:
     * - Multiple-Choice Question with Single Answer (radio buttons)
     * - Multiple-Choice Question with Multiple Answers (checkboxes)
     * - Free-input Question (text inputs)
     *
     */
    .directive('questionEditor', [ '$compile',
        function ($compile) {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    questions: '='
                },
                controller: ['$scope', function($scope) {
                    //console.log('====ctrl qe====');
                    //console.log($scope);
                    //console.log($scope.questions);
                    $scope.addQuestion = function() {
                        var type = document.getElementById('qe-type-selector').value;
                        $scope.questions.push({
                            type: type,
                            questionNo: $scope.questions.length + 1,
                            content: {
                                title: '',
                                choices: [
                                    {
                                        choiceNo: 1,
                                        description: ''
                                    }
                                ]
                            },
                            answer: null
                        });
                        var template = '<' + type + ' questions="questions"' +
                            ' question-no="' + $scope.questions.length + '"' +
                            ' ' + ' />';
                        var addBtn = document.getElementById('qe-add-question-section');
                        ($compile(template)($scope)).insertBefore(addBtn);
                    };
                    $scope.findQuestionByNo = function(questionNo) {
                        for (var i in $scope.questions) {
                            if (questionNo == $scope.questions[i].questionNo) {
                                return $scope.questions[i];
                            }
                        }
                        return -1;
                    };
                }],
                templateUrl: '/html/questionEditor.html',
                link: function(scope, element, attrs) {
                    //console.log('====link qe====');
                    //console.log(scope);
                    //console.log(element);
                    //console.log(attrs);
                    var addBtn = document.getElementById('qe-add-question-section');
                    for (var i in scope.questions) {
                        var template = '<' + scope.questions[i].type +
                            ' questions="questions"' +
                            ' question-no="' + scope.questions[i].questionNo + '"' +
                            '  ' + ' />';
                        ($compile(template)(scope)).insertBefore(addBtn);
                    }
                }
            }
        }])
    .directive('qeRadio',
        function() {
            return {
                transclue: true,
                scope: {
                    questions: '='
                },
                controller: ['$scope', function($scope) {
                    //console.log('====ctrl ra====');
                    //console.log($scope);
                    //console.log($scope.questions);
                }],
                templateUrl: '/html/qeRadio.html',
                link: function(scope, element, attrs) {
                    //console.log('====link ra====');
                    //console.log(scope);
                    //console.log(attrs);
                    scope.question = scope.$parent.findQuestionByNo(attrs.questionNo);
                    scope.addChoice = function() {
                        scope.question.content.choices.push({description: ''});
                    };
                    scope.removeChoice = function() {
                        scope.question.content.choices.pop();
                    };
                    scope.status = function(choiceNo) {
                        if (scope.question.answer === undefined || scope.question.answer === null) {
                            return 'qe-unchecked';
                        }
                        else if (scope.question.answer == choiceNo) {
                            return 'qe-checked';
                        }
                        else return 'qe-unchecked';
                    };
                    scope.check = function(choiceNo) {
                        scope.question.answer = choiceNo;
                    }
                }
            }
        })
    .directive('qeCheckbox',
        function() {
            return {
                transclue: true,
                scope: {
                    questions: '='
                },
                controller: ['$scope', function($scope) {
                    //console.log('====ctrl ra====');
                    //console.log($scope);
                    //console.log($scope.questions);
                }],
                templateUrl: '/html/qeCheckbox.html',
                link: function(scope, element, attrs) {
                    //console.log('====link ra====');
                    //console.log(scope);
                    //console.log(attrs);
                    scope.question = scope.$parent.findQuestionByNo(attrs.questionNo);
                    scope.addChoice = function() {
                        scope.question.content.choices.push({description: ''});
                    };
                    scope.removeChoice = function() {
                        scope.question.content.choices.pop();
                    }
                }
            }
        })
    .directive('qeTextInput',
        function() {

        });