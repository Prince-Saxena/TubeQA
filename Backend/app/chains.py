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
**YouTube Video Assistant Response Format**

🔍 **Key Points from Video:**
{context}

{{ Answer in 2-3 concise bullet points or 1 short paragraph. Focus on the most relevant information from the context. }}

{{ Optional: 1-2 supporting points if needed for clarity }}

🚫 **Disclaimer:** 
- Answers are generated from the video content only
- May not represent complete or professional advice

Example Structure:

🔍 **Key Points from Video:
- Plants use sunlight to make food
- Chlorophyll captures light energy
- Carbon dioxide + water → glucose + oxygen

🎯 **Answer (Summary):**
Photosynthesis is how plants make food using sunlight. The green chlorophyll in leaves captures sunlight to convert carbon dioxide and water into glucose (plant food) and oxygen.

💡 **Additional Details:
- Occurs in plant cell structures called chloroplasts
- Vital for producing oxygen we breathe
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