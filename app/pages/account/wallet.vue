<script setup lang="ts">
const { wallet, fetch } = useWallet()
await fetch();

// todo load paginated transactions
</script>
<template>
    <Container>
        <div class="flex flex-col gap-4">
            <LayoutSectionHeading>Reprostunden-Konto</LayoutSectionHeading>
            <dl>
                <WalletBalance />
            </dl>
            <WalletTransactionList v-if="wallet?.transactions" :transactions="wallet.transactions" />
            <div v-else>
                <p class="text-sm">Noch keine Transaktionen auf diesem Stundenkonto.</p>
            </div>
        </div>
    </Container>
</template>