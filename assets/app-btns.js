const settings = require('electron-settings')

const appBtns = document.querySelectorAll('.js-container-target')
// Listen for app button clicks
Array.prototype.forEach.call(appBtns, (btn) => {
  btn.addEventListener('click', (event) => {
    const parent = event.target.parentElement

    // Toggles the "is-open" class on the app's parent element.
    parent.classList.toggle('is-open')

    // Saves the active app if it is open, or clears it if the app was user
    // collapsed by the user
    if (parent.classList.contains('is-open')) {
      settings.set('activeAppButtonId', event.target.getAttribute('id'))
    } else {
      settings.delete('activeAppButtonId')
    }
  })
})

// Default to the app that was active the last time the app was open
const buttonId = settings.get('activeAppButtonId')
if (buttonId) {
  document.getElementById(buttonId).click()
}
