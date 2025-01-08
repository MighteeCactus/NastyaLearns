import workbook from './workbook.js'

const MAX_TASKS = 5
const MAX_ATTEMPTS = 15

const tplAnswer = document.querySelector('template#q-answer').content
const tplQuestion = document.querySelector('template#question').content
const tplForm = document.querySelector('template#form').content

const containerLessons = document.querySelector('.content')

function initializeWorkbook() {
    for (let i in workbook) {
        const lesson = workbook[i]

        const section = tplForm.cloneNode(true)

        section.querySelector('form').lesson = lesson

        // header
        const header = section.querySelector('summary')
        header.textContent = lesson.name_ru
        header.setAttribute('title', lesson.name_en)

        section.querySelector('input#section').setAttribute('value', lesson.name_en)

        const desc = section.querySelector('.description')
        desc.textContent = lesson.desc_ru
        desc.setAttribute('title', lesson.desc_en)

        updateQuestions(section.querySelector('form'))
        // questions
        const qs = section.querySelector('ul.questions')

        section.querySelector('form').addEventListener('submit', (evt) => {
            evt.preventDefault()
            evt.stopPropagation()

            const inputs = qs.querySelectorAll('input[type="text"]')
            let count = 0
            inputs.forEach((input, i) => {
                const value = input.value.toLowerCase().trim().replaceAll(" ", "")
                if (value === '') return

                const answer = input.getAttribute('data-answer').toLowerCase().trim().replaceAll(" ", "")
                input.classList.remove('succ', 'fail')
                input.classList.add(answer === value ? 'succ' : 'fail')
                if (answer === value) count++
            })

            const form = evt.target.closest('form')
            form.attempts++

            if (count === inputs.length) {
                evt.target.submit()
            } else if (form.attempts >= MAX_ATTEMPTS && form.lesson.answers_allowed) {
                form.querySelectorAll('.give-up').forEach(el => el.classList.add('on'))
            }
        })

        section.querySelector('button.submit').addEventListener('click', (evt) => {
            evt.target.classList.add('btn-react')
            setTimeout(function() { evt.target.classList.remove('btn-react') }, 2100)
        })

        section.querySelector('button.give-new').addEventListener('click', (evt) => {
            evt.preventDefault()
            evt.stopPropagation()

            updateQuestions(evt.target)
        })

        containerLessons.appendChild(section)
    }
}

document.addEventListener('DOMContentLoaded', initializeWorkbook)

function updateQuestions(elem) {
    const form = elem.closest('form')

    form.attempts = 0

    // questions
    const qs = form.querySelector('ul.questions')
    qs.querySelectorAll('li').forEach(el => el.remove())

    shuffleArray(form.lesson.tasks)
    const tasks = form.lesson.tasks.slice(0, MAX_TASKS)
    shuffleArray(tasks)

    for(let k in tasks) {
        const task = tasks[k]

        const q = tplQuestion.cloneNode(true)
        q.querySelector('.ru').innerHTML = generateHints(task.ru)
        q.querySelector('.en').innerHTML = generateQuestionWithInputs(task.en)


        const qanswer = tplAnswer.cloneNode(true)
        qanswer.querySelector('input').setAttribute('name', 'task_'+task.id)
        qanswer.querySelector('input').setAttribute('id', 'task_'+task.id)
        qanswer.querySelector('input').setAttribute('value', task.en)
        q.querySelector('li').appendChild(qanswer)

        qs.appendChild(q)
    }

    qs.querySelectorAll('input[type="text"]').forEach((input, i) => {
        input.id = `v${i+1}`
        input.setAttribute('name', `v${i+1}`)
    })
    qs.querySelectorAll('input[type="hidden"]').forEach((input, i) => {
        input.id = `q${i+1}`
        input.setAttribute('name', `q${i+1}`)
    })

    form.querySelector('button.submit').disabled   = tasks.length === 0
    form.querySelector('button.give-new').disabled = tasks.length === 0
}



function generateQuestionWithInputs(str) {
    const pairs = extractQuestions(str)
    let result = str
    for (let i in pairs)
    {
        const pair = pairs[i]
        const chunk = str.substring(pair[0], pair[1]+1)
        result = result.replace(
            chunk,
            `<input type="text" autocomplete="off" id="v?" name="v?" maxlength="${chunk.length+2}" size="${chunk.length+2}" data-answer="${chunk.slice(1, -1)}">`)
    }

    result += `<input type="hidden" id="q?" name="q?" value="${str}"> <span class="give-up">${str.replaceAll('_', '')}</span>`

    return result
}

function generateHints(str) {
    const pairs = extractQuestions(str)
    let result = str
    for (let i in pairs)
    {
        const pair = pairs[i]
        const chunk = str.substring(pair[0], pair[1]+1)
        result = result.replace(
            chunk,
            `<span class="hint">${chunk.slice(1, -1)}</span>`)
    }

    return result
}

function extractQuestions(str, search = "_") {
    if (str.length === 0)
        return []

    let indices = []
    let start = 0
    let index
    while ((index = str.indexOf(search, start)) > -1) {
        indices.push(index);
        start = index + search.length;
    }

    const pairs = []
    index = 0
    while (index < indices.length) {
        if (index % 2 === 0)
        {
            pairs.push(indices.slice(index, index + 2))
            console.log()
        }

        index++
    }

    return pairs
}

// source: https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
const shuffleArray = array =>
{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
