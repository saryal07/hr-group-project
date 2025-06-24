# OPT Visa Workflow Management with S3 Storage

This feature implements a complete OPT visa document management workflow for employees and HR administrators, with secure cloud storage using Amazon S3.

## Features

### For Employees
- **Sequential Document Upload**: Documents must be uploaded in order (OPT Receipt → OPT EAD → I-983 → I-20)
- **Status Tracking**: Real-time status updates for each document
- **HR Feedback**: View feedback when documents are rejected
- **Template Downloads**: Download I-983 templates
- **Workflow Guidance**: Clear messages about next steps
- **Secure Cloud Storage**: All documents stored securely in Amazon S3

### For HR Administrators
- **Document Review**: Approve or reject uploaded documents
- **Feedback System**: Provide detailed feedback for rejections
- **Workflow Overview**: View progress of all OPT employees
- **Bulk Management**: Manage multiple employees efficiently
- **Secure Access**: Documents accessed via signed URLs

## Document Types

1. **OPT Receipt** (Step 1)
   - Initial receipt from USCIS
   - Must be approved before proceeding

2. **OPT EAD** (Step 2)
   - Employment Authorization Document
   - Requires OPT Receipt approval

3. **I-983** (Step 3)
   - Training Plan for STEM OPT Students
   - Requires OPT EAD approval
   - Templates available for download

4. **I-20** (Step 4)
   - Updated I-20 from school
   - Requires I-983 approval
   - Final step in workflow

## API Endpoints

### Employee Endpoints

#### POST /api/documents
Upload a document (enforces step order)

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body:**
- `document` (file): PDF, PNG, JPG up to 5MB
- `documentType` (string): opt_receipt, opt_ead, i_983, i_20
- `description` (string, optional): Document description

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "document_id",
    "employee": "employee_id",
    "documentType": "opt_receipt",
    "stepOrder": 1,
    "status": "pending",
    "uploadDate": "2024-01-01T00:00:00.000Z",
    "stepName": "OPT Receipt",
    "s3Key": "documents/employee-id/opt_receipt/timestamp-random.pdf",
    "s3Bucket": "hr-documents-bucket",
    "s3Url": "https://hr-documents-bucket.s3.amazonaws.com/..."
  }
}
```

#### GET /api/documents
Get all documents with signed download URLs

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "document_id",
      "employee": "employee_id",
      "documentType": "opt_receipt",
      "status": "pending",
      "downloadUrl": "https://hr-documents-bucket.s3.amazonaws.com/...?signature=..."
    }
  ]
}
```

