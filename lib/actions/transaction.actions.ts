"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const createTransaction = async (
  transaction: CreateTransactionProps
) => {
  try {
    const { database } = await createAdminClient();
    const newTrnx = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(), // gen a new ID
      {
        channel: "online",
        category: "Transfer",
        ...transaction,
      }
    );

    return parseStringify(newTrnx);
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  try {
    const { database } = await createAdminClient();

    const senderTrnxs = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal("senderBankId", bankId)]
    );

    const receiverTrnxs = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal("receiverBankId", bankId)]
    );

    const trnxs = {
      total: senderTrnxs.total + receiverTrnxs.total,
      documents: [...senderTrnxs.documents, ...receiverTrnxs.documents],
    };

    return parseStringify(trnxs);
  } catch (error) {
    console.log(error);
  }
};
