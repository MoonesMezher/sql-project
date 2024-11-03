/*!
 * mez-validation
 * Copyright(c) 2024-2025 Moones Mezher
 * MIT Licensed
 */

'use strict'

// check from valid syntax input
const validateInputSyntax = (output, arr) => {
    // valid types in library 
    const validTypes = [
        'required',
        'string',
        'number',
        'boolean',
        '[string]',
        '[number]',
        '[boolean]',
        'array',
        'email',
        'url',
        'date',
        'time',
        'phone'
    ]

    // valid types (with value like [x-y]) in library 
    const validTypesWithValues = [
        'eq:',
        'len:',
        'max:',
        'min:',
        'less:',
        'more:',
        'less-eq:',
        'more-eq:',
        'not-eq:',
        'contains:',
        'not-contains:',
        "in:",
        'not-in:'
    ]

    // types does not logical get to the same input
    const justOneOfThem = {
        types: [   
            'string',
            'number',
            'boolean',
            'array',
        ],
        format: [
            'email',
            'url',
            'date',
            'time',
            'phone'
        ]
    }

    // check from input is an array
    if(!arr || !Array.isArray(arr)) {
        throw new Error("Invalid input syntax: You must insert an array as parameter to validation method")
    }

    // check from input is not empty array
    if(arr.length === 0) {
        throw new Error("Invalid input syntax: You should have at least one input field in array parameter")
    }

    // check from each element in array input
    for(let i = 0; i < arr.length; i++) {
        const element = arr[i];

        const wrongInputsJustOneOfThemTypes = []
        const wrongInputsJustOneOfThemFormat = []

        // check if elemet is { } => empty object
        if(!element?.is && !element.data && !element.name) {
            throw new Error("Invalid input syntax: We can not accept empty object as input parameter")
        }

        // check if elemet has `is` prop
        if(element?.is) {
            // check `is` prop is an array
            if(!Array.isArray(element?.is)) {
                throw new Error(`Invalid input syntax: The element has ${i+1} index in the array must have 'is' attribute as an array`)
            }

            // apply valid types action
            for(let j = 0; j < element.is.length; j++) {
                const type = element.is[j];

                if(!validTypes.find(e => e === type) && !validTypesWithValues.find(e => type.includes(e))) {
                    throw new Error(`Invalid input syntax: This type {${type}} does not valid`)
                }

                if(validTypesWithValues.find(e => e.startsWith(type)) && (type.split(":").length !== 2 || type.endsWith(":"))) {
                    throw new Error(`Invalid input syntax: This type {${type}} must write like this ${type}value`)
                }

                if(justOneOfThem.types.find(e => e === type) && wrongInputsJustOneOfThemTypes.filter(e => e === type).length === 0) {
                    wrongInputsJustOneOfThemTypes.push(type)
                }

                if(justOneOfThem.format.find(e => e === type) && wrongInputsJustOneOfThemFormat.filter(e => e === type).length === 0) {
                    wrongInputsJustOneOfThemFormat.push(type)
                }

                if(wrongInputsJustOneOfThemTypes.length >= 2) {
                    throw new Error(`Invalid input syntax: You can not insert more than one type to the same value like (number, string, array, boolean), It is not logical!`)
                }

                if(wrongInputsJustOneOfThemFormat.length >= 2) {
                    throw new Error(`Invalid input syntax: You can not insert more than one format type to the same value like (date, time, url, email, phone), It is not logical!`)
                }
            }
        } else {
            element.is = ["any"]
        }
    }
}

