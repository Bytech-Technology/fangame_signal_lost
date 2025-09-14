import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

// -----------------------------
// Configuración de Express
// -----------------------------
const expressApp = express();
const PORT = 3000;

// Motor de vistas (ejemplo con EJS, podés adaptarlo)
expressApp.set("views", [
  path.join(__dirname, "views"), 
  path.join(__dirname, "components"),
]);
expressApp.set("view engine", "ejs");

// Middleware
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use(express.static(path.join(__dirname, "assets")));
expressApp.use(express.static("components/"));

// Rutas de ejemplo
expressApp.get("/", (req, res) => {
    res.render("index", { title: "Hola desde Express + Electron" });
});

// Levantar el servidor Express
expressApp.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});

// -----------------------------
// Configuración de Electron
// -----------------------------
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
            sandbox:false
        },
    });

    //mainWindow.removeMenu();

    // Cargar la app de Express dentro de Electron
    mainWindow.loadURL(`http://localhost:${PORT}`);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on("exit-game", () => {
    if (mainWindow) {
        mainWindow.close();
    }
});
