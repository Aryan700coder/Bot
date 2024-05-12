"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// 1. Import necessary modules
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const server = async (client) => {
    const app = (0, express_1.default)();
    const PORT = process.env.PORT || 3001;
    app.use(express_1.default.static(path_1.default.join(__dirname, '../build')));
    // Endpoint to fetch all blogs
    app.get('/api/blogs', async (req, res) => {
        try {
            const blogs = await client.prisma.post.findMany();
            res.json(blogs);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    // Endpoint to fetch a single blog by ID
    app.get('/api/blogs/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const blog = await client.prisma.post.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            res.json(blog);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
exports.default = server;
