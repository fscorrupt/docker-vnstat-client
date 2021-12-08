import Store from "electron-store";
import { app } from "electron";
import { info } from "electron-log";
import fs from "fs";
class cfg {
	constructor() {
		// Default settings

		this.scheme = {
			apperance: {
				globalTheme: "green",
				darkMode: true,
				lineChart: {
					haveArea: true,
					areaOpacity: 0.5,
					colors: "nivo",
					curve: "cardinal",
				},
				barChart: {
					colors: "nivo",
					isGrouped: true,
				},
			},
		};

		this.store = new Store({});

		if (!fs.existsSync(`${app.getPath("userData")}/config.json`)) {
			info("Creating configration file...");
			this.store.set(this.scheme);

			info(`Configration file was created at ${this.store.path}`);
		}
	}

	get(key) {
		return key ? this.store.get(key) : this.store.store;
	}
	set(key, value) {
		this.store.set(key, value);
	}
}

export default cfg;
