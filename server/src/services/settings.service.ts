import prisma from "../config/prisma";

// ===============================
// GET SETTINGS
// ===============================

export const getSettings = async () => {
  let settings = await prisma.storeSettings.findFirst();

  // Haddii settings-ku uusan jirin,
  // samee default settings
  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: {
        storeName: "My POS Store",
        phone: "",
        address: "",
        currency: "USD",
        tax: 0,
        receiptFooter: "Thank you for your business!",
      },
    });
  }

  return settings;
};

// ===============================
// UPDATE SETTINGS
// ===============================

export const updateSettings = async (
  storeName: string,
  phone: string,
  address: string,
  currency: string,
  tax: number,
  receiptFooter: string
) => {
  // Hubi settings-ka jira
  let settings = await prisma.storeSettings.findFirst();

  // Haddii uusan jirin, samee
  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: {
        storeName,
        phone,
        address,
        currency,
        tax,
        receiptFooter,
      },
    });

    return settings;
  }

  // Haddii uu jiro, update garee
  const updatedSettings =
    await prisma.storeSettings.update({
      where: {
        id: settings.id,
      },
      data: {
        storeName,
        phone,
        address,
        currency,
        tax,
        receiptFooter,
      },
    });

  return updatedSettings;
};