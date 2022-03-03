const {app, BrowserWindow, screen, ipcMain, dialog} = require("electron");
const tess = require("./module/tess");
const path = require("path");
const fs = require("fs/promises");
const toBase64 = require("image-to-base64");
const EventEmitter = require("events");

global.isDev = process.env.NODE_ENV === "development";
global.emitter = new EventEmitter();
global.isStopped = false;

async function createWindow(width, height) {
    console.log("isDev: " + global.isDev);
    let win = new BrowserWindow({
        width,
        height,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false
        }
    });

    if (global.isDev) {
        await win.loadURL("http://localhost:3000/");
    } else {
        await win.loadFile("./ocr_app_client/build/index.html", {
            hash: "main"
        });
    }

    win.on("closed", () => {
        win = null;
    })

    return win;
}

async function openFileDialog(isDir, title) {
    const properties = [
        isDir ? "openDirectory" : "openFiles"
    ];
    !isDir && properties.push("multiSelections");
    let data = dialog.showOpenDialogSync({
        title,
        filters: isDir ? [] : [{
            name: "图像",
            extensions: [
                "jpg", "png", "webp"
            ]
        }],
        properties
    });
    if (isDir && data) {
        const pPath = data[0];
        data = ((await fs.readdir(pPath)).filter(i => /jpg|png|webp|jpeg/.test(i)).map(i => path.join(pPath, i)));
    }
    if (data) {
        data = await Promise.all(data.map(i => new Promise(res => {
            const temp = i.split(".");
            toBase64(i).then(data => res(`data:image/${temp[temp.length - 1]};base64,${data}`)).catch(e => {
                console.log(e);
                res([]);
            });
        })));
    }
    return data ? data : [];
}

function registerApp(app) {
    // 所有窗口关闭时退出应用.
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });

    // 关闭程序
    ipcMain.on("app-exit", (e) => {
        app.quit();
    });

    ipcMain.on('window-min', function() {
        global.win.minimize();
    });

    ipcMain.on("select-files", async (e, isDir) => {
        e.reply("reply-select-files", await openFileDialog(isDir, isDir ? "选择文件夹" : "选择文件(可多选)"));
    });

    ipcMain.on("get-height", (e) => {
       e.reply("recv-height", global.height, global.width);
    });

    ipcMain.on("start-ocr", async (e, d) => {
        if (global.isStopped) {
            await tess.init(path.resolve(__dirname, "./module"));
            global.isStopped = false;
        }
        await tess.recognize(d, e);
    });

    ipcMain.on("stop-ocr", async (e) => {
        await tess.terminate();
        global.isStopped = true;
    });
}

async function main() {
    registerApp(app);
    await tess.init(path.resolve(__dirname, "./module"));
    await app.whenReady();
    const primDisplay = screen.getPrimaryDisplay();
    const {width, height} = primDisplay.workAreaSize;
    global.width = width;
    global.height = height;
    global.win = await createWindow(width, height);
}

main().catch(e => {
    console.log(e);
});
