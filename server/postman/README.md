# Postman Test Collections

This directory contains Postman test collections for the HR system API.

## Current Test Collections

### ✅ **Personal_Documents_Tests.postman_collection.json**
**Status**: Current and Active  
**Purpose**: Test the new personal document types (`profile_picture`, `drivers_license`)  
**Features**:
- Profile picture upload (JPG, PNG)
- Driver's license upload (PDF, image)
- Document retrieval with signed URLs
- Document deletion
- Error handling
- Workflow comparison tests
- Auto-approval validation for personal documents

**Documentation**: `Personal_Documents_Tests_README.md`

### ✅ **OPT_Workflow_Tests.postman_collection.json** (Updated)
**Status**: Current and Active  
**Purpose**: Test the OPT visa workflow functionality  
**Features**:
- OPT document upload workflow (4 steps)
- HR approval/rejection process
- Workflow status tracking
- Sequential document validation
- HR admin functionality

**Last Updated**: Authentication endpoints updated to use `username` instead of `email`

## Deleted Collections

### ❌ **Document_Upload_Tests.postman_collection.json** (DELETED)
**Reason**: Completely outdated  
**Issues**:
- Used unsupported document types (`passport`)
- Used old authentication system (`email` instead of `username`)
- Outdated API structure
- Functionality covered by newer collections

## Supported Document Types

### Workflow Documents (Require HR Approval)
- `opt_receipt` - OPT Receipt (Step 1)
- `opt_ead` - OPT EAD (Step 2)
- `i_983` - I-983 Form (Step 3)
- `i_20` - I-20 Form (Step 4)

### Personal Documents (Auto-Approved)
- `profile_picture` - Profile picture (JPG, PNG)
- `drivers_license` - Driver's license (PDF, image)

## Test Environment Setup

### Required Environment Variables
```json
{
  "baseUrl": "http://localhost:3000",
  "authToken": "(auto-populated)",
  "employeeId": "(auto-populated)",
  "profilePictureId": "(auto-populated)",
  "driversLicenseId": "(auto-populated)",
  "optReceiptId": "(auto-populated)"
}
```

### Test Users
- **Employee**: `username: "testemployee", password: "password123"`
- **HR Admin**: `username: "admin", password: "password123"`

## Running Tests

### 1. Personal Documents Tests
```bash
# Import Personal_Documents_Tests.postman_collection.json
# Set up environment variables
# Run tests sequentially for best results
```

### 2. OPT Workflow Tests
```bash
# Import OPT_Workflow_Tests.postman_collection.json
# Set up environment variables
# Run authentication tests first
# Follow the 4-step workflow sequence
```

## Test Coverage

### Authentication
- ✅ Login with username/password
- ✅ JWT token management
- ✅ Authorization headers

### File Upload
- ✅ Multipart form data
- ✅ File type validation (PDF, PNG, JPG)
- ✅ File size limits (5MB)
- ✅ Duplicate prevention

### Document Management
- ✅ Upload documents
- ✅ Retrieve documents with signed URLs
- ✅ Delete documents
- ✅ Workflow status tracking

### Error Handling
- ✅ Invalid file types
- ✅ Missing files
- ✅ Unauthorized access
- ✅ Duplicate documents
- ✅ Workflow violations

### S3 Integration
- ✅ File storage in S3
- ✅ Signed URL generation
- ✅ File deletion from S3

## Maintenance Notes

### When Adding New Document Types
1. Update the Document model enum
2. Update the controller validation
3. Add new test cases to appropriate collections
4. Update documentation

### When Updating Authentication
1. Update all test collections
2. Update environment variables
3. Test login endpoints
4. Verify token handling

### When Updating API Endpoints
1. Update request URLs in collections
2. Update response validation
3. Test error handling
4. Update documentation

## Best Practices

1. **Always test authentication first** before running other tests
2. **Use environment variables** for dynamic values
3. **Clean up test data** after running tests
4. **Validate both success and error cases**
5. **Test file uploads with various formats**
6. **Verify S3 integration** for file storage
7. **Test workflow constraints** for OPT documents
8. **Validate auto-approval** for personal documents

## Troubleshooting

### Common Issues
1. **Authentication failures**: Check username/password
2. **File upload errors**: Verify file size and type
3. **S3 errors**: Check AWS credentials and bucket access
4. **Workflow errors**: Ensure proper step sequence

### Debug Steps
1. Check server logs for backend errors
2. Verify environment variables are set
3. Test individual endpoints manually
4. Check file paths and permissions 