// apply valid operation
const validateData = (output, arr) => {
    // make loop on all inputs 
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        
        // add virtual title to input that does not have name
        const title = element?.name || "Input"+(i+1);
        
        const checked = [];

        // make loop on all validation types 
        for (let j = 0; j < element.is.length; j++) {
            const element2 = element.is[j];

            // if the same type get twice or more => does not apply the validation (because it handled before to the same element)
            if(checked.find(e => e === element2.split(":")[0])) {
                continue;
            }

            checked.push(element2.split(":")[0]);
            

            if(element2[0] === 'any' || element.is.find(e => e === 'any')) {
                output.check.push({
                    title,
                    task: 'any',
                    pass: true
                })
            } else {
                // required type (can not be empty)
                if(element2 === 'required') {
                    if(!element.data) {
                        output.check.push({
                            title,
                            task: 'required',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'required', title)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'required',
                            pass: true
                        })
                    }
                }

                // string type
                if(element2 === 'string') {
                    if(typeof element.data !== 'string') {
                        output.check.push({
                            title,
                            task: 'string',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'string', title)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'string',
                            pass: true
                        })
                    }
                }

                // number type
                if(element2 === 'number') {
                    if(typeof element.data !== 'number') {
                        output.check.push({
                            title,
                            task: 'number',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'number', title)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'number',
                            pass: true
                        })
                    }
                }
                
                // array type
                if(element2 === 'array') {
                    if(!Array.isArray(element.data)) {
                        output.check.push({
                            title,
                            task: 'array',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'array', title)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'array',
                            pass: true
                        })
                    }
                }

                // boolean type
                if(element2 === 'boolean') {
                    if(typeof element.data !== 'boolean') {
                        output.check.push({
                            title,
                            task: 'boolean',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'boolean', title)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'boolean',
                            pass: true
                        })
                    }
                }

                // string array type
                if(element2 === '[string]') {
                    if(!Array.isArray(element.data)) {
                        output.check.push({
                            title,
                            task: '[string]',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, '[string]-array', title)
                        output.error = true
                        return;
                    }

                    if(element.data.find(e => (typeof e !== 'string'))) {
                        output.check.push({
                            title,
                            task: '[string]',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, '[string]', title)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: '[string]',
                            pass: true
                        })
                    }
                }

                // number array type
                if(element2 === '[number]') {
                    if(!Array.isArray(element.data)) {
                        output.check.push({
                            title,
                            task: '[number]',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, '[number]-array', title)
                        output.error = true
                        return;
                    }

                    if(element.data.find(e => (typeof e !== 'number'))) {
                        output.check.push({
                            title,
                            task: '[number]',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, '[number]', title)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: '[number]',
                            pass: true
                        })
                    }
                }

                // boolean array type
                if(element2 === '[boolean]') {
                    if(!Array.isArray(element.data)) {
                        output.check.push({
                            title,
                            task: '[boolean]',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, '[boolean]-array', title)
                        output.error = true
                        return;
                    }

                    if(element.data.find(e => (typeof e !== 'boolean'))) {
                        output.check.push({
                            title,
                            task: '[boolean]',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, '[boolean]', title)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: '[boolean]',
                            pass: true
                        })
                    }
                }

                // phone format type
                if(element2 === 'phone') {
                    const phoneRegex = /^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/;

                    if(phoneRegex.test(element.data)) {
                        output.check.push({
                            title,
                            task: 'phone',
                            pass: true
                        })
                    } else {
                        output.check.push({
                            title,
                            task: 'phone',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'phone', title)
                        output.error = true
                    }
                }

                // email format type
                if(element2 === 'email') {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                    if(emailRegex.test(element.data)) {
                        output.check.push({
                            title,
                            task: 'email',
                            pass: true
                        })
                    } else {
                        output.check.push({
                            title,
                            task: 'email',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'email', title)
                        output.error = true
                    }
                }

                // url format type
                if(element2 === 'url') {
                    const emailRegex = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]*[-A-Za-z0-9+&@#/%=~_|]$/;

                    if(emailRegex.test(element.data)) {
                        output.check.push({
                            title,
                            task: 'url',
                            pass: true
                        })
                    } else {
                        output.check.push({
                            title,
                            task: 'url',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'url', title)
                        output.error = true
                    }
                }

                // date format type
                if(element2 === 'date') {
                    const dateParts = element.data.split(/[-/.]/); // split the input into parts using -, ., or /

                    if (dateParts.length === 3) {
                        const year = parseInt(dateParts[0], 10);
                        const month = parseInt(dateParts[1], 10);
                        const day = parseInt(dateParts[2], 10);

                        const date = new Date(year, month - 1, day); // create a Date object

                        if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
                            output.check.push({
                                title,
                                task: 'date',
                                pass: true
                            })
                        } else {
                            output.check.push({
                                title,
                                task: 'date',
                                pass: false
                            })
    
                            output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                            handleMessages(output, 'date', title)
                            output.error = true
                        }
                    } else {
                        output.check.push({
                            title,
                            task: 'date',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'date', title)
                        output.error = true
                    }
                }

                // time format type
                if(element2 === 'time') {
                    const timeParts = element.data.split(/[:.]/); // split the input into parts using -, ., or /

                    if (timeParts.length === 3) {
                        const hours = parseInt(timeParts[0], 10);
                        const minutes = parseInt(timeParts[1], 10);
                        const seconds = parseInt(timeParts[2], 10);
                        const time = new Date(0, 0, 0, hours, minutes, seconds);

                        if (time.getHours() === hours && time.getMinutes() === minutes && time.getSeconds() === seconds) {                                output.check.push({
                                title,
                                task: 'time',
                                pass: true
                            })
                        } else {
                            output.check.push({
                                title,
                                task: 'time',
                                pass: false
                            })
    
                            output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                            handleMessages(output, 'time', title)
                            output.error = true
                        }
                    } else {
                        output.check.push({
                            title,
                            task: 'time',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'time', title)
                        output.error = true
                    }
                }

                // length of data is X
                if(element2.includes('len:')) {
                    const length = +element2.split(":")[1];

                    if(element.data.toString().length !== length) {
                        output.check.push({
                            title,
                            task: 'len',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'len', title, length)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'len',
                            pass: true
                        })
                    }
                }

                // max length of data is X
                if(element2.includes('max:')) {
                    const length = +element2.split(":")[1];

                    if(element.data.toString().length > length) {
                        output.check.push({
                            title,
                            task: 'max',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'max', title, length)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'max',
                            pass: true
                        })
                    }
                }

                // min length of data is X
                if(element2.includes('min:')) {
                    const length = +element2.split(":")[1];

                    if(element.data.toString().length < length) {
                        output.check.push({
                            title,
                            task: 'min',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'min', title, length)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'min',
                            pass: true
                        })
                    }
                }

                // data value less than X
                if(element2.includes('less:') && !element2.includes('eq')) {
                    const val = +element2.split(":")[1];

                    if(+element.data >= val) {
                        output.check.push({
                            title,
                            task: 'less',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'less', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'less',
                            pass: true
                        })
                    }
                }

                // dara value bigger than X
                if(element2.includes('more:') && !element2.includes('eq')) {
                    const val = +element2.split(":")[1];

                    if(+element.data <= val) {
                        output.check.push({
                            title,
                            task: 'more',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'more', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'more',
                            pass: true
                        })
                    }
                }

                // data value less than or equal X
                if(element2.includes('less-eq:')) {
                    const val = +element2.split(":")[1];

                    if(+element.data > val) {
                        output.check.push({
                            title,
                            task: 'less-eq',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'less-eq', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'less-eq',
                            pass: true
                        })
                    }
                }

                // data value bigger than or equal X
                if(element2.includes('more-eq:')) {
                    const val = +element2.split(":")[1];

                    if(+element.data < val) {
                        output.check.push({
                            title,
                            task: 'more-eq',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'more-eq', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'more-eq',
                            pass: true
                        })
                    }
                }

                // data value is equal X
                if(element2.includes('eq:') && !element2.startsWith('not-' || 'val-')) {
                    const val = +element2.split(":")[1];

                    if(element.data.toString() !== val.toString()) {
                        output.check.push({
                            title,
                            task: 'eq',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'eq', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'eq',
                            pass: true
                        })
                    }
                }

                // data value is not equal X
                if(element2.includes('not-eq:')) {
                    const val = +element2.split(":")[1];

                    if(element.data.toString() === val.toString()) {
                        output.check.push({
                            title,
                            task: 'not-eq',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'not-eq', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'not-eq',
                            pass: true
                        })
                    }
                }

                // data value is contains X
                if(element2.includes('contains:') && !element2.startsWith('not-')) {
                    const val = element2.split(":")[1];

                    if(!element.data.toString().includes(val)) {
                        output.check.push({
                            title,
                            task: 'contains',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'contains', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'contains',
                            pass: true
                        })
                    }
                }

                // data value is not contains X
                if(element2.includes('not-contains:')) {
                    const val = element2.split(":")[1];

                    if(element.data.toString().includes(val)) {
                        output.check.push({
                            title,
                            task: 'not-contains',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'not-contians', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'not-contains',
                            pass: true
                        })
                    }
                }

                // data value has X
                if(element2.includes('in:') && !element2.startsWith('not-')) {
                    const val = element2.split(":")[1]
                    
                    if(!Array.isArray(element.data)) {
                        output.check.push({
                            title,
                            task: 'in',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'in-array', title, val)
                        output.error = true
                        return;
                    }

                    if(!element.data.find(e => e.toString() === val.toString())) {
                        output.check.push({
                            title,
                            task: 'in',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'in', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'in',
                            pass: true
                        })
                    }
                }

                // data value does not has X
                if(element2.includes('not-in:')) {
                    const val = element2.split(":")[1];

                    if(!Array.isArray(element.data)) {
                        output.check.push({
                            title,
                            task: 'not-in',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'not-in-array', title, val)
                        output.error = true
                        return;
                    }

                    if(element.data.find(e => e.toString() === val.toString())) {
                        output.check.push({
                            title,
                            task: 'not-in',
                            pass: false
                        })

                        output.wrongInputs = [...output.wrongInputs.filter(e => e !== title), title]
                        handleMessages(output, 'not-in', title, val)
                        output.error = true
                    } else {
                        output.check.push({
                            title,
                            task: 'not-in',
                            pass: true
                        })
                    }
                }
            }
        }
    }
}

