import React from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster"
import * as ReactDOM from "react-dom/client"
import { Crosshair, Maximize2, Minimize2, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { ASSET_KPIS } from "@/App"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const TILE_STYLES = [
  { key: "light_nolabels", label: "Minimal" },
  { key: "light_all",      label: "Light" },
  { key: "dark_all",       label: "Dark" },
  { key: "voyager",        label: "Street" },
  { key: "dark_nolabels",  label: "High contrast" },
  { key: "voyager_labels_under", label: "Outdoors" },
] as const

type TileStyleKey = typeof TILE_STYLES[number]["key"]

function tileUrl(key: TileStyleKey) {
  const rastertiles = ["voyager", "voyager_labels_under"]
  const base = rastertiles.includes(key) ? "rastertiles/" : ""
  return `https://{s}.basemaps.cartocdn.com/${base}${key}/{z}/{x}/{y}{r}.png`
}

function occupancyColor(occ: number) {
  if (occ >= 90) return "var(--color-success)"
  if (occ >= 75) return "var(--color-warning)"
  return "var(--color-destructive)"
}

function occupancyClass(occ: number) {
  if (occ >= 90) return "text-success"
  if (occ >= 75) return "text-warning"
  return "text-destructive"
}

function makePin(occ: number, isDimmed = false) {
  const color = isDimmed ? "oklch(0.75 0 0)" : occupancyColor(occ)
  const opacity = isDimmed ? 0.35 : 1
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36" opacity="${opacity}">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
  </svg>`
  return L.divIcon({ html: svg, className: "", iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -42] })
}

function makeClusterIcon(avgOcc: number, count: number) {
  const color = occupancyColor(avgOcc)
  const size = count >= 5 ? 52 : count >= 3 ? 46 : 40
  const r = size / 2
  const inner = r - 5
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${r}" cy="${r}" r="${r}" fill="${color}" opacity="0.25"/>
    <circle cx="${r}" cy="${r}" r="${inner}" fill="${color}" stroke="white" stroke-width="2"/>
    <text x="${r}" y="${r + 1}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="${count >= 10 ? 11 : 13}" font-weight="700" font-family="system-ui,sans-serif">${count}</text>
  </svg>`
  return L.divIcon({ html: svg, className: "", iconSize: [size, size], iconAnchor: [r, r] })
}

interface Asset {
  id: string
  name: string
  address: string
  lat: number
  lng: number
}

function PopupContent({ asset, onAssetClick }: { asset: Asset; onAssetClick: (id: string) => void }) {
  const kpi = ASSET_KPIS[asset.id]
  const occ = kpi?.occupancy ?? 80
  return (
    <div className="w-52">
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm font-semibold text-foreground leading-snug">{asset.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{asset.address}</p>
      </div>
      {kpi && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-px bg-border border-b border-border">
            <KpiCell label="Occupancy">
              <span className={cn("text-sm font-bold tabular-nums", occupancyClass(occ))}>{occ}%</span>
            </KpiCell>
            <KpiCell label="Avg NER">
              <span className="text-sm font-bold tabular-nums text-foreground">{kpi.avgNer}</span>
            </KpiCell>
            <KpiCell label="WALT">
              <span className="text-sm font-bold tabular-nums text-foreground">{kpi.walt}</span>
            </KpiCell>
            <KpiCell label="Active deals">
              <span className="text-sm font-bold tabular-nums text-foreground">{kpi.activeDeals}</span>
            </KpiCell>
          </div>
        </>
      )}
      <div className="px-3 py-3">
        <Button size="sm" className="w-full h-8 text-xs" onClick={() => onAssetClick(asset.id)}>
          View asset
        </Button>
      </div>
    </div>
  )
}

function KpiCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-card px-3.5 py-2.5 flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

function FitBounds({ assets, height }: { assets: Array<{ lat: number; lng: number }>; height: number }) {
  const map = useMap()
  React.useEffect(() => {
    if (assets.length === 0) return
    requestAnimationFrame(() => {
      map.invalidateSize()
      const bounds = L.latLngBounds(assets.map(a => [a.lat, a.lng]))
      map.fitBounds(bounds, { padding: [48, 48] })
    })
  }, [assets, map, height])
  return null
}

