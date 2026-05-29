const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer
} = require('electron')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    backgroundColor: '#0f1115',
    autoHideMenuBar: true,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })

  mainWindow.loadURL('http://localhost:5173')

mainWindow.webContents.openDevTools()
}

ipcMain.handle('get-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window']
  })

  return sources.map(source => ({
    id: source.id,
    name: source.name
  }))
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})