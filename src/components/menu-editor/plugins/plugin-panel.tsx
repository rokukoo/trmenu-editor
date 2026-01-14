"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plugin, PluginComponentProps } from "@/types/plugin";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PluginPanelProps {
  plugins: Plugin[];
  pluginProps: PluginComponentProps;
}

export function PluginPanel({ plugins, pluginProps }: PluginPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePluginId, setActivePluginId] = useState<string | null>(
    plugins[0]?.id || null
  );

  const activePlugin = plugins.find((p) => p.id === activePluginId);

  return (
    <div className="flex h-full">
      {/* 插件面板内容 */}
      <div
        className={cn(
          "transition-all duration-300 border-l overflow-hidden flex-shrink-0",
          isExpanded ? "w-80" : "w-0"
        )}
      >
        {isExpanded && activePlugin && (
          <div className="flex flex-col h-full w-80">
            {/* 插件头部 */}
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <activePlugin.icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm truncate">
                    {activePlugin.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {activePlugin.description}
                  </p>
                </div>
              </div>
            </div>

            {/* 插件切换标签 */}
            <div className="flex gap-1 p-2 border-b overflow-x-auto flex-shrink-0">
              {plugins.map((plugin) => (
                <Button
                  key={plugin.id}
                  variant={plugin.id === activePluginId ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 gap-2 flex-shrink-0"
                  onClick={() => setActivePluginId(plugin.id)}
                >
                  <plugin.icon className="h-3 w-3" />
                  <span className="text-xs">{plugin.name}</span>
                </Button>
              ))}
            </div>

            {/* 插件内容区 */}
            <div className="flex-1 overflow-hidden">
              <activePlugin.component {...pluginProps} />
            </div>
          </div>
        )}
      </div>

      {/* 切换按钮 */}
      <div className="flex flex-col border-l flex-shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-none"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <div className="relative">
                    {activePlugin && (
                      <>
                        <activePlugin.icon className="h-4 w-4" />
                        <ChevronLeft className="h-3 w-3 absolute -right-1 -bottom-1" />
                      </>
                    )}
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isExpanded ? "收起插件面板" : "展开插件面板"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator />

        {/* 快速切换插件按钮 */}
        {!isExpanded && (
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {plugins.map((plugin) => (
                <TooltipProvider key={plugin.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          plugin.id === activePluginId ? "secondary" : "ghost"
                        }
                        size="icon"
                        className="h-12 w-12 rounded-none"
                        onClick={() => {
                          setActivePluginId(plugin.id);
                          setIsExpanded(true);
                        }}
                      >
                        <plugin.icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{plugin.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
