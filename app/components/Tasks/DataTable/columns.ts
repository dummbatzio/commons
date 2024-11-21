import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { Repeat1Icon, RepeatIcon } from "lucide-vue-next";
import { DateTime, Duration } from "luxon";
import { h } from "vue";
import { Badge } from "~/components/ui/badge";
import type { Task } from "~/types";
import RowAction from "./RowAction.vue";
import { TaskPriority } from "~/types/tasks";
import SeriesDialog from "../SeriesDialog.vue";

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
          ...(type && type === "series"
            ? [h(SeriesDialog, { task: row.original })]
            : []),
        ]);
      },
    }),
    columnHelper.accessor("priority", {
      header: "Prio",
      cell: ({ row }) => h("div", {}, row.getValue("priority")),
      sortingFn: (rowA: any, rowB: any, columnId: any): number => {
        const taskPriorityValues = Object.values(TaskPriority);
        const aIndex = taskPriorityValues.findIndex(
          (v) => v == rowA.getValue(columnId)
        );
        const bIndex = taskPriorityValues.findIndex(
          (v) => v === rowB.getValue(columnId)
        );
        return bIndex - aIndex;
      },
    }),
    columnHelper.accessor("due", {
      header: "Fälligkeit",
      cell: ({ row }) => {
        if (!row.getValue("due")) {
          return h("div", {}, "keine");
        }
        const date = DateTime.fromISO(row.getValue("due"));
        return h("div", {}, date.toLocaleString(DateTime.DATETIME_SHORT));
      },
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
      cell: ({ row }) => h("div", { class: "w-max" }, row.getValue("factor")),
    }),
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;
        return h(
          "div",
          { class: "relative text-right" },
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
