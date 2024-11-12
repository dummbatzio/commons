<template>
    <Container>
        <div class="space-y-12">
            <AccountProfile />
            <div class="flex flex-col gap-4">
                <div class="space-y-1">
                    <h3 class="text-lg font-medium">
                        Assignments
                    </h3>
                    <p class="text-sm text-muted-foreground">
                        Deine aktuellen Aufgaben
                    </p>
                </div>
                <Separator />
                <div>
                    <AssignmentsMine />
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="space-y-1">
                    <h3 class="text-lg font-medium">
                        Qualifikationen
                    </h3>
                    <p class="text-sm text-muted-foreground">
                        Hier siehst du eine Liste deiner abgeschlossenen Einführungen
                    </p>
                </div>
                <Separator />
                <div>
                    <p class="text-sm">Du hast noch keine Qualifikationsnachweise.</p>
                </div>
            </div>
        </div>
    </Container>
</template>