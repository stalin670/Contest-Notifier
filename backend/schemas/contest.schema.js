const { z } = require("zod");

const addSolutionSchema = z.object({
    contestId: z.string().min(1).max(200),
    name: z.string().min(1).max(500),
    platform: z.string().min(1).max(50),
    solutionLink: z.string().url().max(1000),
});

module.exports = { addSolutionSchema };
