let list = document.getElementById("fileList");

getFilesNames();

//get the list of file names to display on the main web page
function getFilesNames(){

    list.innerHTML = "";
    fetch('/filenames').then( response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    }).then( (json)=>{
        for (let i = 0; i < json.length; i++){
            list.innerHTML += `<div class="listItem"> ${json[i]} <button type="button" onclick="del('${json[i]}')"> Delete </button> </div>`
        }
    }).catch( err => console.error(`Fetch problem: ${err.message}`) );
}

//handle deleting sounds
function del(filename){
    fetch('/delete', 
    {
        method: "DELETE", 
        body: filename
    }); //fix these fetches
    getFilesNames();
}

//handle uplaoding sounds
function upload(){
    let data = new FormData(document.getElementById("upload"));
    fetch('/upload', {method: "POST", body: data}); //fix these fetches
    getFilesNames();
}

