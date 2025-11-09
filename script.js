// Editor functionality
const editor = document.getElementById("editor")
const wordCountEl = document.getElementById("wordCount")
const charCountEl = document.getElementById("charCount")
const toolbarButtons = document.querySelectorAll(".toolbar-btn")

// Execute formatting command
function execCommand(command, value = null) {
  document.execCommand(command, false, value)
  updateActiveStates()
  editor.focus()
}

// Update active button states
function updateActiveStates() {
  toolbarButtons.forEach((btn) => {
    const command = btn.getAttribute("data-command")

    if (command) {
      if (command === "formatBlock") {
        const value = btn.getAttribute("data-value")
        const currentTag = document.queryCommandValue("formatBlock").toLowerCase()

        if (value === currentTag || (value === "blockquote" && currentTag === "blockquote")) {
          btn.classList.add("active")
        } else {
          btn.classList.remove("active")
        }
      } else {
        if (document.queryCommandState(command)) {
          btn.classList.add("active")
        } else {
          btn.classList.remove("active")
        }
      }
    }
  })
}

// Update word and character count
function updateStats() {
  const text = editor.innerText || ""
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)

  wordCountEl.textContent = words.length
  charCountEl.textContent = text.length
}

// Handle toolbar button clicks
toolbarButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault()

    const command = btn.getAttribute("data-command")
    const value = btn.getAttribute("data-value")

    if (command === "formatBlock" && value) {
      execCommand(command, `<${value}>`)
    } else if (command) {
      execCommand(command)
    }
  })
})

// Handle insert link button
document.getElementById("insertLink").addEventListener("click", (e) => {
  e.preventDefault()
  const url = prompt("Enter URL:")
  if (url) {
    execCommand("createLink", url)
  }
})

// Handle keyboard shortcuts
editor.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case "b":
        e.preventDefault()
        execCommand("bold")
        break
      case "i":
        e.preventDefault()
        execCommand("italic")
        break
      case "u":
        e.preventDefault()
        execCommand("underline")
        break
    }
  }
})

// Update stats and active states on input
editor.addEventListener("input", () => {
  updateStats()
  updateActiveStates()
})

// Update active states on selection change
editor.addEventListener("mouseup", updateActiveStates)
editor.addEventListener("keyup", updateActiveStates)

// Initialize
updateStats()
updateActiveStates()

// Prevent default paste behavior and clean HTML
editor.addEventListener("paste", (e) => {
  e.preventDefault()
  const text = e.clipboardData.getData("text/plain")
  document.execCommand("insertText", false, text)
})
