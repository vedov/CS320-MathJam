//Global Range Values
var nr_range_low = 1;
var nr_range_high = 10;
var diff_counter = 0;
var level = 1;
var score = 0;
var correct_answer;
var joker_counter = 0;
var name;
var time = 10;


// Generate a random number between the given bounds
function getRandomInt(min, max) {
    a_min = Math.ceil(min);
    a_max = Math.floor(max);
    return Math.floor(Math.random() * (a_max - a_min + 1)) + a_min;
}

// Enclose the sa negative number in parathensis
function enclose(number) {
    if (number < 0) {
        return "(" + number + ")";
    }
    return number.toString();
}

function generateRandomEquation() {

    var numberArray = [];
    var opArray = [];

    for (var i = 0; i < 2; ++i) {

        var number = getRandomInt(nr_range_low, nr_range_high);

        // Decide if the number will be positive or not.
        var invert = getRandomInt(0, 1);
        if (invert === 0)
            numberArray.push(-number);
        else
            numberArray.push(number);
    }
    //Check if the numbers are divisible, if not generate a new pair.
    // 0: Addition
    // 1: Subtraction
    // 2: Multiplication
    // 3: Division
    if (numberArray[0] % numberArray[1] == 0) {
        opArray.push(getRandomInt(0, 3));
    } else {
        opArray.push(getRandomInt(0, 2));
    }
    var result = numberArray[0];
    var string = numberArray[0];

    for (var i = 1; i < 2; i++) {
        switch (opArray[i - 1]) {
            case 0:
                result += numberArray[i];
                string += " + " + enclose(numberArray[i]);
                break;
            case 1:
                result -= numberArray[i];
                string += " - " + enclose(numberArray[i]);
                break;
            case 2:
                result *= numberArray[i];
                string += " * " + enclose(numberArray[i]);
                break;
            case 3:
                result /= numberArray[i];
                string += " / " + enclose(numberArray[i]);
                break;
        }
    }
    // Raise the difficulty
    diff_counter++;
    if (diff_counter % 2 == 0) {
        nr_range_low = Math.floor(nr_range_low * 2);
        nr_range_high = Math.ceil(nr_range_high * 2.5);
    }
    return [string, result];
}

//Fisher-Yates (aka Knuth) Array Shuffle Algorithm
//Source: https://github.com/Daplie/knuth-shuffle/blob/master/index.js
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Generate possible answers
function generateAnswers() {
    var equation = generateRandomEquation();
    var string = equation[0];
    var correct_answer = equation[1];
    var answers = new Array;
    var other_answers;
    answers.push(correct_answer);

    for (var i = 1; i < 4; i++) {
        do {
            other_answers = getRandomInt(Math.floor((correct_answer - 3) * 0.25), Math.ceil((correct_answer + 3) * 2.25));
        }
        while (answers.includes(other_answers));
        answers.push(other_answers);
    }

    shuffle(answers);
    return [string, answers, correct_answer];

}

//Check Number of remaining jokers
function checkJoker() {
    if (joker_counter >= 2) {
        $(".jokers button").css('background-image', 'linear-gradient(#D3D3D3, #D3D3D3');
        $(".jokers button").css('pointer-events', 'none');
        return false;
    }
    joker_counter++;
    return true;
}
//Check Level and set score
function setScore() {
    if (level <= 6) score += 200;
    else if (6 < level && level <= 11) score += 6200;
    else if (11 < level && level <= 16) score += 193600;
}

//Set final score
function finalScore() {
    if (level <= 6) return 0;
    else if (6 < level && level <= 11) return 1000;
    else if (11 < level && level <= 15) return 32000;
}
//50-50 Choice Joker
function fiftyFifty(array, answer) {
    var all_answers = array;
    var correct_answer = answer;
    var fifty_array = new Array;
    shuffle(all_answers);
    if (all_answers[0] != correct_answer) {
        fifty_array.push(all_answers[0]);
    } else {
        fifty_array.push(all_answers[1]);
    }
    fifty_array.push(correct_answer);
    shuffle(fifty_array);

    return fifty_array;
}

