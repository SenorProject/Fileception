const { dialog, ipcRenderer } = require("electron")
const app = require('electron').remote.app
const { exec } = require('child_process')
const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'
const arch = process.arch

var path1 = ""
var keypath = ""

document.getElementById("decrypt-key").addEventListener("change", (event) =>{
    var flag = document.getElementById("decrypt-key").value

    if (flag == "y"){
        document.getElementById("decrypt-yeskey").style.display = "flex"
    }
    
    if (flag == "n"){
        document.getElementById("decrypt-yeskey").style.display = "none"
    }
})

function handleBtnEnable(){
    if(path1 != ""){
        document.getElementById("decrypt-btn").disabled = false
        document.getElementById("decrypt-btn").style.borderColor = "red"
        document.getElementById("decrypt-btn").style.color = "red"
    }
}

// Send request to open existing file open dialog
document.getElementById("decrypt-browse-1").addEventListener('click', (event) => {
    ipcRenderer.send('decrypt-browse-1')
})

// Receive response from existing file open dialog
ipcRenderer.on('decrypt-browsed-1', (event, path) => {
    if(path.filePaths[0] != null){
		path1 = path.filePaths[0]
		document.getElementById("decrypt-path-1").value = path1
        handleBtnEnable()
	}
})

// Send request to open key file open dialog
document.getElementById("decrypt-browse-key").addEventListener('click', (event) => {
    ipcRenderer.send('decrypt-browse-key')
})

// Receive response from key file open dialog
ipcRenderer.on('decrypt-browsed-key', (event, path) => {
    if(path.filePaths[0] != null){
		keypath = path.filePaths[0]
		document.getElementById("decrypt-path-key").value = keypath
	}
})

// Send request to save file dialog
document.getElementById("decrypt-btn").addEventListener('click', (event) => {
    ipcRenderer.send('decrypt-file')
})

// Receive response from save file dialog
ipcRenderer.on('decrypted-file', (event, path) => {
    // console.log("save file path: ", path);
	flag = document.getElementById("decrypt-key").value == "y"
    opt = "d"
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