// Handle output messages
const handleMessages = (output, type, title, base = "") => {
    // messages array
    const messages = [
        {
            type: 'required',
            AR: `لا يجوز أن يكون فارغ ${title}`,
            EN: `${title} can not be empty`
        },
        {
            type: 'string',
            AR: `يجب أن يكون نص ${title}`,
            EN: `${title} must be string`
        },
        {
            type: 'number',
            AR: `يجب أن يكون رقم ${title}`,
            EN: `${title} must be number`
        },
        {
            type: 'boolean',
            AR: `يجب أن يكون صح أو خطأ ${title}`,
            EN: `${title} must be boolean`
        },
        {
            type: '[string]',
            AR: `يجب أن يكون مصفوفة نصوص ${title}`,
            EN: `${title} must be string array`
        },
        {
            type: '[number]',
            AR: `يجب أن يكون مصفوفة أرقام ${title}`,
            EN: `${title} must be number array`
        },
        {
            type: '[boolean]',
            AR: `يجب أن يكون مصفوفة من عناصر صح أو خطأ ${title}`,
            EN: `${title} must be boolean array`
        },
        {
            type: '[string]-array',
            AR: `${title} يجب أن يكون مصفوفة قبل تنفيذ التحقق في {[string]}`,
            EN: `${title} must be array before implement check in {[string]}`
        },
        {
            type: '[number]-array',
            AR: `${title} يجب أن يكون مصفوفة قبل تنفيذ التحقق في {[number]}`,
            EN: `${title} must be array before implement check in {[number]}`
        },
        {
            type: '[boolean]-array',
            AR: `${title} يجب أن يكون مصفوفة قبل تنفيذ التحقق في {[boolean]}`,
            EN: `${title} must be array before implement check in {[boolean]}`
        },
        {
            type: 'array',
            AR: `يجب أن يكون مصفوفة ${title}`,
            EN: `${title} must be an array`
        },
        {
            type: 'email',
            AR: `ليس إيميل صحيح ${title}`,
            EN: `${title} does not a valid email`
        },
        {
            type: 'url',
            AR: `ليس رابط صحيح ${title}`,
            EN: `${title} does not a valid url`
        },
        {
            type: 'date',
            AR: `ليس تاريخ صحيح ${title}`,
            EN: `${title} does not a valid date`
        },
        {
            type: 'time',
            AR: `ليس وقت صحيح ${title}`,
            EN: `${title} does not a valid time`
        },
        {
            type: 'phone',
            AR: `ليس رقم هاتف صحيح ${title}`,
            EN: `${title} does not a valid phone number`
        },
        {
            type: 'eq',
            AR: `يجب أن يكون مساوي ${title} ل ${base}`,
            EN: `${title} must be equal ${base}`
        },
        {
            type: 'len',
            AR: `طول ${title} يجب أن يكون مساوي ${base}`,
            EN: `${title} length must be equal ${base}`
        },
        {
            type: 'max',
            AR: `أقصى طول ${title} يجب أن يكون مساوي ${base}`,
            EN: `${title} max length must be equal ${base}`
        },
        {
            type: 'min',
            AR: `أدنى طول ${title} يجب أن يكون مساوي ${base}`,
            EN: `${title} min length must be equal ${base}`
        },
        {
            type: 'less',
            AR: `${title} يجب أن يكون أقل من ${base}`,
            EN: `${title} must be less than ${base}`
        },
        {
            type: 'more',
            AR: `${title} يجب أن يكون أكبر من ${base}`,
            EN: `${title} must be greater than ${base}`
        },
        {
            type: 'less-eq',
            AR: `${title} يجب أن يكون أقل من أو مساوي ${base}`,
            EN: `${title} must be less than or equal ${base}`
        },
        {
            type: 'more-eq',
            AR: `${title} يجب أن يكون أكبر من أو مساوي ${base}`,
            EN: `${title} must be greater than or equal ${base}`
        },
        {
            type: 'not-eq',
            AR: `${title} لا يجب أن يكون مساوي ${base}`,
            EN: `${title} can not be equal ${base}`
        },
        {
            type: 'contains',
            AR: `${title} يجب أن يحتوي على ${base}`,
            EN: `${title} must be contains ${base}`
        },
        {
            type: 'not-contains',
            AR: `${title} لا يجب أن يحتوي على ${base}`,
            EN: `${title} can not be contains ${base}`
        },
        {
            type: 'in',
            AR: `${title} يجب أن يحتوي على ${base}`,
            EN: `${title} must be contains ${base}`
        },
        {
            type: 'not-in',
            AR: `${title} لا يجب أن يحتوي على ${base}`,
            EN: `${title} can not be contains ${base}`
        },
        {
            type: 'in-array',
            AR: `${title} يجب أن يكون مصفوفة قبل تنفيذ التحقق في {in}`,
            EN: `${title} must be array before implement check in {in}`
        },
        {
            type: 'not-in-array',
            AR: `${title} يجب أن يكون مصفوفة قبل تنفيذ التحقق في {not-in}`,
            EN: `${title} must be array before implement check in {not-in}`
        }
    ];

    // get the fit messages
    const message = messages.find(e => e.type === type);

    // handle if the inserted type is valid
    if(message) {
        output.messages.push(message[Mez.language])
    } else {
        throw new Error("Invalid input: You insert invalid type, check the valid types list by visit my repo on github https://www.m.com/")
    }

}

// Main structure
const Mez = {
    // Language of messages
    language: "EN",

    // Select valid language method
    lang: (language = "EN") => {
        const validLangauges = ["EN", "AR"];

        if(!validLangauges.find(e => e === language)) {
            throw new Error("Invalid input: You insert invalid language, check the valid language list by visit my repo on github https://www.m.com/")
        }

        Mez.language = language;
    },

    // Main method to check (syntax, value)
    validation: (arr) => {
        const output = {
            messages: [],
            error: false,
            check: [],
            wrongInputs: [],
            status: 200,
        }
    
        try {
            // Check from input syntax
            validateInputSyntax(output, arr);
        
            // Check from data
            validateData(output, arr);
    
            output.status = output.error? 400: 200;
        
            return output
        } catch (error) {
            output.status = 401;
            throw new Error("mez-validation-" + error.message)
        }
    },
}

module.exports = Mez