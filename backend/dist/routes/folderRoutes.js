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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// Mendapatkan struktur folder
/**
 * @swagger
 * /api/folders:
 *   get:
 *     summary: Get the structure of the folders
 *     responses:
 *       200:
 *         description: Successfully retrieved folder structure
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   parent_id:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */
// Fungsi untuk mengambil subfolder secara rekursif
const getSubFolders = (parentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM folders WHERE parent_id = ?';
        const [subFolders] = yield db_1.default.query(query, [parentId]);
        const folderTree = [];
        // Untuk setiap folder, cari subfolder-nya
        for (const folder of subFolders) {
            const children = yield getSubFolders(folder.id); // Rekursif untuk subfolder
            if (children.length > 0) {
                folder.subfolders = children; // Tambahkan subfolder ke folder
            }
            folderTree.push(folder);
        }
        return folderTree;
    }
    catch (error) {
        console.error('Error fetching subfolders:', error);
        throw new Error('Failed to fetch subfolders');
    }
});
router.get('/api/folders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM folders WHERE parent_id IS NULL';
        console.log('Executing Query:', query);
        // Jalankan query
        const [folders] = yield db_1.default.query(query);
        console.log('Query Result:', folders); // Log hasil query
        const folderStructure = [];
        // Untuk setiap folder utama, cari subfoldernya
        for (const folder of folders) {
            const subfolders = yield getSubFolders(folder.id); // Ambil subfolder
            if (subfolders.length > 0) {
                folder.subfolders = subfolders; // Masukkan subfolder ke dalam folder utama
            }
            folderStructure.push(folder);
        }
        res.status(200).json(folderStructure);
    }
    catch (error) {
        console.error('Error fetching folder structure:', error); // Log error
        res.status(500).json({ message: 'Error fetching folder structure', error });
    }
}));
// Menambahkan folder
/**
 * @swagger
 * /api/folders:
 *   post:
 *     summary: Create a new folder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Folder created successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/api/folders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, parent_id } = req.body;
    try {
        // Jalankan query dan ambil hasilnya
        const [result] = yield db_1.default.query('INSERT INTO folders (name, parent_id) VALUES (?, ?)', [name, parent_id || null]);
        console.log('Query Result:', result); // Debugging log
        // Periksa hasil query dan kirimkan response
        res.status(201).json({
            id: result.insertId, // ID folder baru yang dimasukkan
            name,
            parent_id
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('ER_NO_SUCH_TABLE')) {
                console.error('Error details1:', error.message);
                res.status(500).json({ message: 'Table does not exist', error: error.message });
            }
            else {
                console.error('Error details2:', error.message);
                res.status(500).json({ message: 'Database error', error: error.message }); //menampilkan error ini di console 
            }
        }
        else {
            console.error('Unknown error2:', error);
            res.status(500).json({ message: 'Error creating folder', error: String(error) });
        }
    }
}));
// Menambahkan subfolder ke folder tertentu
/**
 * @swagger
 * /api/folders/{folderId}/subfolders:
 *   post:
 *     summary: Create a subfolder inside a folder
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Subfolder created successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/api/folders/:folderId/subfolders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderId } = req.params;
    const { name } = req.body;
    try {
        const [result] = yield db_1.default.query('INSERT INTO folders (name, parent_id) VALUES (?, ?)', [name, folderId]);
        res.status(201).json({ id: result.insertId, name, parent_id: folderId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating subfolder', error });
    }
}));
// Mendapatkan file dalam folder
/**
 * @swagger
 * /api/folders/{folderId}/files:
 *   get:
 *     summary: Get files inside a specific folder
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of files in the folder
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   folder_id:
 *                     type: integer
 *                   file_path:
 *                     type: string
 */
router.get('/api/folders/:folderId/files', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderId } = req.params;
    try {
        const [files] = yield db_1.default.query('SELECT * FROM files WHERE folder_id = ?', [folderId]);
        res.status(200).json(files);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching files', error });
    }
}));
// Menambahkan file ke folder
/**
 * @swagger
 * /api/folders/{folderId}/files:
 *   post:
 *     summary: Upload a new file to a folder
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               file_path:
 *                 type: string
 *             required:
 *               - name
 *               - file_path
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid file details
 */
router.post('/api/folders/:folderId/files', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderId } = req.params;
    const { name, file_path } = req.body;
    try {
        const [result] = yield db_1.default.query('INSERT INTO files (name, folder_id, file_path) VALUES (?, ?, ?)', [name, folderId, file_path]);
        res.status(201).json({ id: result.insertId, name, folder_id: folderId, file_path });
    }
    catch (error) {
        res.status(500).json({ message: 'Error uploading file', error });
    }
}));
// Menghapus file dari folder
/**
 * @swagger
 * /api/files/{fileId}:
 *   delete:
 *     summary: Soft delete a file
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File soft deleted successfully
 *       404:
 *         description: File not found
 */
