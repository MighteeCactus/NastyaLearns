import workbook from './workbook.js'

const tplHeader = document.querySelector('template#header').content
const tplAnswer = document.querySelector('template#q-answer').content
const tplQA = document.querySelector('template#q-variant').content
const tplQuestion = document.querySelector('template#question').content
const tplForm = document.querySelector('template#form').content

const containerLessons = document.querySelector('.content')
const containerHeaders = document.querySelector('.tab-header')

function initializeWorkbook() {
    for (let i in workbook) {
        const lesson = workbook[i]

        // header
        const header = tplHeader.cloneNode(true)
        header.querySelector('li').textContent = lesson.name_ru
        header.querySelector('li').setAttribute('title', lesson.name_en)
        containerHeaders.appendChild(header)


        // content
        const section = tplForm.cloneNode(true)
        section.querySelector('input#section').setAttribute('value', lesson.name_en)

        const desc = section.querySelector('.description')
        desc.textContent = lesson.desc_ru
        desc.setAttribute('title', lesson.desc_en)

        // questions
        const qs = section.querySelector('ul.questions')
        for(let k in lesson.tasks) {
            const task = lesson.tasks[k]

            const q = tplQuestion.cloneNode(true)
            q.querySelector('.ru').textContent = task.ru
            q.querySelector('.en').textContent = task.en

            const qanswer = tplAnswer.cloneNode(true)
            qanswer.querySelector('input').setAttribute('name', 'task_'+task.id)
            qanswer.querySelector('input').setAttribute('id', 'task_'+task.id)
            qanswer.querySelector('input').setAttribute('value', task.en)
            q.querySelector('li').appendChild(qanswer)

            qs.appendChild(q)
        }

        containerLessons.appendChild(section)
    }
}

document.addEventListener('DOMContentLoaded', initializeWorkbook)
