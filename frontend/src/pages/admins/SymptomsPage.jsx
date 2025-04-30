import { useEffect, useState } from "react";
import { useSymptomStore } from "../../store/admins/useSymptomStore.js";

const SymptomsPage = () => {
  const { symptoms, fetchSymptoms, addSymptom, deleteSymptom } =
    useSymptomStore();
  const [newSymptom, setNewSymptom] = useState("");
  const [conditions, setConditions] = useState("");
  const [conditionList, setConditionList] = useState([]);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const handleAddCondition = () => {
    if (conditions.trim() && !conditionList.includes(conditions.trim())) {
      setConditionList([...conditionList, conditions.trim()]);
      setConditions("");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Symptom Management</h2>

      {/* Add Symptom Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Symptom Name"
          className="border p-2 w-full mb-2"
          value={newSymptom}
          onChange={(e) => setNewSymptom(e.target.value)}
        />

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Add Condition"
            className="border p-2 w-full"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
          />
          <button
            onClick={handleAddCondition}
            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Add Condition
          </button>
        </div>

        {/* Display Conditions */}
        <ul>
          {conditionList.map((condition, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <span>{condition}</span>
              <button
                onClick={() =>
                  setConditionList(conditionList.filter((_, i) => i !== index))
                }
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => addSymptom(newSymptom, conditionList)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          Add Symptom
        </button>
      </div>

      {/* Symptom List */}
      <h3 className="text-xl font-semibold mb-2">Existing Symptoms</h3>
      <ul className="bg-white p-4 rounded-lg shadow-md">
        {symptoms.length === 0 ? (
          <p className="text-gray-500">No symptoms available</p>
        ) : (
          symptoms.map((symptom) => (
            <li key={symptom._id} className="border-b p-2">
              {symptom.name} -{" "}
              <span className="text-gray-500">
                {(symptom.possibleConditions || []).join(", ")}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SymptomsPage;
