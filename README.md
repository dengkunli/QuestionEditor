# QuestionEditor
An awesome question editor based on AngularJS. 

## Demo

![mcq multiple](https://cloud.githubusercontent.com/assets/13433096/13378867/d2ddf4b2-de14-11e5-837a-efe98f9634b2.gif) ![mcq single](https://cloud.githubusercontent.com/assets/13433096/13378868/d6592d28-de14-11e5-8aaf-ac7a5f48d3af.gif) ![text input](https://cloud.githubusercontent.com/assets/13433096/13378869/d86bfe42-de14-11e5-9289-3a50a8619ebf.gif)

A Demo free to play around is also available in my personal blog : http://dengkunli.com/en/Question-Editor-Demo/.

## Install

#### Bower

```bash
bower install question-editor
```

## Use

It's simple to use the question editor. 

All you have to do is to first add the `question-editor` dependency to your app module and then add the `question-editor` directive in a place where it is under the scope of one of your controllers. And then create a scope variable (must be an array) say `scope.questionsHolder = []` in your controller to hold the questions, and then add an attribute to the `question-editor` with value `questionsHolder` in order to set up a two-way data binding.

Currently supported question types and their encoded values of type (in parentheses) are :

* Multiple Choice Question with Single Answer (qe-radio)
* Multiple Choice Question with One or More Answers (qe-checkbox)
* Text-Input Question (qe-text-input)

We can not only create new questions, but also editing existing questions. To edit the existing, simply set the `$scope.questionsHolder` to the array of questions with each of them conform to the specification of the format of questions described below.

Regarding the format of the questions variable, refer to section [Format](#format).

Here's an example HTML code snippet.

```html
    <body>
    
    <!-- A controller that wraps the question-editor -->
    <div ng-controller="exampleController">
        <!-- Add the question-editor directive & set the questions attr -->
        <question-editor questions="variableToHoldQuestions"></question-editor>
    </div>
   
    <!-- Angular Dependency -->
    <script src="path/to/angular.js"></script>
    
    <!-- Question Editor -->
    <script src="path/to/questionEditor.js"></script>
    
    <!-- Your Application Module -->
    <script src="path/to/app.js"></script>
    
    <!-- Insert the stylesheet in the question-editing page -->
    <link rel="styleSheet" href="path/to/questionEditor.css"/>
    
    </body>
```

## <a name="Format"></a> Format

The `questions` variable is an array of objects, each object represents a question. An example as well as specification of the format of the questions is given below :

```javascript
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
            answer: 'Don't know, say maybe a chili pizza.'
        }
    ];
```