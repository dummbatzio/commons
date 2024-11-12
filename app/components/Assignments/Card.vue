<script setup lang="ts">
import type { Assignment } from '~/types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const { assignment } = defineProps<{
    assignment: Assignment
}>()

const emit = defineEmits(["assign"])
</script>

<template>
    <Card class="group">
        <CardContent>
            <div class="pt-4 pb-2">
                <h3 class="font-medium text-xl">{{ assignment.title }}</h3>
                <p>{{ assignment.description }}</p>
            </div>
        </CardContent>
        <CardFooter class="flex justify-between">
            <div class="flex items-start justify-between">
                <div class="flex flex-col gap-1 text-sm">
                    <span>Reward</span>
                    <span class="font-bold">{{ useFormatReproduction(assignment.reward) }}</span>
                </div>
            </div>
            <div v-if="assignment.status !== 'processing'">
                <Button variant="outline" @click="emit('assign', assignment)">Assing to me</Button>
            </div>
            <div v-else>
                <p class="text-sm">Currently in Progress</p>
            </div>
        </CardFooter>
    </Card>
</template>