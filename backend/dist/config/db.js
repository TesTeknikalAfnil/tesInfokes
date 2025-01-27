"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: 'roxas',
    database: 'explorer_db',
    connectionLimit: 10, // Tingkatkan dari 5 ke 10 atau lebih
    connectTimeout: 10000 // Timeout 10 detik
});
exports.default = pool;
