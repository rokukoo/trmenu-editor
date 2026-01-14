import { LucideIcon } from "lucide-react";
import { MenuItem } from "./index";

// 插件配置
export interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  component: React.ComponentType<PluginComponentProps>;
  order: number;
}

// 插件组件属性
export interface PluginComponentProps {
  menuId: string;
  onItemCreate?: (item: Partial<MenuItem>) => void;
  onItemImport?: (item: MenuItem) => void;
  selectedItem?: MenuItem | null;
}

// 资产库中的物品模板
export interface ItemAsset {
  id: string;
  name: string;
  description?: string;
  template: Partial<MenuItem>;
  category: string;
  tags: string[];
  createdAt: string;
  previewIcon?: string;
}

// 历史记录项
export interface HistoryItem {
  id: string;
  menuId: string;
  action: "create" | "update" | "delete" | "move";
  itemId: string;
  timestamp: string;
  data: Partial<MenuItem>;
}
