const electron = require('electron')
const {ipcRenderer} = electron
const moment = require('moment')

var smcDelay = 700

function sendTo(event){
    let test = ''
    var cardID,fullnameTH,fullnameENG,birthDate,address,imgCard,timestamp
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        
        console.log(arg) // prints "rawdata"
        test = arg
        cardID = test.data[0].nid
        fullnameTH = test.data[0].fullname_tha
        fullnameENG = test.data[0].fullname_eng
        birthDate = test.data[0].birth_date
        address = test.data[0].address
        imgCard = test.data[0].photo
        timestamp = test.data_timestamp
        var replaceNameTH = fullnameTH.replace(/#/gi, " ")
        var replaceNameENG = fullnameENG.replace(/#/gi, " ")
        var replaceAddress = address.replace(/#/gi, " ")
        console.log(test.data_timestamp)

            // set value from card to html
            
            setTimeout(function(){ document.getElementById("cardID").value = cardID }, smcDelay)
            setTimeout(function(){ document.getElementById("fullnameTH").value = replaceNameTH }, smcDelay)
            setTimeout(function(){ document.getElementById("fullnameENG").value = replaceNameENG }, smcDelay)
            setTimeout(function(){ document.getElementById("birthDate").value = moment(birthDate).format('MMMM Do YYYY') }, smcDelay)

            var gender = test.data[0].gender
            if(gender==1){
                setTimeout(function(){ document.getElementById("gender").value = 'Male' }, smcDelay)
            
            }
            else if(gender!=1){
                setTimeout(function(){ document.getElementById("gender").value = 'Female' }, smcDelay)
            
            }
            setTimeout(function(){ document.getElementById("address").value = replaceAddress }, smcDelay)
            

            // image64 to src
            setTimeout(function(){ document.getElementById('img-container').src = imgCard }, smcDelay)
                     
    })
        
    ipcRenderer.send('asynchronous-message', 'success') // return console success
        document.getElementById("readBtn").disabled = true;
        setTimeout(function(){document.getElementById("subBtn").disabled = false;},1200)
        setTimeout(function(){
            if  (document.getElementById("cardID").value == ''&&
                document.getElementById("fullnameTH").value == ''&&
                document.getElementById("fullnameENG").value == ''&&
                document.getElementById("birthDate").value == ''&&
                document.getElementById("address").value == ''){
                    document.getElementById("readBtn").disabled = false
                    document.getElementById("subBtn").disabled = true;
                }
        },1300)
}


function sendForm(event) {
    event.preventDefault() // stop the form from submitting

    // if not blank do addTable func
    if(document.getElementById("Name").value != ''&&
        document.getElementById("Company").value != ''&&
        document.getElementById("Phone").value != ''&&
        document.getElementById("Details").value != ''&&
        document.getElementById("StaffID").value != ''&&
        document.getElementById("Order").valu != ''&&
        document.getElementById("In").value != ''&&
    
        document.getElementById("cardID").value != ''&&
        document.getElementById("fullnameTH").value != ''&&
        document.getElementById("fullnameENG").value != ''&&
        document.getElementById("birthDate").value != ''&&
        document.getElementById("address").value != ''&&
        document.getElementById("gender").value != ''&&
        document.getElementById("img-container").src != ''){
            
            let separateField = document.getElementById("Name").value;
            let company = document.getElementById("Company").value;
            let phone = document.getElementById("Phone").value;
            let details = document.getElementById("Details").value;
            let staffid = document.getElementById("StaffID").value;
            let order = document.getElementById("Order").value;
            let intime = document.getElementById("In").value;
            let outtime = document.getElementById("Out").value;

            let dataObjective = "separate field:\t" + separateField + 
                                "\ncompany:\t" + company +
                                "\nphone:\t\t" + phone +
                                "\ndetails:\t" + details +
                                "\nstaff id:\t" + staffid +
                                "\norder:\t\t" + order +
                                "\ntime in:\t" + intime +
                                "\ntime out:\t" + outtime
                                
            ipcRenderer.send('form-submission',dataObjective)
            
            addTable() // go to add table

    }else {
        
    }
}





// create table
function addTable(){
    var table = document.getElementById("myTable");
    var row = table.insertRow();
    var cell_Name = row.insertCell(0);
    var cell_SeparateField = row.insertCell(1);
    var cell_CompanySector = row.insertCell(2);
    var cell_Timein = row.insertCell(3);
    var cell_Timeout = row.insertCell(4);
    cell_Name.innerHTML = document.getElementById("fullnameTH").value;
    cell_SeparateField.innerHTML = document.getElementById("Name").value;
    cell_CompanySector.innerHTML = document.getElementById("Company").value;
    cell_Timein.innerHTML = '';
    cell_Timeout.innerHTML = '';
    document.getElementById("readBtn").disabled = false;
    document.getElementById("subBtn").disabled = true;
    setBlank()
  }
  function setBlank(){
      setTimeout(function(){
        document.getElementById("Name").value = '';
        document.getElementById("Company").value = '';
        document.getElementById("Phone").value = '';
        document.getElementById("Details").value = '';
        document.getElementById("StaffID").value = '';
        document.getElementById("Order").valu = '';
        document.getElementById("In").value = '';
        document.getElementById("Out").value = '';

        document.getElementById("cardID").value = ''
        document.getElementById("fullnameTH").value = ''
        document.getElementById("fullnameENG").value = ''
        document.getElementById("birthDate").value = ''
        document.getElementById("address").value = ''
        document.getElementById("gender").value = ''
        document.getElementById("img-container").src = ''
      },50)
    
  }

