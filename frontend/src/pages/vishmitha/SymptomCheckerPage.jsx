import React, { useEffect, useState } from "react";
import { useSymptomStore } from "../../store/vishmitha/symptomStore.js";

const SymptomCheckerPage = () => {
  const {
    symptoms,
    possibleConditions,
    isLoading,
    error,
    fetchSymptoms,
    checkSymptoms,
  } = useSymptomStore();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  useEffect(() => {
    fetchSymptoms();
  }, [fetchSymptoms]);

  const handleSymptomChange = (event) => {
    const value = event.target.value;
    setSelectedSymptoms((prev) =>
      prev.includes(value)
        ? prev.filter((symptom) => symptom !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkSymptoms(selectedSymptoms);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Symptom Checker
        </h2>

        {/* Symptom Selection Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {symptoms.length === 0 ? (
              <p className="text-center text-lg text-gray-600">
                Loading symptoms...
              </p>
            ) : (
              symptoms.map((symptom) => (
                <div key={symptom.name} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    value={symptom.name}
                    onChange={handleSymptomChange}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-lg text-gray-800">
                    {symptom.name}
                  </label>
                </div>
              ))
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || selectedSymptoms.length === 0}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {isLoading ? "Checking..." : "Check Conditions"}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {/* Display Possible Conditions */}
        {possibleConditions.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Possible Conditions:
            </h3>
            <ul className="space-y-4">
              {possibleConditions.map((condition, index) => (
                <li key={index} className="text-lg text-gray-800">
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
