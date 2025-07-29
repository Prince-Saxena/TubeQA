from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from app.rag import retrieve_doc

# First chain: parallel_chain to prepare context and question
parallel_chain = RunnableParallel({
    'context': RunnableLambda(lambda x: retrieve_doc(x['query'], x['video_id'], x['lang'])),
    'question': RunnablePassthrough()
})

# Second chain: main processing chain
main_chain = (
    parallel_chain 
    | RunnableLambda(lambda x: {
        'context': "\n\n".join(doc.page_content for doc in x['context']),
        'question': x['question']['query']
    })
    | ChatPromptTemplate.from_template("""
You are a YouTube Video Assistant.

Answer the user's question using only the given context from the video transcript.  
Keep the language simple and easy to understand. Format & beautify the output using Markdown.

Rules:
- Do not repeat the question.
- Do not include headings like "Answer", "Summary", or "Disclaimer".
- Respond in 2–3 clear bullet points OR 1 short paragraph, depending on what's better.
- Only use information from the video.

Context:
{context}

Question:
{question}

Response:
""")

    | ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    | StrOutputParser()
)

# Combined function to use the chains
def gen_response(query: str, video_id: str, lang: str):
    inputs = {
        'query': query,
        'video_id': video_id,
        'lang': lang
    }
    return main_chain.invoke(inputs)