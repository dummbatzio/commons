import type { Profile, User } from "~/types";

export const useUser = () => {
  const user: Ref<User | null> = useState("currentUser", () => null);
  const profile: Ref<Profile | null> = useState(
    "currentUserProfile",
    () => null
  );

  const fetch = async () => {
    const { me } = await GqlMe();
    user.value = me;
  };

  const fetchProfile = async () => {
    const { myProfile } = await GqlGetMyProfile();
    profile.value = myProfile;
  };

  return {
    user,
    profile,
    fetch,
    fetchProfile,
  };
};
