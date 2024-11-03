# mez-validation

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][github-actions-ci-image]][github-actions-ci-url]
[![Test Coverage][coveralls-image]][coveralls-url]

It is a pure and open source node js library that provides validation method to check from inputs and thier data

## First lunch
**Date**: 2024-10-25

## Installation
```sh
$ npm install --save mez-validaton
```

## How it works?
After install this library yuo just have to select the language wich you want to show messages by it, then you have to call validation method to enter the data

## Valid languages
- EN => english (default)
- AR => arabic

### Ex1:
```js
const age = 10;

Mez.lang("AR") // langauge of messages will shown in arabic

Mez.validation([
    {
        name: "age",
        data: age,
        is: ["required", "number", "less:15"]
    }
])
```

=> value will return: 
```js
{
    messages: [],
    error: false,
    check: [
        { title: 'age', task: 'required', pass: true },
        { title: 'age', task: 'number', pass: true },
        { title: 'age', task: 'less', pass: true },
    ],
    wrongInputs: [],
    status: 200
}
```

### Ex2:
```js
const age = 10;

Mez.validation([
    {
        name: "age",
        data: age,
        is: ["required", "string"] 
    }
])
```
=> value will return: 
```js
{
    messages: ["age must be string"], // default language is "English"
    error: true,
    check: [
        { title: 'age', task: 'required', pass: true },
        { title: 'age', task: 'string', pass: false },
    ],
    wrongInputs: [ "age" ],
    status: 400
}
```

**Note**: if is array to any element is empty or null it will take `any` type which accept anything and that is mean his pass value is true

## Messages array
It provides a list of messages to be displayed when validation fails in task related in an input

## Error value
If all tasks is passed in check array => error: false, status: 200, if one task or more is not passed in check array => error: true, status: 400   

## Check array
It will ensure to check on all data and all tasks if passed or no and to handle your messages if you want

## WrongInputs array
It will contains a list of variables name which not passed in check array

## Status value 
- 200: Success (all tasks are passed in check array)
- 400: Error (there one task or more is not passed in check array)

## How can i use Mez.validation method?
```js
const age = 10;

const validation = Mez.validation([
    {
        name: "age",
        data: age,
        is: ["required", "string"]
    }
])

if(validation.error) {
    conosole.log({state: 'falied', wrongInputs: validation.wrongInputs})
} else {
    conosole.log({state: 'success'})
}
```

**Note**: if you not insert a name to the data, it will take an default name which depaned on his index in inputs 

### Ex:
```js
const validation = Mez.validation([
    {
        data: age, // Default name: Input1 
        is: ["required", "string"]
    }
])
```

**Note**: all of these patterns will return synatx error

- 1
```js
Mez.validation()
```
- 2
```js
Mez.validation([
    {
        is: ["required", "string"]
    }
])
```
- 3
```js
Mez.validation([
    {
        data: age,
    }
])
```

## Valid Types to check in is array 
- `required` => data must be required and can not be empty or null
- `string` => type of data must be a string
- `number` => type of data must be a number
- `boolean` => type of data must be a boolean
- `[string]` => type of data must be a string array (all elements of array must be string)
- `[number]` => type of data must be a number array (all elements of array must be number)
- `[boolean]` => type of data must be a boolean array (all elements of array must be boolean)
- `array` => type of data must be an array
- `email` => data must be have a valid email format
- `url` => data must be have a valid email format
- `date` => data must be have a valid data format depending on (YYYY-MM-DD)
- `time` => data must be have a valid time format depending on (HH:MM:SS)
- `phone` => data must be have a valid phone format
- `eq:X` => data must be equal X value (X must be selected by the developer)
- `len:X` => length of data must be equal X value (X must be selected by the developer)
- `max:X` => length of data must be equal or less than X value (X must be selected by the developer)
- `min:X` => length of data must be equal or greater than X value (X must be selected by the developer)
- `less:X` => data must be less than X value (X must be selected by the developer)
- `more:X` => data must be greater thanX value (X must be selected by the developer)
- `less-eq:X` => data must be equal or less than X value (X must be selected by the developer)
- `more-eq:X` => data must be equal or greater than X value (X must be selected by the developer)
- `not-eq:X` => data can not be equal X value (X must be selected by the developer)
- `contains:X` => data must be contains X value (X must be selected by the developer)
- `not-contains:X` => data can not be contains X value (X must be selected by the developer)
- `in:X` => data must be has X value (X must be selected by the developer) **Note**: this data must be an array to implement the in task
- `not-in:X` => data can not be has X value (X must be selected by the developer) **Note**: this data must be an array to implement the in task

## License

[MIT](LICENSE)