//Ask The Audience Joker
function AskTheAudience(array, answer) {
    var winrate = 100 - (level - 1) * 3;
    var raise = (winrate % 10);
    var chance_array = array;
    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;
    var voting_array = new Array;
    var voting_percentage = new Array;
    for (var i = 0; i < raise; i++) {
        chance_array.push(answer);
    }
    for (var i = 0; i < 50; i++) {
        var random_value = chance_array[Math.floor(Math.random() * chance_array.length)];
        if (random_value == array[0]) {
            a++;
        } else if (random_value == array[1]) {
            b++;
        } else if (random_value == array[2]) {
            c++;
        } else d++;
    }
    voting_percentage.push(Math.round((a / 50) * 100));
    voting_percentage.push(Math.round((b / 50) * 100));
    voting_percentage.push(Math.round((c / 50) * 100));
    voting_percentage.push(Math.round((d / 50) * 100));

    return voting_percentage;
}

function setAskTheAudience(array, answer) {
    var audience = AskTheAudience(array, answer);
    var options = new Array;
    $(".votes").empty();
    $.each(audience, function(index, value) {
        options.push(index + 1 + " ");
        $(".votes").append('<div class="progress-circle progress-' + value + ' "><span>' + options[index] + ': ' + value + '</span></div>');
    });

}

function setFiftyFifty(array, answer) {
    var fifty_array = fiftyFifty(array, answer);
    $(".solutions").empty();
    $.each(fifty_array, function(index, value) {
        $(".solutions").append("<button>" + value + "</button>");
    });

    return fifty_array;

}

function generateContent() {
    var array = generateAnswers();
    var string = array[0];
    var answers = array[1];
    var correct_answer = array[2];

    $("#level").empty().append(
        "<i class='far fa-question-circle' id='lvl'></i>  " + level + " / 15"
    );

    level++;

    $("#equations").empty().append(
        "<div class='equation'>" + string + "</div>"
    );

    $(".solutions").empty();

    $.each(answers, function(index, value) {
        $(".solutions").append("<button><span>" + value + "</span></button>");
    });

    $("#score").empty().append("<i class='fas fa-dollar-sign' id='dollar'></i>  " + score);
    $("#score").css('box-shadow', 'none');

    return array;
}

//Show the Lose Screen
function Lose() {
    $("audio#doot")[0].play();
    setTimeout(function() {
        $("#finalscore").append("<strong>" + name + "</strong> your score is: <strong>" + finalScore() + "</strong>");
        $("#modal-5").toggle(300);
        $(".question").hide(300);
    }, 500);
}

//Show the Win Screen
function Win() {
    $("#modal-4 .notify").append(" " + name + "!");
    $("#modal-4").toggle(300);
    $(".question").hide(300);
}

function Game() {

    var array = generateContent();
    var string = array[0];
    var answers = array[1];
    var correct_answer = array[2];
    var klik = false;
    $("#btn-50").on('click', function() {
        if (checkJoker()) {
            setFiftyFifty(answers, correct_answer);
        }
    });
    $("#btn-audience").on('click', function() {
        if (checkJoker()) {
            setAskTheAudience(answers, correct_answer);
        }
    });


    // Check Answer
    $(document).on("click", ".solutions button", function(e) {
        var item = $(this).text();
        if (item == correct_answer) {
            $(this).css('box-shadow', 'inset 300px 0px 0px 0.01px #93F9B9');
            $("#score").empty().append("<i class='fas fa-dollar-sign' id='dollar'></i>  " + score);
            $("#score").css('box-shadow', '0 0 25px 1px #f46b45, 0.1rem 0.1rem 10px #eea849');
            $("audio#pop")[0].play();
            setScore();
            if (level >= 16) {
                Win();
            } else {
                setTimeout(function() {
                    array = generateContent();
                    string = array[0];
                    answers = array[1];
                    correct_answer = array[2];

                }, 500);
            }
        } else {
            $(this).css('box-shadow', 'inset 300px 0px 0px 0.01px #f80759');
            Lose();
        }
    });
}



$(document).ready(function() {
    Game();
});