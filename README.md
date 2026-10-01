# SynthNotes

SynthNotes is an NLP-powered educational tool designed to synthesize multiple learning resources into a single, cohesive set of study notes, attributing facts to their original sources and verifying faithfulness.

## Setup Instructions

1. **Activate Virtual Environment** (Assuming `venv` is already created)
   ```powershell
   .\venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```powershell
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

3. **Configure Environment**
   Copy the example environment file and add your actual API keys:
   ```powershell
   cp .env.example .env
   ```

4. **Run the Backend**
   *(The backend API implementation is in progress. Once complete, you will use Uvicorn to run the FastAPI app.)*
