import axios from "axios";

export interface SaleItemInput {
  productId: number;
  quantity: number;
}

export interface CreateSalePayload {
  customerId: number;
  paymentMethod: "CASH" | "CARD" | "MOBILE_MONEY";
  paidAmount: number;
  items: SaleItemInput[];
}

const API_BASE_URL = "http://localhost:5000/api"; // U beddel URL-kaaga dhabta ah

const createSale = async (payload: CreateSalePayload) => {
  const token = localStorage.getItem("token"); // Haddii aad JWT Auth adeegsato
  const response = await axios.post(`${API_BASE_URL}/sales`, payload, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
};

export default  createSale ;

