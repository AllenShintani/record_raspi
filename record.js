"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const child_process_1 = require("child_process");
// Record Audio Function
const recordAudio = () => {
    return new Promise((resolve, reject) => {
        // arecord command
        const process = (0, child_process_1.spawn)('arecord', [
            '-D', 'plughw:1,0',
            '-c1',
            '-r', '44100',
            '-f', 'S32_LE',
            '-t', 'wav',
            '-V', 'mono',
            '-v',
            'file.wav' // output file
        ]);
        // Handle stdout data
        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        // Handle stderr data
        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        // Handle close event
        process.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve();
        });
        // Stop recording after 5 seconds
        setTimeout(() => {
            process.kill();
        }, 5000); // 5000 milliseconds = 5 seconds
    });
};
// Main Function
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield recordAudio();
        console.log('Audio recording finished.');
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
});
exports.main = main;
