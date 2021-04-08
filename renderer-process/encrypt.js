const { dialog, ipcRenderer } = require("electron")
const app = require('electron').remote.app
const { exec } = require('child_process')
const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'
const arch = process.arch

var path1 = ""
var keypath = ""

document.getElementById("encrypt-key").addEventListener("change", (event) =>{
    var flag = document.getElementById("encrypt-key").value

    if (flag == "y"){
        document.getElementById("encrypt-yeskey").style.display = "flex"
    }
    
    if (flag == "n"){
        document.getElementById("encrypt-yeskey").style.display = "none"
    }
})

function handleBtnEnable(){
    if(path1 != ""){
        document.getElementById("encrypt-btn").disabled = false
        document.getElementById("encrypt-btn").style.borderColor = "red"
        document.getElementById("encrypt-btn").style.color = "red"
    }
}

// Send request to open existing file open dialog
document.getElementById("encrypt-browse-1").addEventListener('click', (event) => {
    ipcRenderer.send('encrypt-browse-1')
})

// Receive response from existing file open dialog
ipcRenderer.on('encrypt-browsed-1', (event, path) => {
    if(path.filePaths[0] != null){
		path1 = path.filePaths[0]
		document.getElementById("encrypt-path-1").value = path1
        handleBtnEnable()
	}
})

// Send request to open key file open dialog
document.getElementById("encrypt-browse-key").addEventListener('click', (event) => {
    ipcRenderer.send('encrypt-browse-key')
})

// Receive response from key file open dialog
ipcRenderer.on('encrypt-browsed-key', (event, path) => {
    if(path.filePaths[0] != null){
		keypath = path.filePaths[0]
		document.getElementById("encrypt-path-key").value = keypath
	}
})

// Send request to save file dialog
document.getElementById("encrypt-btn").addEventListener('click', (event) => {
    ipcRenderer.send('encrypt-file')
})

// Receive response from save file dialog
ipcRenderer.on('encrypted-file', (event, path) => {
	flag = document.getElementById("encrypt-key").value == "y"
    opt = "e"
	if(flag){
		if (isMac){
			exec(`${app.getAppPath()}/renderer-process/py/intelmac -${opt} ${path1} ${keypath}`, (error, stdout, stderr) => {
				console.log(`stdout: ${stdout}`);
			})
		}
		else if (isWin){
			if(arch=="x64"){
				exec(`${app.getAppPath()}\\renderer-process\\py\\winx64.exe -${opt} ${path1} ${keypath}`, (error, stdout, stderr) => {
					console.log(`stdout: ${stdout}`);
				})	
			}
			else{
				exec(`${app.getAppPath()}\\renderer-process\\py\\winx32.exe -${opt} ${path1} ${keypath}`, (error, stdout, stderr) => {
					console.log(`stdout: ${stdout}`);
				})	
			}
		}
		else if (isLinux){
			exec(`${app.getAppPath()}/renderer-process/py/linux -${opt} ${path1} ${keypath}`, (error, stdout, stderr) => {
				console.log(`stdout: ${stdout}`);
			})	
		}
	}
	else{
		if (isMac){
			exec(`${app.getAppPath()}/renderer-process/py/intelmac -${opt} ${path1}`, (error, stdout, stderr) => {
				console.log(`stdout: ${stdout}`);
			})
		}
		else if (isWin){
			if(arch=="x64"){
				exec(`${app.getAppPath()}\\renderer-process\\py\\winx64.exe -${opt} ${path1}`, (error, stdout, stderr) => {
					console.log(`stdout: ${stdout}`);
				})	
			}
			else{
				exec(`${app.getAppPath()}\\renderer-process\\py\\winx32.exe -${opt} ${path1}`, (error, stdout, stderr) => {
					console.log(`stdout: ${stdout}`);
				})	
			}
		}
		else if (isLinux){
			exec(`${app.getAppPath()}/renderer-process/py/linux -${opt} ${path1}`, (error, stdout, stderr) => {
				console.log(`stdout: ${stdout}`);
			})	
		}
	}
})