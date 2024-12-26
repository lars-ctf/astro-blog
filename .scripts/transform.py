from pathlib import Path
from datetime import datetime

def transform(path: Path):
    last_write_date = path.stat().st_mtime
    last_write_date = datetime.fromtimestamp(last_write_date).strftime("%Y-%m-%d")
    print(f"Transforming {path} last modified at {last_write_date}")
    content = path.read_text()
    title = content.splitlines()[0][1:].strip()
    print(f"Title: {title}")
    content = f"""---
title: "{title}"
pubDate: "{last_write_date}"
---
{content}
"""
    path.write_text(content)
    pass


blogs = Path("./src/content/blog")
for blog in blogs.iterdir():
    if blog.is_dir():
        for blog_file in blog.iterdir():
            if blog_file.is_file():
                transform(blog_file)