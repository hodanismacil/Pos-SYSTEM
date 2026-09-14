import React, { useEffect, useState } from "react";

export interface SettingsData {
  storeName: string;
  phone: string;
  address: string;
  currency: string;
  tax: number;
  receiptFooter: string;
}

const DEFAULT_SETTINGS: SettingsData = {
  storeName: "My POS Store",
  phone: "",
  address: "",
  currency: "USD",
  tax: 0,
  receiptFooter: "Thank you for your business!",
};

const API_BASE_URL = "http://localhost:5000/api";

const Settings = () => {
  const [settings, setSettings] =
    useState<SettingsData>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET SETTINGS
  // ==========================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login as Admin");
        }

        const response = await fetch(
          `${API_BASE_URL}/settings`,
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
            result.message || "Failed to fetch settings"
          );
        }

        setSettings({
          storeName: result.data.storeName ?? "",
          phone: result.data.phone ?? "",
          address: result.data.address ?? "",
          currency: result.data.currency ?? "USD",
          tax: result.data.tax ?? 0,
          receiptFooter:
            result.data.receiptFooter ?? "",
        });
      } catch (error: any) {
        console.error(
          "Fetch settings error:",
          error
        );

        setError(
          error.message || "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        name === "tax" ? Number(value) : value,
    }));

    setSaved(false);
    setError("");
  };

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

 const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  setSaved(false);
  setError("");

  // ==============================
  // VALIDATION
  // ==============================

  if (!settings.storeName.trim()) {
    setError("Store name is required");
    return;
  }

  if (!settings.phone.trim()) {
    setError("Phone number is required");
    return;
  }

  if (!settings.address.trim()) {
    setError("Address is required");
    return;
  }

  if (!settings.currency.trim()) {
    setError("Currency is required");
    return;
  }

  if (
    settings.tax < 0 ||
    settings.tax > 100
  ) {
    setError("Tax must be between 0 and 100");
    return;
  }

  if (!settings.receiptFooter.trim()) {
    setError("Receipt footer is required");
    return;
  }

  // ==============================
  // SAVE TO BACKEND
  // ==============================

  try {
    setSaving(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login as Admin");
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/settings`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName: settings.storeName.trim(),
          phone: settings.phone.trim(),
          address: settings.address.trim(),
          currency: settings.currency,
          tax: settings.tax,
          receiptFooter:
            settings.receiptFooter.trim(),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to update settings"
      );
    }

    // Database-ka kasoo qaado xogta la kaydiyay
    setSettings({
      storeName: result.data.storeName,
      phone: result.data.phone,
      address: result.data.address,
      currency: result.data.currency,
      tax: result.data.tax,
      receiptFooter: result.data.receiptFooter,
    });

    setSaved(true);

    window.dispatchEvent(
      new Event("posSettingsUpdated")
    );

    setTimeout(() => {
      setSaved(false);
    }, 3000);

  } catch (error: any) {
    console.error(error);

    setError(
      error.message ||
        "Failed to update settings"
    );
  } finally {
    setSaving(false);
  }
};
  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050817] text-slate-100 p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="text-slate-400">
              Loading settings...
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
    <div className="min-h-screen bg-[#050817] text-slate-100 p-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-1 text-slate-400">
          Manage your store and POS settings
        </p>
      </div>

      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl"
      >

        {/* ======================================
            STORE INFORMATION
        ====================================== */}

        <div className="mb-6 rounded-xl border border-slate-800 bg-[#0b1124] shadow-sm">

          <div className="border-b border-slate-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Store Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Basic information about your business
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            {/* Store Name */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Store Name
              </label>

              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                placeholder="Enter store name"
                disabled={saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Address */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                placeholder="Enter store address"
                disabled={saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

          </div>
        </div>

        {/* ======================================
            CURRENCY & TAX
        ====================================== */}

        <div className="mb-6 rounded-xl border border-slate-800 bg-[#0b1124] shadow-sm">

          <div className="border-b border-slate-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Currency & Tax
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Configure pricing and tax settings
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            {/* Currency */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Currency
              </label>

              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                disabled={saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option
                  value="USD"
                  className="bg-slate-900 text-white"
                >
                  USD - US Dollar
                </option>

                <option
                  value="SOS"
                  className="bg-slate-900 text-white"
                >
                  SOS - Somali Shilling
                </option>

                <option
                  value="EUR"
                  className="bg-slate-900 text-white"
                >
                  EUR - Euro
                </option>

                <option
                  value="GBP"
                  className="bg-slate-900 text-white"
                >
                  GBP - British Pound
                </option>
              </select>
            </div>

            {/* Tax */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Tax (%)
              </label>

              <input
                type="number"
                name="tax"
                min="0"
                max="100"
                step="0.01"
                value={settings.tax}
                onChange={handleChange}
                disabled={saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

          </div>
        </div>

        {/* ======================================
            RECEIPT SETTINGS
        ====================================== */}

        <div className="mb-6 rounded-xl border border-slate-800 bg-[#0b1124] shadow-sm">

          <div className="border-b border-slate-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Receipt Settings
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Customize the information shown on receipts
            </p>
          </div>

          <div className="p-6">

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Receipt Footer
            </label>

            <textarea
              name="receiptFooter"
              value={settings.receiptFooter}
              onChange={handleChange}
              rows={3}
              placeholder="Enter receipt footer message"
              disabled={saving}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

          </div>
        </div>

        {/* ======================================
            SAVE ACTIONS
        ====================================== */}

        <div className="flex flex-col items-end justify-end gap-4 sm:flex-row">

          {saved && (
            <span className="text-sm font-medium text-emerald-400">
              Settings saved successfully ✓
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default Settings;