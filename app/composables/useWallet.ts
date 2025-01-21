import type { User, Wallet } from "~/types";

export const useWallet = () => {
  const wallet: Ref<Wallet | null> = useState(
    "current-user-wallet",
    () => null
  );

  const fetch = async () => {
    const { myWallet } = await GqlGetMyWallet();
    wallet.value = myWallet;
  };

  const setWallet = (w: Wallet) => (wallet.value = w);

  return {
    wallet,
    fetch,
    setWallet,
  };
};
