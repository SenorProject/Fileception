const { ipcRenderer } = require("electron")

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

// Send request to open existing file open dialog
document.getElementById("decrypt-browse-1").addEventListener('click', (event) => {
    ipcRenderer.send('decrypt-browse-1')
})

// Receive response from existing file open dialog
ipcRenderer.on('decrypt-browsed-1', (event, path) => {
    if(path.filePaths[0] != null){
		path1 = path.filePaths[0]
		document.getElementById("decrypt-path-1").value = path1
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
    console.log("save file path: ", path);
})