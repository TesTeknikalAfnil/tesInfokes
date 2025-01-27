import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import folderRoutes from './routes/folderRoutes';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

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


const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(folderRoutes); // Assume folderRoutes contains all your routes

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
