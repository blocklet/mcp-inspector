import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface BlockletInfo {
  did: string;
  appId: string;
  serverDid: string;
  appName: string;
  appDescription: string;
  appLogo: string;
  appUrl: string;
}

interface ServersProps {
  setSseUrl: (url: string) => void;
}

declare global {
  interface Window {
    blocklet?: BlockletInfo;
  }
}

export function Servers({ setSseUrl }: ServersProps) {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const blocklet = window.blocklet;

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch("/.well-known/service/mcp/servers");
        if (!response.ok) {
          throw new Error("Failed to fetch MCP servers");
        }
        const data = await response.json();
        // Filter out the default server
        const filteredServers = data.filter(
          (server: McpServer) => server.did !== blocklet?.appId,
        );
        setServers(filteredServers);
        console.log(data, filteredServers, blocklet);
        // Set the default server from window.blocklet
        if (blocklet) {
          setSelectedServer(blocklet.appId);
        }
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
      {blocklet && (
        <Card
          className={cn(
            "cursor-pointer hover:border-primary transition-colors relative",
            selectedServer === blocklet.appId && "border-primary",
          )}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <img
              src={blocklet.appLogo}
              alt={blocklet.appName}
              className="w-12 h-12 rounded-lg"
            />
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {blocklet.appName}
              </CardTitle>
              <CardDescription>{blocklet.appDescription}</CardDescription>
            </div>
          </CardHeader>
          {selectedServer === blocklet.appId && (
            <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
              <Check className="w-4 h-4" />
            </div>
          )}
        </Card>
      )}

      {/* Other Servers */}
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
                {selectedServer === server.did && (
                  <Badge variant="outline" className="ml-2">
                    Selected
                  </Badge>
                )}
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