#### GET /api/documents/status
Get complete workflow status with download URLs

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "stepOrder": 1,
      "documentType": "opt_receipt",
      "stepName": "OPT Receipt",
      "status": "pending",
      "canUpload": false,
      "message": "Waiting for HR to approve your OPT Receipt",
      "document": {
        "_id": "document_id",
        "downloadUrl": "https://hr-documents-bucket.s3.amazonaws.com/...?signature=..."
      }
    }
  ]
}
```

#### GET /api/documents/templates/i983-empty
Download empty I-983 template

#### GET /api/documents/templates/i983-sample
Download sample I-983 template

### HR Endpoints

#### GET /api/hr/documents
Get all documents for review

#### GET /api/hr/documents/pending
Get only pending documents

#### GET /api/hr/documents/employee/:employeeId
Get documents for specific employee

#### PUT /api/hr/documents/:id/approve
Approve a document

**Body:**
```json
{
  "feedback": "Optional feedback message"
}
```

#### PUT /api/hr/documents/:id/reject
Reject a document

**Body:**
```json
{
  "feedback": "Required feedback explaining rejection"
}
```

#### GET /api/hr/employees/opt
Get all employees with OPT visa status

#### GET /api/hr/workflow-summary
Get workflow summary for all OPT employees

## S3 Storage Features

### 1. Secure File Storage
- All documents stored in Amazon S3
- Private bucket with encrypted storage
- Automatic file cleanup after upload

### 2. Signed URLs
- Documents accessed via time-limited signed URLs
- URLs expire after 1 hour for security
- No direct S3 access required

### 3. Organized File Structure
```
hr-documents-bucket/
├── documents/
│   ├── employee-id-1/
│   │   ├── opt_receipt/
│   │   ├── opt_ead/
│   │   ├── i_983/
│   │   └── i_20/
│   └── employee-id-2/
```

### 4. Metadata Storage
- Original filename preserved
- Employee ID and document type stored
- Upload timestamp recorded

## Workflow Logic

### Upload Order Enforcement
1. Only first document (OPT Receipt) can be uploaded initially
2. Subsequent documents require previous step approval
3. Each document type can only be uploaded once per employee

### Status Messages
- **Pending**: "Waiting for HR to approve your [Document Name]"
- **Approved**: 
  - Step 1: "Please upload a copy of your OPT EAD"
  - Step 2: "Please download and fill out the I-983 form"
  - Step 3: "Please send the I-983 along with all necessary documents to your school and upload the new I-20"
  - Step 4: "All documents have been approved"
- **Rejected**: Shows HR feedback message

### Error Handling
- **Previous step not approved**: "Previous step must be approved before uploading [document type]"
- **Document already exists**: "Document of type [type] already exists"
- **Invalid document type**: "Invalid document type"
- **File validation**: Size and type restrictions enforced
- **S3 errors**: Comprehensive error handling for cloud storage issues

## Database Schema Updates

### Document Model Changes
- **New document types**: opt_receipt, opt_ead, i_983, i_20
- **Status field**: pending, approved, rejected
- **HR feedback**: hrFeedback field for rejection reasons
- **Review tracking**: reviewedBy, reviewedAt fields
- **Step order**: stepOrder field (1-4) for workflow enforcement
- **S3 fields**: s3Key, s3Bucket, s3Url for cloud storage

### Indexes
- Employee + step order for efficient workflow queries
- Status index for pending document queries

## Security Features

1. **Authentication Required**: All endpoints require valid JWT
2. **Authorization**: Employees can only access their own documents
3. **HR Access**: Only admin users can approve/reject documents
4. **File Validation**: Type and size restrictions
5. **Workflow Enforcement**: Server-side validation of upload order
6. **S3 Security**: Private bucket with signed URL access
7. **Temporary Storage**: Files only temporarily stored locally during upload

## Setup Instructions

1. **Environment Configuration**: Set up AWS credentials in `.env` file
2. **S3 Bucket**: Application will auto-create bucket or use existing one
3. **IAM Permissions**: Configure appropriate S3 permissions
4. **Database Migration**: The Document model has been updated with S3 fields
5. **Template Files**: Place I-983 templates in `server/templates/`
6. **Testing**: Use the provided Postman collection for testing

## Environment Variables Required

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=hr-documents-bucket

# Other required variables
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

## Frontend Integration

### Employee Dashboard
- Show workflow status for all 4 steps
- Display appropriate messages based on status
- Enable/disable upload buttons based on canUpload flag
- Show HR feedback for rejected documents
- Use downloadUrl for document access

### HR Dashboard
- List all pending documents
- Show employee progress overview
- Provide approve/reject interface with feedback
- Track workflow completion rates
- Access documents via signed URLs

## Error Scenarios

1. **Upload out of order**: Returns 400 with clear error message
2. **Missing previous approval**: Prevents upload with explanation
3. **Duplicate upload**: Prevents multiple uploads of same document type
4. **Template not found**: Returns 404 with helpful message
5. **Unauthorized access**: Returns 401/403 as appropriate
6. **S3 upload failure**: Returns 500 with error details
7. **Signed URL generation failure**: Graceful fallback with null URL

## Testing

Use the provided Postman collection to test:
- Document upload workflow with S3
- HR approval/rejection process
- Template downloads
- Error scenarios
- Authorization checks
- S3 integration

## Cost Considerations

1. **S3 Storage**: Pay per GB stored
2. **Data Transfer**: Pay for downloads and uploads
3. **API Requests**: Pay for S3 API calls
4. **Optimization**: Use lifecycle policies for cost management

## Future Enhancements

1. **Email Notifications**: Notify employees of status changes
2. **Document Expiry**: Track document expiration dates
3. **Bulk Operations**: HR bulk approve/reject functionality
4. **Audit Trail**: Track all document changes
5. **File Preview**: Preview uploaded documents in browser
6. **CDN Integration**: Use CloudFront for faster document delivery
7. **Backup Strategy**: Implement S3 cross-region replication 