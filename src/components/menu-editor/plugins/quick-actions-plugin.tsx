"use client";

import { PluginComponentProps } from "@/types/plugin";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Wand2,
  Grid3x3,
  Paintbrush,
  Copy,
  Sparkles,
  Layout,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: typeof Wand2;
  action: () => void;
  category: string;
}

export function QuickActionsPlugin({ onItemCreate }: PluginComponentProps) {
  // 快速填充边框
  const fillBorder = () => {
    if (
      !confirm("确定要填充边框吗？\n这将在菜单的上下边缘添加装饰性玻璃板。")
    ) {
      return;
    }

    // 顶部边框 (0-8)
    for (let i = 0; i < 9; i++) {
      onItemCreate?.({
        slot: i,
        material: "GRAY_STAINED_GLASS_PANE",
        displayName: " ",
      });
    }

    // 底部边框 (45-53, 假设是54格菜单)
    for (let i = 45; i < 54; i++) {
      onItemCreate?.({
        slot: i,
        material: "GRAY_STAINED_GLASS_PANE",
        displayName: " ",
      });
    }

    alert("已填充边框！");
  };

  // 填充整个菜单
  const fillAll = () => {
    const material = prompt("请输入要填充的材质：", "WHITE_STAINED_GLASS_PANE");
    if (!material) return;

    if (!confirm(`确定要用 ${material} 填充所有空槽位吗？`)) return;

    for (let i = 0; i < 54; i++) {
      onItemCreate?.({
        slot: i,
        material: material,
        displayName: " ",
      });
    }

    alert("已填充所有槽位！");
  };

  // 创建棋盘图案
  const createCheckerboard = () => {
    if (!confirm("确定要创建棋盘图案吗？")) return;

    for (let i = 0; i < 54; i++) {
      const row = Math.floor(i / 9);
      const col = i % 9;
      const isEven = (row + col) % 2 === 0;

      onItemCreate?.({
        slot: i,
        material: isEven
          ? "WHITE_STAINED_GLASS_PANE"
          : "BLACK_STAINED_GLASS_PANE",
        displayName: " ",
      });
    }

    alert("已创建棋盘图案！");
  };

  // 添加四角按钮
  const addCornerButtons = () => {
    if (!confirm("确定要在四角添加功能按钮吗？")) return;

    // 左上角 - 返回
    onItemCreate?.({
      slot: 0,
      material: "ARROW",
      displayName: "§e§l返回",
      lore: ["§7点击返回"],
    });

    // 右上角 - 信息
    onItemCreate?.({
      slot: 8,
      material: "BOOK",
      displayName: "§b§l信息",
      lore: ["§7查看详细信息"],
    });

    // 左下角 - 上一页
    onItemCreate?.({
      slot: 45,
      material: "LIME_DYE",
      displayName: "§a§l上一页",
      lore: ["§7点击查看上一页"],
    });

    // 右下角 - 下一页
    onItemCreate?.({
      slot: 53,
      material: "LIME_DYE",
      displayName: "§a§l下一页",
      lore: ["§7点击查看下一页"],
    });

    // 中下 - 关闭
    onItemCreate?.({
      slot: 49,
      material: "BARRIER",
      displayName: "§c§l关闭",
      lore: ["§7点击关闭菜单"],
      actions: [
        { type: "CLOSE" as const, clickType: "ALL" as const, value: "" },
      ],
    });

    alert("已添加四角按钮！");
  };

  // 创建颜色渐变
  const createGradient = () => {
    if (!confirm("确定要创建彩虹渐变吗？")) return;

    const colors = [
      "RED",
      "ORANGE",
      "YELLOW",
      "LIME",
      "LIGHT_BLUE",
      "BLUE",
      "PURPLE",
      "MAGENTA",
      "PINK",
    ];

    for (let i = 0; i < 9; i++) {
      const color = colors[i % colors.length];
      onItemCreate?.({
        slot: i,
        material: `${color}_STAINED_GLASS_PANE`,
        displayName: " ",
      });
    }

    alert("已创建彩虹渐变！");
  };

  const actions: QuickAction[] = [
    {
      id: "fill-border",
      name: "填充边框",
      description: "在顶部和底部添加装饰性边框",
      icon: Grid3x3,
      action: fillBorder,
      category: "布局",
    },
    {
      id: "checkerboard",
      name: "棋盘图案",
      description: "创建黑白相间的棋盘效果",
      icon: Layout,
      action: createCheckerboard,
      category: "布局",
    },
    {
      id: "fill-all",
      name: "填充全部",
      description: "用指定材质填充所有槽位",
      icon: Paintbrush,
      action: fillAll,
      category: "布局",
    },
    {
      id: "corner-buttons",
      name: "四角按钮",
      description: "在四个角添加常用功能按钮",
      icon: Copy,
      action: addCornerButtons,
      category: "功能",
    },
    {
      id: "gradient",
      name: "彩虹渐变",
      description: "在顶部创建彩虹渐变效果",
      icon: Sparkles,
      action: createGradient,
      category: "装饰",
    },
  ];

  const categories = [...new Set(actions.map((a) => a.category))];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="h-4 w-4 text-purple-500" />
            <h3 className="font-semibold text-sm">快捷操作</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            快速生成常用的菜单布局和装饰
          </p>
        </div>

        <Separator />

        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {category}
            </h4>
            <div className="space-y-2">
              {actions
                .filter((a) => a.category === category)
                .map((action) => (
                  <div
                    key={action.id}
                    className="group p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <action.icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{action.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {action.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-7 text-xs mt-2"
                          onClick={action.action}
                        >
                          <Wand2 className="h-3 w-3 mr-1" />
                          执行
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* 提示信息 */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 提示：快捷操作会直接修改菜单，建议在使用前先保存当前进度。
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}
