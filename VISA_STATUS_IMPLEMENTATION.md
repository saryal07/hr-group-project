# Visa Status Management Implementation

This document outlines the implementation of the Visa Status Management feature for the HR system, focusing on the HR side implemented in Angular.

## Overview

The Visa Status Management feature provides a comprehensive system for managing OPT (Optional Practical Training) visa documentation workflow. It includes:

- **HR Side (Angular)**: Complete management interface for tracking employee OPT progress
- **Employee Side (React)**: Self-service interface for viewing status and uploading documents (already implemented)
- **Document Management**: Secure S3-based document storage with preview capabilities
- **Workflow Automation**: Sequential document approval process with notifications

## Features Implemented

### HR Side Features (Angular)

#### 1. In Progress Tab
- Lists all employees with pending OPT documents
- Shows work authorization details (title, start/end dates, days remaining)
- Displays next steps for each employee
- Actions:
  - **Review Document**: For pending documents, opens preview dialog with approve/reject options
  - **Send Notification**: For employees who need to submit next documents

#### 2. All Tab
- Lists all OPT employees with search functionality
- Shows approved documents for each employee
- Actions:
  - **Preview Document**: Opens document in new tab
  - **Download Document**: Downloads document to local machine

#### 3. Document Preview Dialog
- Secure document preview using S3 signed URLs
- Approve/Reject functionality with feedback
- Form validation for rejection feedback
- Real-time status updates

### Employee Side Features (React - Already Implemented)

The employee side is already implemented in React and includes:
- Workflow progress tracking
- Document upload functionality
- Status feedback display
- Step-by-step guidance

## Technical Implementation

### Backend APIs

#### New API Endpoints

1. **GET /api/hr/visa-status/in-progress**
   - Returns employees with pending OPT documents
   - Includes workflow status and next steps

2. **GET /api/hr/visa-status/all**
   - Returns all OPT employees with search functionality
   - Includes approved documents list

3. **POST /api/hr/visa-status/send-notification**
   - Sends email notifications to employees
   - Customizable message content

4. **GET /api/hr/documents/:id/preview**
   - Generates signed S3 URLs for document preview
   - 1-hour expiration for security

#### Enhanced Existing APIs

- **PUT /api/hr/documents/:id/approve** - Approve documents
- **PUT /api/hr/documents/:id/reject** - Reject documents with feedback
- **GET /api/hr/workflow-summary** - Get workflow status for all employees

### Frontend Components (Angular)

#### HR Components

1. **VisaStatusManagementComponent**
   - Main HR interface with tabs
   - Data tables with sorting and pagination
   - Search functionality
   - Action buttons for document management

2. **DocumentPreviewDialogComponent**
   - Modal dialog for document preview
   - Approve/Reject functionality
   - Form validation and feedback

#### Shared Components

1. **SafePipe**
   - URL sanitization for iframe security
   - Prevents XSS attacks

### Services

1. **VisaStatusService**
   - Centralized API communication
   - Type-safe interfaces
   - Error handling and response formatting

### Data Models

#### Interfaces

```typescript
// Employee information
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

// Work authorization details
interface WorkAuthorization {
  title: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

// Document information
interface PendingDocument {
  id: string;
  fileName: string;
  originalName: string;
  uploadDate: string;
  hrFeedback?: string;
}

// Workflow step
interface WorkflowStep {
  stepOrder: number;
  stepName: string;
  documentType: string;
  status: 'not_uploaded' | 'pending' | 'approved' | 'rejected';
  canUpload: boolean;
  message: string;
}
```

## Workflow Logic

### OPT Document Steps

1. **OPT Receipt** (Step 1)
   - Initial receipt from USCIS
   - Must be approved before proceeding

2. **OPT EAD** (Step 2)
   - Employment Authorization Document
   - Requires OPT Receipt approval

3. **I-983** (Step 3)
   - Training Plan for STEM OPT Students
   - Requires OPT EAD approval

4. **I-20** (Step 4)
   - Updated I-20 from school
   - Requires I-983 approval
   - Final step in workflow

### Status Flow

