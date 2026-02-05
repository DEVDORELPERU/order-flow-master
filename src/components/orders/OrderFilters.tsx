import { OrderStatus, Channel } from "@/data/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { STATUS_LABELS, CHANNEL_LABELS } from "@/data/orders";

interface OrderFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (v: OrderStatus | "all") => void;
  channelFilter: Channel | "all";
  onChannelChange: (v: Channel | "all") => void;
}

export function OrderFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  channelFilter,
  onChannelChange,
}: OrderFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID, nombre o email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as OrderStatus | "all")}>
        <SelectTrigger className="w-44 bg-card">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={channelFilter} onValueChange={(v) => onChannelChange(v as Channel | "all")}>
        <SelectTrigger className="w-44 bg-card">
          <SelectValue placeholder="Canal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los canales</SelectItem>
          {Object.entries(CHANNEL_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
