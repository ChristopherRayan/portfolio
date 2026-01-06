import * as Icons from 'lucide-react';

// Map of available icons for services
export const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Monitor: Icons.Monitor,
  Server: Icons.Server,
  Smartphone: Icons.Smartphone,
  Code: Icons.Code,
  Database: Icons.Database,
  Cloud: Icons.Cloud,
  Lock: Icons.Lock,
  Zap: Icons.Zap,
  Globe: Icons.Globe,
  Palette: Icons.Palette,
  Layout: Icons.Layout,
  Terminal: Icons.Terminal,
  Cpu: Icons.Cpu,
  Shield: Icons.Shield,
  Rocket: Icons.Rocket,
  Users: Icons.Users,
  Settings: Icons.Settings,
  Package: Icons.Package,
  Layers: Icons.Layers,
  Box: Icons.Box,
};

// Get list of available icon names
export const availableIcons = Object.keys(iconMap);

// Get icon component by name
export function getIconComponent(iconName: string): React.ComponentType<{ className?: string; size?: number }> {
  return (iconMap[iconName] || Icons.HelpCircle) as React.ComponentType<{ className?: string; size?: number }>;
}
