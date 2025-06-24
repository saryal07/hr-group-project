# Personal Documents Postman Test Collection

This Postman collection is specifically designed to test the new personal document types: `profile_picture` and `drivers_license`.

## Overview

The collection tests the following functionality:
- **Profile Picture Upload**: JPG and PNG formats
- **Driver's License Upload**: PDF and image formats
- **Document Retrieval**: Get all documents and specific documents
- **Document Deletion**: Delete personal documents
- **Error Handling**: Various error scenarios
- **Workflow Comparison**: Compare personal vs workflow documents

## Setup Instructions

### 1. Import the Collection
1. Open Postman
2. Click "Import" button
3. Select the `Personal_Documents_Tests.postman_collection.json` file
4. The collection will be imported with all test cases

### 2. Set Up Environment Variables
Create a new environment in Postman with the following variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `baseUrl` | Your server base URL | `http://localhost:3000` |
| `authToken` | JWT authentication token | (auto-populated after login) |
| `employeeId` | Employee ID | (auto-populated after login) |
| `profilePictureId` | Profile picture document ID | (auto-populated after upload) |
| `driversLicenseId` | Driver's license document ID | (auto-populated after upload) |
| `optReceiptId` | OPT receipt document ID | (auto-populated after upload) |

### 3. Prepare Test Files
You'll need the following test files in your local system:

#### For Profile Picture Tests:
- `test-image.jpg` (JPG format, < 5MB)
- `test-image.png` (PNG format, < 5MB)
- `test-document.pdf` (PDF format, for invalid file type test)

#### For Driver's License Tests:
- `drivers-license.pdf` (PDF format, < 5MB)
- `drivers-license-image.jpg` (JPG format, < 5MB)

#### For OPT Workflow Tests:
- `opt-receipt.pdf` (PDF format, < 5MB)

### 4. Update File Paths
In the collection, update the file paths in the formdata sections to point to your actual test files:

```json
{
  "key": "document",
  "type": "file",
  "src": "/path/to/your/test-image.jpg"
}
```

## Test Structure

### 1. Authentication
- **Login Employee**: Authenticates and saves the JWT token

### 2. Profile Picture Tests
- **Upload Profile Picture - JPG**: Tests JPG upload with validation
- **Upload Profile Picture - PNG**: Tests PNG upload with validation
- **Upload Profile Picture - Invalid File Type**: Tests PDF rejection

### 3. Driver's License Tests
- **Upload Driver's License - PDF**: Tests PDF upload
- **Upload Driver's License - Image**: Tests image upload

### 4. Document Retrieval Tests
- **Get All Documents**: Retrieves all documents for the employee
- **Get Specific Profile Picture**: Gets a specific profile picture
- **Get Specific Driver's License**: Gets a specific driver's license

### 5. Document Deletion Tests
- **Delete Profile Picture**: Deletes a profile picture
- **Delete Driver's License**: Deletes a driver's license

### 6. Error Handling Tests
- **Upload Without Authentication**: Tests unauthorized access
- **Upload Without File**: Tests missing file validation
- **Upload Without Document Type**: Tests missing document type
- **Upload Duplicate Document Type**: Tests duplicate prevention

### 7. Workflow Comparison Tests
- **Upload OPT Receipt**: Tests workflow document upload
- **Compare Personal vs Workflow Documents**: Compares the two document types

## Key Test Validations

### Personal Documents (Auto-Approved)
- ✅ Status is `approved` upon upload
- ✅ No `stepOrder` field
- ✅ Can be deleted at any time
- ✅ Support both PDF and image formats

### Workflow Documents (Require Approval)
- ✅ Status is `pending` upon upload
- ✅ Have `stepOrder` field (1-4)
- ✅ Cannot be deleted if `rejected`
- ✅ Follow sequential workflow

### Common Validations
- ✅ Authentication required for all operations
- ✅ File size limit (5MB)
- ✅ Supported file types (PDF, PNG, JPG)
- ✅ Duplicate document type prevention
- ✅ Signed URLs for downloads

## Running the Tests

### 1. Sequential Execution
Run the tests in the following order for best results:

1. **Authentication** → Login Employee
2. **Profile Picture Tests** → Upload tests
3. **Driver's License Tests** → Upload tests
4. **Document Retrieval Tests** → Get documents
5. **Workflow Comparison Tests** → Upload OPT document
6. **Document Deletion Tests** → Clean up

### 2. Individual Test Execution
You can run individual tests to test specific functionality.

### 3. Collection Runner
Use Postman's Collection Runner to run all tests automatically.

## Expected Results

### Successful Upload Response
```json
{
  "success": true,
  "data": {
    "_id": "document_id",
    "employee": "employee_id",
    "fileName": "document-1234567890.jpg",
    "originalName": "profile.jpg",
    "fileType": "image/jpeg",
    "fileSize": 512000,
    "documentType": "profile_picture",
    "description": "Professional headshot",
    "status": "approved",
    "uploadDate": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response Examples
```json
{
  "message": "No file uploaded"
}
```
```json
{
  "message": "Invalid file type. Only PDF, PNG, and JPG files are allowed."
}
```
```json
{
  "message": "Document of type profile_picture already exists"
}
```

## Troubleshooting

### Common Issues

1. **File Path Errors**
   - Ensure test files exist at the specified paths
   - Update file paths in the collection

2. **Authentication Errors**
   - Run the Login Employee test first
   - Check that the server is running
   - Verify the base URL is correct

3. **File Size Errors**
   - Ensure test files are under 5MB
   - Check file format is supported

4. **Duplicate Document Errors**
   - Delete existing documents before re-running upload tests
   - Use different document types for testing

### Debug Tips

1. **Check Environment Variables**
   - Verify all variables are set correctly
   - Check that tokens are being saved after login

2. **Monitor Console Logs**
   - Check Postman console for detailed error messages
   - Verify server logs for backend errors

3. **Test File Preparation**
   - Use small, valid test files
   - Ensure files are in supported formats

## Notes

- This collection is designed to work with the updated document upload system
- Personal documents (`profile_picture`, `drivers_license`) are auto-approved
- Workflow documents (`opt_receipt`, `opt_ead`, `i_983`, `i_20`) require HR approval
- All tests include comprehensive validation checks
- The collection automatically saves document IDs for subsequent tests 