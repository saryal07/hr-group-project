# Document Upload Feature

This feature allows employees to securely upload, view, and delete their identification documents for onboarding purposes.

## Features

- **Secure File Upload**: Employees can upload PDF, PNG, and JPG files up to 5MB
- **Document Management**: View and delete uploaded documents
- **Authentication Required**: All endpoints require valid JWT authentication
- **File Validation**: Automatic validation of file types and sizes
- **Error Handling**: Comprehensive error handling for various scenarios

## API Endpoints

### POST /api/documents
Upload a new document.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body (form-data):**
- `document` (file): The file to upload (PDF, PNG, JPG up to 5MB)
- `documentType` (string): Type of document (passport, drivers_license, ssn_card, birth_certificate, visa, other)
- `description` (string, optional): Description of the document

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "document_id",
    "employee": "employee_id",
    "fileName": "document-1234567890.pdf",
    "originalName": "passport.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "filePath": "/path/to/file",
    "documentType": "passport",
    "description": "My passport document",
    "uploadDate": "2024-01-01T00:00:00.000Z",
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/documents
Get all documents for the authenticated employee.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "document_id_1",
      "employee": "employee_id",
      "fileName": "document-1234567890.pdf",
      "originalName": "passport.pdf",
      "fileType": "application/pdf",
      "fileSize": 1024000,
      "filePath": "/path/to/file",
      "documentType": "passport",
      "description": "My passport document",
      "uploadDate": "2024-01-01T00:00:00.000Z",
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/documents/:id
Get a specific document by ID.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "document_id",
    "employee": "employee_id",
    "fileName": "document-1234567890.pdf",
    "originalName": "passport.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "filePath": "/path/to/file",
    "documentType": "passport",
    "description": "My passport document",
    "uploadDate": "2024-01-01T00:00:00.000Z",
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE /api/documents/:id
Delete a specific document by ID.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "No file uploaded"
}
```
```json
{
  "message": "Document type is required"
}
```
```json
{
  "message": "Invalid file type. Only PDF, PNG, and JPG files are allowed."
}
```
```json
{
  "message": "File too large. Maximum file size is 5MB."
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to access this document"
}
```

### 404 Not Found
```json
{
  "message": "Document not found"
}
```

## File Requirements

- **Supported Formats**: PDF, PNG, JPG
- **Maximum Size**: 5MB
- **Field Name**: Must use "document" as the form field name

## Document Types

- `passport`: Passport document
- `drivers_license`: Driver's license
- `ssn_card`: Social Security card
- `birth_certificate`: Birth certificate
- `visa`: Visa document
- `other`: Other identification documents

## Security Features

1. **Authentication Required**: All endpoints require valid JWT token
2. **Authorization**: Users can only access their own documents
3. **File Validation**: Automatic validation of file types and sizes
4. **Secure File Storage**: Files stored with unique names to prevent conflicts
5. **File Cleanup**: Files are deleted from filesystem when document is deleted

## Database Schema

The Document model includes:
- Employee reference (ObjectId)
- File metadata (name, type, size, path)
- Document type and description
- Upload date and verification status
- Timestamps for creation and updates

## Testing

Use the provided Postman collection (`postman/Document_Upload_Tests.postman_collection.json`) to test all endpoints.

### Test Scenarios Covered:
- Successful document upload
- Missing file upload
- Invalid file type
- Missing document type
- Unauthorized access
- Document retrieval
- Document deletion
- Error handling

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install multer
   ```

2. The uploads directory will be created automatically when the server starts

3. Import the document routes in `app.js` (already done)

4. Start the server and test with Postman

## File Storage

Files are stored in the `server/uploads/` directory with unique filenames to prevent conflicts. The directory is automatically created if it doesn't exist.

## Error Handling

The implementation includes comprehensive error handling for:
- File upload errors (size, type, missing file)
- Authentication errors
- Authorization errors
- Database errors
- File system errors

All errors return appropriate HTTP status codes and descriptive error messages. 