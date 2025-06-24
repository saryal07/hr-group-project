const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'hr-documents-bucket';

class S3Service {
  /**
   * Upload a file to S3
   * @param {Object} file - Multer file object
   * @param {string} employeeId - Employee ID for folder structure
   * @param {string} documentType - Type of document
   * @returns {Promise<Object>} - S3 upload result with key and URL
   */
  static async uploadFile(file, employeeId, documentType) {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    const key = `documents/${employeeId}/${documentType}/${fileName}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        employeeId: employeeId,
        documentType: documentType,
        uploadedAt: new Date().toISOString()
      }
    };

    try {
      const result = await s3.upload(params).promise();
      
      // Clean up local file after upload
      fs.unlinkSync(file.path);
      
      return {
        key: result.Key,
        url: result.Location,
        bucket: result.Bucket,
        etag: result.ETag
      };
    } catch (error) {
      // Clean up local file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  /**
   * Delete a file from S3
   * @param {string} key - S3 object key
   * @returns {Promise<Object>} - S3 delete result
   */
  static async deleteFile(key) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    try {
      const result = await s3.deleteObject(params).promise();
      return result;
    } catch (error) {
      throw new Error(`S3 delete failed: ${error.message}`);
    }
  }

  /**
   * Get a signed URL for file download
   * @param {string} key - S3 object key
   * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
   * @returns {Promise<string>} - Signed URL
   */
  static async getSignedUrl(key, expiresIn = 3600) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: expiresIn
    };

    try {
      const url = await s3.getSignedUrlPromise('getObject', params);
      return url;
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  /**
   * Check if a file exists in S3
   * @param {string} key - S3 object key
   * @returns {Promise<boolean>} - True if file exists
   */
  static async fileExists(key) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    try {
      await s3.headObject(params).promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get file metadata from S3
   * @param {string} key - S3 object key
   * @returns {Promise<Object>} - File metadata
   */
  static async getFileMetadata(key) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    try {
      const result = await s3.headObject(params).promise();
      return {
        contentType: result.ContentType,
        contentLength: result.ContentLength,
        lastModified: result.LastModified,
        metadata: result.Metadata
      };
    } catch (error) {
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }

  /**
   * List files for a specific employee
   * @param {string} employeeId - Employee ID
   * @param {string} prefix - Optional prefix filter
   * @returns {Promise<Array>} - List of files
   */
  static async listEmployeeFiles(employeeId, prefix = '') {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: `documents/${employeeId}/${prefix}`,
      MaxKeys: 1000
    };

    try {
      const result = await s3.listObjectsV2(params).promise();
      return result.Contents || [];
    } catch (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  /**
   * Create a bucket if it doesn't exist
   * @returns {Promise<void>}
   */
  static async ensureBucketExists() {
    try {
      await s3.headBucket({ Bucket: BUCKET_NAME }).promise();
      console.log(`S3 bucket ${BUCKET_NAME} already exists`);
    } catch (error) {
      if (error.statusCode === 404) {
        // Bucket doesn't exist, create it
        const params = {
          Bucket: BUCKET_NAME,
          ACL: 'private'
        };

        try {
          await s3.createBucket(params).promise();
          console.log(`S3 bucket ${BUCKET_NAME} created successfully`);
        } catch (createError) {
          console.error(`Failed to create S3 bucket: ${createError.message}`);
          throw createError;
        }
      } else {
        throw error;
      }
    }
  }
}

module.exports = S3Service; 