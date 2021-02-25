const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');

// require('electron-reload')(__dirname); // Buggy but is useful

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const isMac = process.platform === 'darwin'

const template = []

const templateMac = [
	// { role: 'appMenu' }
	...(isMac ? [{
	  label: app.name,
	  submenu: [
		{ role: 'about' },
		{ type: 'separator' },
		{ role: 'hide' },
		{ role: 'hideothers' },
		{ role: 'unhide' },
		{ type: 'separator' },
		{ role: 'quit' }
	  ]
	}] : []),
	// { role: 'fileMenu' }
	{
	  label: 'File',
	  submenu: [
		isMac ? { role: 'close' } : { role: 'quit' }
	  ]
	},
	// { role: 'editMenu' }
	{
	  label: 'Edit',
	  submenu: [
		{ role: 'undo' },
		{ role: 'redo' },
		{ type: 'separator' },
		{ role: 'cut' },
		{ role: 'copy' },
		{ role: 'paste' },
		...(isMac ? [
		  { role: 'pasteAndMatchStyle' },
		  { role: 'delete' },
		  { role: 'selectAll' },
		  { type: 'separator' },
		  {
			label: 'Speech',
			submenu: [
			  { role: 'startSpeaking' },
			  { role: 'stopSpeaking' }
			]
		  }
		] : [
		  { role: 'delete' },
		  { type: 'separator' },
		  { role: 'selectAll' }
		])
	  ]
	},
	// { role: 'viewMenu' }
	{
	  label: 'View',
	  submenu: [
		{ role: 'togglefullscreen' }
	  ]
	},
	// { role: 'windowMenu' }
	{
	  label: 'Window',
	  submenu: [
		{ role: 'minimize' },
		{ role: 'zoom' },
		...(isMac ? [
		  { type: 'separator' },
		  { role: 'front' },
		  { type: 'separator' },
		  { role: 'window' }
		] : [
		  { role: 'close' }
		])
	  ]
	},
  ]

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
	height: 830,
	minWidth: 750,
	minHeight: 820,
    webPreferences: {
		devTools: true,
		nodeIntegration: true,
		// contextIsolation: false
	},
	titleBarStyle: 'hidden',
	icon: __dirname + '/assets/icons/icon.png'
  });

var fileext = "";

ipcMain.on('open-file1', (event) => {
	dialog.showOpenDialog({
		properties: ['openFile']
	}).then (files => {
		if(files){
			// fileext = files.filePaths[0].substring(files.filePaths[0].lastIndexOf('.') + 1)
			event.sender.send('selected-directory1', files)
		}
	})
})

ipcMain.on('open-file-dialog1', (event) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showOpenDialog(window, {
		properties: ['openFile']
	}).then(files => {
		if(files){
			// fileext = files.filePaths[0].substring(files.filePaths[0].lastIndexOf('.') + 1)
			event.sender.send('selected-directory1', files)
		}
	})
})

ipcMain.on('open-file2', (event) => {
	dialog.showOpenDialog({
		properties: ['openFile']
	}).then (files => {
		if(files){
			event.sender.send('selected-directory2', files)
		}
	})
})

ipcMain.on('open-file-dialog2', (event) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showOpenDialog(window, {
		properties: ['openFile']
	}).then(files => {
		if(files){
			event.sender.send('selected-directory2', files)
		}
	})
})

ipcMain.on('save-dialog1', (event, args) => {
	dialog.showSaveDialog({
		defaultPath: `combined.`+args,
	}).then(filename=>{
		event.sender.send('saved-file1', filename)
	})
})

ipcMain.on('save-dialog-dialog1', (event, args) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showSaveDialog(window, {
		defaultPath: `combined.`+args,
	}).then(filename=>{
		event.sender.send('saved-file1', filename)
	})
})

ipcMain.on('save-dialog2', (event, args) => {
	dialog.showSaveDialog({
		defaultPath: `combined.`+args,
	}).then(filename=>{
		event.sender.send('saved-file2', filename)
	})
})

ipcMain.on('save-dialog-dialog2', (event, args) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showSaveDialog(window, {
		defaultPath: `combined.`+args,
	}).then(filename=>{
		event.sender.send('saved-file2', filename)
	})
})

ipcMain.on('open-file3', (event) => {
	dialog.showOpenDialog({
		properties: ['openFile']
	}).then (files => {
		if(files){
			event.sender.send('selected-directory2', files)
		}
	})
})

ipcMain.on('open-file-dialog3', (event) => {
	const window = BrowserWindow.fromWebContents(event.sender)
	dialog.showOpenDialog(window, {
		properties: ['openFile']
	}).then(files => {
		if(files){
			event.sender.send('selected-directory3', files)
		}
	})
})

  const menu = isMac ? Menu.buildFromTemplate(templateMac) : Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
