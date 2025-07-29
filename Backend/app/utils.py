from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema.document import Document
from youtube_transcript_api import YouTubeTranscriptApi
from fastapi import HTTPException
from langchain.vectorstores import FAISS
from pydantic import BaseModel, Field
from dotenv import load_dotenv


load_dotenv()

class Transcript(BaseModel):
    text: str = Field(...,description="Transcript of YT video.")

def split_transcript(data:Transcript):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=200,
    )
    return splitter.split_text(data.text)


def embeddings(chunks):
    embedding_function = HuggingFaceEmbeddings(model_name='sentence-transformers/all-mpnet-base-v2')
    docs = [Document(page_content=chunk) for chunk in chunks]
    # print(docs)
    vector_store = FAISS.from_documents(docs, embedding_function)
    return vector_store
    
async def get_available_languages(video_id: str):
    try:
        ytapi = YouTubeTranscriptApi()
        transcript_list = ytapi.list(video_id)
        languages = []
        
        # Get manually created transcripts
        for transcript in transcript_list:
            languages.append(transcript.language_code)
        
        # Get generated transcripts
        for transcript in transcript_list:
            if transcript.is_generated:
                languages.append(transcript.language_code)
        
        # Remove duplicates
        languages = list(set(languages))
        
        return {"languages": languages}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
