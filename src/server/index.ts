// 1. Import necessary modules
import express, { Request, Response } from 'express';
import ExtendedClient from '../structure/client';
import path from 'path';
const server = async (client: ExtendedClient) => {
    const app = express();
    const PORT = process.env.PORT || 3001;

    app.use(express.static(path.join(__dirname, '../build')));
    // Endpoint to fetch all blogs
    app.get('/api/blogs', async (req: Request, res: Response) => {
        try {
            const blogs = await client.prisma.post.findMany();
            res.json(blogs);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Endpoint to fetch a single blog by ID
    app.get('/api/blogs/:id', async (req: Request, res: Response) => {
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
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

export default server;