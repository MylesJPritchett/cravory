"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { Trash2, PlusCircle, GripVertical, Edit2 } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';
import {
  Food
} from '@/app/types';


export default function CreateRecipePage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    method: [] as string[],
    cooking_time: 0,
    servings: 0,
    ingredients: [] as {
      id: number;
      foodName: string;
      weight: number;
      notes?: string;
    }[],
  });
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [editingField, setEditingField] = useState<{
    type: 'name' | 'description' | 'servings' | 'cooking_time' | null,
    value: string | number
  }>({ type: null, value: '' });
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

  const handleEditField = (type: 'name' | 'description' | 'servings' | 'cooking_time', currentValue: string | number) => {
    setEditingField({ type, value: currentValue });
  };

  const saveEditedField = () => {
    if (editingField.type) {
      setFormData(prev => {
        const updatedFormData = { ...prev };

        if (editingField.type === 'name') updatedFormData.name = String(editingField.value);
        else if (editingField.type === 'description') updatedFormData.description = String(editingField.value);
        else if (editingField.type === 'servings') updatedFormData.servings = Number(editingField.value);
        else if (editingField.type === 'cooking_time') updatedFormData.cooking_time = Number(editingField.value);

        return updatedFormData;
      });
      setEditingField({ type: null, value: '' });
    }
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

    try {
      const response = await fetch("/api/recipe/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Recipe</h1>
      <form onSubmit={handleSubmit}>
        {/* Recipe Name */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Recipe Name
            </label>
            {editingField.type !== 'name' && (
              <button
                type="button"
                onClick={() => handleEditField('name', formData.name)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <Edit2 size={16} className="mr-1" /> Edit
              </button>
            )}
          </div>
          {editingField.type === 'name' ? (
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="text"
                value={editingField.value}
                onChange={(e) => setEditingField(prev => ({ ...prev, value: e.target.value }))}
                className="flex-grow block w-full p-2 bg-gray-700 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="button"
                onClick={saveEditedField}
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="mt-1 p-2 bg-gray-700 text-white rounded">{formData.name || 'Not set'}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Description
            </label>
            {editingField.type !== 'description' && (
              <button
                type="button"
                onClick={() => handleEditField('description', formData.description)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <Edit2 size={16} className="mr-1" /> Edit
              </button>
            )}
          </div>
          {editingField.type === 'description' ? (
            <div className="flex items-center space-x-2 mt-1">
              <textarea
                value={editingField.value}
                onChange={(e) => setEditingField(prev => ({ ...prev, value: e.target.value }))}
                className="flex-grow block w-full p-2 border bg-gray-700 text-white border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                autoFocus
              />
              <button
                type="button"
                onClick={saveEditedField}
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="mt-1 p-2 bg-gray-700 text-white rounded">{formData.description || 'Not set'}</p>
          )}
        </div>

        {/* Servings */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="servings" className="block text-sm font-medium text-white">
              Servings
            </label>
            {editingField.type !== 'servings' && (
              <button
                type="button"
                onClick={() => handleEditField('servings', formData.servings)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <Edit2 size={16} className="mr-1" /> Edit
              </button>
            )}
          </div>
          {editingField.type === 'servings' ? (
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="number"
                value={editingField.value}
                onChange={(e) => setEditingField(prev => ({ ...prev, value: Number(e.target.value) }))}
                className="flex-grow block w-full p-2 bg-gray-700 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="button"
                onClick={saveEditedField}
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="mt-1 p-2 bg-gray-700 text-white rounded">{formData.servings || 'Not set'}</p>
          )}
        </div>

        {/* Cooking Time */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="cooking_time" className="block text-sm font-medium text-white">
              Cooking Time (minutes)
            </label>
            {editingField.type !== 'cooking_time' && (
              <button
                type="button"
                onClick={() => handleEditField('cooking_time', formData.cooking_time)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <Edit2 size={16} className="mr-1" /> Edit
              </button>
            )}
          </div>
          {editingField.type === 'cooking_time' ? (
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="number"
                value={editingField.value}
                onChange={(e) => setEditingField(prev => ({ ...prev, value: Number(e.target.value) }))}
                className="flex-grow block w-full p-2 bg-gray-700 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="button"
                onClick={saveEditedField}
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="mt-1 p-2 bg-gray-700 text-white rounded">{formData.cooking_time ? `${formData.cooking_time} minutes` : 'Not set'}</p>
          )}
        </div>

        {/* Ingredients */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex flex-col mb-2 p-2 bg-gray-700 text-white border border-gray-300 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <Select
                  options={foods.map((food) => ({
                    value: food.id,
                    label: food.name,
                  }))}
                  value={{
                    value: ingredient.id,
                    label: ingredient.foodName
                  }}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      updateIngredient(index, 'id', selectedOption.value);
                      updateIngredient(index, 'foodName', selectedOption.label);
                    }
                  }}
                  className="flex-grow"
                  isSearchable
                  placeholder="Select food"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#374151",
                      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
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
                <input
                  type="number"
                  value={ingredient.weight}
                  onChange={(e) => updateIngredient(index, 'weight', Number(e.target.value))}
                  className="w-24 p-2 bg-gray-700 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Weight (g)"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <input
                type="text"
                value={ingredient.notes || ''}
                onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                className="w-full p-2 bg-gray-700 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes (optional)"
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
                  weight: 100,
                  notes: ''
                }]
              }));
            }}
            className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
          >
            <PlusCircle size={16} className="mr-2" /> Add Ingredient
          </button>
        </div>

        {/* Method Steps */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">Method Steps</label>
          <DragDropContext onDragEnd={onDragEndMethod}>
            <Droppable droppableId="method-steps">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {formData.method.map((step, index) => (
                    <Draggable key={index} draggableId={`step-${index}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center mb-2 space-x-2"
                        >
                          <div {...provided.dragHandleProps} className="cursor-move">
                            <GripVertical size={20} className="text-white" />
                          </div>
                          <textarea
                            value={step}
                            onChange={(e) => updateMethodStep(index, e.target.value)}
                            className="flex-grow p-2 bg-gray-700 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Step ${index + 1}`}
                            rows={2}
                          />
                          <button
                            type="button"
                            onClick={() => removeMethodStep(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={20} />
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
            className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
          >
            <PlusCircle size={16} className="mr-2" /> Add Step
          </button>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? "Creating..." : "Create Recipe"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
    </div>
  );
}
