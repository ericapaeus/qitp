'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface OrganizationNode {
  id: string;
  code: string;
  name: string;
  level: 'PROVINCE' | 'CITY';
  status: 'ACTIVE' | 'SUSPENDED';
  children?: OrganizationNode[];
}

interface QuarantineOrganizationHierarchyProps {
  data: OrganizationNode[];
  onSelect?: (node: OrganizationNode) => void;
  className?: string;
}

function OrganizationTreeNode({
  node,
  level = 0,
  onSelect,
}: {
  node: OrganizationNode;
  level?: number;
  onSelect?: (node: OrganizationNode) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center py-2 px-2 rounded-lg hover:bg-muted/50 cursor-pointer",
          level === 0 && "font-medium"
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={() => onSelect?.(node)}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <div className="w-4" />
        )}
        <Building2 className="h-4 w-4 mx-2 text-muted-foreground" />
        <div className="flex-1 flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate">{node.name}</span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <div>机构编号：{node.code}</div>
                <div>机构级别：{node.level === 'PROVINCE' ? '省级' : '市级'}</div>
              </div>
            </TooltipContent>
          </Tooltip>
          <Badge
            variant={node.status === 'ACTIVE' ? 'default' : 'secondary'}
            className="ml-2"
          >
            {node.status === 'ACTIVE' ? '正常' : '已暂停'}
          </Badge>
        </div>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children?.map((child) => (
            <OrganizationTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function QuarantineOrganizationHierarchy({
  data,
  onSelect,
  className,
}: QuarantineOrganizationHierarchyProps) {
  return (
    <div className={cn("border rounded-lg", className)}>
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-semibold">机构层级关系</h3>
      </div>
      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-1">
          {data.map((node) => (
            <OrganizationTreeNode
              key={node.id}
              node={node}
              onSelect={onSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 