function ClusterLayer({ assets, onAssetClick, dimmed }: { assets: Asset[]; onAssetClick: (id: string) => void; dimmed: Set<string> }) {
  const map = useMap()
  const rootsRef = React.useRef<ReactDOM.Root[]>([])

  React.useEffect(() => {
    rootsRef.current.forEach(r => setTimeout(() => { try { r.unmount() } catch {} }, 0))
    rootsRef.current = []

    const cluster = (L as any).markerClusterGroup({
      maxClusterRadius: 80,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (c: any) => {
        const markers = c.getAllChildMarkers()
        const occs = markers.map((m: any) => ASSET_KPIS[m._assetId]?.occupancy ?? 80)
        const avg = occs.reduce((a: number, b: number) => a + b, 0) / occs.length
        return makeClusterIcon(avg, markers.length)
      },
    })

    assets.forEach(asset => {
      const kpi = ASSET_KPIS[asset.id]
      const occ = kpi?.occupancy ?? 80
      const marker = L.marker([asset.lat, asset.lng], { icon: makePin(occ, dimmed.has(asset.id)) })
      ;(marker as any)._assetId = asset.id

      marker.bindPopup(() => {
        const container = document.createElement("div")
        const root = ReactDOM.createRoot(container)
        rootsRef.current.push(root)
        root.render(<PopupContent asset={asset} onAssetClick={onAssetClick} />)
        return container
      }, {
        closeButton: false,
        className: "portfolio-map-popup",
        minWidth: 208,
        autoPan: true,
        autoPanPaddingTopLeft: [20, 320],
        autoPanPaddingBottomRight: [20, 20],
      })

      cluster.addLayer(marker)
    })

    map.addLayer(cluster)
    return () => {
      map.removeLayer(cluster)
      rootsRef.current.forEach(r => setTimeout(() => { try { r.unmount() } catch {} }, 0))
      rootsRef.current = []
    }
  }, [assets, map, onAssetClick, dimmed])

  return null
}



function MapController({ mapRef, boundsRef, assets }: {
  mapRef: React.MutableRefObject<L.Map | null>
  boundsRef: React.MutableRefObject<L.LatLngBounds | null>
  assets: Asset[]
}) {
  const map = useMap()
  mapRef.current = map
  if (assets.length > 0) boundsRef.current = L.latLngBounds(assets.map(a => [a.lat, a.lng]))
  return null
}

const BTN = "h-8 w-8 shadow-sm bg-card hover:bg-muted active:bg-muted"

