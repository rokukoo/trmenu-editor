"use client";

import { useState } from "react";
import { PluginComponentProps } from "@/types/plugin";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Download,
  ChevronRight,
  Store,
  Home,
  Settings,
  User,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types";

interface ItemTemplate {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  items: Partial<MenuItem>[];
  category: string;
}

// 预设的物品模板
const TEMPLATES: ItemTemplate[] = [
  {
    id: "template-shop",
    name: "商店布局",
    description: "54格商店菜单布局，包含商品位和装饰",
    icon: Store,
    category: "商店",
    items: [
      // 顶部装饰
      ...Array.from({ length: 9 }, (_, i) => ({
        slot: i,
        material: "BLACK_STAINED_GLASS_PANE",
        displayName: " ",
      })),
      // 底部装饰
      ...Array.from({ length: 9 }, (_, i) => ({
        slot: 45 + i,
        material: "BLACK_STAINED_GLASS_PANE",
        displayName: " ",
      })),
      // 关闭按钮
      {
        slot: 49,
        material: "BARRIER",
        displayName: "§c§l关闭",
        lore: ["§7点击关闭菜单"],
        actions: [
          { type: "CLOSE" as const, clickType: "ALL" as const, value: "" },
        ],
      },
    ],
  },
  {
    id: "template-confirm",
    name: "确认界面",
    description: "27格确认/取消界面",
    icon: Award,
    category: "对话框",
    items: [
      // 确认按钮
      {
        slot: 11,
        material: "LIME_WOOL",
        displayName: "§a§l✔ 确认",
        lore: ["§7点击确认操作"],
      },
      // 取消按钮
      {
        slot: 15,
        material: "RED_WOOL",
        displayName: "§c§l✖ 取消",
        lore: ["§7点击取消操作"],
      },
      // 中间装饰
      {
        slot: 13,
        material: "PAPER",
        displayName: "§e§l确认操作？",
        lore: ["§7请选择确认或取消"],
      },
    ],
  },
  {
    id: "template-nav",
    name: "导航菜单",
    description: "主菜单导航布局",
    icon: Home,
    category: "导航",
    items: [
      {
        slot: 10,
        material: "DIAMOND_SWORD",
        displayName: "§b§l战斗",
        lore: ["§7查看战斗相关功能"],
      },
      {
        slot: 12,
        material: "CHEST",
        displayName: "§e§l仓库",
        lore: ["§7打开你的仓库"],
      },
      {
        slot: 14,
        material: "EMERALD",
        displayName: "§a§l商城",
        lore: ["§7访问游戏商城"],
      },
      {
        slot: 16,
        material: "BOOK",
        displayName: "§d§l任务",
        lore: ["§7查看可用任务"],
      },
    ],
  },
  {
    id: "template-pagination",
    name: "翻页模板",
    description: "带翻页功能的菜单布局",
    icon: FileText,
    category: "功能",
    items: [
      // 上一页
      {
        slot: 45,
        material: "ARROW",
        displayName: "§e§l← 上一页",
        lore: ["§7点击返回上一页"],
      },
      // 下一页
      {
        slot: 53,
        material: "ARROW",
        displayName: "§e§l下一页 →",
        lore: ["§7点击查看下一页"],
      },
      // 页码显示
      {
        slot: 49,
        material: "PAPER",
        displayName: "§a§l第 1 页",
        lore: ["§7共 1 页"],
      },
    ],
  },
  {
    id: "template-user-profile",
    name: "玩家信息",
    description: "玩家个人信息展示",
    icon: User,
    category: "信息",
    items: [
      {
        slot: 4,
        material: "PLAYER_HEAD",
        displayName: "§b§l玩家信息",
        lore: ["§7查看你的个人信息"],
      },
      {
        slot: 10,
        material: "EXPERIENCE_BOTTLE",
        displayName: "§a§l等级信息",
        lore: ["§7等级: §e1", "§7经验: §e0/100"],
      },
      {
        slot: 12,
        material: "GOLD_INGOT",
        displayName: "§e§l金币",
        lore: ["§7余额: §e$1000"],
      },
      {
        slot: 14,
        material: "DIAMOND",
        displayName: "§b§l钻石",
        lore: ["§7余额: §b0"],
      },
      {
        slot: 16,
        material: "CLOCK",
        displayName: "§6§l游戏时间",
        lore: ["§7在线时长: §e0小时"],
      },
    ],
  },
  {
    id: "template-settings",
    name: "设置菜单",
    description: "游戏设置选项",
    icon: Settings,
    category: "设置",
    items: [
      {
        slot: 10,
        material: "BELL",
        displayName: "§e§l通知设置",
        lore: ["§7管理通知偏好"],
      },
      {
        slot: 12,
        material: "NOTE_BLOCK",
        displayName: "§d§l音效设置",
        lore: ["§7调整音效音量"],
      },
      {
        slot: 14,
        material: "PAINTING",
        displayName: "§b§l界面设置",
        lore: ["§7自定义界面显示"],
      },
      {
        slot: 16,
        material: "COMMAND_BLOCK",
        displayName: "§c§l高级设置",
        lore: ["§7高级选项配置"],
      },
    ],
  },
];

export function TemplatesPlugin({ onItemCreate }: PluginComponentProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ItemTemplate | null>(
    null
  );

  const categories = [...new Set(TEMPLATES.map((t) => t.category))];

  const applyTemplate = (template: ItemTemplate) => {
    if (!onItemCreate) return;

    if (
      !confirm(
        `确定要应用"${template.name}"模板吗？\n这将创建 ${template.items.length} 个物品。`
      )
    ) {
      return;
    }

    // 批量创建物品
    template.items.forEach((item) => {
      onItemCreate(item);
    });

    alert(`已成功应用模板！创建了 ${template.items.length} 个物品。`);
  };

  return (
    <div className="flex h-full">
      {/* 分类列表 */}
      <div className="w-20 border-r shrink-0">
        <ScrollArea className="h-full">
          <div className="p-1.5 space-y-0.5">
            {categories.map((category) => {
              const categoryTemplates = TEMPLATES.filter(
                (t) => t.category === category
              );
              return (
                <Button
                  key={category}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto py-1.5 px-1.5"
                  onClick={() => setSelectedTemplate(categoryTemplates[0])}
                >
                  <div className="text-[10px] text-left leading-tight">
                    <div className="font-medium">{category}</div>
                    <div className="text-muted-foreground text-[9px]">
                      {categoryTemplates.length}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* 模板列表 */}
      <div className="flex-1">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1.5">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "group p-2 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer",
                  selectedTemplate?.id === template.id && "bg-accent"
                )}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded bg-linear-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
                    <template.icon className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs">{template.name}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                          {template.description}
                        </p>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        {template.items.length} 个物品
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-6 text-[10px] mt-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        applyTemplate(template);
                      }}
                    >
                      <Download className="h-2.5 w-2.5 mr-0.5" />
                      应用模板
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
