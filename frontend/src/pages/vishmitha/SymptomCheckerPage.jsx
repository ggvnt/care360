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
    <div className=" flex items-center justify-center bg-gray-100 p-6 ">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Symptom Checker 🏥
        </h2>

        {/* Symptom Selection Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 rounded-lg bg-gray-50 border ">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Select Your Symptoms:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              {symptoms.length === 0 ? (
                <p className="text-gray-500 text-center w-full">
                  Loading symptoms...
                </p>
              ) : (
                symptoms.map((symptom) => (
                  <label
                    key={symptom.name}
                    className="flex items-center space-x-3 bg-white p-2 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      value={symptom.name}
                      onChange={handleSymptomChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-gray-800">{symptom.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || selectedSymptoms.length === 0}
            className={`w-full py-3 text-lg font-semibold rounded-lg transition-all focus:outline-none ${
              isLoading || selectedSymptoms.length === 0
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
            }`}
          >
            {isLoading ? "Checking..." : "Check Conditions"}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {/* Display Possible Conditions */}
        {possibleConditions.length > 0 && (
          <div className="mt-6 p-6 rounded-lg bg-gray-50 border">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              Possible Conditions:
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-gray-600">#</th>
                  <th className="py-2 px-4 text-gray-600">Condition</th>
                </tr>
              </thead>
              <tbody>
                {possibleConditions.map((condition, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
