import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SymptomsPage = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState("");
  const [conditions, setConditions] = useState("");
  const [conditionList, setConditionList] = useState([]);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/symptoms");
      setSymptoms(data);
    } catch (error) {
      toast.error("Failed to fetch symptoms");
    }
  };

  const handleAddCondition = () => {
    if (conditions.trim() && !conditionList.includes(conditions.trim())) {
      setConditionList([...conditionList, conditions.trim()]);
      setConditions(""); // Clear the input
    } else {
      toast.error("Please enter a valid condition or condition already added.");
    }
  };

  const handleRemoveCondition = (index) => {
    const updatedConditions = conditionList.filter((_, i) => i !== index);
    setConditionList(updatedConditions);
  };

  const addSymptom = async () => {
    if (!newSymptom || conditionList.length === 0) {
      toast.error("Please enter symptom and at least one condition");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/symptoms/add", {
        name: newSymptom,
        possibleConditions: conditionList,
      });
      toast.success("Symptom added successfully!");
      setNewSymptom("");
      setConditionList([]); // Reset conditions list
      fetchSymptoms(); // Refresh list
    } catch (error) {
      toast.error("Error adding symptom");
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

        {/* Condition Input */}
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

        {/* Display Added Conditions */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Conditions:</h3>
          <ul>
            {conditionList.map((condition, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{condition}</span>
                <button
                  onClick={() => handleRemoveCondition(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={addSymptom}
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
                {symptom.possibleConditions.join(", ")}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SymptomsPage;
