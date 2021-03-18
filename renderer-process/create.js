const { ipcRenderer } = require("electron")

var path1 = ""
var path2 = ""

document.getElementById("create-key").addEventListener("change", (event) =>{
    var flag = document.getElementById("create-key").value

    if (flag == "y"){
        document.getElementById("create-key-msg").style.display = "inline"
    }
    
    if (flag == "n"){
        document.getElementById("create-key-msg").style.display = "none"
    }
})

function handleBtnEnable(){
    if(path1 != "" && path2 != ""){
        document.getElementById("create-btn").disabled = false
        document.getElementById("create-btn").style.borderColor = "red"
        document.getElementById("create-btn").style.color = "red"
    }
}

// Send request to open visible file open dialog
document.getElementById("create-browse-1").addEventListener('click', (event) => {
    ipcRenderer.send('create-browse-1')
})

// Receive response from visible file open dialog
ipcRenderer.on('create-browsed-1', (event, path) => {
    if(path.filePaths[0] != null){
		path1 = path.filePaths[0]
		document.getElementById("create-path-1").value = path1
        handleBtnEnable()
	}
})

// Send request to open hidden file open dialog
document.getElementById("create-browse-2").addEventListener('click', (event) => {
    ipcRenderer.send('create-browse-2')
})

// Receive response from hidden file open dialog
ipcRenderer.on('create-browsed-2', (event, path) => {
    if(path.filePaths[0] != null){
		path2 = path.filePaths[0]
		document.getElementById("create-path-2").value = path2
        handleBtnEnable()
	}
})

// Send request to save file dialog
document.getElementById("create-btn").addEventListener('click', (event) => {
    ipcRenderer.send('create-file')
})

// Receive response from save file dialog
ipcRenderer.on('created-file', (event, path) => {
    console.log("save file path: ", path);
})