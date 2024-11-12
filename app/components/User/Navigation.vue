<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

const { user } = useUserSession();
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                <Avatar class="h-9 w-9">
                    <AvatarImage src="https://api.dicebear.com/9.x/lorelei/svg?seed=Sarah" alt="@shadcn" />
                    <AvatarFallback>SC</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end">
            <template v-if="user">
                <DropdownMenuLabel class="font-normal flex">
                    <div class="flex flex-col space-y-1">
                        <p class="text-sm font-medium leading-none">
                            {{ user.username }}
                        </p>
                        <p class="text-xs leading-none text-muted-foreground">
                            {{ user.email }}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
            </template>
            <DropdownMenuGroup>
                <DropdownMenuItem as-child>
                    <NuxtLink to="/account">
                        Profile
                    </NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                    <NuxtLink to="/account/settings">
                        Settings
                    </NuxtLink>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
                <NuxtLink to="/auth/logout">
                    Log out
                </NuxtLink>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>