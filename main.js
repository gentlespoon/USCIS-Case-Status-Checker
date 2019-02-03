// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const fetch = require('node-fetch');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// newLine in console.
console.log();

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1400, height: 700});

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit();
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// var uscisAPI = 'https://api.gentlespoon.com/echo.php';
// var uscisAPI = 'https://api.gentlespoon.com/USCIS_Saved_Page.html';
var uscisAPI = 'https://egov.uscis.gov/casestatus/mycasestatus.do';





var toString = (x) => {
  switch (typeof x) {
    case 'object':
      return 'object';
    case 'function':
      return 'function';
    default:
      return x + '';
  }
};


var alert = (msg) => {
  dialog.showMessageBox({
    message: toString(msg)
  });
};








ipcMain.on('getCaseStatus', (evt, caseId) => {
  console.log('IPC received: ' + caseId);
  var uCase = new uscisCase(caseId);
  uCase.getStatus();
});










function uscisCase (caseId) {

  this.caseId = caseId;

  this.getStatus = () => {
    const data = new URLSearchParams();
    data.append('appReceiptNum', this.caseId);
    fetch(uscisAPI, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "post",
      body: data
    })
    .then((response) => {
      if (response.status !== 200) {
        dialog.showErrorBox('Failed to communicate with USCIS', 'Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      // Examine the text in the response
      response.text().then((data) => {
        this.prepareAnalyze(data);
      });
    })
    .catch((err) => {
      dialog.showErrorBox('Fetch Error', err);
    });
  };

  this.prepareAnalyze = (data) => {
    var result = analyzeHTML(data);
    mainWindow.send('gotCaseStatus', {caseId: this.caseId, parsed: result, raw: data});
  };


  // no need to destroy object
}








var analyzeHTML = (data) => {

  // check IP ban
  if (data.indexOf("It was reported to us that your IP address or internet gateway") != -1) {
    msg = 'Your IP address has been blocked by USCIS.\n\nAs stated before, the author is not responsible for any consequences of using this software.\n\nYou may try again in 24 hours.';
    dialog.showErrorBox('Your IP is blocked by USCIS', msg);
    return;
  }

  var title = "Invalid Case ID";
  var content = "";

  var titleStart = data.indexOf("<h1>");
  var titleEnd;

  if (titleStart === -1) {
    // if there is no <h1>, something is wrong, maybe invalid case id
  } else {
    // title in <h1> summarizes case status
    titleEnd = data.indexOf("</h1>");
    title = data.substring(titleStart+4, titleEnd);
    // the first <p> contains a paragraph describing the detail of case status
    var contentStart = data.indexOf("<p>", titleEnd);
    var contentEnd = data.indexOf("</p>", contentStart);
    content = data.substring(contentStart+3, contentEnd);
  }

  var form = "-";
  var formStart = content.indexOf("Form ");
  var formEnd;
  if (formStart != -1) {
    // there is form info
    formEnd = content.indexOf(",", formStart);
    form = content.substring(formStart+5, formEnd);
  }

  var date = "-";
  var dateStart = content.indexOf("On ");
  var dateEnd;
  if (dateStart != -1) {
    dateEnd = content.indexOf(", we");
    if (dateEnd == -1) {
      // the special case of carrier returns
      dateEnd = content.indexOf(", the");
    }
    date = content.substring(dateStart+3, dateEnd);
  }

  return [title, content, form, date];

};
