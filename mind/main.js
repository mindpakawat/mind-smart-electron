const electron = require('electron')
const http = require('http')
const path = require('path')
const url = require('url')
const request = require('request')

process.env.NODE_ENV = 'development';
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const {BrowserWindow,app,ipcMain,Menu} = electron;

let win

function getDataV2(){
    let blank = ''
    http.get('http://localhost:8001/api/v1/person', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +`Status Code: ${statusCode}`);

    } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +`Expected application/json but received ${contentType}`);
                      
    }
    if (error) {
    console.error(error.message);
    // Consume response data to free up memory 
    res.resume();
    return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {  
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
        receiveData(parsedData)
        
      } catch (e) {
      console.error(e.message);
      }
       
    });

    }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
    });
    
  }
  function sendMessage(receivedata){
    ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg) // prints 
    event.reply('asynchronous-reply', receivedata)
  })
  }
  function receiveData(receivedata){    
      sendMessage(receivedata)
  }
function createWindow(){
    //create browser window
    win = new BrowserWindow({
        width:800 , 
        height: 600,
        webPreferences: {
        nodeIntegration: true
      }
    })
    //load url
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'electronWindow.html'),
        protocal: 'file',
        slashes: true

    }));
    
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    // open dev tools
    win.webContents.openDevTools();
    // close window
    win.on('closed',()=>{
        win = null;

    });
   
}
  var allData = ''

  // Get data from input value (renderer.js)
  ipcMain.on('form-submission', function(event, dataObjective){
    console.log(dataObjective)
  });
  

// run create window
app.on('ready', function(){
  createWindow()
})


app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }

});

// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      {
        label: 'Read', // Click read to read a card
        click(){
          getDataV2();
          
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];
// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload',    
           
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}