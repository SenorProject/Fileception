document.getElementById("encrypt-key").addEventListener("change", (event) =>{
    var flag = document.getElementById("encrypt-key").value

    if (flag == "y"){
        document.getElementById("encrypt-yeskey").style.display = "flex"
    }
    
    if (flag == "n"){
        document.getElementById("encrypt-yeskey").style.display = "none"
    }
})