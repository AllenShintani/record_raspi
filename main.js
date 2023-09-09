"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const promises_1 = require("fs/promises");
const node_fetch_1 = __importDefault(require("node-fetch"));
const FormData = __importStar(require("form-data"));
const node_record_lpcm16_1 = __importDefault(require("node-record-lpcm16"));
const record_1 = require("./record"); // ここでmainをインポート
function genConversation(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: input }),
            });
            const data = yield response.json();
            yield generateVoice(data.result.content);
        }
        catch (e) {
            console.log(e);
        }
    });
}
function generateVoice(userText) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`https://deprecatedapis.tts.quest/v2/voicevox/audio/?text=${userText}&key=${process.env.VOICE_KEY}&speaker=1`);
            const buffer = yield response.buffer();
            const audioFilePath = "/tmp/audio_output.wav";
            yield (0, promises_1.writeFile)(audioFilePath, buffer);
            (0, child_process_1.exec)(`aplay ${audioFilePath}`, (error) => {
                if (error) {
                    console.log(`Error playing audio: ${error}`);
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    });
}
const startRecording = () => {
    const audioChunks = [];
    const formData = new FormData();
    const endPoint = "https://api.openai.com/v1/audio/transcriptions";
    formData.append("model", "whisper-1");
    formData.append("language", "ja");
    const audioStream = node_record_lpcm16_1.default.record({
        sampleRate: 44100,
        threshold: 0.5
    });
    audioStream.on('data', (data) => {
        audioChunks.push(data);
    });
    audioStream.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        const audioBlob = Buffer.concat(audioChunks);
        formData.append('file', audioBlob, 'audio.webm');
        const response = yield (0, node_fetch_1.default)(endPoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOT_INIAD_KEY}`,
            },
            body: formData,
        });
        // ここでmain関数（録音関連の処理）を呼び出す
        yield (0, record_1.main)();
        const data = yield response.json();
        yield genConversation(data.text);
    }));
};
// 3秒ごとにstartRecording関数を呼び出す
try {
    startRecording();
}
catch (e) {
    console.error("Error in startRecording:", e);
}
console.log("Started 3-second interval for startRecording.");
