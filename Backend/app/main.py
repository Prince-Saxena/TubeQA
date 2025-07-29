from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
# from app.rag import retrieve_doc,gen_response
from app.chains import gen_response
from app.utils import get_available_languages

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or use ["http://localhost:3000"] for specific frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def hello():
    return {"message": "Hello!"}

@app.post("/query")
async def query(req:Request):
    body = await req.json()
    query = body["query"]
    video_id = body["video_id"]
    lang = body["lang"]
    # results = retrieve_doc(query=query,video_id=video_id,lang=lang)
    # response = gen_response(query, results)
    response = gen_response(query=query, video_id=video_id, lang=lang)
    return {"Response":response}

@app.post("/langs")
async def available_langs(video_id:str):
    print(video_id)
    return await get_available_languages(video_id=video_id)
