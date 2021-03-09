const { dialog, ipcRenderer } = require("electron")
const { exec } = require('child_process')
const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'
const arch = process.arch

//Future Reference Code

// var windowTopBar = document.createElement('div')
//     windowTopBar.style.width = "100%"
//     windowTopBar.style.height = "32px"
//     windowTopBar.style.position = "absolute"
//     windowTopBar.style.top = windowTopBar.style.left = 0
//     windowTopBar.style.webkitAppRegion = "drag"
//     document.body.appendChild(windowTopBar)


// document.getElementById("opt1").addEventListener('click', () => {
//     var x = document.getElementById("smt");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
// });

// // btn.dispatchEvent(new Event('click'));


// Vars for app windows

var x = document.getElementById("mainwindow");
var y = document.getElementById("createfile")
var z = document.getElementById('flipfile')
var highlight = 'black'

// Main window actions small

document.getElementById("opt1").addEventListener('click', () => {
	x.style.display = "none";
	y.style.display = "block"
});

document.getElementById("opt1").onmouseover = () => {
	var x = document.getElementById("opt1");
	x.style.backgroundColor = highlight
};

document.getElementById("opt1").onmouseout = () => {
	var x = document.getElementById("opt1");
	x.style.backgroundColor = null
};

document.getElementById("opt2").addEventListener('click', () => {
	x.style.display = "none";
	z.style.display = "block"
});

document.getElementById("opt2").onmouseover = () => {
	var x = document.getElementById("opt2");
	x.style.backgroundColor = highlight
};

document.getElementById("opt2").onmouseout = () => {
	var x = document.getElementById("opt2");
	x.style.backgroundColor = null
};

document.getElementById("opt3").onmouseover = () => {
	var x = document.getElementById("opt3");
	x.style.backgroundColor = highlight
};

document.getElementById("opt3").onmouseout = () => {
	var x = document.getElementById("opt3");
	x.style.backgroundColor = null
};

// Main window actions big

document.getElementById("opt1-big").addEventListener('click', () => {
	x.style.display = "none";
	y.style.display = "block"
});

document.getElementById("opt1-big").onmouseover = () => {
	var x = document.getElementById("opt1-big");
	x.style.backgroundColor = highlight
};

document.getElementById("opt1-big").onmouseout = () => {
	var x = document.getElementById("opt1-big");
	x.style.backgroundColor = null
};

document.getElementById("opt2-big").addEventListener('click', () => {
	x.style.display = "none";
	z.style.display = "block"
});

document.getElementById("opt2-big").onmouseover = () => {
	var x = document.getElementById("opt2-big");
	x.style.backgroundColor = highlight
};

document.getElementById("opt2-big").onmouseout = () => {
	var x = document.getElementById("opt2-big");
	x.style.backgroundColor = null
};

document.getElementById("opt3-big").onmouseover = () => {
	var x = document.getElementById("opt3-big");
	x.style.backgroundColor = highlight
};

document.getElementById("opt3-big").onmouseout = () => {
	var x = document.getElementById("opt3-big");
	x.style.backgroundColor = null
};

// Create File Window

var file1 = "";
var file2 = "";

document.getElementById("backbutton").addEventListener('click', () => {
	x.style.display = "block";
	y.style.display = "none";
	document.getElementById("filelocation1").value = ""
	document.getElementById("filelocation2").value = ""
	document.getElementById("opt4").disabled = false
	document.getElementById("opt4").style.color = "grey"
});

document.getElementById("dragfile1").addEventListener('drop', (event) => { 
	if(y.style.display != "none"){
		event.preventDefault(); 
		event.stopPropagation(); 
  
		for (const f of event.dataTransfer.files) { 
			// Using the path attribute to get absolute file path 
			file1 = f.path 
			var elem = document.getElementById("filelocation1")
			elem.innerHTML = ""
			elem.value = file1
			if(document.getElementById("filelocation2").value != ""){
				document.getElementById("opt4").style.color = "inherit"
				document.getElementById("opt4").disabled = false
			}
		} 
	}	
}); 
  
document.getElementById("dragfile1").addEventListener('dragover', (e) => { 
	e.preventDefault(); 
	e.stopPropagation(); 
  }); 

document.getElementById("dragfile2").addEventListener('drop', (event) => { 
	if(y.style.display != "none"){
		event.preventDefault(); 
		event.stopPropagation(); 
  
		for (const f of event.dataTransfer.files) { 
			// Using the path attribute to get absolute file path 
			file2 = f.path 
			var elem = document.getElementById("filelocation2") 
			elem.innerHTML = ""
			elem.value = file2
			if(document.getElementById("filelocation1").value != ""){
				document.getElementById("opt4").style.color = "inherit"
				document.getElementById("opt4").disabled = false
			}
		} 
	}	
}); 
  
document.getElementById("dragfile2").addEventListener('dragover', (e) => { 
	e.preventDefault(); 
	e.stopPropagation(); 
}); 

document.getElementById("dragfile1").addEventListener('click', (event) => {
	if(isMac){
		ipcRenderer.send('open-file-dialog1')
	} else {
		ipcRenderer.send('open-file1') 
	}
});

document.getElementById("dragfile2").addEventListener('click', (event) => {
	if(isMac){
		ipcRenderer.send('open-file-dialog2')
	} else {
		ipcRenderer.send('open-file2') 
	}
});

