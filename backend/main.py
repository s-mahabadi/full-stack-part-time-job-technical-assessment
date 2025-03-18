from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import os
import shutil
import uuid
from datetime import datetime
import pymongo
from pymongo import MongoClient
from bson import ObjectId
import json
from extract_data import convert_word_to_json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="Word to JSON Converter API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
try:
    # Get MongoDB URI from environment variable or use default
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client["word_to_json_db"]
    files_collection = db["files"]
    # Create index for faster lookups
    files_collection.create_index("file_id")
    logger.info(f"Connected to MongoDB at {mongo_uri}")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

# Constants
UPLOAD_DIR = "stored_files"
ALLOWED_EXTENSIONS = [".docx"]

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Models
class FileResponse(BaseModel):
    file_id: str
    filename: str
    file_path: str
    upload_date: str
    file_type: str
    
    class Config:
        json_encoders = {
            ObjectId: lambda oid: str(oid)
        }

class FileList(BaseModel):
    files: List[FileResponse]

class ErrorResponse(BaseModel):
    error: str

# Helper Functions
def validate_file_type(filename: str) -> bool:
    """Validate if the file type is allowed."""
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def get_rel_path(file_id: str, filename: str) -> str:
    """Get relative path for a file."""
    return os.path.join(UPLOAD_DIR, f"{file_id}_{filename}")

# API Endpoints
@app.post("/uploadFile", response_model=FileResponse)
async def upload_file(file: UploadFile = File(...)):
    """Upload a Word document file."""
    try:
        # Validate file type
        if not validate_file_type(file.filename):
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Only {', '.join(ALLOWED_EXTENSIONS)} files are allowed."
            )
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Create relative path
        rel_path = get_rel_path(file_id, file.filename)
        abs_path = os.path.join(os.getcwd(), rel_path)
        
        # Save the file
        with open(abs_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Store file metadata in MongoDB
        file_data = {
            "file_id": file_id,
            "filename": file.filename,
            "file_path": rel_path,
            "upload_date": datetime.now().isoformat(),
            "file_type": os.path.splitext(file.filename)[1].lower()
        }
        
        files_collection.insert_one(file_data)
        
        return file_data
        
    except Exception as e:
        logger.exception(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/getFiles", response_model=FileList)
async def get_files():
    """Get list of all uploaded files."""
    try:
        files = list(files_collection.find())
        for file in files:
            file["_id"] = str(file["_id"])
        
        return {"files": files}
        
    except Exception as e:
        logger.exception(f"Error retrieving files: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/deleteFile/{file_id}")
async def delete_file(file_id: str):
    """Delete a file by ID."""
    try:
        # Find the file in the database
        file_data = files_collection.find_one({"file_id": file_id})
        
        if not file_data:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Delete from database
        result = files_collection.delete_one({"file_id": file_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=500, detail="Failed to delete file from database")
        
        # Delete the file from disk
        file_path = os.path.join(os.getcwd(), file_data["file_path"])
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return {"message": "File deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error deleting file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/WordToJson/{file_id}")
async def word_to_json(file_id: str):
    """Convert a Word document to JSON."""
    try:
        # Find the file in the database
        file_data = files_collection.find_one({"file_id": file_id})
        
        if not file_data:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Get the file path
        file_path = os.path.join(os.getcwd(), file_data["file_path"])
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found on disk")
            
        # Convert Word to JSON
        result = convert_word_to_json(file_path)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error converting Word to JSON: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Run with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 