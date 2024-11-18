import React, { useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import CloudinaryUpload from './CloudinaryUpload';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const DocumentUpload = ({ caseId, clientId }) => {
  const [uploadStatus, setUploadStatus] = useState('');

  const handleUploadSuccess = async (fileUrl) => {
    try {
      // Store the document reference in Firestore
      await addDoc(collection(db, 'documents'), {
        url: fileUrl,
        caseId,
        clientId,
        uploadedAt: new Date(),
        type: 'case_document'
      });

      setUploadStatus('Document uploaded successfully!');
    } catch (error) {
      console.error('Error saving document reference:', error);
      setUploadStatus('Failed to save document reference.');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload Case Document
      </Typography>
      <Box my={2}>
        <CloudinaryUpload onUploadSuccess={handleUploadSuccess} />
      </Box>
      {uploadStatus && (
        <Typography color={uploadStatus.includes('Failed') ? 'error' : 'success'}>
          {uploadStatus}
        </Typography>
      )}
    </Paper>
  );
};

export default DocumentUpload; 