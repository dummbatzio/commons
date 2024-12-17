<template>
    <Container>
        <div class="space-y-12">
            <AccountProfile />

            <div class="flex flex-col gap-4">
                <LayoutSectionHeading>Deine Aufgaben</LayoutSectionHeading>
                <div>
                    <AssignmentList />
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <LayoutSectionHeading>Qualifikationen</LayoutSectionHeading>
                <div>
                    <p class="text-sm">Du hast noch keine Qualifikationsnachweise.</p>
                </div>
            </div>
        </div>
    </Container>
</template>