document.getElementById('opt4').addEventListener('click', (event) => {
	fileext = file1.substring(file1.lastIndexOf('.') + 1)
	if(isMac){
		ipcRenderer.send('save-dialog-dialog1', fileext)
	} else {
		ipcRenderer.send('save-dialog1', fileext)
	}
})

ipcRenderer.on('selected-directory1', (event, path) =>{
	var elem = document.getElementById("filelocation1")
	elem.innerHTML = ""
	if(path.filePaths[0] != null){
		file1 = path.filePaths[0]
		elem.value = file1
	}
	if(document.getElementById("filelocation2").value != ""){
		document.getElementById("opt4").style.color = "inherit"
		document.getElementById("opt4").disabled = false
	}
})

ipcRenderer.on('selected-directory2', (event, path) =>{
	var elem = document.getElementById("filelocation2")
	elem.innerHTML = ""
	if(path.filePaths[0] != null){
		file2 = path.filePaths[0]
		elem.value = file2
	}
	if(document.getElementById("filelocation1").value != ""){
		document.getElementById("opt4").style.color = "inherit"
		document.getElementById("opt4").disabled = false
	}
})

ipcRenderer.on('saved-file1', (event, path) => {
	// let options = {
	// 	scriptPath: process.cwd()+'/src/py',
	// 	pythonPath: 'python',
	// 	args: [file2, file1, path.filePath]
	// };
	if (isMac){
		exec(`${process.cwd()}/src/py/intelmac ${file2} ${file1} ${path.filePath}`, (error, stdout, stderr) => {
			console.log(`stdout: ${stdout}`);
		})
	}
	else if (isWin){
		if(arch="x64"){
			exec(`${process.cwd()}/src/py/winx64.exe ${file2} ${file1} ${path.filePath}`, (error, stdout, stderr) => {
				console.log(`stdout: ${stdout}`);
			})	
		}
		else{
			exec(`${process.cwd()}/src/py/winx32.exe ${file2} ${file1} ${path.filePath}`, (error, stdout, stderr) => {
				console.log(`stdout: ${stdout}`);
			})	
		}
	}
	else if (isLinux){
		exec(`${process.cwd()}/src/py/linux ${file2} ${file1} ${path.filePath}`, (error, stdout, stderr) => {
			console.log(`stdout: ${stdout}`);
		})	}
	//   PythonShell.run('script.py', options, function (err, results) {
	// 	if (err) throw err;
	// 	// results is an array consisting of messages collected during execution
	// 	console.log('results: %j', results);
	//   });
})

// Flip file window

var file3 = ""

document.getElementById("backbutton2").addEventListener('click', () => {
	x.style.display = "block";
	z.style.display = "none"
	document.getElementById("filelocation3").value = ""
	document.getElementById("opt5").disabled = false
	document.getElementById("opt5").style.color = "grey"
});

document.getElementById("dragfile3").addEventListener('drop', (event) => { 
	if(z.style.display != "none"){
		event.preventDefault(); 
		event.stopPropagation(); 
  
		for (const f of event.dataTransfer.files) { 
			// Using the path attribute to get absolute file path 
			file3 = f.path 
			var elem = document.getElementById("filelocation3")
			elem.innerHTML = ""
			elem.value = file3
			document.getElementById("opt5").style.color = "inherit"
			document.getElementById("opt5").disabled = false	
		} 
	}	
}); 
  
document.getElementById("dragfile3").addEventListener('dragover', (e) => { 
	e.preventDefault(); 
	e.stopPropagation(); 
}); 

document.getElementById("dragfile3").addEventListener('click', (event) => {
	if(isMac){
		ipcRenderer.send('open-file-dialog3')
	} else {
		ipcRenderer.send('open-file3') 
	}
});

ipcRenderer.on('selected-directory3', (event, path) =>{
	var elem = document.getElementById("filelocation3")
	elem.innerHTML = ""
	if(path.filePaths[0] != null){
		file3 = path.filePaths[0]
		elem.value = file3
	}
	if(document.getElementById("filelocation3").value != ""){
		document.getElementById("opt5").style.color = "inherit"
		document.getElementById("opt5").disabled = false
	}
})

ipcRenderer.on('saved-file2', (event, path) => {
	flag = document.getElementById("dropdown").value
	if (isMac){
		exec(`${process.cwd()}/src/py/intelmac -${flag} ${file3}`, (error, stdout, stderr) => {
			console.log(`stdout: ${stdout}`);
		})
	}
	else if (isWin){
		if(arch="x64"){
			exec(`${process.cwd()}/src/py/winx64.exe -${flag} ${file3}`, (error, stdout, stderr) => {
				console.log(`stdout: ${stdout}`);
			})	
		}
		else{
			exec(`${process.cwd()}/src/py/winx32.exe -${flag} ${file3}`, (error, stdout, stderr) => {
				console.log(`stdout: ${stdout}`);
			})	
		}
	}
	else if (isLinux){
		exec(`${process.cwd()}/src/py/linux -${flag} ${file3}`, (error, stdout, stderr) => {
			console.log(`stdout: ${stdout}`);
		})	}
})

document.getElementById('opt5').addEventListener('click', (event) => {
	fileext = file3.substring(file1.lastIndexOf('.') + 1)
	if(isMac){
		ipcRenderer.send('save-dialog-dialog2', fileext)
	} else {
		ipcRenderer.send('save-dialog2', fileext)
	}
})