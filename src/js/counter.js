let addBtn = document.getElementById('add-counter')
let counterDisplay = document.getElementById('counterDisplay')

let setTargetBtn = document.getElementById('setTarget')
let resetBtn = document.getElementById('resetBtn')

let targetInput = document.getElementById('targetInput')

let counterValue = 0
let goals = 33

function incrementCounter() {
    counterValue++
    counterDisplay.textContent = counterValue

    if (goals !== 0 && counterValue === goals) {
        alert("Target Reached!")
    }
}

function setGoals() {
    goals = Number(targetInput.value)

    if (goals > 0) {
        targetInput.classList.remove("border")
        targetInput.classList.add("border-2", "border-blue", "bg-blue-50")
    }else{
        alert('Minimal Target 1')
    }
}

function resetCounter() {
    if (confirm("Reset everything?")) {
        counterValue = 0
        goals = 0

        counterDisplay.textContent = 0
        counterDisplay.classList.remove("text-green-500")

        targetInput.value = ""
        targetInput.classList.remove("border-2", "border-blue-500", "bg-blue-50")
    }
}

addBtn.addEventListener('click', incrementCounter)
setTargetBtn.addEventListener('click', setGoals)
resetBtn.addEventListener('click', resetCounter)