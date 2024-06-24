"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

// Get the env value and rename to a simpler var name
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Mutation / Database / Make fetch
    const { account } = await createAdminClient();

    const resp = await account.createEmailPasswordSession(email, password);

    return parseStringify(resp);
  } catch (error) {
    console.error("Error", error);
  }
};

/**
 * Create a new user, and store in cookie and appwrite DB,
 * and infuse it with Plaid integration
 *
 * This func has to be atomic
 */
export const signUp = async ({password, ...userData}: SignUpParams) => {
  // destructure field first
  const { email, firstName, lastName } = userData;

  let newUserAccount;

  try {
    // 1. Create a user account in appwrite
    const { account, database } = await createAdminClient();
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Failed to create user account in Appwrite");

    // 2. Create a Dwolla customer URL
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData, 
      type: 'personal'
    });

    if (!dwollaCustomerUrl) throw new Error("Failed to create user in Dwolla");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl); 

    // 3. Store user with Dwolla info as a whole in appwrite DB 
    const newUser = await database.createDocument(
      DATABASE_ID!, 
      USER_COLLECTION_ID!, 
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id, 
        dwollaCustomerId, 
        dwollaCustomerUrl
      }
    )

    if (!newUser) throw new Error("Failed to create user in Appwrite");

    // 4. Store the info in session
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    return parseStringify(result);
  } catch (error) {
    return null;
  }
}

export const accountLogout = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

// Create a bank account of user in appwrite DB
export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId, // encrypted account Id, for public sharing safely
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {}
};

// connect the logged user to a plaid user
export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const resp = await plaidClient.linkTokenCreate(tokenParams);
    console.log(resp);

    return parseStringify({ linkToken: resp.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

// exchange the existing access token for a token that allows us to do banking ops,
// such as conn to bank account, or make payment transfer between accounts
export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID,
    // processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID,
    // access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.log("Error occurred while creating exchange token: ", error);
  }
};
