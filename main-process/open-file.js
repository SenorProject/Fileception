const {ipcMain, dialog} = require('electron')

ipcMain.on('create-browse-1', (event, args) => {
	dialog.showOpenDialog({
		properties: ['openFile']
	}).then (files => {
		if(files){
			event.sender.send('create-browsed-1', files)
		}
	})
})

ipcMain.on('create-browse-2', (event, args) => {
	dialog.showOpenDialog({
		properties: ['openFile']
	}).then (files => {
		if(files){
			event.sender.send('create-browsed-2', files)
		}
	})
})