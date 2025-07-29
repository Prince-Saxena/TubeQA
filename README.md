# TubeQA - YouTube Video Assistant 🎥🤖

![TubeQA Screenshot](/images/image.png)

---

## 🎯 Purpose

As a Data Scientist, I built TubeQA to explore the integration of:

- Natural Language Processing (NLP)  
- Retrieval-Augmented Generation (RAG)  
- YouTube data mining  
- FastAPI for real-time ML serving  
- LangChain for chaining LLM-based pipelines  

This project enables interactive question answering over YouTube videos — a practical use case of RAG for extracting insights from unstructured video transcripts.

---

## ✨ Key Features

- 🎯 Ask questions about any YouTube video  
- 🧠 AI-powered answers using LangChain  
- 📝 Summarize long video content  
- 🌓 Dark/Light mode toggle  
- 🕒 Timestamped conversation history  
- ⚡ FastAPI backend with real-time response  

---

## 🔧 Tech Stack

### 📦 Backend
- Python 3.12  
- FastAPI – high-performance backend  
- LangChain – for Retrieval-Augmented Generation (RAG)  
- YouTube Transcript API – fetch captions  
- Google Gemini (Generative AI) – question answering  
- HuggingFace Sentence Transformers – embedding text  
- FAISS – vector similarity search  

### 💻 Frontend
- HTML5 + Tailwind CSS – responsive UI  
- JavaScript (Vanilla) – interactivity  
- YouTube IFrame API – video embedding  

---

## 🧠 LangChain RAG Architecture

> ✅ Enable Mermaid rendering in GitHub or use any compatible markdown viewer.

```mermaid
graph TD
    A[User Input via UI] --> B[Extract YouTube Video ID]
    B --> C[Fetch Transcript from YouTube]
    C --> D[Chunk Transcript]
    D --> E[Generate Embeddings (HuggingFace)]
    E --> F[Store in FAISS Vector DB]
    A2[User Query] --> H[Convert to Embedding]
    H --> I[Semantic Search in FAISS]
    I --> J[Retrieve Top-k Chunks]
    J --> K[LangChain + Gemini API]
    K --> L[Answer Generation]
    L --> M[Return Answer to UI]
