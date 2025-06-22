# S3 Storage Setup Guide

This guide explains how to configure Amazon S3 for document storage in the HR system.

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/hr-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=hr-documents-bucket

# Server Configuration
PORT=3000
NODE_ENV=development
```

## AWS S3 Setup

### 1. Create an AWS Account
If you don't have an AWS account, create one at https://aws.amazon.com/

### 2. Create an IAM User
1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach the following policies:
   - `AmazonS3FullAccess` (for development)
   - Or create a custom policy with minimal permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:CreateBucket",
                "s3:HeadBucket",
                "s3:HeadObject"
            ],
            "Resource": [
                "arn:aws:s3:::hr-documents-bucket",
                "arn:aws:s3:::hr-documents-bucket/*"
            ]
        }
    ]
}
```

### 3. Get Access Keys
1. After creating the IAM user, download the access keys
2. Add them to your `.env` file

### 4. S3 Bucket Configuration
The application will automatically create the S3 bucket if it doesn't exist. However, you can also create it manually:

1. Go to AWS S3 Console
2. Create a new bucket with the name specified in `S3_BUCKET_NAME`
3. Configure the bucket for private access
4. Enable versioning (optional but recommended)
5. Configure lifecycle policies (optional)

### 5. CORS Configuration (if needed)
If you plan to upload directly from the frontend, add this CORS configuration to your S3 bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
        "ExposeHeaders": []
    }
]
```

## Security Best Practices

### 1. IAM Permissions
- Use the principle of least privilege
- Create specific IAM policies for your application
- Rotate access keys regularly

### 2. S3 Bucket Security
- Keep bucket private
- Enable server-side encryption
- Use bucket policies to restrict access
- Enable access logging

### 3. Environment Variables
- Never commit `.env` files to version control
- Use different credentials for development and production
- Use AWS Secrets Manager for production environments

## File Structure in S3

Documents are stored in the following structure:
```
hr-documents-bucket/
├── documents/
│   ├── employee-id-1/
│   │   ├── opt_receipt/
│   │   │   └── timestamp-random.pdf
│   │   ├── opt_ead/
│   │   │   └── timestamp-random.pdf
│   │   ├── i_983/
│   │   │   └── timestamp-random.pdf
│   │   └── i_20/
│   │       └── timestamp-random.pdf
│   └── employee-id-2/
│       └── ...
```

## Features

### 1. Automatic File Cleanup
- Temporary files are automatically deleted after S3 upload
- No local storage of sensitive documents

### 2. Signed URLs
- Documents are accessed via signed URLs with expiration
- URLs expire after 1 hour for security

### 3. Metadata Storage
- Original filename, employee ID, and document type are stored as S3 metadata
- Upload timestamp is recorded

### 4. Error Handling
- Comprehensive error handling for S3 operations
- Graceful fallbacks when S3 is unavailable

## Testing

### 1. Local Testing
- Use AWS CLI to verify bucket creation
- Check S3 console for uploaded files
- Verify signed URLs work correctly

### 2. Production Considerations
- Use AWS CloudTrail for audit logging
- Set up S3 event notifications for monitoring
- Configure CloudWatch alarms for errors

## Troubleshooting

### Common Issues

1. **Access Denied Errors**
   - Check IAM permissions
   - Verify access keys are correct
   - Ensure bucket name matches

2. **Bucket Not Found**
   - Check bucket name in environment variables
   - Verify bucket exists in correct region
   - Check IAM permissions for bucket creation

3. **Upload Failures**
   - Check file size limits (5MB)
   - Verify file type is allowed
   - Check network connectivity

4. **Signed URL Issues**
   - Verify bucket and key exist
   - Check IAM permissions for GetObject
   - Ensure clock synchronization

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=s3:*
```

## Cost Optimization

1. **Lifecycle Policies**
   - Move old documents to cheaper storage classes
   - Delete documents after retention period

2. **Monitoring**
   - Set up CloudWatch billing alerts
   - Monitor storage usage

3. **Optimization**
   - Compress documents before upload
   - Use appropriate storage classes
   - Implement document versioning policies 