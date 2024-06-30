import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const TransactionHistory = async ({
  searchParams: { id, page },
}: SearchParamProps) => {
  const loggedIn = await getLoggedInUser();
  const ac = await getAccounts({
    userId: loggedIn.$id,
  });




  return <div>Trnx</div>;
};

export default TransactionHistory;
