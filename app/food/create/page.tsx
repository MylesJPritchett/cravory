"use client";

import { useState } from "react";

export default function CreateFoodPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    energy: 0,
    fiber: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/food/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Food created successfully: ${data.name}`);
        setFormData({
          name: "",
          description: "",
          protein: 0,
          fat: 0,
          carbohydrates: 0,
          energy: 0,
          fiber: 0,
        });
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error creating food:", error);
      setError("An error occurred while creating the food.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Food</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border bg-gray-700 text-white border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border bg-gray-700 text-white border-gray-300 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="protein" className="block text-sm font-medium">
              Protein (g)
            </label>
            <input
              id="protein"
              name="protein"
              type="number"
              value={formData.protein}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border bg-gray-700 text-white border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="fat" className="block text-sm font-medium">
              Fat (g)
            </label>
            <input
              id="fat"
              name="fat"
              type="number"
              value={formData.fat}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border bg-gray-700 text-white border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="carbohydrates" className="block text-sm font-medium">
              Carbohydrates (g)
            </label>
            <input
              id="carbohydrates"
              name="carbohydrates"
              type="number"
              value={formData.carbohydrates}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border bg-gray-700 text-white border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="energy" className="block text-sm font-medium">
              Energy (kcal)
            </label>
            <input
              id="energy"
              name="energy"
              type="number"
              value={formData.energy}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border bg-gray-700 text-white border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="fiber" className="block text-sm font-medium">
              Fiber (g)
            </label>
            <input
              id="fiber"
              name="fiber"
              type="number"
              value={formData.fiber}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border bg-gray-700 text-white border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? "Creating..." : "Create Food"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
    </div>
  );
}
