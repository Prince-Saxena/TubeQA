# TubeQA - YouTube Video Assistant 🎥🤖

![TubeQA Screenshot](/images/image.png)

---

## 🎯 Purpose

As a Aspiring Data Scientist, I built TubeQA to explore the integration of:

- Retrieval-Augmented Generation (RAG)  
- Natural Language Processing (NLP)  
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

![Work Flow](/images/workflow.png)

---

## 🚫 Why TubeQA is Not Deployed

Although TubeQA is fully functional, I have **not deployed** it intentionally. Here's why:

- 🚨 The app uses **private API keys** for services like Google Gemini and HuggingFace.
- 🧾 If I deploy it publicly, **API usage can incur charges**, which are billed to my account.
- 🔐 To keep my keys secure and avoid unwanted billing, I’ve chosen not to make it live for now.

Feel free to fork the project and set up your own keys to run it locally.

---

## 🙏 Acknowledgements

Special thanks to [CampusX YouTube Channel](https://www.youtube.com/c/CampusX) 🎓 —  
Their clear and beginner-friendly tutorials helped me learn and build with **LangChain** effectively.

---