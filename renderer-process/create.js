document.getElementById("create-key").addEventListener("change", (event) =>{
    var flag = document.getElementById("create-key").value

    if (flag == "y"){
        document.getElementById("create-key-msg").style.display = "inline"
    }
    
    if (flag == "n"){
        document.getElementById("create-key-msg").style.display = "none"
    }
})