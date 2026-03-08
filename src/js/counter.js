let counterDisplay = document.getElementById('counterDisplay')
let targetDisplay = document.getElementById('targetDisplay')

let targetInput = document.getElementById('targetInput')

let counterValue = 0
let goals = 33

function setQuickTarget(value) {
    goals = value
    counterValue = 0
    targetDisplay.textContent = value
    counterDisplay.textContent = 0
    targetInput.value = ''
}

function incrementCounter() {
    if (counterValue < goals) {
        counterValue++
        counterDisplay.textContent = counterValue

        if (counterValue === goals) {
            alert("🎉 Target Reached!")
            counterDisplay.classList.add("text-green-500")
        }
    }
}

function decrementCounter() {
    if (counterValue > 0) {
        counterValue--
        counterDisplay.textContent = counterValue
        counterDisplay.classList.remove("text-green-500")
    }
}

function resetCounter() {
    if (confirm("Reset everything?")) {
        counterValue = 0
        goals = 33

        counterDisplay.textContent = 0
        counterDisplay.classList.remove("text-green-500")

        targetDisplay.textContent = 33
        targetInput.value = ""
    }
}

function setCustomTarget() {
    const inputValue = Number(targetInput.value)
    
    if (inputValue > 0) {
        goals = inputValue
        counterValue = 0
        targetDisplay.textContent = inputValue
        counterDisplay.textContent = 0
    } else {
        alert('Minimal Target 1')
    }
}

addBtn.addEventListener('click', incrementCounter)
resetBtn.addEventListener('click', resetCounter)
targetInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') setCustomTarget()
})