import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in environment variables.")
openai.api_key = OPENAI_API_KEY

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    tool: str
    input: str
    tone: str = "professional"
    length: str = "medium"
    affiliate_link: str = ""
    tag: str = ""  # Optional tag for affiliate generator

@app.post("/generate")
async def generate(request: GenerateRequest):
    prompt = ""
    tool = request.tool.lower()
    if tool == "video idea generator":
        prompt = (
            f"Generate 10 unique, SEO-optimized YouTube video ideas for: {request.input}. "
            f"Ideas should be tailored for YouTube, use catchy and search-friendly titles, and avoid repeating topics or phrasing. "
            f"Format the response as a numbered list, with each idea on a new line."
        )
        max_tokens = 400
    elif tool == "metadata generator":
        prompt = (
            f"Generate YouTube metadata for: {request.input}.\n"
            f"Return a JSON object with two fields: titles (an array of 10 unique, SEO-optimized YouTube titles, each catchy and search-friendly, with no repetition), and description (an engaging, SEO-friendly video description).\n"
            f"Example: {{ \"titles\": [\"Title 1\", \"Title 2\", ..., \"Title 10\"], \"description\": \"SEO-friendly description...\" }}"
        )
        max_tokens = 600
    elif tool == "link shortener":
        import requests
        url = request.input.strip()
        if not url.startswith("http"):
            return {"error": "Input must be a valid URL starting with http or https."}
        try:
            shortener = f"https://tinyurl.com/api-create.php?url={url}"
            resp = requests.get(shortener)
            if resp.status_code == 200:
                short_url = resp.text.strip()
            else:
                short_url = url
            return {"original": url, "short": short_url}
        except Exception as e:
            return {"error": f"Shortening failed: {str(e)}"}
    elif tool == "content posting calendar":
        prompt = (
            f"Generate a 7-day content posting calendar for: {request.input}. "
            f"For each day, suggest a content topic and a suggested posting date (starting from today). Format as a JSON array of objects with 'date' and 'topic'."
        )
        max_tokens = 250
    elif tool == "tag generator":
        # Combine topic and description for richer prompt context
        topic_desc = request.input
        if hasattr(request, 'description') and request.description:
            topic_desc += f". {request.description}"
        # Use a single, clear, RapidTags-like prompt and one strong example
        prompt = (
            f"Generate a comma-separated list of highly relevant, short (1-3 words), SEO-optimized YouTube tags for: {topic_desc}. Tags should be what people actually search for on YouTube. Return only the tags, no hashtags, no explanations, no extra text.\n"
            f"Example: iphone 17 air,iphone 17 air unboxing,iphone 17 air review,iphone 17 air camera test,iphone 17 air vs iphone 16,iphone 17 air price,iphone 17 air features,iphone 17 air battery test,iphone 17 air display,iphone 17 air performance,iphone 17 air tips,iphone 17 air tricks,iphone 17 air waterproof test,iphone 17 air speed test,iphone 17 air gaming,iphone 17 air pubg,iphone 17 air comparison,iphone 17 air best features,iphone 17 air night mode,iphone 17 air portrait mode,iphone 17 air vs samsung s25,iphone 17 air shorts,iphone 17 air leaks,iphone 17 air rumors,iphone 17 air camera samples,iphone 17 air slow motion,iphone 17 air selfie test,iphone 17 air vs pro,iphone 17 air vs pro max,iphone 17 air hands on\n"
        )
        max_tokens = 250
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=0.7,
            )
            tags = response.choices[0].message.content.strip()
            # LOGGING: Save prompt and raw response for debugging
            with open("openai_tag_debug.log", "a") as logf:
                import datetime
                logf.write(f"\n---\n[{datetime.datetime.now()}] PROMPT:\n{prompt}\nRAW RESPONSE:\n{tags}\n---\n")
            # Clean up tags: remove newlines, trim, split, rejoin, enforce 500 char limit
            tags = tags.replace('\n', ' ').replace('\r', ' ').strip()
            tag_list = [t.strip() for t in tags.split(',') if t.strip()]
            tags = ','.join(tag_list)
            if len(tags) > 500:
                trimmed = tags[:500]
                if ',' in trimmed:
                    trimmed = trimmed[:trimmed.rfind(',')]
                tags = trimmed
            return {"tags": tags}
        except Exception as e:
            return {"error": f"Error generating tags: {str(e)}"}
    else:
        prompt = f"Generate content for tool '{request.tool}': {request.input}"
        max_tokens = 100
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        content = response.choices[0].message.content.strip()
        # Fallback for empty or irrelevant video idea generator responses
        if tool == "video idea generator":
            import re
            if not content or len(re.sub(r'\s+', '', content)) < 20:
                # Fallback generic ideas
                fallback = f"1. '{request.input} Explained: Everything You Need to Know'\n2. 'Top 5 {request.input} Tips and Tricks'\n3. 'Beginner's Guide to {request.input}'\n4. 'Common Mistakes in {request.input} and How to Avoid Them'\n5. 'The Future of {request.input}: Trends and Predictions'"
                return {"content": fallback}
        # If metadata generator, try to parse JSON
        if tool == "metadata generator":

            import json, re
            try:
                content_json = json.loads(content)
                # Ensure all fields exist
                for k in ["titles", "description", "tags"]:
                    if k not in content_json:
                        content_json[k] = ""
                return content_json
            except Exception:
                # Fallback: try to extract fields manually
                titles = re.findall(r'"titles"\s*:\s*\[(.*?)\]', content, re.DOTALL)
                titles = [t.strip().strip('"') for t in titles[0].split(',')] if titles else []
                desc = re.search(r'"description"\s*:\s*"(.*?)"', content, re.DOTALL)
                tags = re.search(r'"tags"\s*:\s*"(.*?)"', content, re.DOTALL)
                return {
                    "titles": titles,
                    "description": desc.group(1) if desc else "",
                    "tags": tags.group(1) if tags else ""
                }
        # If content posting calendar, try to parse JSON
        if tool == "content posting calendar":
            import json
            try:
                calendar = json.loads(content)
                return {"calendar": calendar}
            except Exception:
                pass  # fallback to raw content
        return {"content": content}
    except Exception as e:
        return {"content": f"Error: {str(e)}"}
