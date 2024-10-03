import express, { query, Request, response, Response } from "express";

export const replicateAi = express();

replicateAi.get("/replicateAI", function (req: Request, res: Response) {
  res.end("Hello World");
});
