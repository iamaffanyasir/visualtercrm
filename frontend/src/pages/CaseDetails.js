import React from 'react';
import DocumentUpload from '../components/DocumentUpload';

const CaseDetails = ({ caseId, clientId }) => {
  return (
    <div>
      {/* Other case details */}
      <DocumentUpload caseId={caseId} clientId={clientId} />
    </div>
  );
};

export default CaseDetails; 