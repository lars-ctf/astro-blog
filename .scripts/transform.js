import { statSync, readFileSync, writeFileSync, readdirSync, rmSync } from "fs";
import { join } from "path";

function transform(filePath) {
  const stats = statSync(filePath);
  const lastWriteDate = new Date(stats.mtime).toISOString().split("T")[0];
  console.log(`Transforming ${filePath} last modified at ${lastWriteDate}`);

  let content = readFileSync(filePath, "utf-8");
  const title = content.split("\n")[0].substring(1).trim();
  if (title === "--") return;
  console.log(`Title: ${title}`);

  content = `---
title: "${title}"
pubDate: "${lastWriteDate}"
---
${content}`;

  writeFileSync(filePath, content);
}

const blogsDir = "./src/content/blog";
readdirSync(blogsDir).forEach((blog) => {
  const blogPath = join(blogsDir, blog);
  if (statSync(blogPath).isDirectory()) {
    readdirSync(blogPath).forEach((blogFile) => {
      const blogFilePath = join(blogPath, blogFile);
      if (statSync(blogFilePath).isFile()) {
        if (blogFilePath.toLowerCase().includes("readme")) {
          rmSync(blogFilePath);
        }
        transform(blogFilePath);
      }
    });
  }
});
