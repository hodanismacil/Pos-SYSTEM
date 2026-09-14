import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  X,
  Loader2,
  Phone,
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  phoneNumber: string;
}

interface CustomerForm {
  name: string;
  phoneNumber: string;
}

const emptyForm: CustomerForm = {
  name: "",
  phoneNumber: "",
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<CustomerForm>(emptyForm);

  // =========================
  // GET CUSTOMERS
  // =========================

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/customers");

      console.log("Customers response:", response.data);

      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================
  // INPUT
  // =========================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // ADD MODAL
  // =========================

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // =========================
  // EDIT MODAL
  // =========================

  const openEditModal = (customer: Customer) => {
    setEditingId(customer.id);

    setForm({
      name: customer.name,
      phoneNumber: customer.phoneNumber,
    });

    setShowModal(true);
  };

  // =========================
  // ADD / EDIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        phoneNumber: form.phoneNumber,
      };

      if (editingId) {
        // UPDATE
        const response = await api.put(
          `/customers/${editingId}`,
          payload
        );

        console.log("Update response:", response.data);

        if (response.data.success) {
          setCustomers((prev) =>
            prev.map((customer) =>
              customer.id === editingId
                ? response.data.data
                : customer
            )
          );
        }
      } else {
        // CREATE
        const response = await api.post(
          "/customers",
          payload
        );

        console.log("Create response:", response.data);

        if (response.data.success) {
          setCustomers((prev) => [
            response.data.data,
            ...prev,
          ]);
        }
      }

      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);

    } catch (error) {
      console.error(
        "Error saving customer:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(
        `/customers/${id}`
      );

      console.log("Delete response:", response.data);

      if (response.data.success) {
        setCustomers((prev) =>
          prev.filter(
            (customer) => customer.id !== id
          )
        );
      }
    } catch (error) {
      console.error(
        "Error deleting customer:",
        error
      );
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = customers.filter(
    (customer) => {
      const query = search.toLowerCase();

      return (
        customer.name
          .toLowerCase()
          .includes(query) ||
        customer.phoneNumber
          .toLowerCase()
          .includes(query)
      );
    }
  );

  return (
    <div className="space-y-7">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>
          <p className="text-sm font-medium text-purple-400">
            Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Customers
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage your customers and phone numbers.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02]"
        >
          <Plus size={18} />
          Add Customer
        </button>

      </div>

      {/* SEARCH */}

      <div className="rounded-2xl border border-white/10 bg-[#101631] p-4">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-[#0a1026] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500/50"
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101631]">

        <div className="flex items-center justify-between border-b border-white/10 p-6">

          <div>
            <h2 className="text-lg font-semibold text-white">
              All Customers
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredCustomers.length} customers found
            </p>
          </div>

          <div className="rounded-xl bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400">
            {customers.length} Total
          </div>

        </div>

        {loading ? (

          <div className="flex h-64 items-center justify-center">
            <Loader2
              size={30}
              className="animate-spin text-purple-400"
            />
          </div>

        ) : filteredCustomers.length === 0 ? (

          <div className="flex h-64 flex-col items-center justify-center">

            <Users
              size={40}
              className="text-slate-600"
            />

            <p className="mt-4 text-sm text-slate-400">
              No customers found
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>

                <tr className="border-b border-white/10 text-left">

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-white/5">

                {filteredCustomers.map(
                  (customer) => (

                    <tr
                      key={customer.id}
                      className="transition hover:bg-white/[0.02]"
                    >

                      {/* CUSTOMER */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-sm font-bold text-purple-400">
                            {customer.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold text-white">
                              {customer.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Customer #{customer.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PHONE */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-slate-400">

                          <Phone size={15} />

                          {customer.phoneNumber}

                        </div>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              openEditModal(
                                customer
                              )
                            }
                            className="rounded-lg bg-blue-500/10 p-2.5 text-blue-400 transition hover:bg-blue-500/20"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                customer.id
                              )
                            }
                            className="rounded-lg bg-red-500/10 p-2.5 text-red-400 transition hover:bg-red-500/20"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#101631] shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 p-6">

              <div>

                <h2 className="text-xl font-bold text-white">
                  {editingId
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingId
                    ? "Update customer information."
                    : "Create a new customer."}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Customer Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Ahmed Mohamed"
                  className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Phone Number
                </label>

                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="+252 63 0000000"
                  className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >

                  {saving && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {editingId
                    ? "Update Customer"
                    : "Add Customer"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Customers;