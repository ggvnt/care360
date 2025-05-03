import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import { jsPDF } from 'jspdf';

const DiagnosisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  
  // PDF Refs and hooks
  const pdfRef = useRef();
  const { toPDF, targetRef } = usePDF({ filename: 'diagnosis-report.pdf' });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Load user from localStorage
        const storedUser = localStorage.getItem('authUser');
        if (!storedUser) {
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setAuthUser(parsedUser);

        // Use diagnosis from localStorage if no valid id is given
        const isValidObjectId = /^[a-f\d]{24}$/i.test(id || '');
        if (!id || !isValidObjectId) {
          const localDiagnosis = localStorage.getItem('latestDiagnosis');
          if (!localDiagnosis) {
            throw new Error('No valid diagnosis ID or local diagnosis found.');
          }

          const parsedDiagnosis = JSON.parse(localDiagnosis);
          setDiagnosis(parsedDiagnosis);
          return;
        }

        // Fetch from API if valid ID is provided
        const response = await axios.get(
          `http://localhost:5001/api/symptoms/diagnosis/${id}`,
          {
            headers: {
              Authorization: `Bearer ${parsedUser?.token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );

        if (!response?.data?.data) {
          throw new Error('No diagnosis data received');
        }

        setDiagnosis(response.data.data);

        // Fetch user details (admin viewing someone else's diagnosis)
        if (
          response.data.data.user &&
          response.data.data.user !== parsedUser._id &&
          parsedUser.role === 'admin'
        ) {
          const userResponse = await axios.get(
            `http://localhost:5001/api/users/${response.data.data.user}`,
            {
              headers: {
                Authorization: `Bearer ${parsedUser?.token}`,
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );
          setUserDetails(userResponse.data);
        }
      } catch (err) {
        console.error('Diagnosis fetch error:', err);

        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }

        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load diagnosis details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Custom PDF generation with jsPDF
  const generateCustomPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Diagnosis Report', 105, 20, { align: 'center' });
    
    // Add patient info section
    doc.setFontSize(14);
    doc.text('Patient Information', 20, 40);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date(diagnosis.createdAt).toLocaleString()}`, 20, 50);
    doc.text(`Age Group: ${diagnosis.ageGroup?.name || 'N/A'}`, 20, 60);
    doc.text(`Sex: ${diagnosis.sex || 'N/A'}`, 20, 70);
    
    if (userDetails) {
      doc.text(`Patient: ${userDetails.firstName} ${userDetails.lastName}`, 20, 80);
      doc.text(`Email: ${userDetails.email}`, 20, 90);
    }
    
    // Add symptoms section
    doc.setFontSize(14);
    doc.text('Reported Symptoms', 20, 110);
    doc.setFontSize(12);
    let yPos = 120;
    diagnosis.symptoms.forEach((symptom, index) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${index + 1}. ${symptom.name}`, 20, yPos);
      if (symptom.description) {
        const splitDesc = doc.splitTextToSize(symptom.description, 170);
        doc.text(splitDesc, 25, yPos + 7);
        yPos += 7 + (splitDesc.length * 7);
      }
      if (symptom.bodyPart) {
        doc.text(`Body part: ${symptom.bodyPart}`, 25, yPos + 7);
        yPos += 10;
      }
      yPos += 10;
    });
    
    // Add conditions section
    doc.setFontSize(14);
    doc.text('Possible Conditions', 20, yPos + 10);
    yPos += 20;
    doc.setFontSize(12);
    
    diagnosis.possibleConditions.forEach((condition, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Condition name and probability
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${condition.condition?.name || 'Unknown Condition'}`, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(`${Math.round(condition.probability || 0)}% probability`, 160, yPos);
      yPos += 10;
      
      // Condition description
      if (condition.condition?.description) {
        const splitDesc = doc.splitTextToSize(condition.condition.description, 170);
        doc.text(splitDesc, 25, yPos);
        yPos += 7 + (splitDesc.length * 7);
      }
      
      // Matching symptoms
      doc.text('Matching Symptoms:', 25, yPos);
      yPos += 10;
      condition.matchingSymptoms.forEach((ms, i) => {
        const text = `- ${ms.symptom?.name || 'Unknown'}${ms.importance ? ` (importance: ${ms.importance}/10)` : ''}`;
        const splitText = doc.splitTextToSize(text, 160);
        doc.text(splitText, 30, yPos);
        yPos += 7 + (splitText.length * 7);
      });
      
      // Recommended actions
      if (condition.recommendedActions?.length > 0) {
        doc.text('Recommended Actions:', 25, yPos);
        yPos += 10;
        condition.recommendedActions.forEach((action, i) => {
          const splitText = doc.splitTextToSize(`- ${action}`, 160);
          doc.text(splitText, 30, yPos);
          yPos += 7 + (splitText.length * 7);
        });
      }
      
      yPos += 15;
    });
    
    // Save the PDF
    doc.save(`diagnosis-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>
        <Link to="/diagnosis-history" className="text-blue-500 hover:underline">
          Back to History
        </Link>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600 mb-4">No diagnosis data available</p>
        <Link to="/diagnosis-history" className="text-blue-500 hover:underline">
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Diagnosis Details</h1>
          {userDetails && (
            <p className="text-gray-600">
              For user: {userDetails.firstName} {userDetails.lastName} ({userDetails.email})
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={generateCustomPDF}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Download PDF (Custom)
          </button>
          <button 
            onClick={() => toPDF()} 
            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
          >
            Download PDF (Styled)
          </button>
          <Link to="/diagnosis-history" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            Back to History
          </Link>
        </div>
      </div>

      {/* Wrap your content in the targetRef for styled PDF */}
      <div ref={targetRef}>
        {/* Basic Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Date</p>
              <p className="mt-1">
                {new Date(diagnosis.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Age Group</p>
              <p className="mt-1 capitalize">
                {diagnosis.ageGroup?.name || 'N/A'}
                {diagnosis.ageGroup?.description && ` (${diagnosis.ageGroup.description})`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Sex</p>
              <p className="mt-1 capitalize">{diagnosis.sex || 'N/A'}</p>
            </div>
            {diagnosis.user && authUser?.role === 'admin' && diagnosis.user !== authUser?._id && (
              <div>
                <p className="text-sm text-gray-600 font-medium">User ID</p>
                <p className="mt-1 text-sm font-mono">{diagnosis.user}</p>
              </div>
            )}
          </div>
        </div>

        {/* Symptoms */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Reported Symptoms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {diagnosis.symptoms?.map((symptom) => (
              <div key={symptom._id} className="bg-white p-3 rounded-lg border shadow-sm">
                <h3 className="font-medium text-gray-800">{symptom.name}</h3>
                {symptom.description && (
                  <p className="text-sm text-gray-600 mt-1">{symptom.description}</p>
                )}
                {symptom.bodyPart && (
                  <p className="text-xs text-gray-500 mt-2 capitalize">
                    Body part: {symptom.bodyPart}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Possible Conditions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Possible Conditions</h2>
          <div className="space-y-4">
            {diagnosis.possibleConditions?.map((condition, index) => (
              <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <h3 className="font-bold text-lg text-gray-800">
                    {condition.condition?.name || 'Unknown Condition'}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(condition.probability || 0)}% probability
                  </span>
                </div>

                {condition.condition?.description && (
                  <p className="mt-2 text-gray-700">{condition.condition.description}</p>
                )}

                {/* Matching Symptoms */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Matching Symptoms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {condition.matchingSymptoms?.map((ms, i) => (
                      <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {ms.symptom?.name || 'Unknown symptom'}
                        {ms.importance && ` • ${ms.importance}/10 importance`}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                {condition.recommendedActions?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Recommended Actions:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {condition.recommendedActions.map((action, i) => (
                        <li key={i} className="text-gray-700">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisDetail;