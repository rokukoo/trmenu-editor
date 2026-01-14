"use client";

import { useState } from "react";
import type { MenuItem, MenuConfig } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface MenuCanvasProps {
  menu: MenuConfig;
  selectedItemId: string | null;
  onSelectItem: (itemId: string | null) => void;
  onSlotClick: (slot: number) => void;
  onItemMove: (itemId: string, newSlot: number) => void;
}

export function MenuCanvas({
  menu,
  selectedItemId,
  onSelectItem,
  onSlotClick,
  onItemMove,
}: MenuCanvasProps) {
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  // 计算行数和列数
  const rows = menu.size / 9;
  const cols = 9;

  // 获取指定槽位的物品
  const getItemAtSlot = (slot: number): MenuItem | undefined => {
    return menu.items.find((item) => item.slot === slot);
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverSlot(null);
  };

  // 处理拖拽悬停
  const handleDragOver = (e: React.DragEvent, slot: number) => {
    e.preventDefault();
    setDragOverSlot(slot);
  };

  // 处理放置
  const handleDrop = (e: React.DragEvent, slot: number) => {
    e.preventDefault();
    if (draggedItem) {
      onItemMove(draggedItem.id, slot);
    }
    setDraggedItem(null);
    setDragOverSlot(null);
  };

  // 渲染槽位
  const renderSlot = (slot: number) => {
    const item = getItemAtSlot(slot);
    const isDragOver = dragOverSlot === slot;
    const isSelected = item && item.id === selectedItemId;
    const isDragging = draggedItem?.id === item?.id;

    return (
      <div
        key={slot}
        className={cn(
          "relative aspect-square border rounded transition-all",
          "hover:border-primary/60 cursor-pointer group",
          isSelected && "border-primary ring-1 ring-primary/30 shadow-sm",
          isDragOver && "border-primary bg-primary/10 scale-[1.02]",
          !item && "border-border/50 bg-muted/10 hover:bg-muted/30",
          item && "border-border/70 bg-card shadow-sm hover:shadow"
        )}
        onClick={() => {
          if (item) {
            onSelectItem(item.id);
          } else {
            onSlotClick(slot);
          }
        }}
        onDragOver={(e) => handleDragOver(e, slot)}
        onDrop={(e) => handleDrop(e, slot)}
      >
        {item ? (
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            className={cn(
              "w-full h-full flex flex-col items-center justify-center p-1",
              isDragging && "opacity-50 cursor-grabbing",
              "cursor-grab active:cursor-grabbing"
            )}
          >
            {/* 物品图标 - 这里暂时用文字表示材质 */}
            <div className="text-base leading-none">
              {getItemIcon(item.material)}
            </div>
            {/* 物品数量 */}
            {item.amount && item.amount > 1 && (
              <span className="absolute bottom-0.5 right-0.5 text-[9px] font-semibold text-foreground bg-background/70 rounded px-0.5 leading-none shadow-sm">
                {item.amount}
              </span>
            )}
            {/* 自定义模型数据标识 */}
            {item.customModelData && (
              <span className="absolute top-0.5 right-0.5 text-[8px] text-muted-foreground bg-background/70 rounded px-0.5 leading-none font-mono shadow-sm">
                #{item.customModelData}
              </span>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/15 group-hover:text-muted-foreground/30 transition-colors">
            <Plus className="h-3 w-3" />
          </div>
        )}

        {/* 槽位号 */}
        <span className="absolute top-0.5 left-0.5 text-[8px] text-muted-foreground/30 font-mono leading-none">
          {slot}
        </span>
      </div>
    );
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20 relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(var(--border) / 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--border) / 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    >
      {/* 编辑器网格背景装饰 */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/30 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* 菜单标题 */}
        <div className="mb-3 text-center">
          <h2 className="text-lg font-bold mb-0.5">{menu.title}</h2>
          <p className="text-[10px] text-muted-foreground">
            {menu.size} 格 • {menu.type} • {menu.items.length} 个物品
          </p>
        </div>

        {/* 菜单网格 */}
        <div
          className="bg-background/90 backdrop-blur-sm rounded-lg p-2.5 border border-border/50"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: "4px",
          }}
        >
          {Array.from({ length: menu.size }, (_, i) => renderSlot(i))}
        </div>
      </div>
    </div>
  );
}

// 根据材质名称返回对应的图标（emoji）
function getItemIcon(material: string): string {
  const iconMap: Record<string, string> = {
    // 常用物品
    DIAMOND: "💎",
    EMERALD: "💚",
    GOLD_INGOT: "🪙",
    IRON_INGOT: "⚙️",
    COAL: "🪨",
    STONE: "🪨",
    DIRT: "🟫",
    GRASS_BLOCK: "🟩",
    OAK_LOG: "🪵",
    STICK: "🥢",
    // 工具
    DIAMOND_SWORD: "⚔️",
    DIAMOND_PICKAXE: "⛏️",
    DIAMOND_AXE: "🪓",
    BOW: "🏹",
    FISHING_ROD: "🎣",
    // 食物
    APPLE: "🍎",
    BREAD: "🍞",
    COOKED_BEEF: "🥩",
    GOLDEN_APPLE: "🍏",
    // 方块
    CHEST: "📦",
    CRAFTING_TABLE: "🔨",
    FURNACE: "🔥",
    ENCHANTING_TABLE: "📕",
    ANVIL: "🔧",
    // 装饰
    GLASS: "🪟",
    WOOL: "🧶",
    CONCRETE: "🧱",
    TERRACOTTA: "🏺",
    // 红石
    REDSTONE: "🔴",
    REPEATER: "🔁",
    COMPARATOR: "⚡",
    LEVER: "🎚️",
    BUTTON: "🔘",
    // 其他
    BARRIER: "🚫",
    COMMAND_BLOCK: "📜",
    PLAYER_HEAD: "👤",
    BOOK: "📖",
    MAP: "🗺️",
  };

  return iconMap[material] || "📦";
}
