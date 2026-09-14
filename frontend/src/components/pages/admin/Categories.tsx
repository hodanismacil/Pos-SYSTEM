import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  _count?: {
    products: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = "http://localhost:5000/api";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `${API_BASE_URL}/categories`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch categories"
        );
      }

      setCategories(result.data || []);
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // ADD / UPDATE CATEGORY
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const categoryName = name.trim();

    // Validation
    if (!categoryName) {
      setError("Category name is required");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first");
      }

      const isEditing =
        editingId !== null;

      const url = isEditing
        ? `${API_BASE_URL}/categories/${editingId}`
        : `${API_BASE_URL}/categories`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: categoryName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Something went wrong"
        );
      }

      // Clear form
      setName("");
      setEditingId(null);

      // Refresh categories
      await fetchCategories();

      setSuccess(
        isEditing
          ? "Category updated successfully"
          : "Category created successfully"
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ||
          "Failed to save category"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (
    category: Category
  ) => {
    setName(category.name);
    setEditingId(category.id);

    setError("");
    setSuccess("");
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    setName("");
    setEditingId(null);
    setError("");
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (
    id: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login first"
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/categories/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete category"
        );
      }

      // Refresh
      await fetchCategories();

      setSuccess(
        "Category deleted successfully"
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ||
          "Failed to delete category"
      );
    }
  };

  // ==========================================
  // LOADING


  if (loading) {
    return (
      <div className="min-h-screen bg-[#050817] p-6 text-slate-100">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="text-slate-400">
              Loading categories...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#050817] p-6 text-slate-100">

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Categories
        </h1>

        <p className="mt-1 text-slate-400">
          Manage your product categories
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Success */}

      {success && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-400">
          {success}
        </div>
      )}

      {/* ======================================
          ADD / EDIT FORM
      ====================================== */}

      <div className="mb-6 max-w-4xl rounded-xl border border-slate-800 bg-[#0b1124]">

        <div className="border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {editingId !== null
              ? "Edit Category"
              : "Add Category"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {editingId !== null
              ? "Update the category name"
              : "Create a new product category"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-6 sm:flex-row"
        >
          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter category name"
            disabled={saving}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-white outline-none placeholder:text-slate-500 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId !== null
              ? "Update Category"
              : "Add Category"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="rounded-lg border border-slate-700 px-6 py-2.5 font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* ======================================
          CATEGORY LIST
      ====================================== */}

      <div className="max-w-4xl overflow-hidden rounded-xl border border-slate-800 bg-[#0b1124]">

        <div className="border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Category List
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {categories.length}{" "}
            {categories.length === 1
              ? "category"
              : "categories"}
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-400">
              No categories found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add your first category above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">

            {categories.map(
              (category, index) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-900/40"
                >

                  {/* Category Info */}

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-semibold text-blue-400">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-white">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {category._count?.products ??
                          0}{" "}
                        {category._count
                          ?.products === 1
                          ? "product"
                          : "products"}
                      </p>
                    </div>

                  </div>

                  {/* Actions */}

                  <div className="flex shrink-0 items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(category)
                      }
                      className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          category.id
                        )
                      }
                      className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              )
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;