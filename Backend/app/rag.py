from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.transcript import get_transcript,TranscriptRequest
from app.utils import embeddings, split_transcript, Transcript



def retrieve_doc(query:str,video_id:str,lang:str):
    data = TranscriptRequest(
        video_id=video_id,
        lang=lang
    )
    transcript_text = get_transcript(data)
    transcript = Transcript(
        text=transcript_text
    )
    splitted_text = split_transcript(transcript)

    vector_store = embeddings(splitted_text)
    retiever = vector_store.as_retriever(search_type='similarity',search_kwargs={"k":4})

    res = retiever.invoke(query)
    return res
    

def gen_response(query: str, docs):
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    prompt = ChatPromptTemplate.from_template(
        """
        You are a helpful assistant. Based on the following context and question, give a detailed but simple response.

        Context: {context}
        Question: {question}
        """
    )
    context_text = "\n\n".join(doc.page_content for doc in docs)
    final_prompt = prompt.format(context=context_text, question=query)
    
    response = model.invoke(final_prompt)
    return response