const {createWorker, createScheduler} = require("tesseract.js");
const path = require("path");
const EventEmitter = require("events");

function* ite(n) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}

class Tess {
    emitter;

    constructor() {
        this._emitter = new EventEmitter();
        this.worker = null;
    }

    async init(dataPath) {
        let worker = createWorker({
            cachePath: path.resolve(dataPath),
            logger: (m) => {
                this._emitter.emit("update-process-in-main", m);
            }
        });
        await worker.load();
        await worker.loadLanguage("chi_sim");
        await worker.initialize("chi_sim");
        this.worker = worker;
    }

    replyTessProcess(m) {
        console.log(m);
        m.key = global.workKey;
        global.workEmitter && global.workEmitter.reply("img-tess-process", m);
    }
    async recognize(work, emitter) {
        return new Promise(async (res) => {
            global.workEmitter = emitter;
            global.workKey = work.key;
            this._emitter.on("update-process-in-main", this.replyTessProcess);
            const { data: { text } } = await this.worker.recognize(work.data);
            const t = {
                key: work.key,
                data: text
            }
            emitter.reply("img-done", t);
            this._emitter.removeListener("update-process-in-main", this.replyTessProcess);
            res(t);
        });
    }
    async terminate() {
        await this.worker.terminate();
    }
}

const tessClient = new Tess();

module.exports = tessClient;
