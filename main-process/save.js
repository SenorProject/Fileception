const {ipcMain, dialog} = require('electron')

ipcMain.on('create-file', (event, args) => {
  const options = {
    title: 'Save file (leave out extension)'
  }
  dialog.showSaveDialog({
    options
  }).then(filename => {
    event.sender.send("created-file", filename)
  })
})

ipcMain.on('decrypt-file', (event, args) => {
  var filename = ""
  event.sender.send("decrypted-file", filename)
  // const options = {
  //   title: 'Save file (leave out extension)'
  // }
  // const window = BrowserWindow.fromWebContents(event.sender)
  // dialog.showSaveDialog(window, {
  //   options
  // }).then(filename => {
  //   event.sender.send("decrypted-file", filename)
  // })
})

ipcMain.on('encrypt-file', (event, args) => {
  var filename = ""
  event.sender.send("encrypted-file", filename)
  // event.sender.send("encrypted-file", filename)
  // const options = {
  //   title: 'Save file (leave out extension)'
  // }
  // const window = BrowserWindow.fromWebContents(event.sender)
  // dialog.showSaveDialog(window, {
  //   options
  // }).then(filename => {
  //   event.sender.send("encrypted-file", filename)
  // })
})
