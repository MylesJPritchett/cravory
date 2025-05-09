"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";

export default function CreateFoodPage() {
  const router = useRouter();
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

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const adjustNumber = (field: keyof typeof formData, amount: number) => {
    setFormData(prev => {
      const currentValue = Number(prev[field]);
      // Allow negative values for adjustments, but not below 0
      const newValue = Math.max(0, currentValue + amount);
      return {
        ...prev,
        [field]: newValue
      };
    });
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
        // Navigate to the new food page
        if (data.id) {
          router.push(`/food/${data.id}`);
        } else {
          // Reset form if not navigating
          setFormData({
            name: "",
            description: "",
            protein: 0,
            fat: 0,
            carbohydrates: 0,
            energy: 0,
            fiber: 0,
          });
        }
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
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Food</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Food Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter food name"
            required
          />
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Describe the food (optional)"
          />
        </div>

        {/* Nutritional Information */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-lg font-medium text-gray-300 mb-4">Nutritional Information (per 100g)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Protein */}
            <div>
              <label htmlFor="protein" className="block text-sm font-medium text-gray-300 mb-2">
                Protein (g)
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => adjustNumber('protein', -1)}
                  className="bg-gray-700 p-2 rounded-l-md border-r border-gray-600 hover:bg-gray-600"
                >
                  <Minus size={16} />
                </button>
                <input
                  id="protein"
                  name="protein"
                  type="number"
                  value={formData.protein}
                  onChange={(e) => handleChange('protein', Number(e.target.value))}
                  className="flex-grow p-2 bg-gray-700 text-white text-center border-y border-gray-600 focus:outline-none"
                  min="0"
                  step="0.1"
                />
                <button
                  type="button"
                  onClick={() => adjustNumber('protein', 1)}
                  className="bg-gray-700 p-2 rounded-r-md border-l border-gray-600 hover:bg-gray-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Fat */}
            <div>
              <label htmlFor="fat" className="block text-sm font-medium text-gray-300 mb-2">
                Fat (g)
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => adjustNumber('fat', -1)}
                  className="bg-gray-700 p-2 rounded-l-md border-r border-gray-600 hover:bg-gray-600"
                >
                  <Minus size={16} />
                </button>
                <input
                  id="fat"
                  name="fat"
                  type="number"
                  value={formData.fat}
                  onChange={(e) => handleChange('fat', Number(e.target.value))}
                  className="flex-grow p-2 bg-gray-700 text-white text-center border-y border-gray-600 focus:outline-none"
                  min="0"
                  step="0.1"
                />
                <button
                  type="button"
                  onClick={() => adjustNumber('fat', 1)}
                  className="bg-gray-700 p-2 rounded-r-md border-l border-gray-600 hover:bg-gray-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Carbohydrates */}
            <div>
              <label htmlFor="carbohydrates" className="block text-sm font-medium text-gray-300 mb-2">
                Carbohydrates (g)
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => adjustNumber('carbohydrates', -1)}
                  className="bg-gray-700 p-2 rounded-l-md border-r border-gray-600 hover:bg-gray-600"
                >
                  <Minus size={16} />
                </button>
                <input
                  id="carbohydrates"
                  name="carbohydrates"
                  type="number"
                  value={formData.carbohydrates}
                  onChange={(e) => handleChange('carbohydrates', Number(e.target.value))}
                  className="flex-grow p-2 bg-gray-700 text-white text-center border-y border-gray-600 focus:outline-none"
                  min="0"
                  step="0.1"
                />
                <button
                  type="button"
                  onClick={() => adjustNumber('carbohydrates', 1)}
                  className="bg-gray-700 p-2 rounded-r-md border-l border-gray-600 hover:bg-gray-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Fiber */}
            <div>
              <label htmlFor="fiber" className="block text-sm font-medium text-gray-300 mb-2">
                Fiber (g)
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => adjustNumber('fiber', -1)}
                  className="bg-gray-700 p-2 rounded-l-md border-r border-gray-600 hover:bg-gray-600"
                >
                  <Minus size={16} />
                </button>
                <input
                  id="fiber"
                  name="fiber"
                  type="number"
                  value={formData.fiber}
                  onChange={(e) => handleChange('fiber', Number(e.target.value))}
                  className="flex-grow p-2 bg-gray-700 text-white text-center border-y border-gray-600 focus:outline-none"
                  min="0"
                  step="0.1"
                />
                <button
                  type="button"
                  onClick={() => adjustNumber('fiber', 1)}
                  className="bg-gray-700 p-2 rounded-r-md border-l border-gray-600 hover:bg-gray-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Energy */}
            <div className="md:col-span-2">
              <label htmlFor="energy" className="block text-sm font-medium text-gray-300 mb-2">
                Energy (kJ)
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => adjustNumber('energy', -10)}
                  className="bg-gray-700 p-2 rounded-l-md border-r border-gray-600 hover:bg-gray-600"
                >
                  <Minus size={16} />
                </button>
                <input
                  id="energy"
                  name="energy"
                  type="number"
                  value={formData.energy}
                  onChange={(e) => handleChange('energy', Number(e.target.value))}
                  className="flex-grow p-2 bg-gray-700 text-white text-center border-y border-gray-600 focus:outline-none"
                  min="0"
                  step="1"
                />
                <button
                  type="button"
                  onClick={() => adjustNumber('energy', 10)}
                  className="bg-gray-700 p-2 rounded-r-md border-l border-gray-600 hover:bg-gray-600"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1 text-center">
                Approximately {(Number(formData.energy) * 0.239006).toFixed(0)} kcal
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-lg"
          >
            {loading ? "Creating..." : "Create Food"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-900 text-white rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mt-4 p-3 bg-green-900 text-white rounded-md">
          {successMessage}
        </div>
      )}
    </div>
  );
}
