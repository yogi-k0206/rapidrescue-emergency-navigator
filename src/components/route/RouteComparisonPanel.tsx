import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, MapPin, AlertTriangle, Zap, Route } from 'lucide-react';

interface RouteOption {
  id: string;
  name: string;
  distance: number;
  eta: number;
  trafficLevel: 'clear' | 'moderate' | 'heavy';
  isRecommended?: boolean;
}

interface RouteComparisonPanelProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  className?: string;
}

const RouteComparisonPanel = ({ 
  routes, 
  selectedRouteId, 
  onSelectRoute,
  className = ''
}: RouteComparisonPanelProps) => {
  const getTrafficColor = (level: RouteOption['trafficLevel']) => {
    switch (level) {
      case 'clear': return 'text-success bg-success/10';
      case 'moderate': return 'text-warning bg-warning/10';
      case 'heavy': return 'text-destructive bg-destructive/10';
    }
  };

  const getTrafficLabel = (level: RouteOption['trafficLevel']) => {
    switch (level) {
      case 'clear': return 'Clear Traffic';
      case 'moderate': return 'Moderate Traffic';
      case 'heavy': return 'Heavy Traffic';
    }
  };

  const getTrafficIcon = (level: RouteOption['trafficLevel']) => {
    switch (level) {
      case 'clear': return <CheckCircle className="w-3 h-3" />;
      case 'moderate': return <AlertTriangle className="w-3 h-3" />;
      case 'heavy': return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Route className="w-4 h-4" />
          Route Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {routes.map((route) => (
          <div
            key={route.id}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedRouteId === route.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onSelectRoute(route.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{route.name}</span>
                  {route.isRecommended && (
                    <Badge className="bg-success text-success-foreground text-xs px-1.5 py-0">
                      <Zap className="w-2.5 h-2.5 mr-0.5" />
                      Best
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {route.distance.toFixed(1)} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {route.eta} min
                  </span>
                </div>
              </div>
              <Badge className={`text-xs ${getTrafficColor(route.trafficLevel)}`}>
                {getTrafficIcon(route.trafficLevel)}
                <span className="ml-1">{getTrafficLabel(route.trafficLevel)}</span>
              </Badge>
            </div>
          </div>
        ))}

        <div className="pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="font-medium">Traffic Legend:</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-success rounded" />
              <span>Clear</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-warning rounded" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-destructive rounded" />
              <span>Heavy</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteComparisonPanel;
