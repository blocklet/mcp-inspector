import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface McpServer {
  did: string;
  name: string;
  description: string;
  url: string;
  protected: boolean;
  version: string;
  logo: string;
}

interface ServersProps {
  setSseUrl: (url: string) => void;
}

export function Servers({ setSseUrl }: ServersProps) {
  const blocklet: any = window.blocklet;
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<string>(
    blocklet?.appId || "",
  );

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch("/.well-known/service/mcp/servers");
        if (!response.ok) {
          throw new Error("Failed to fetch MCP servers");
        }
        const data = await response.json();
        setServers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load servers");
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [blocklet]);

  const handleServerSelect = (server: McpServer) => {
    setSelectedServer(server.did);
    setSseUrl(server.url);
  };

  if (loading) {
    return <div className="text-center p-4">Loading servers...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading servers: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">Available MCP Servers</p>
      {servers.map((server) => (
        <Card
          key={server.did}
          className={cn(
            "cursor-pointer hover:border-primary transition-colors relative",
            selectedServer === server.did && "border-primary",
          )}
          onClick={() => handleServerSelect(server)}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <img
              src={server.logo}
              alt={server.name}
              className="w-12 h-12 rounded-lg"
            />
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {server.name}
              </CardTitle>
              <CardDescription>{server.description}</CardDescription>
            </div>
          </CardHeader>
          {selectedServer === server.did && (
            <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
              <Check className="w-4 h-4" />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
