"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { Trash2, PlusCircle, GripVertical, Minus, Plus } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';
import {
  Food
} from '@/app/types';

// Common measurement units
const UNITS = [
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
  { value: 'l', label: 'l' },
  { value: 'tsp', label: 'tsp' },
  { value: 'tbsp', label: 'tbsp' },
  { value: 'cup', label: 'cup' },
  { value: 'oz', label: 'oz' },
  { value: 'lb', label: 'lb' },
  { value: 'pinch', label: 'pinch' },
  { value: 'piece', label: 'piece' },
  { value: 'slice', label: 'slice' },
  { value: 'whole', label: 'whole' },
];

export default function CreateRecipePage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    method: [] as string[],
    cooking_time: 30,
    servings: 4,
    ingredients: [] as {
      id: number;
      foodName: string;
      quantity: number;
      unit: string;
      notes?: string;
    }[],
  });
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await fetch("/api/food/");
        const data = await response.json();
        setFoods(data);
      } catch (error) {
        console.error("Error fetching foods:", error);
        setError("Failed to load food options.");
      }
    }

    fetchFoods();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const adjustNumber = (field: 'cooking_time' | 'servings', amount: number) => {
    setFormData(prev => {
      const currentValue = prev[field] as number;
      const newValue = Math.max(1, currentValue + amount); // Ensure value is at least 1
      return {
        ...prev,
        [field]: newValue
      };
    });
  };

  const removeIngredient = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, index) => index !== indexToRemove)
    }));
  };

  const updateIngredient = (index: number, field: keyof typeof formData.ingredients[0], value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  const addMethodStep = () => {
    setFormData((prev) => ({
      ...prev,
      method: [...prev.method, '']
    }));
  };

  const removeMethodStep = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      method: prev.method.filter((_, index) => index !== indexToRemove)
    }));
  };

  const updateMethodStep = (index: number, step: string) => {
    setFormData((prev) => ({
      ...prev,
      method: prev.method.map((existingStep, i) =>
        i === index ? step : existingStep
      )
    }));
  };

  const onDragEndMethod = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedMethod = Array.from(formData.method);
    const [reorderedItem] = reorderedMethod.splice(result.source.index, 1);
    reorderedMethod.splice(result.destination.index, 0, reorderedItem);

    setFormData((prev) => ({
      ...prev,
      method: reorderedMethod
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Convert ingredients to the format expected by the API
    const apiFormData = {
      ...formData,
      ingredients: formData.ingredients.map(ingredient => ({
        id: ingredient.id,
        foodName: ingredient.foodName,
        weight: ingredient.unit === 'g' ? ingredient.quantity : ingredient.quantity, // For now, just use quantity directly
        notes: `${ingredient.quantity} ${ingredient.unit} ${ingredient.notes ? '- ' + ingredient.notes : ''}`
      }))
    };

    try {
      const response = await fetch("/api/recipe/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Recipe created successfully: ${data.recipe.name}`);
        router.push(`/recipe/${data.recipe.id}`);
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      setError("An error occurred while creating the recipe.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipe Name */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Recipe Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter recipe name"
          />
        </div>

        {/* Description */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Describe your recipe"
          />
        </div>

        {/* Servings & Cooking Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Servings
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => adjustNumber('servings', -1)}
                className="bg-gray-700 p-2 rounded-l-md border-r border-gray-600 hover:bg-gray-600"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) => handleInputChange('servings', Number(e.target.value))}
                className="flex-grow p-2 bg-gray-700 text-white text-center border-y border-gray-600 focus:outline-none"
                min="1"
              />
              <button
                type="button"
                onClick={() => adjustNumber('servings', 1)}
                className="bg-gray-700 p-2 rounded-r-md border-l border-gray-600 hover:bg-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cooking Time (minutes)
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => adjustNumber('cooking_time', -5)}
                className="bg-gray-700 p-2 rounded-l-md border-r border-gray-600 hover:bg-gray-600"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={formData.cooking_time}
                onChange={(e) => handleInputChange('cooking_time', Number(e.target.value))}
                className="flex-grow p-2 bg-gray-700 text-white text-center border-y border-gray-600 focus:outline-none"
                min="1"
              />
              <button
                type="button"
                onClick={() => adjustNumber('cooking_time', 5)}
                className="bg-gray-700 p-2 rounded-r-md border-l border-gray-600 hover:bg-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-3">Ingredients</label>
          
          {formData.ingredients.length === 0 && (
            <div className="text-center py-4 text-gray-400">
              No ingredients added yet. Add your first ingredient below.
            </div>
          )}
          
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="mb-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <div className="flex-grow">
                  <Select
                    options={foods.map((food) => ({
                      value: food.id,
                      label: food.name,
                    }))}
                    value={ingredient.id ? {
                      value: ingredient.id,
                      label: ingredient.foodName
                    } : null}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        updateIngredient(index, 'id', selectedOption.value);
                        updateIngredient(index, 'foodName', selectedOption.label);
                      }
                    }}
                    className="flex-grow"
                    isSearchable
                    placeholder="Select ingredient"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "#374151",
                        borderColor: state.isFocused ? "#3b82f6" : "#4B5563",
                        color: "#ffffff",
                        "&:hover": {
                          borderColor: "#3b82f6",
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#374151",
                        color: "#ffffff",
                      }),
                      input: (base) => ({
                        ...base,
                        color: "#ffffff",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#9ca3af",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#ffffff",
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? "#2563eb" : isFocused ? "#1e40af" : "#374151",
                        color: "#ffffff",
                      }),
                    }}
                  />
                </div>
                
                <div className="flex">
                  <input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', Number(e.target.value))}
                    className="w-20 p-2 bg-gray-700 text-white border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Qty"
                    min="0"
                    step="0.1"
                  />
                  <Select
                    options={UNITS}
                    value={UNITS.find(unit => unit.value === ingredient.unit) || UNITS[0]}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        updateIngredient(index, 'unit', selectedOption.value);
                      }
                    }}
                    className="w-24"
                    isSearchable
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#374151",
                        borderColor: "#4B5563",
                        borderRadius: "0",
                        minHeight: "42px",
                        color: "#ffffff",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#374151",
                      }),
                      input: (base) => ({
                        ...base,
                        color: "#ffffff",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#ffffff",
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? "#2563eb" : isFocused ? "#1e40af" : "#374151",
                        color: "#ffffff",
                      }),
                    }}
                  />
                  
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 bg-red-800 text-white rounded-r-md hover:bg-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <input
                type="text"
                value={ingredient.notes || ''}
                onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes (e.g., chopped, diced, etc.)"
              />
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                ingredients: [...prev.ingredients, {
                  id: 0,
                  foodName: '',
                  quantity: 100,
                  unit: 'g',
                  notes: ''
                }]
              }));
            }}
            className="flex items-center justify-center w-full py-2 mt-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={16} className="mr-2" /> Add Ingredient
          </button>
        </div>

        {/* Method Steps */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-3">Cooking Steps</label>
          
          {formData.method.length === 0 && (
            <div className="text-center py-4 text-gray-400">
              No steps added yet. Add your first cooking step below.
            </div>
          )}
          
          <DragDropContext onDragEnd={onDragEndMethod}>
            <Droppable droppableId="method-steps">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {formData.method.map((step, index) => (
                    <Draggable key={index} draggableId={`step-${index}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-start gap-2 bg-gray-700 rounded-lg border border-gray-600 p-2"
                        >
                          <div {...provided.dragHandleProps} className="cursor-move p-2 bg-gray-600 rounded-md">
                            <GripVertical size={20} className="text-gray-300" />
                          </div>
                          <div className="flex-shrink-0 bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </div>
                          <textarea
                            value={step}
                            onChange={(e) => updateMethodStep(index, e.target.value)}
                            className="flex-grow p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Describe step ${index + 1}`}
                            rows={2}
                          />
                          <button
                            type="button"
                            onClick={() => removeMethodStep(index)}
                            className="p-2 bg-red-800 text-white rounded-md hover:bg-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <button
            type="button"
            onClick={addMethodStep}
            className="flex items-center justify-center w-full py-2 mt-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={16} className="mr-2" /> Add Step
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-lg"
          >
            {loading ? "Creating..." : "Create Recipe"}
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