function MapControls({
  onZoomIn, onZoomOut, onFitBounds, isFullscreen, onToggleFullscreen, tileStyle, onTileStyleChange,
}: {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitBounds: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
  tileStyle: TileStyleKey
  onTileStyleChange: (key: TileStyleKey) => void
}) {
  return (
    <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-0.5">
      <Button variant="outline" size="icon" className={BTN} onClick={onZoomIn}>
        <span className="text-base font-medium leading-none">+</span>
      </Button>
      <Button variant="outline" size="icon" className={BTN} onClick={onZoomOut}>
        <span className="text-base font-medium leading-none">−</span>
      </Button>
      <Button variant="outline" size="icon" className={cn(BTN, "mt-1")} onClick={onFitBounds}>
        <Crosshair className="h-3.5 w-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" className={BTN} />}>
          <Layers className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-44">
          {TILE_STYLES.map(s => (
            <DropdownMenuItem
              key={s.key}
              onClick={() => onTileStyleChange(s.key)}
              className={cn(tileStyle === s.key && "font-medium text-primary")}
            >
              {s.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" size="icon" className={BTN} onClick={onToggleFullscreen}>
        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
      </Button>
    </div>
  )
}

function Legend() {
  return (
    <div className="absolute top-3 right-3 z-[1000] bg-card border border-border rounded-md shadow-sm px-3 py-2 flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Occupancy</span>
      {[
        { label: "90%+", cls: "bg-success" },
        { label: "75–90%", cls: "bg-warning" },
        { label: "Below 75%", cls: "bg-destructive" },
      ].map(({ label, cls }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", cls)} />
          <span className="text-xs text-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}

function applyMapFilter(assets: Asset[], filter: string | null): { filtered: Asset[]; dimmed: Set<string> } {
  if (!filter || filter === "reset") return { filtered: assets, dimmed: new Set() }
  const dimmed = new Set<string>()
  assets.forEach(a => {
    const kpi = ASSET_KPIS[a.id]
    let hide = false
    if (filter === "occ-low")  hide = (kpi?.occupancy ?? 100) >= 80
    if (filter === "expiring") hide = (kpi?.expiring12mo ?? 0) === 0
    if (filter === "at-risk")  hide = (kpi?.activeDeals ?? 0) === 0
    if (filter === "walt-low") hide = (parseFloat(kpi?.walt ?? "99") ?? 99) >= 2
    if (hide) dimmed.add(a.id)
  })
  return { filtered: assets, dimmed }
}

interface PortfolioMapProps {
  assets: Asset[]
  onAssetClick: (id: string) => void
  className?: string
  activeFilters?: Record<string, string[]>
  mapFilter?: string | null
}

export function PortfolioMap({ assets, onAssetClick, className, activeFilters, mapFilter }: PortfolioMapProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<L.Map | null>(null)
  const boundsRef = React.useRef<L.LatLngBounds | null>(null)
  const [height, setHeight] = React.useState(400)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [tileStyle, setTileStyle] = React.useState<TileStyleKey>("light_nolabels")
  const { filtered: filteredAssets, dimmed } = React.useMemo(() => applyMapFilter(assets, mapFilter ?? null), [assets, mapFilter])

  React.useLayoutEffect(() => {
    function update() {
      if (isFullscreen || !wrapperRef.current) return
      const top = wrapperRef.current.getBoundingClientRect().top
      setHeight(Math.max(300, window.innerHeight - top - 16))
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [isFullscreen])

  // Invalidate map size when fullscreen changes
  React.useEffect(() => {
    setTimeout(() => mapRef.current?.invalidateSize(), 50)
  }, [isFullscreen])

  function handleFitBounds() {
    if (!mapRef.current || !boundsRef.current) return
    mapRef.current.fitBounds(boundsRef.current, { padding: [48, 48] })
  }

  const mapHeight = isFullscreen ? "100%" : height

  return (
    <>
      <style>{`
.portfolio-map-popup .leaflet-popup-content-wrapper {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 8px 32px -4px oklch(0 0 0 / 0.14), 0 2px 8px -2px oklch(0 0 0 / 0.08);
          padding: 0;
          overflow: hidden;
        }
        .portfolio-map-popup .leaflet-popup-content { margin: 0; width: auto !important; }
        .portfolio-map-popup .leaflet-popup-tip-container { display: none; }
        .leaflet-cluster-anim .leaflet-marker-icon, .leaflet-cluster-anim .leaflet-marker-shadow {
          transition: transform 0.3s ease-out, opacity 0.3s ease-in;
        }
      `}</style>

      <div
        ref={wrapperRef}
        className={cn(
          "portfolio-map-wrapper rounded-xl overflow-hidden border border-border relative",
          isFullscreen && "fixed inset-0 z-[2000] rounded-none border-0",
          className
        )}
        style={{ height: mapHeight, zIndex: isFullscreen ? 2000 : 0 }}
      >
        <MapContainer center={[39.5, -98.35]} zoom={4} style={{ height: "100%", width: "100%" }} scrollWheelZoom zoomControl={false}>
          <TileLayer
            key={tileStyle}
            url={tileUrl(tileStyle)}
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={20}
          />
          <MapController mapRef={mapRef} boundsRef={boundsRef} assets={assets} />
          <FitBounds assets={assets} height={height} />
          <ClusterLayer assets={filteredAssets} onAssetClick={onAssetClick} dimmed={dimmed} />
        </MapContainer>

        <MapControls
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          onFitBounds={handleFitBounds}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(v => !v)}
          tileStyle={tileStyle}
          onTileStyleChange={setTileStyle}
        />

        <Legend />

        {/* Asset count badge */}
        <div className="absolute bottom-3 left-3 z-[1000] h-8 flex items-center bg-card border border-border rounded-md shadow-sm px-3">
          <span className="text-sm font-medium text-foreground tabular-nums whitespace-nowrap">
            {assets.length} {assets.length === 1 ? "asset" : "assets"}
            {activeFilters && Object.keys(activeFilters).length > 0 && " (filtered)"}
          </span>
        </div>

      </div>
    </>
  )
}
