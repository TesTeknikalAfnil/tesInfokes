"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const folderRoutes_1 = __importDefault(require("./routes/folderRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'File and Folder Management API',
            version: '1.0.0',
            description: 'API for managing folders, files, and soft deletion functionality'
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['src/routes/folderRoutes.ts'], // Pastikan ini mengarah ke file yang berisi dokumentasi API
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Middleware
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use(express_1.default.json());
app.use(folderRoutes_1.default); // Assume folderRoutes contains all your routes
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
