  <div>
    <img height="28" src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img height="28" src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img height="28" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img height="28" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img height="28" src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img height="28" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img height="28" src="https://img.shields.io/badge/Google%20ADK-AI%20Agents-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google ADK" />
    <img height="28" src="https://img.shields.io/badge/Lyzr-Orchestration-6E56CF?style=for-the-badge" alt="Lyzr" />
    <img height="28" src="https://img.shields.io/badge/A2A-Agent--to--Agent-FF6F00?style=for-the-badge" alt="A2A" />
    <img height="28" src="https://img.shields.io/badge/Qdrant-Vector%20Memory-DC244C?style=for-the-badge" alt="Qdrant" />
    <img height="28" src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img height="28" src="https://img.shields.io/badge/gRPC-4285F4?style=for-the-badge&logo=grpc&logoColor=white" alt="gRPC" />
  </div>
</div>

# Sentinel Scribe: AI-Augmented Clinical Triage, Documentation, and Doctor Copilot System

Welcome to Sentinel Scribe, an intelligent, multi-agent platform designed to modernize the clinical workflow. Whether you are a healthcare professional seeking to reduce documentation overhead, or an engineer exploring modern AI architectures, this documentation provides a comprehensive overview of the project.

---

### Table of Contents
- [Project Overview](#project-overview)
- [Demo Video](#demo-video)
- [Target Audience](#target-audience)
- [System Benefits and Improvements](#system-benefits-and-improvements)
- [System Workflow](#system-workflow)
- [Key Features](#key-features)
- [Architecture and Technology Stack](#architecture-and-technology-stack)
- [System Endpoints](#system-endpoints)
- [Graceful Fallback Mechanism](#graceful-fallback-mechanism)

---

### Project Overview

Sentinel Scribe is a comprehensive AI-powered application built to assist medical professionals by automating clinical triage, generating SOAP (Subjective, Objective, Assessment, and Plan) documentation, and acting as an interactive AI copilot. 

It processes raw patient-doctor conversation transcripts to identify emergencies, extract symptoms, determine triage priority, and generate professional medical notes. This is powered by an advanced Multi-Agent AI system using Google ADK and Gemini models.

---

### Demo Video

#### Doctor

https://github.com/user-attachments/assets/0368c707-8fa3-4612-b0b3-4693ec514249

#### Patient

https://github.com/user-attachments/assets/cd4468a8-d4e8-47d9-a15d-c6d3638dbeaf

---

### Target Audience

- **Healthcare Providers (Doctors, Nurses):** Reduce time spent on paperwork and documentation, allowing more focus on direct patient care.
- **Triage Staff:** Quickly and accurately prioritize patients based on symptom severity and clinical guidelines.
- **Clinic Administrators:** Streamline patient flow, increase efficiency, and maintain standardized medical records.
- **Software Developers and AI Engineers:** Explore practical implementations of Multi-Agent architectures, RAG (Retrieval-Augmented Generation), and Vector Databases in healthcare.

---

### System Benefits and Improvements

- **Reduces Burnout:** Automates the creation of SOAP notes, saving hours of manual data entry per week.
- **Enhances Patient Safety:** The dedicated RedFlagAgent instantly flags critical emergency symptoms that require immediate attention.
- **Data-Driven Decisions:** Leverages Clinical Guideline RAG to ensure that triage decisions are backed by up-to-date medical standards.
- **Context-Aware Assistance:** The CopilotAgent remembers patient history, acting as a virtual assistant to answer specific clinical questions.
- **Standardization:** Ensures that all patient encounters are documented in a consistent, structured format across the clinic.

---

### System Workflow

The workflow is designed to bridge the gap between clinical usability and robust backend processing.

#### The Medical Workflow (User Perspective)

1. **Input:** A raw text transcript of the patient's consultation is submitted to the system.
2. **Analysis:** The AI instantly analyzes the text, looking for critical red flags and extracting core symptoms.
3. **Triage:** The system assigns a priority (P1 - Emergency, P2 - Urgent, P3 - Routine) based on guidelines.
4. **Documentation:** A complete SOAP note is generated for the doctor to review and finalize.
5. **Interaction:** The doctor can chat with the AI Copilot to ask specific questions regarding the patient's history.

#### The Technical Workflow (System Perspective)

The system operates on a linear pipeline orchestrated by seven specialized AI Agents:

1. **TranscriptAgent:** Cleans, formats, and normalizes the raw conversation transcript.
2. **RedFlagAgent:** Scans the cleaned transcript for immediate emergency indicators.
3. **SymptomAgent:** Extracts symptoms and structures them into a clean JSON format.
4. **RAG Step:** Queries Qdrant (Vector DB) to retrieve relevant clinical guidelines and past patient history.
5. **TriageAgent:** Uses extracted data and RAG context to classify triage level (P1/P2/P3) and outputs clinical reasoning.
6. **SOAPAgent:** Synthesizes all gathered information into standard SOAP format.
7. **Storage:** All outputs, reasoning, and notes are securely persisted to a PostgreSQL database.
8. **CopilotAgent:** Available asynchronously for Doctor Q&A based on the persisted patient context.

---

### Key Features

- **Multi-Agent Orchestration:** A sequential pipeline of seven distinct AI agents handling specialized tasks seamlessly.
- **Retrieval-Augmented Generation (RAG):** Deep integration with Qdrant for global clinical guidelines and individualized patient memory retrieval.
- **Structured Output Generation:** AI responses are strictly structured (JSON) for seamless frontend integration and reliability.
- **Complete Dashboard Interface:** A sleek, modern frontend built with React, TypeScript, and Tailwind CSS.
- **Robust API Backend:** A highly scalable FastAPI backend handling async database operations.
- **Mock Data Seeding:** Built-in seed scripts to quickly populate the database with mock patients and vector embeddings for testing.

---

### Architecture and Technology Stack

- **Frontend:** Node.js, TypeScript, React, Tailwind CSS, Radix UI
- **Backend:** Python, FastAPI, SQLAlchemy (async), Pydantic
- **AI and Orchestration:** Google ADK (Agent Development Kit), Lyzr-style pipelines, Gemini 2.5 Flash
- **Relational Database:** PostgreSQL (Structured records and transactional data)
- **Vector Database:** Qdrant (Embeddings and RAG)

---

### System Endpoints

| Service | Default URL | Description |
|---|---|---|
| Frontend Application | https://sentinel-scribe.vercel.app/ | The main user interface for healthcare professionals. |
| Backend API | https://sentinel-scribe.onrender.com | The core backend service. |
| API Documentation (Swagger) | https://sentinel-scribe.onrender.com/docs | Interactive API documentation. |
| Qdrant Dashboard | https://76d39b28-64ec-4b34-a368-9faa11ad18b7.eu-central-1-0.aws.cloud.qdrant.io | Visual interface for managing the Vector DB. |

---

### Graceful Fallback Mechanism

The system is designed to maintain high availability. If the required Gemini API key is missing, invalid, or experiencing downtime, all AI agents gracefully fall back to deterministic, rule-based responses. This ensures that the user interface and core pipeline can always be operated and tested without interruption.