router.delete('/api/files/:fileId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId } = req.params;
    try {
        const [result] = yield db_1.default.query('UPDATE files SET deleted_at = NOW() WHERE id = ?', [fileId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'File not found' });
            return; // Tambahkan return di sini
        }
        res.status(200).json({ message: 'File soft deleted successfully' });
    }
    catch (error) {
        console.error('Error soft deleting file:', error);
        res.status(500).json({ message: 'Error soft deleting file', error: String(error) });
    }
}));
// Delete folder and its subfolders/files
/**
 * @swagger
 * /api/folders/{folderId}:
 *   delete:
 *     summary: Soft delete a folder and its subfolders/files
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Folder and its contents soft deleted successfully
 *       404:
 *         description: Folder not found
 */
router.delete('/api/folders/:folderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderId } = req.params;
    try {
        // Query rekursif untuk mendapatkan ID folder dan subfolder
        const [folderHierarchy] = yield db_1.default.query(`
            WITH RECURSIVE folder_hierarchy AS (
                SELECT id FROM folders WHERE id = ?
                UNION ALL
                SELECT f.id
                FROM folders f
                INNER JOIN folder_hierarchy fh ON f.parent_id = fh.id
            )
            SELECT id FROM folder_hierarchy;
        `, [folderId]);
        const folderIds = folderHierarchy.map((folder) => folder.id);
        // Soft delete files dalam folder-folder terkait
        yield db_1.default.query('UPDATE files SET deleted_at = NOW() WHERE folder_id IN (?)', [folderIds]);
        // Soft delete folder-folder terkait
        const [result] = yield db_1.default.query('UPDATE folders SET deleted_at = NOW() WHERE id IN (?)', [folderIds]);
        res.status(200).json({
            message: 'Folder and its subfolders/files soft deleted successfully',
            softDeletedFolders: folderIds,
            affectedRows: result.affectedRows,
        });
    }
    catch (error) {
        console.error('Error soft deleting folder:', error);
        res.status(500).json({ message: 'Error soft deleting folder', error: String(error) });
    }
}));
//trash
/**
 * @swagger
 * tags:
 *   - name: Trash
 *     description: API for handling trashed files and folders.
 */
/**
 * @swagger
 * /api/trash:
 *   get:
 *     summary: Get trash contents (files and/or folders)
 *     description: Retrieves files and folders that are soft deleted (moved to trash).
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - files
 *             - folders
 *         description: Filter by type ('files' or 'folders'). If not provided, both files and folders will be retrieved.
 *     responses:
 *       200:
 *         description: Trash contents retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Trash contents fetched successfully
 *                 folders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       parent_id:
 *                         type: integer
 *                       deleted_at:
 *                         type: string
 *                         format: date-time
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       folder_id:
 *                         type: integer
 *                       deleted_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching trash contents
 *                 error:
 *                   type: string
 *                   example: Error details
 */
router.get('/api/trash', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.query; // Ambil parameter `type`
    try {
        let files = [];
        let folders = [];
        if (!type || type === 'folders') {
            const [queryResult] = yield db_1.default.query('SELECT id, name, parent_id, deleted_at FROM folders WHERE deleted_at IS NOT NULL');
            folders = queryResult;
        }
        if (!type || type === 'files') {
            const [queryResult] = yield db_1.default.query('SELECT id, name, folder_id, deleted_at FROM files WHERE deleted_at IS NOT NULL');
            files = queryResult;
        }
        res.status(200).json({
            message: 'Trash contents fetched successfully',
            folders,
            files,
        });
    }
    catch (error) {
        console.error('Error fetching trash contents:', error);
        res.status(500).json({ message: 'Error fetching trash contents', error: String(error) });
    }
}));
//restoreFile
/**
 * @swagger
 * /api/files/{fileId}/restore:
 *   post:
 *     summary: Restore a file from trash
 *     description: Restores a file that was previously soft deleted (moved to trash).
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the file to restore.
 *     responses:
 *       200:
 *         description: File restored successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File restored successfully
 *       404:
 *         description: File not found or not in trash.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File not found or not in trash
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error restoring file
 *                 error:
 *                   type: string
 *                   example: Error details
 */
router.post('/api/files/:fileId/restore', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId } = req.params;
    try {
        const [result] = yield db_1.default.query('UPDATE files SET deleted_at = NULL WHERE id = ?', [fileId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'File not found or not in trash' });
            return;
        }
        res.status(200).json({ message: 'File restored successfully' });
    }
    catch (error) {
        console.error('Error restoring file:', error);
        res.status(500).json({ message: 'Error restoring file', error: String(error) });
    }
}));
//restoreFolder
/**
 * @swagger
 * /api/folders/{folderId}/restore:
 *   post:
 *     summary: Restore a folder from trash
 *     description: Restores a folder that was previously soft deleted (moved to trash).
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the folder to restore.
 *     responses:
 *       200:
 *         description: Folder restored successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Folder restored successfully
 *       404:
 *         description: Folder not found or not in trash.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Folder not found or not in trash
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error restoring folder
 *                 error:
 *                   type: string
 *                   example: Error details
 */
router.post('/api/folders/:folderId/restore', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderId } = req.params;
    try {
        const [result] = yield db_1.default.query('UPDATE folders SET deleted_at = NULL WHERE id = ?', [folderId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Folder not found or not in trash' });
            return;
        }
        res.status(200).json({ message: 'Folder restored successfully' });
    }
    catch (error) {
        console.error('Error restoring folder:', error);
        res.status(500).json({ message: 'Error restoring folder', error: String(error) });
    }
}));
exports.default = router;
