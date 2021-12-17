import { app, ipcMain, dialog } from "electron";
import log from "electron-log";
import serve from "electron-serve";
import fs from "fs";

import { createWindow } from "./helpers";

// Classes
import CommunicationClass from "./Communication";
import Cfg from "./cfg";
import Traffic from "./traffic";

const Communication = new CommunicationClass();
const cfg = new Cfg();
const traffic = new Traffic();

//
const isProd = process.env.NODE_ENV === "production";

// Constants
const ICON_NAME = "vnclient-icon.png";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
	await app.whenReady();

	log.info("vnStat-client is starting..");

	const mainWindow = createWindow("main", {
		width: 920,
		height: 600,
		minWidth: 550,
		icon: `${
			isProd ? `${__dirname}/images` : "renderer/public/images"
		}/${ICON_NAME}`,
	});

	if (isProd) {
		await mainWindow.loadURL("app://./index.html");
	} else {
		const port = process.argv[2];
		await mainWindow.loadURL(`http://localhost:${port}/`);
		// mainWindow.webContents.openDevTools();
	}

	Communication.Init();
	await INIT(mainWindow);
})();

app.on("window-all-closed", () => {
	app.quit();
	log.info("vnStat-client has been closed.");
});

async function INIT(mainWindow) {
	// Send Configs
	mainWindow.webContents.send("send-config", cfg.get());

	// Send Data
	log.info("Getting data...");
	try {
		await traffic.getData();
		mainWindow.webContents.send("send-usage", traffic);
		log.info("Getting data is successfully");
	} catch (err) {
		log.error(err);
	}
}
