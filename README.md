# Word to JSON Converter

A full-stack application that extracts structured data from Word documents (.docx), converts it to JSON format, and presents it in a user-friendly web interface.

## Project Overview

This application allows users to:
- Upload Word documents (.docx files)
- View uploaded files in a table format
- Convert Word documents to structured JSON
- View the JSON output in a formatted viewer
- Download the converted JSON

## Technical Stack

### Backend
- **FastAPI**: RESTful API framework for handling file operations and data extraction
- **Python-docx**: Python library for Word document parsing
- **MongoDB**: Database for storing file metadata
- **Python 3.x**: Programming language for backend logic

### Frontend
- **React.js**: Frontend framework for building the user interface
- **Axios**: HTTP client for API requests
- **React-JSON-Pretty**: Component for JSON visualization
- **CSS**: Custom styling for the user interface

### DevOps & Deployment
- **Docker**: Containerization for all components
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Web server for serving the frontend and routing API requests

## Project Structure

```
project/
├── backend/
│   ├── extract_data.py     # Python script for Word document parsing
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker configuration for backend
│   └── stored_files/       # Directory for storing uploaded files
│
├── frontend/
│   ├── src/                # React application source code
│   ├── public/             # Public assets
│   ├── package.json        # NPM dependencies
│   ├── Dockerfile          # Docker configuration for frontend
│   └── nginx.conf          # Nginx configuration
│
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project documentation
```

## Setup and Installation

### Prerequisites
- Docker and Docker Compose installed on your system
- Git for cloning the repository

### Steps to Run

1. Clone the repository:
   ```
   git clone <repository-url>
   cd word-to-json-converter
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up -d
   ```

3. Access the web application at:
   ```
   http://localhost
   ```

## API Endpoints

The backend provides the following RESTful API endpoints:

- **POST /api/uploadFile**: Upload a Word document
- **GET /api/getFiles**: Get a list of all uploaded files
- **DELETE /api/deleteFile/{file_id}**: Delete a specific file by ID
- **GET /api/WordToJson/{file_id}**: Convert a Word document to JSON format

## Data Extraction Features

The application extracts the following elements from Word documents:
- Headers (section titles, sub-titles)
- Text content (paragraphs and descriptions)
- Tables (with row and column values)

The extracted data is structured into a logical JSON format that preserves the document hierarchy.

## Development

### Running in Development Mode

#### Backend
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```
cd frontend
npm install
npm start
```

## Troubleshooting

If you encounter issues with container conflicts during startup, you can remove all containers and try again:
```
docker-compose down
docker rm -f $(docker ps -a -q)
docker-compose up -d
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was developed as part of a technical assessment
- Uses open-source libraries and frameworks
