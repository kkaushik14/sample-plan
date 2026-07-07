import { readFile } from "node:fs/promises";
import { join } from "node:path";

export default async function handler(request, response) {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.status(405).json({
      success: false,
      error: "Method not allowed"
    });
    return;
  }

  const seedPath = join(process.cwd(), "data", "portfolio.seed.json");
  const seed = JSON.parse(await readFile(seedPath, "utf8"));

  response.status(200).json(seed);
}
