// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

//Операторы
const operators = {
    ["+"]: { calc: (a, b) => a + b },  // сложение
    ["-"]: { calc: (a, b) => a - b },  //вычитание
    ["*"]: { calc: (a, b) => a * b },  // умножение
    ["/"]: { calc: (a, b) => a / b },  // деление
};

// Проверка, является ли строка str числом.
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).

function evaluate(str) {
    if(typeof str === 'string'){
        str = str.split(" ");
    }
    let stack = [];
    let result = "";
    for(let i = 0; i < str.length; i++){
        if(isNumeric(str[i])){
            stack.push(str[i])
        }
        else{
            var a = stack.pop();
            var b = 0;
            if(stack.length > 0){
                b = stack.pop();
            }
            stack.push(operators[str[i]].calc(Number(b), Number(a)));
        }
    }
    if(stack.length > 1){
        result = evaluate(stack);
    }
    else{
        result = stack.pop();
    }
    return result;
}

// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.

function clickHandler(event) {
    let target = event.target;
    let screen = document.getElementsByClassName("screen")[0];
    if(target.className == "key result"){
        let result = "=" + evaluate(compile(input));
        screen.getElementsByTagName('span')[0].innerHTML += result;
    }
    else if(target.className == "key clear"){
        input = "";
        screen.getElementsByTagName('span')[0].innerHTML = "";
    }
    else{
        if(screen.getElementsByTagName('span')[0].innerHTML.includes("=")){
            screen.getElementsByTagName('span')[0].innerHTML = "";
        }
        if(input.length < 19){
            screen.getElementsByTagName('span')[0].innerHTML += target.innerText;
            input += target.innerText;
        }
    }

}


// Назначьте нужные обработчики событий.
window.onload = function () {
    var digits = document.getElementsByClassName("digits")[0];
    var other = document.getElementsByClassName("other")[0];
    digits.addEventListener('click', event => {
        if(event.target != digits){
            clickHandler(event);
        }
    });
    other.addEventListener('click', event => {
        if(event.target != other){
            clickHandler(event);
        }
    });
}

var input = "";