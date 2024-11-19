import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { Repeat1Icon, RepeatIcon } from "lucide-vue-next";
import { Duration } from "luxon";
import { h } from "vue";
import { Badge } from "~/components/ui/badge";
import type { Task } from "~/types";
import RowAction from "./RowAction.vue";

const columnHelper = createColumnHelper<Task>();
export const columns = ({
  onEdit,
  onCopy,
  onDelete,
}: {
  onEdit: any;
  onCopy: any;
  onDelete: any;
}) => {
  return [
    columnHelper.accessor("title", {
      header: "Titel",
      cell: ({ row }) => {
        const { type, categories } = row.original;
        const category = categories?.find((c) => !c.parent);
        return h("div", { class: "flex items-center gap-2" }, [
          type && type === "series"
            ? h(RepeatIcon, { class: "w-4 h-4" })
            : h(Repeat1Icon, { class: "w-4 h-4" }),
          category ? h(Badge, { variant: "outline" }, () => category.name) : "",
          h(
            "span",
            { class: "max-w-[500px] truncate font-medium" },
            row.getValue("title")
          ),
        ]);
      },
    }),
    columnHelper.accessor("priority", {
      header: "Prio",
      cell: ({ row }) => h("div", {}, row.getValue("priority")),
    }),
    columnHelper.accessor("expense", {
      header: "Aufwand (h)",
      cell: ({ row }) => {
        const { hours } = Duration.fromObject({
          minutes: row.getValue("expense"),
        })
          .shiftTo("hours")
          .toObject();
        return h("div", {}, hours);
      },
    }),
    columnHelper.accessor("factor", {
      header: "Faktor",
      cell: ({ row }) => h("div", {}, row.getValue("factor")),
    }),
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return h(
          "div",
          { class: "relative" },
          h(RowAction, {
            task,
            "onRow:edit": onEdit,
            "onRow:copy": onCopy,
            "onRow:deleted": onDelete,
          })
        );
      },
    }),
  ] as Array<ColumnDef<Task, unknown>>;
};
