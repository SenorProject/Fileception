document.getElementById("decrypt-key").addEventListener("change", (event) =>{
    var flag = document.getElementById("decrypt-key").value

    if (flag == "y"){
        document.getElementById("decrypt-yeskey").style.display = "flex"
    }
    
    if (flag == "n"){
        document.getElementById("decrypt-yeskey").style.display = "none"
    }
})