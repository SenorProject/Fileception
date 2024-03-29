const {ipcMain, dialog, BrowserWindow} = require('electron')

ipcMain.on('create-browse-1', (event, args) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showOpenDialog(window,{
		properties: ['openFile']
	}).then (files => {
		if(files){
			event.sender.send('create-browsed-1', files)
		}
	})
})

ipcMain.on('create-browse-2', (event, args) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showOpenDialog(window,{
		properties: ['openFile']
	}).then (files => {
		if(files){
			event.sender.send('create-browsed-2', files)
		}
	})
})

ipcMain.on('decrypt-browse-1', (event, args) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showOpenDialog(window,{
		properties: ['openFile']
	}).then (files => {
		if(files){
			event.sender.send('decrypt-browsed-1', files)
		}
	})
})

ipcMain.on('decrypt-browse-key', (event, args) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showOpenDialog(window,{
		properties: ['openFile'],
    filters: [
      { name: 'key', extensions: ['txt'] }
    ]
	}).then (files => {
		if(files){
			event.sender.send('decrypt-browsed-key', files)
		}
	})
})

ipcMain.on('encrypt-browse-1', (event, args) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showOpenDialog(window,{
		properties: ['openFile']
	}).then (files => {
		if(files){
			event.sender.send('encrypt-browsed-1', files)
		}
	})
})

ipcMain.on('encrypt-browse-key', (event, args) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showOpenDialog(window,{
		properties: ['openFile'],
    filters: [
      { name: 'key', extensions: ['txt'] }
    ]
	}).then (files => {
		if(files){
			event.sender.send('encrypt-browsed-key', files)
		}
	})
})