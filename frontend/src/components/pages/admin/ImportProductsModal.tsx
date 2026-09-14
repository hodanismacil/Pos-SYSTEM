import { useState } from "react";
import { Upload, X, FileSpreadsheet, Loader2, CheckCircle } from "lucide-react";
import api from "../../api/api";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportProductsModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Fadlan dooro fayl CSV ah!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage(null);

      const response = await api.post("/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setTimeout(() => {
          onSuccess();
          onClose();
          setFile(null);
          setMessage(null);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Upload Error:", error);
      alert(error.response?.data?.message || "Import-kii waa uu fashilmay!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101631] p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <FileSpreadsheet className="text-emerald-400" size={20} /> Bulk Import Products
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-xs text-slate-400">
            Soo upload-garee faylka CSV-ga ah oo leh tiirarka: <code className="text-purple-400">Name, SKU, Barcode, Price, Stock</code>.
          </p>

          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-[#0a1026] p-6 text-center">
            <Upload className="mb-2 text-purple-400" size={32} />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload-input"
            />
            <label
              htmlFor="csv-upload-input"
              className="cursor-pointer text-xs font-semibold text-purple-400 hover:underline"
            >
              {file ? file.name : "Dooro faylka CSV-ga ah"}
            </label>
          </div>

          {message && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-400">
              <CheckCircle size={16} /> {message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold transition hover:bg-purple-500 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Upload Products"}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};