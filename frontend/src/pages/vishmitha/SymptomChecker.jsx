// SymptomChecker.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/auth/useAuthStore';

const SymptomChecker = () => {
  const { authUser, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const [step, setStep] = useState(1);
  const [ageGroups, setAgeGroups] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [sex, setSex] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingAgeGroups, setIsLoadingAgeGroups] = useState(true);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(false);

  if (!authUser) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Symptom Checker</h1>
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
          You need to be logged in to use the symptom checker
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchAgeGroups = async () => {
      setIsLoadingAgeGroups(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5001/api/symptoms/age-groups');
        if (Array.isArray(response?.data)) {
          setAgeGroups(response.data);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching age groups:', err);
        setError(err.response?.data?.message || 'Failed to load age groups');
        setAgeGroups([]);
      } finally {
        setIsLoadingAgeGroups(false);
      }
    };

    fetchAgeGroups();

    setBodyParts([
      'head', 'neck', 'chest', 'abdomen', 'back', 'pelvis',
      'arms', 'legs', 'skin', 'general', 'other'
    ]);
  }, []);

  useEffect(() => {
    if (selectedBodyPart) {
      const fetchSymptoms = async () => {
        setIsLoadingSymptoms(true);
        setError('');
        try {
          const response = await axios.get(
            `http://localhost:5001/api/symptoms/symptoms/${selectedBodyPart}`
          );
          if (Array.isArray(response?.data)) {
            setSymptoms(response.data);
          } else {
            throw new Error('Invalid symptoms data format');
          }
        } catch (err) {
          console.error('Error fetching symptoms:', err);
          setError(err.response?.data?.message || 'Failed to load symptoms');
          setSymptoms([]);
        } finally {
          setIsLoadingSymptoms(false);
        }
      };

      fetchSymptoms();
    }
  }, [selectedBodyPart]);

  const handleNextStep = () => {
    setStep(step + 1);
    setError('');
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSymptomToggle = (symptomId) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedAgeGroup || !sex || selectedSymptoms.length === 0) {
      setError('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const symptomIds = selectedSymptoms.map(s => typeof s === 'object' ? s._id : s);

      const response = await axios.post(
        'http://localhost:5001/api/symptoms/diagnosis',
        {
          symptoms: symptomIds,
          ageGroupId: selectedAgeGroup,
          sex
        },
        {
          headers: {
            'Authorization': `Bearer ${authUser.token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response?.data?.success) {
        setDiagnosis(response.data.diagnosis);
        localStorage.setItem('latestDiagnosis', JSON.stringify(response.data.diagnosis)); 
        setStep(4);
        console.log('Diagnosis response:', response.data.diagnosis);
      } else {
        throw new Error(response?.data?.message || 'Invalid diagnosis response');
      }
    } catch (err) {
      console.error('Full diagnosis error:', {
        message: err.message,
        response: err.response?.data,
        request: err.config
      });

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to get diagnosis. Please try again.'
      );

      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Symptom Checker</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <div>
            <label className="block text-gray-700 mb-2">Age Group</label>
            {isLoadingAgeGroups ? (
              <div className="p-3 bg-gray-100 rounded animate-pulse">Loading age groups...</div>
            ) : (
              <select
                className="w-full p-2 border rounded"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                disabled={isLoadingAgeGroups}
              >
                <option value="">Select Age Group</option>
                {ageGroups.map(group => (
                  <option key={group._id} value={group._id}>
                    {group.name} ({group.description})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Sex</label>
            <select
              className="w-full p-2 border rounded"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            onClick={handleNextStep}
            disabled={!selectedAgeGroup || !sex || isLoadingAgeGroups}
            className={`px-4 py-2 rounded ${!selectedAgeGroup || !sex || isLoadingAgeGroups ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Select Body Part */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Where are you experiencing symptoms?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {bodyParts.map(part => (
              <button
                key={part}
                onClick={() => setSelectedBodyPart(part)}
                className={`p-3 border rounded capitalize transition-colors ${selectedBodyPart === part ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
              >
                {part}
              </button>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <button
              onClick={handlePreviousStep}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              disabled={!selectedBodyPart}
              className={`px-4 py-2 rounded ${!selectedBodyPart ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Symptoms */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select your symptoms</h2>
          <p className="text-gray-600">Select all that apply</p>

          {isLoadingSymptoms ? (
            <div className="p-4 bg-gray-100 rounded animate-pulse">
              Loading symptoms for {selectedBodyPart}...
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {symptoms.length > 0 ? (
                symptoms.map(symptom => (
                  <div
                    key={symptom._id}
                    onClick={() => handleSymptomToggle(symptom._id)}
                    className={`p-3 border rounded cursor-pointer transition-colors ${selectedSymptoms.includes(symptom._id) ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
                  >
                    <h3 className="font-medium">{symptom.name}</h3>
                    <p className="text-sm text-gray-600">{symptom.description}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No symptoms found for this body part
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={handlePreviousStep}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedSymptoms.length === 0 || isLoading || isLoadingSymptoms}
              className={`px-4 py-2 rounded ${selectedSymptoms.length === 0 || isLoading || isLoadingSymptoms ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Check Symptoms'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Show Diagnosis */}
      {step === 4 && diagnosis && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Possible Conditions</h2>

          <div className="space-y-4">
            {diagnosis.possibleConditions.map((condition, index) => (
              <div key={index} className="p-4 border rounded bg-gray-50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{condition.condition.name}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {condition.probability}% probability
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{condition.condition.description}</p>

                <div className="mt-3">
                  <h4 className="font-medium text-gray-800">Matching Symptoms:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {condition.matchingSymptoms.map((ms, i) => (
                      <span key={i} className="bg-white px-2 py-1 rounded border text-sm">
                        {ms.symptom.name} (importance: {ms.importance})
                      </span>
                    ))}
                  </div>
                </div>

                {condition.recommendedActions?.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-800">Recommended Actions:</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {condition.recommendedActions.map((action, i) => (
                        <li key={i} className="text-gray-700">{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Start Over
            </button>
            <button
              onClick={() => navigate('/diagnosis/:id')}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
            >
              View History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
