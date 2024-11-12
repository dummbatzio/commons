<script setup lang="ts">
import { ToastAction, useToast } from '~/components/ui/toast';
import type { Assignment } from '~/types';

// const { data, refresh } = await useAsyncGql("FindAssignments")
// const assignments = computed(() => data.value?.assignments)

const { user } = useUserSession()
const { toast } = useToast()

const onAssign = async (assignment: Assignment) => {
    if (!user.value) {
        return;
    }

    try {
        // const { assignAssignmentToUser } = await GqlAssignAssignmentToUser({
        //     input: {
        //         assignmentId: assignment.id,
        //         userId: user.value.id
        //     }
        // });

        toast({
            title: "Whoo!",
            description: "You have a new Task. Have fun!",
            action: h(ToastAction, {
                altText: 'See your assignments',
            }, {
                default: () => 'See your assignments',
            }),
        })
    } catch (err) {
        console.error(err)
    }

    // await refresh()
}
</script>

<template>
    <Container>
        <div class="space-y-1">
            <h2 class="text-2xl font-semibold tracking-tight">
                Assignments
            </h2>
            <p class="text-sm text-muted-foreground">
                Mache Sachen - für dich, für alle.
            </p>
        </div>

        <Separator class="my-4" />

        <div class="grid sm:grid-cols-2 gap-2 md:gap-4 lg:grid-cols-3">
            <!-- <AssignmentsCard v-for="a in assignments" :assignment="a" @assign="onAssign" /> -->
        </div>
    </Container>
</template>