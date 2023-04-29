const { app, BrowserWindow, ipcMain, Menu } = require( "electron" );
const path = require( "path" );

const createWindow = () => {
	const win = new BrowserWindow( {
		width: 800,
		height: 600,
		webPreferences: {
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join( __dirname, "preload.js" ),
		},
	} );
	win.loadFile( "index.html" );
	const menu = Menu.buildFromTemplate( [
		{
			label: "Developer",
			submenu: [
				{ role: "reload" },
				{ role: "forcereload" },
				{ role: "separator" },
				{
					label: "Toggle DevTools",
					accelerator: process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+C",
					click: () => {
						win.webContents.toggleDevTools();
					},
				},
			],
		},
	] );

	Menu.setApplicationMenu( menu );
};

app.whenReady().then( () => {
	createWindow();
	ipcMain.handle( "ping", () => "pong" );

	app.on( "activate", () => {
		if ( BrowserWindow.getAllWindows().length === 0 ) {
			createWindow();
		}
	} );
} );

app.on( "window-all-closed", () => {
	if ( process.platform !== "darwin" ) {
		app.quit();
	}
} );