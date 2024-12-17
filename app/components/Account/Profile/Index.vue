<script setup lang="ts">
const { fetchProfile } = useUser()
await fetchProfile();
</script>

<template>
    <div>
        <LayoutSectionHeading>
            Profile
        </LayoutSectionHeading>
        <div>
            <WalletBalanceCard />
        </div>
    </div>
</template>