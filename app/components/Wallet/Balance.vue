<script setup lang="ts">
const { wallet } = useWallet()
</script>

<template>
    <div>
        <dt class="text-sm text-gray-600">Guthaben</dt>
        <dd class="flex items-end gap-1">
            <span
                :class="['text-2xl font-semibold', wallet?.balance && { 'text-green-700': wallet.balance > 0, 'text-red-700': wallet.balance < 0 }]">{{
                    wallet?.balance ? useFormatReproduction(wallet.balance) : "-"
                }}</span>
            <span class="text-xs pb-1">Repros</span>
        </dd>
    </div>
</template>