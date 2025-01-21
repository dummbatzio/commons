import type { User } from "~/types";

export const useUser = () => {
  const user: Ref<User | null> = useState("current-user", () => null);
  const { setWallet } = useWallet();

  const fetch = async () => {
    const { me, myWallet } = await GqlMe();
    user.value = me;
    setWallet(myWallet);
  };

  return {
    user,
    fetch,
  };
};
