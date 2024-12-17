<script setup lang="ts">
const { profile } = useUser()
</script>

<template>
    <Card class="w-max">
        <CardContent class="grid gap-2 p-6">
            <div>
                Guthaben
            </div>
            <div class="text-3xl font-semibold flex items-end gap-2">
                {{ useFormatReproduction(profile?.wallet?.balance ?? 0) }}
                <span class="text-xs pb-1">Repros</span>
            </div>
        </CardContent>
    </Card>
</template>