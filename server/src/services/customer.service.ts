
import  prisma from '../config/prisma';


export const createCustomer = async (
  name: string,
  phoneNumber: string
) => {
  const existingCustomer = await prisma.customer.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (existingCustomer) {
    throw new Error("Customer already exists");
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      phoneNumber,
    },
  });

  return customer;
};

export const getAllCustomers = async () => {
  const customers = await prisma.customer.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return customers;
}
    

export const getCustomerById = async (id: number) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });
  return customer;
}


export const updateCustomer = async (id: number, name: string, phoneNumber: string) => {
  const existingCustomer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!existingCustomer) {
    throw new Error("Customer not found");
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name,
      phoneNumber,
    },
  });

  return customer;
}


export const deleteCustomer = async (id: number) => {
  const existingCustomer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!existingCustomer) {
    throw new Error("Customer not found");
  }

  const customer = await prisma.customer.delete({
    where: { id },
  });

  return customer;
}