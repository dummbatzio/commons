<script setup lang="ts">
import type { WalletTransaction } from '~/types';

interface WalletTransactionListItemProps {
    transaction: WalletTransaction
}
defineProps<WalletTransactionListItemProps>()
</script>

<template>
    <div class="flex gap-4 py-4 lg:py-6">
        <div class="flex-1">
            <span class="text-xs text-gray-600">{{ formatISODateTime(transaction.createdAt) }}</span>
            <p class="font-medium">{{ transaction.comment ?? (transaction.type === "transfer_in" ? "Stundenzugang" :
                "Stundenabgang") }}</p>
        </div>
        <div class="flex items-end gap-1">
            <span :class="['text-lg', transaction.type === 'transfer_in' ? 'text-green-700' : 'text-red-700']">
                {{ transaction.type === 'transfer_in' ? '+' : "-" }} {{ useFormatReproduction(transaction.amount)
                }}</span>
            <span class="text-xs pb-1">Repros</span>
        </div>
    </div>
</template>