import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

const conf = new Configuration({
  basePath: PlaidEnvironments.sandbox, 
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID_SECRET': process.env.PLAID_SECRET,
    }
  }
})

export const plaidClient = new PlaidApi(conf);
