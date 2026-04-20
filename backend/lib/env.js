const { z } = require("zod");

const schema = z.object({
    PORT: z.coerce.number().default(8001),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    MONGO_URI: z.string().min(1, "MONGO_URI required"),
    FRONTEND_URL: z.string().url().default("http://localhost:5173"),
    CLIST_USERNAME: z.string().min(1, "CLIST_USERNAME required"),
    CLIST_API_KEY: z.string().min(1, "CLIST_API_KEY required"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}

module.exports = parsed.data;