```
not_uploaded → pending → approved → next step
                ↓
              rejected → not_uploaded (resubmit)
```

### Business Rules

1. **Sequential Upload**: Documents must be uploaded in order
2. **HR Approval Required**: Each document requires HR approval
3. **Feedback Required**: Rejections must include feedback
4. **Automatic Progression**: Approved documents unlock next steps
5. **Notification System**: HR can send reminders to employees

## Security Features

### Document Security

1. **S3 Storage**: All documents stored securely in Amazon S3
2. **Signed URLs**: Time-limited access (1 hour expiration)
3. **Private Bucket**: No direct S3 access
4. **File Validation**: Type and size restrictions enforced

### Authorization

1. **Role-Based Access**: HR vs Employee permissions
2. **User Isolation**: Employees can only see their own documents
3. **Admin Middleware**: HR routes protected by admin middleware
4. **Token Authentication**: JWT-based authentication

## UI/UX Features

### Material Design

- Consistent Material UI components
- Responsive design for mobile and desktop
- Accessibility features (ARIA labels, keyboard navigation)
- Color-coded status indicators

### User Experience

- **Loading States**: Spinners and progress indicators
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Toast notifications for actions
- **Search Functionality**: Real-time search with debouncing
- **Pagination**: Efficient data loading for large datasets

### Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized table displays for mobile

## File Structure

```
client-angular/src/app/
├── hr/visa-status-management/
│   ├── visa-status-management.component.ts
│   ├── visa-status-management.component.html
│   ├── visa-status-management.component.css
│   └── document-preview-dialog/
│       ├── document-preview-dialog.component.ts
│       ├── document-preview-dialog.component.html
│       └── document-preview-dialog.component.css
├── services/
│   └── visa-status.service.ts
└── pipes/
    └── safe.pipe.ts

server/
├── controllers/hrController.js (enhanced)
├── routers/hrRoutes.js (enhanced)
└── services/s3Service.js (existing)
```

## Testing

### API Testing

The implementation includes comprehensive API testing through Postman collections:

- **OPT Workflow Tests**: Tests the complete OPT workflow
- **Document Management**: Tests upload, approval, rejection
- **Search Functionality**: Tests employee search features

### Manual Testing Scenarios

1. **HR Workflow**
   - View in-progress employees
   - Review and approve documents
   - Reject documents with feedback
   - Send notifications to employees
   - Search and view all employees

2. **Employee Workflow (React)**
   - View workflow progress
   - Upload documents
   - View HR feedback
   - Track completion status

## Future Enhancements

### Planned Features

1. **Email Integration**
   - Automated email notifications
   - Email templates for different scenarios
   - Email tracking and delivery confirmation

2. **Advanced Search**
   - Filter by document status
   - Filter by date ranges
   - Export functionality

3. **Bulk Operations**
   - Bulk document approval
   - Bulk notification sending
   - Batch processing

4. **Analytics Dashboard**
   - Workflow completion rates
   - Average processing times
   - Bottleneck identification

### Technical Improvements

1. **Real-time Updates**
   - WebSocket integration for live updates
   - Push notifications for status changes

2. **Document Processing**
   - OCR for document text extraction
   - Automated validation checks
   - Document comparison tools

3. **Mobile App**
   - Native mobile application
   - Offline document upload
   - Push notifications

## Deployment Notes

### Environment Variables

Required environment variables for S3 integration:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-2
AWS_BUCKET_NAME=hr-documents-bucket
```

### Dependencies

#### Backend Dependencies
- `aws-sdk`: S3 integration
- `multer`: File upload handling
- `mongoose`: Database operations

#### Frontend Dependencies (Angular)
- `@angular/material`: UI components
- `@angular/forms`: Form handling
- `rxjs`: Reactive programming

## Conclusion

The Visa Status Management feature provides a comprehensive, secure, and user-friendly solution for managing OPT visa documentation workflows. The HR side is implemented in Angular with Material UI, while the employee side leverages the existing React implementation.

The system is designed to be easily extensible for future enhancements and can serve as a foundation for other document management workflows within the HR system. 