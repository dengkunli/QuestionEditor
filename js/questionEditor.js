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
                    $scope.editor = document.getElementsByTagName('question-editor')[0];
                    $scope.hasQuestion = $scope.questions.length > 0;
                    $scope.addQuestion = function() {
                        var type = document.getElementById('qe-type-selector').value;
                        var content, answer;
                        switch (type) {
                            case 'qe-radio':
                                content = {
                                    title: '',
                                        choices: [
                                        {choiceNo: 1, description: ''},
                                        {choiceNo: 2, description: ''},
                                        {choiceNo: 3, description: ''},
                                        {choiceNo: 4, description: ''}
                                    ]
                                };
                                answer = null;
                                break;
                            case 'qe-checkbox':
                                content = {
                                    title: '',
                                    choices: [
                                        {choiceNo: 1, description: ''},
                                        {choiceNo: 2, description: ''},
                                        {choiceNo: 3, description: ''},
                                        {choiceNo: 4, description: ''}
                                    ]
                                };
                                answer = [];
                                break;
                            case 'qe-text-input':
                                content = {
                                    title: ''
                                };
                                answer = null;
                                break;
                            default:
                                // unknown/unsupported type of question
                                console.log('Unsupported type of question: ' + type);
                                return;
                        }
                        $scope.questions.push({
                            type: type,
                            questionNo: $scope.questions.length + 1,
                            content: content,
                            answer: answer
                        });
                        var template = '<' + type + ' questions="questions"' +
                            ' question-no="' + $scope.questions.length + '"' + ' />';
                        var compiledNode = ($compile(template)($scope));
                        $scope.editor.insertBefore(compiledNode[0], $scope.editor.lastChild);
                        $timeout(function() {
                            var q = window.document.getElementById('qe-question-no-' + $scope.questions.length);
                            q.lastChild.style.transitionTimingFunction = 'ease-out';
                            q.lastChild.style.backgroundColor = 'rgba(0,0,0,0.1)';
                            $timeout(function() {
                                q.lastChild.style.transitionTimingFunction = 'ease-out';
                                q.lastChild.style.backgroundColor = 'rgba(0,0,0,0.0)';
                            }, 500);
                        }, 10);

                        // Update hasQuestion status variable
                        $scope.hasQuestion = true;
                    };
                    $scope.removeQuestion = function(questionNo) {
                        // Remove from DOM
                        $scope.editor.removeChild(window.document.getElementById('qe-question-no-' + questionNo).parentNode);
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
                template:
                '<div id="qe-add-question-section" class="qe-section">'+
                '    <p class="qe-hint" ng-show="hasQuestion">Note: choose/type the correct answer(s) before saving</p>'+
                '    <div class="row">'+
                '        <a id="qe-add-question-btn" ng-click="addQuestion()">Add a Question of type: </a>'+
                '        <select id="qe-type-selector">'+
                '            <option value="qe-radio">Multiple Choice Question with Single Answer</option>'+
                '            <option value="qe-checkbox">Multiple Choice Question with Multiple Answers</option>'+
                '            <option value="qe-text-input">Text-Input Question</option>'+
                '        </select>'+
                '    </div>'+
                '</div>',
                link: function(scope, element, attrs) {
                    var addBtn = window.document.getElementById('qe-add-question-section');
                    for (var i in scope.questions) {
                        var template = '<' + scope.questions[i].type +
                            ' questions="questions"' +
                            ' question-no="' + scope.questions[i].questionNo + '"' +
                            '  ' + ' />';
                        scope.editor.insertBefore(($compile(template)(scope))[0], scope.editor.lastChild);
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
                template:
                '<div id="qe-question-no-{{question.questionNo}}" class="qe-question qe-section">'+
                '    <div class="qe-question-title-wrapper">'+
                '        <span class="qe-question-no">{{question.questionNo}}.</span>'+
                '        <div>'+
                '            <input type="text" ng-model="question.content.title" placeholder="What\'s the Question ?"/>'+
                '        </div>'+
                '    </div>'+
                '    <div class="qe-answers">'+
                '        <div class="qe-choice-wrapper row" ng-repeat="choice in question.content.choices">'+
                '            <div class="qe-radio-btn-wrapper" ng-class="status(choice.choiceNo)" ng-click="check(choice.choiceNo)">'+
                '                <div class="qe-radio-off"></div>'+
                '                <div class="qe-radio-on"></div>'+
                '            </div>'+
                '            <div class="qe-choice-input-wrapper">'+
                '                <input type="text" ng-model="choice.description" placeholder="Description of Choice"/>'+
                '            </div>'+
                '        </div>'+
                '        <a ng-click="addChoice()" class="qe-add-choice-btn">Add a choice</a>'+
                '        <a ng-click="removeChoice()" class="qe-remove-choice-btn">Remove a choice</a>'+
                '        <a ng-click="removeQuestion()" class="qe-remove-question-btn">Remove this question</a>'+
                '    </div>'+
                '    <div class="qe-overlay"></div>'+
                '</div>',
                link: function(scope, element, attrs) {
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
                template:
                '<div id="qe-question-no-{{question.questionNo}}" class="qe-question qe-section">'+
                '    <div class="qe-question-title-wrapper">'+
                '        <span class="qe-question-no">{{question.questionNo}}.</span>'+
                '        <div>'+
                '            <input type="text" ng-model="question.content.title" placeholder="What\'s the Question ?"/>'+
                '        </div>'+
                '    </div>'+
                '    <div class="qe-answers">'+
                '        <div class="qe-choice-wrapper row" ng-repeat="choice in question.content.choices">'+
                '            <div class="qe-checkbox-btn-wrapper" ng-class="status(choice.choiceNo)" ng-click="toggle(choice.choiceNo)">'+
                '                <div class="qe-checkbox-off"></div>'+
                '                <div class="qe-checkbox-on"></div>'+
                '            </div>'+
                '            <div class="qe-choice-input-wrapper">'+
                '                <input type="text" ng-model="choice.description" placeholder="Description of Choice"/>'+
                '            </div>'+
                '        </div>'+
                '        <a ng-click="addChoice()" class="qe-add-choice-btn">Add a choice</a>'+
                '        <a ng-click="removeChoice()" class="qe-remove-choice-btn">Remove a choice</a>'+
                '        <a ng-click="removeQuestion()" class="qe-remove-question-btn">Remove this question</a>'+
                '    </div>'+
                '    <div class="qe-overlay"></div>'+
                '</div>',
                link: function(scope, element, attrs) {
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
            return {
                transclue: true,
                scope: {
                    questions: '='
                },
                template:
                '<div id="qe-question-no-{{question.questionNo}}" class="qe-question qe-section qe-text-input">'+
                '    <div class="qe-question-title-wrapper">'+
                '        <span class="qe-question-no">{{question.questionNo}}.</span>'+
                '        <div>'+
                '            <input type="text" ng-model="question.content.title" placeholder="What\'s the Question ?"/>'+
                '        </div>'+
                '    </div>'+
                '    <div class="qe-answers">'+
                '        <div class="qe-text-input-wrapper">'+
                '            <input type="text" ng-model="question.answer" placeholder="Correct answer goes here..."/>'+
                '        </div>'+
                '        <div class="qe-remove-question-btn-wrapper">'+
                '            <a ng-click="removeQuestion()" class="qe-remove-question-btn">Remove this question</a>'+
                '        </div>'+
                '    </div>'+
                '    <div class="qe-overlay"></div>'+
                '</div>',
                link: function(scope, element, attrs) {
                    scope.question = scope.$parent.findQuestionByNo(attrs.questionNo);
                    scope.removeQuestion = function() {
                        scope.$parent.removeQuestion(scope.question.questionNo);
                    };
                }
            }
        });