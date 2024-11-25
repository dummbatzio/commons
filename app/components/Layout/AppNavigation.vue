<script setup lang="ts">
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

// todo: check for permissions
const adminLinks = [{
    to: "/app/admin/tasks",
    label: "Aufgaben"
},
{
    to: "/app/admin/ressources",
    label: "Resourcen"
},
{
    to: "/app/admin/qualifications",
    label: "Qualifikationen"
}];
</script>

<template>
    <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
                <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul class="grid gap-2 w-max">
                        <li v-for="item in adminLinks" class="w-full">
                            <NuxtLink :to="item.to">
                                <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                                    {{ item.label }}
                                </NavigationMenuLink>
                            </NuxtLink>
                        </li>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
</template>