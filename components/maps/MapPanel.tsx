'use client';

import { useEffect, useRef, useState } from 'react';

export type MapLayer = {
  id: string;
  label: string;
  geojson?: GeoJSON.FeatureCollection | GeoJSON.Feature | string;
  color?: string;
  type?: 'fill' | 'line' | 'circle';
  defaultVisible?: boolean;
};

export type MapPanelProps = {
  center: [number, number];
  zoom?: number;
  layers?: MapLayer[];
  height?: number;
  fallbackNote?: string;
};

export function MapPanel({
  center,
  zoom = 11,
  layers = [],
  height = 360,
  fallbackNote
}: MapPanelProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(layers.map((l) => [l.id, l.defaultVisible !== false]))
  );

  useEffect(() => {
    let cancelled = false;
    let map: import('mapbox-gl').Map | null = null;

    if (typeof window === 'undefined') return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setError('NEXT_PUBLIC_MAPBOX_TOKEN missing — placeholder shown.');
      return;
    }

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        try {
          const mapboxgl = (await import('mapbox-gl')).default;
          if (cancelled || !ref.current) return;
          mapboxgl.accessToken = token;
          map = new mapboxgl.Map({
            container: ref.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [center[1], center[0]],
            zoom,
            attributionControl: true
          });
          map.on('load', () => {
            if (!map) return;
            for (const layer of layers) {
              if (!layer.geojson) continue;
              try {
                const data =
                  typeof layer.geojson === 'string' ? JSON.parse(layer.geojson) : layer.geojson;
                map.addSource(layer.id, { type: 'geojson', data });
                if (layer.type === 'fill' || !layer.type) {
                  map.addLayer({
                    id: `${layer.id}-fill`,
                    type: 'fill',
                    source: layer.id,
                    paint: {
                      'fill-color': layer.color || '#1f4e79',
                      'fill-opacity': visibility[layer.id] === false ? 0 : 0.18
                    }
                  });
                  map.addLayer({
                    id: `${layer.id}-outline`,
                    type: 'line',
                    source: layer.id,
                    paint: {
                      'line-color': layer.color || '#1f4e79',
                      'line-width': 1
                    }
                  });
                } else if (layer.type === 'line') {
                  map.addLayer({
                    id: `${layer.id}-line`,
                    type: 'line',
                    source: layer.id,
                    paint: {
                      'line-color': layer.color || '#1f4e79',
                      'line-width': 1.5
                    }
                  });
                } else if (layer.type === 'circle') {
                  map.addLayer({
                    id: `${layer.id}-circle`,
                    type: 'circle',
                    source: layer.id,
                    paint: {
                      'circle-color': layer.color || '#1f4e79',
                      'circle-radius': 4
                    }
                  });
                }
              } catch {
                // skip malformed layer
              }
            }
            setMounted(true);
          });
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Map failed to load.');
        }
      },
      { rootMargin: '200px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (map) map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full panel" style={{ height }}>
      <div ref={ref} className="absolute inset-0 bg-surface" />
      {!mounted && !error ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-ink-tertiary pointer-events-none">
          {fallbackNote ?? '·'}
        </div>
      ) : null}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-ink-tertiary mono p-4 text-center">
          {error}
        </div>
      ) : null}
      {layers.length > 0 ? (
        <div className="absolute top-3 right-3 flex flex-col gap-1 panel bg-white/95 px-3 py-2 text-xs shadow-none z-10">
          <span className="label-tiny">Layers</span>
          {layers.map((l) => (
            <label key={l.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visibility[l.id] !== false}
                onChange={(e) =>
                  setVisibility((v) => ({ ...v, [l.id]: e.currentTarget.checked }))
                }
                className="accent-ink-primary"
              />
              <span>{l.label}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}
