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
    .directive('questionEditor', [ '$compile', '$timeout',
        function ($compile, $timeout) {
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
                    $scope.editor = document.getElementsByTagName('question-editor')[0];
                    $scope.hasQuestion = $scope.questions.length > 0;
                    $scope.addQuestion = function() {
                        var type = document.getElementById('qe-type-selector').value;
                        $scope.questions.push({
                            type: type,
                            questionNo: $scope.questions.length + 1,
                            content: {
                                title: '',
                                choices: [
                                    {choiceNo: 1, description: ''},
                                    {choiceNo: 2, description: ''},
                                    {choiceNo: 3, description: ''},
                                    {choiceNo: 4, description: ''}
                                ]
                            },
                            answer: null
                        });
                        var template = '<' + type + ' questions="questions"' +
                            ' question-no="' + $scope.questions.length + '"' + ' />';
                        var compiledNode = ($compile(template)($scope));
                        $scope.editor.insertBefore(compiledNode[0], $scope.editor.lastChild);
                        $timeout(function() {
                            var q = document.getElementById('qe-question-no-' + $scope.questions.length);
                            var overlay = q.lastChild.previousSibling;
                            overlay.style.backgroundColor = 'rgba(0,0,0,0.2)';
                            $timeout(function() {
                                overlay.style.backgroundColor = 'rgba(0,0,0,0)';
                                $timeout(function() {
                                    q.removeChild(overlay);
                                }, 500);
                            }, 500);
                        }, 10);

                        //angular.element(q).css('background-color','#777');
                        //angular.element($scope.editor.lastChild.previousSibling.firstChild).css('background-color','transparent');
                        /**
                         * Dependency of jQuery removed, this is the original backup:
                         * var addSection = document.getElementById('qe-add-question-section')[0];
                         * ($compile(template)($scope)).insertBefore(addSection);
                         */

                        // Update hasQuestion status variable
                        $scope.hasQuestion = true;
                    };
                    $scope.removeQuestion = function(questionNo) {
                        // Remove from DOM
                        $scope.editor.removeChild(document.getElementById('qe-question-no-' + questionNo).parentNode);
                        // Remove from $scope.questions
                        var found = false;
                        var len = $scope.questions.length;
                        for (var i = 0; i < len; i++) {
                            if (found === false) {
                                if ($scope.questions[i].questionNo == questionNo) {
                                    $scope.questions.splice(Number.parseInt(i), 1);
                                    found = true;
                                    i--;
                                    len--;
                                }
                            }
                            else {
                                $scope.questions[i].questionNo--;
                            }
                        }
                        // Update hasQuestion if neccessary
                        if ($scope.questions.length == 0) {
                            $scope.hasQuestion = false;
                        }
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
                templateUrl: '../html/questionEditor.html',
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
                templateUrl: '../html/qeRadio.html',
                link: function(scope, element, attrs) {
                    //console.log('====link ra====');
                    //console.log(scope);
                    //console.log(attrs);
                    scope.question = scope.$parent.findQuestionByNo(attrs.questionNo);
                    scope.addChoice = function() {
                        scope.question.content.choices.push({
                            choiceNo: scope.question.content.choices.length + 1,
                            description: ''
                        });
                    };
                    scope.removeChoice = function() {
                        if (scope.question.answer == scope.question.content.choices.length) {
                            // To one deleted is the marked answer
                            scope.question.answer = null;
                        }
                        scope.question.content.choices.pop();
                    };
                    scope.removeQuestion = function() {
                        scope.$parent.removeQuestion(scope.question.questionNo);
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
                templateUrl: '../html/qeCheckbox.html',
                link: function(scope, element, attrs) {
                    //console.log('====link ra====');
                    //console.log(scope);
                    //console.log(attrs);
                    scope.question = scope.$parent.findQuestionByNo(attrs.questionNo);
                    scope.addChoice = function() {
                        scope.question.content.choices.push({
                            choiceNo: scope.question.content.choices.length + 1,
                            description: ''
                        });
                    };
                    scope.removeChoice = function() {
                        var index = scope.question.answer.indexOf(scope.question.content.choices.length);
                        if (index !== -1) {
                            scope.question.answer.splice(index, 1);
                        }
                        scope.question.content.choices.pop();
                    };
                    scope.removeQuestion = function() {
                        scope.$parent.removeQuestion(scope.question.questionNo);
                    };
                    scope.status = function(choiceNo) {
                        if (scope.question.answer === undefined || scope.question.answer === null) {
                            return 'qe-unchecked';
                        }
                        else if (scope.question.answer.indexOf(choiceNo) !== -1) {
                            return 'qe-checked';
                        }
                        else return 'qe-unchecked';
                    };
                    scope.toggle = function(choiceNo) {
                        if (scope.question.answer === undefined || scope.question.answer === null) {
                            scope.question.answer = [choiceNo];
                        }
                        else {
                            var index = scope.question.answer.indexOf(choiceNo);
                            if (index === -1) {
                                scope.question.answer.push(choiceNo);
                            }
                            else {
                                scope.question.answer.splice(index, 1);
                            }
                        }
                    }
                }
            }
        })
    .directive('qeTextInput',
        function() {

        });