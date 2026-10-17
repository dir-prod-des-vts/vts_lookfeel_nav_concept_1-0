import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { toast, Toaster } from "sonner"
import {
  AlertCircle, Archive, ArrowRight, Bell, BookOpen, Check, ChevronDown,
  ChevronRight, CircleUser, Clock, Copy, Download, ExternalLink, File,
  FileText, Globe, Home, Image, Info, Inbox, Layers, Loader2, Mail,
  Menu, MessageSquare, MoreHorizontal, Paperclip, Plus, Search, Settings,
  Smile, Star, Trash2, Upload, User, X, ZoomIn,
} from "lucide-react"

// ── UI imports ────────────────────────────────────────────────────────────────
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Attachment, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Marker } from "@/components/ui/marker"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar"
import { Message, MessageAvatar, MessageContent, MessageGroup } from "@/components/ui/message"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { NativeSelect } from "@/components/ui/native-select"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// ── Layout helpers ────────────────────────────────────────────────────────────

function Section({ num, title }: { num: string; title: string }) {
  return (
    <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">
      {num} · {title}
    </p>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-border" />
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [date, setDate] = React.useState<Date>()
  const [progress, setProgress] = React.useState(40)
  const [sliderVal, setSliderVal] = React.useState([60])
  const [checked, setChecked] = React.useState(false)
  const [switchOn, setSwitchOn] = React.useState(false)
  const [radio, setRadio] = React.useState("option-1")
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(false)
  const [comboValue, setComboValue] = React.useState("")
  const [otpValue, setOtpValue] = React.useState("")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">

        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
              VTS design system
            </p>
            <h1 className="text-3xl font-semibold text-foreground">Components</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-prose">
              All 60 shadcn/ui components installed and styled with VTS tokens. Built on Base UI primitives.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
            {isDark ? "Light mode" : "Dark mode"}
          </Button>
        </div>

        <div className="flex flex-col gap-10">

          {/* ── 01 Accordion ─────────────────────────────────────────────── */}
          <section>
            <Section num="01" title="Accordion" />
            <div className="flex flex-col gap-5">
              <Row label="default">
                <Accordion type="single" collapsible className="w-80">
                  <AccordionItem value="a">
                    <AccordionTrigger>What is VTS?</AccordionTrigger>
                    <AccordionContent>VTS is the world's leading commercial real estate platform.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="b">
                    <AccordionTrigger>How does it work?</AccordionTrigger>
                    <AccordionContent>Connect landlords, tenants, and brokers in a single workflow.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="c">
                    <AccordionTrigger>Who uses VTS?</AccordionTrigger>
                    <AccordionContent>Over 45,000 industry professionals worldwide.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Row>
            </div>
          </section>

          <Divider />

          {/* ── 02 Alert ─────────────────────────────────────────────────── */}
          <section>
            <Section num="02" title="Alert" />
            <div className="flex flex-col gap-4 max-w-lg">
              <Alert>
                <Info className="size-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>Your lease renewal is due in 30 days.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Action required</AlertTitle>
                <AlertDescription>Two critical dates are past due.</AlertDescription>
              </Alert>
            </div>
          </section>

          <Divider />

          {/* ── 03 Alert Dialog ──────────────────────────────────────────── */}
          <section>
            <Section num="03" title="Alert dialog" />
            <Row label="trigger">
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="destructive" />}>
                  <Trash2 className="mr-2 size-4" />Delete lease
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this lease?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All lease data and associated critical dates will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Row>
          </section>

          <Divider />

          {/* ── 04 Aspect Ratio ──────────────────────────────────────────── */}
          <section>
            <Section num="04" title="Aspect ratio" />
            <Row label="16:9">
              <div className="w-64">
                <AspectRatio ratio={16 / 9}>
                  <div className="size-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    <Image className="size-6" />
                  </div>
                </AspectRatio>
              </div>
              <div className="w-32">
                <AspectRatio ratio={1}>
                  <div className="size-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    1:1
                  </div>
                </AspectRatio>
              </div>
            </Row>
          </section>

          <Divider />

          {/* ── 05 Attachment ────────────────────────────────────────────── */}
          <section>
            <Section num="05" title="Attachment" />
            <Row label="default">
              <Attachment>
                <AttachmentMedia>
                  <FileText className="size-5 text-muted-foreground" />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>Lease_Agreement_v3.pdf</AttachmentTitle>
                  <AttachmentDescription>2.4 MB · PDF</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <Button variant="ghost" size="icon-sm"><Download className="size-3.5" /></Button>
                </AttachmentActions>
              </Attachment>
              <Attachment state="idle">
                <AttachmentMedia>
                  <Upload className="size-5 text-muted-foreground" />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>Uploading…</AttachmentTitle>
                  <AttachmentDescription>Floor_Plan.png · 45%</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            </Row>
          </section>

          <Divider />

          {/* ── 06 Avatar ────────────────────────────────────────────────── */}
          <section>
            <Section num="06" title="Avatar" />
            <Row label="sizes">
              <Avatar size="sm">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>VT</AvatarFallback>
              </Avatar>
            </Row>
          </section>

          <Divider />

          {/* ── 07 Badge ─────────────────────────────────────────────────── */}
          <section>
            <Section num="07" title="Badge" />
            <Row label="variants">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </Row>
          </section>

          <Divider />

          {/* ── 08 Breadcrumb ────────────────────────────────────────────── */}
          <section>
            <Section num="08" title="Breadcrumb" />
            <Row label="default">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="#">Portfolio</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbLink href="#">One Market Plaza</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage>Leases</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Row>
            <Row label="collapsed">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="#">Portfolio</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage>Deal #4821</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Row>
          </section>

          <Divider />

          {/* ── 09 Bubble ────────────────────────────────────────────────── */}
          <section>
            <Section num="09" title="Bubble" />
            <Row label="variants">
              <div className="flex flex-col gap-2 w-72">
                <BubbleGroup>
                  <Bubble variant="default">
                    <BubbleContent>Here's the updated lease proposal for review.</BubbleContent>
                  </Bubble>
                </BubbleGroup>
                <BubbleGroup>
                  <Bubble variant="secondary">
                    <BubbleContent>Looks good, I'll share it with the team.</BubbleContent>
                  </Bubble>
                </BubbleGroup>
                <BubbleGroup>
                  <Bubble variant="muted">
                    <BubbleContent>Can we adjust the commencement date?</BubbleContent>
                  </Bubble>
                </BubbleGroup>
              </div>
            </Row>
          </section>

          <Divider />

          {/* ── 10 Calendar ──────────────────────────────────────────────── */}
          <section>
            <Section num="10" title="Calendar" />
            <Row label="inline">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
              />
            </Row>
          </section>

          <Divider />

          {/* ── 11 Card ──────────────────────────────────────────────────── */}
          <section>
            <Section num="11" title="Card" />
            <Row label="default">
              <Card className="w-72">
                <CardHeader>
                  <CardTitle>One Market Plaza</CardTitle>
                  <CardDescription>San Francisco, CA</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">4 active leases · 12 floors · 98% occupancy</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm">View details</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                </CardFooter>
              </Card>
            </Row>
          </section>

          <Divider />

          {/* ── 12 Carousel ──────────────────────────────────────────────── */}
          <section>
            <Section num="12" title="Carousel" />
            <Row label="horizontal">
              <Carousel className="w-72">
                <CarouselContent>
                  {["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"].map((q) => (
                    <CarouselItem key={q}>
                      <div className="rounded-lg border bg-card p-6 text-center">
                        <p className="text-sm font-medium">{q}</p>
                        <p className="text-2xl font-bold mt-1">{Math.floor(Math.random() * 50 + 80)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Occupancy</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </Row>
          </section>

          <Divider />

          {/* ── 13 Checkbox ──────────────────────────────────────────────── */}
          <section>
            <Section num="13" title="Checkbox" />
            <div className="flex flex-col gap-4">
              <Row label="states">
                <div className="flex items-center gap-2">
                  <Checkbox id="cb1" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
                  <Label htmlFor="cb1">Send reminder emails</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cb2" defaultChecked />
                  <Label htmlFor="cb2">Notify on critical dates</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cb3" disabled />
                  <Label htmlFor="cb3">Disabled option</Label>
                </div>
              </Row>
            </div>
          </section>

          <Divider />

          {/* ── 14 Collapsible ───────────────────────────────────────────── */}
          <section>
            <Section num="14" title="Collapsible" />
            <Row label="default">
              <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="w-72">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Lease details</h4>
                  <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
                    <ChevronDown className="size-4" />
                  </CollapsibleTrigger>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Suite 400, 12,000 sq ft</p>
                <CollapsibleContent className="mt-3 space-y-2">
                  <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">Commencement: Jan 1, 2024</div>
                  <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">Expiration: Dec 31, 2029</div>
                  <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">Base rent: $48/sq ft</div>
                </CollapsibleContent>
              </Collapsible>
            </Row>
          </section>

          <Divider />

          {/* ── 15 Combobox ──────────────────────────────────────────────── */}
          <section>
            <Section num="15" title="Combobox" />
            <Row label="default">
              <Combobox value={comboValue} onValueChange={setComboValue}>
                <ComboboxInput placeholder="Search tenants…" className="w-56" />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxEmpty>No tenants found.</ComboboxEmpty>
                    {["Acme Corp", "Globex", "Initech", "Umbrella Corp", "Wayne Enterprises"].map(t => (
                      <ComboboxItem key={t} value={t}>{t}</ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Row>
          </section>

          <Divider />

          {/* ── 16 Command ───────────────────────────────────────────────── */}
          <section>
            <Section num="16" title="Command" />
            <Row label="inline">
              <Command className="rounded-lg border w-72">
                <CommandInput placeholder="Search…" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Deals">
                    <CommandItem><File className="mr-2 size-4" />New deal</CommandItem>
                    <CommandItem><Search className="mr-2 size-4" />Search deals<CommandShortcut>⌘K</CommandShortcut></CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Portfolio">
                    <CommandItem><Home className="mr-2 size-4" />Portfolio overview<CommandShortcut>⌘P</CommandShortcut></CommandItem>
                    <CommandItem><Layers className="mr-2 size-4" />All spaces</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </Row>
          </section>

          <Divider />

          {/* ── 17 Context Menu ──────────────────────────────────────────── */}
          <section>
            <Section num="17" title="Context menu" />
            <Row label="right-click">
              <ContextMenu>
                <ContextMenuTrigger className="flex h-24 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  Right-click here
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem><Copy className="mr-2 size-4" />Copy</ContextMenuItem>
                  <ContextMenuItem><ExternalLink className="mr-2 size-4" />Open in new tab</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem className="text-destructive"><Trash2 className="mr-2 size-4" />Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </Row>
          </section>

          <Divider />

          {/* ── 18 Dialog ────────────────────────────────────────────────── */}
          <section>
            <Section num="18" title="Dialog" />
            <Row label="trigger">
              <Dialog>
                <DialogTrigger render={<Button variant="outline" />}>
                  <Plus className="mr-2 size-4" />New lease
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new lease</DialogTitle>
                    <DialogDescription>Add a lease to your portfolio. Fill in the key details below.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <Input placeholder="Tenant name" />
                    <Input placeholder="Space (sq ft)" type="number" />
                    <Input placeholder="Base rent ($/sq ft)" type="number" />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create lease</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Row>
          </section>

          <Divider />

          {/* ── 19 Drawer ────────────────────────────────────────────────── */}
          <section>
            <Section num="19" title="Drawer" />
            <Row label="bottom">
              <Drawer>
                <DrawerTrigger render={<Button variant="outline" />}>
                  Open drawer
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Lease summary</DrawerTitle>
                    <DrawerDescription>Key metrics for your current portfolio.</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                    {[["Active leases", "142"], ["Sq ft managed", "4.2M"], ["Occupancy", "94%"], ["Avg rent", "$52/sf"]].map(([k, v]) => (
                      <div key={k} className="rounded-lg border bg-card p-3">
                        <p className="text-xs text-muted-foreground">{k}</p>
                        <p className="text-xl font-semibold">{v}</p>
                      </div>
                    ))}
                  </div>
                  <DrawerFooter>
                    <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Row>
          </section>

          <Divider />

          {/* ── 20 Dropdown Menu ─────────────────────────────────────────── */}
          <section>
            <Section num="20" title="Dropdown menu" />
            <Row label="default">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" />}>
                  Actions <ChevronDown className="ml-2 size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Lease actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem><Copy className="mr-2 size-4" />Duplicate<DropdownMenuShortcut>⌘D</DropdownMenuShortcut></DropdownMenuItem>
                    <DropdownMenuItem><Mail className="mr-2 size-4" />Send to tenant</DropdownMenuItem>
                    <DropdownMenuItem><Download className="mr-2 size-4" />Export PDF</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 size-4" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Row>
          </section>

          <Divider />

          {/* ── 21 Empty ─────────────────────────────────────────────────── */}
          <section>
            <Section num="21" title="Empty" />
            <Row label="default">
              <Empty className="w-72 border">
                <EmptyMedia variant="icon">
                  <Inbox className="size-4" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No deals yet</EmptyTitle>
                  <EmptyDescription>Create your first deal to get started tracking leases and proposals.</EmptyDescription>
                </EmptyHeader>
                <Button size="sm"><Plus className="mr-2 size-4" />New deal</Button>
              </Empty>
            </Row>
          </section>

          <Divider />

          {/* ── 22 Field ─────────────────────────────────────────────────── */}
          <section>
            <Section num="22" title="Field" />
            <div className="flex flex-col gap-5">
              <Row label="with label">
                <div className="flex flex-col gap-1.5 w-64">
                  <Field>
                    <FieldLabel>Tenant name</FieldLabel>
                    <Input placeholder="Acme Corporation" />
                    <FieldDescription>Legal entity name as it appears on the lease.</FieldDescription>
                  </Field>
                </div>
              </Row>
              <Row label="with error">
                <div className="flex flex-col gap-1.5 w-64">
                  <Field>
                    <FieldLabel>Base rent</FieldLabel>
                    <Input placeholder="$/sq ft" aria-invalid />
                    <FieldError>Base rent must be a positive number.</FieldError>
                  </Field>
                </div>
              </Row>
            </div>
          </section>

          <Divider />

          {/* ── 23 Hover Card ────────────────────────────────────────────── */}
          <section>
            <Section num="23" title="Hover card" />
            <Row label="hover">
              <HoverCard>
                <HoverCardTrigger render={<Button variant="link" />}>
                  One Market Plaza
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                        <Home className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">One Market Plaza</p>
                        <p className="text-xs text-muted-foreground">San Francisco, CA</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">1.6M sq ft · 4 active leases · 98% occupancy</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Row>
          </section>

          <Divider />

          {/* ── 24 Input ─────────────────────────────────────────────────── */}
          <section>
            <Section num="24" title="Input" />
            <div className="flex flex-col gap-4">
              <Row label="default">
                <Input placeholder="Search spaces…" className="w-56" />
                <Input placeholder="Tenant name" className="w-56" defaultValue="Acme Corp" />
              </Row>
              <Row label="states">
                <Input placeholder="Disabled" className="w-40" disabled />
                <Input placeholder="Invalid" className="w-40" aria-invalid />
              </Row>
            </div>
          </section>

          <Divider />

          {/* ── 25 Input Group ───────────────────────────────────────────── */}
          <section>
            <Section num="25" title="Input group" />
            <div className="flex flex-col gap-4">
              <Row label="with icon">
                <InputGroup className="w-56">
                  <InputGroupAddon align="inline-start"><Search className="size-4" /></InputGroupAddon>
                  <InputGroupInput placeholder="Search…" />
                </InputGroup>
              </Row>
              <Row label="with suffix">
                <InputGroup className="w-40">
                  <InputGroupInput placeholder="0.00" />
                  <InputGroupAddon align="inline-end">$/sf</InputGroupAddon>
                </InputGroup>
              </Row>
            </div>
          </section>

          <Divider />

          {/* ── 26 Input OTP ─────────────────────────────────────────────── */}
          <section>
            <Section num="26" title="Input OTP" />
            <Row label="6 digits">
              <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Row>
          </section>

          <Divider />

          {/* ── 27 Item ──────────────────────────────────────────────────── */}
          <section>
            <Section num="27" title="Item" />
            <Row label="list">
              <ItemGroup className="w-72 rounded-lg border divide-y divide-border">
                {[
                  { name: "Acme Corp", space: "Suite 400 · 12,000 sf" },
                  { name: "Globex", space: "Suite 1200 · 8,400 sf" },
                  { name: "Initech", space: "Suite 200 · 5,600 sf" },
                ].map(({ name, space }) => (
                  <Item key={name} size="sm" className="px-3 py-2">
                    <ItemMedia>
                      <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">{name[0]}</div>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{name}</ItemTitle>
                      <ItemDescription>{space}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" size="icon-xs"><ChevronRight className="size-3.5" /></Button>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </Row>
          </section>

          <Divider />

          {/* ── 28 Kbd ───────────────────────────────────────────────────── */}
          <section>
            <Section num="28" title="Kbd" />
            <Row label="keys">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
              <KbdGroup><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd></KbdGroup>
            </Row>
          </section>

          <Divider />

          {/* ── 29 Label ─────────────────────────────────────────────────── */}
          <section>
            <Section num="29" title="Label" />
            <Row label="default">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lease-type">Lease type</Label>
                <Select defaultValue="gross">
                  <SelectTrigger id="lease-type" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gross">Gross</SelectItem>
                    <SelectItem value="net">Net</SelectItem>
                    <SelectItem value="modified">Modified gross</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Row>
          </section>

          <Divider />

          {/* ── 30 Marker ────────────────────────────────────────────────── */}
          <section>
            <Section num="30" title="Marker" />
            <div className="flex flex-col gap-3 w-72">
              <Row label="default">
                <div className="flex flex-col gap-2 w-64">
                  <Marker><Bell className="size-4 text-muted-foreground" />Notification sent</Marker>
                  <Marker><Check className="size-4 text-muted-foreground" />Lease executed</Marker>
                </div>
              </Row>
              <Row label="separator">
                <Marker variant="separator" className="w-64">Today</Marker>
              </Row>
            </div>
          </section>

          <Divider />

          {/* ── 31 Menubar ───────────────────────────────────────────────── */}
          <section>
            <Section num="31" title="Menubar" />
            <Row label="default">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>New lease<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                    <MenubarItem>Open<MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Export PDF</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Undo<MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                    <MenubarItem>Redo<MenubarShortcut>⌘⇧Z</MenubarShortcut></MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Find<MenubarShortcut>⌘F</MenubarShortcut></MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>View</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Grid view</MenubarItem>
                    <MenubarItem>List view</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Full screen<MenubarShortcut>⌘⇧F</MenubarShortcut></MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </Row>
          </section>

          <Divider />

          {/* ── 32 Message ───────────────────────────────────────────────── */}
          <section>
            <Section num="32" title="Message" />
            <Row label="thread">
              <div className="flex flex-col gap-4 w-80">
                <MessageGroup>
                  <Message align="start">
                    <MessageAvatar>
                      <Avatar size="sm"><AvatarFallback>JL</AvatarFallback></Avatar>
                    </MessageAvatar>
                    <MessageContent className="rounded-lg bg-muted px-3 py-2 text-sm">
                      Can we extend the commencement date by 30 days?
                    </MessageContent>
                  </Message>
                </MessageGroup>
                <MessageGroup>
                  <Message align="end">
                    <MessageContent className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                      Sure — I'll update the proposal and send it over.
                    </MessageContent>
                    <MessageAvatar>
                      <Avatar size="sm"><AvatarFallback>ME</AvatarFallback></Avatar>
                    </MessageAvatar>
                  </Message>
                </MessageGroup>
              </div>
            </Row>
          </section>

          <Divider />

          {/* ── 33 Navigation Menu ───────────────────────────────────────── */}
          <section>
            <Section num="33" title="Navigation menu" />
            <Row label="default">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
                    <NavigationMenuContent className="p-3 w-48">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Overview</NavigationMenuLink>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Assets</NavigationMenuLink>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Leases</NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Deals</NavigationMenuTrigger>
                    <NavigationMenuContent className="p-3 w-48">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Active deals</NavigationMenuLink>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pipeline</NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Analytics</NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </Row>
          </section>

          <Divider />

          {/* ── 34 Native Select ─────────────────────────────────────────── */}
          <section>
            <Section num="34" title="Native select" />
            <Row label="sizes">
              <NativeSelect size="sm">
                <option>San Francisco</option>
                <option>New York</option>
                <option>Chicago</option>
              </NativeSelect>
              <NativeSelect>
                <option>San Francisco</option>
                <option>New York</option>
                <option>Chicago</option>
              </NativeSelect>
            </Row>
          </section>

          <Divider />

          {/* ── 35 Pagination ────────────────────────────────────────────── */}
          <section>
            <Section num="35" title="Pagination" />
            <Row label="default">
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                  <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationEllipsis /></PaginationItem>
                  <PaginationItem><PaginationLink href="#">12</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </Row>
          </section>

          <Divider />

          {/* ── 36 Popover ───────────────────────────────────────────────── */}
          <section>
            <Section num="36" title="Popover" />
            <Row label="default">
              <Popover>
                <PopoverTrigger render={<Button variant="outline" />}>
                  <Settings className="mr-2 size-4" />Lease settings
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium">Notification settings</p>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-normal">Critical dates</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-normal">Rent escalations</Label>
                      <Switch />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </Row>
          </section>

          <Divider />

          {/* ── 37 Progress ──────────────────────────────────────────────── */}
          <section>
            <Section num="37" title="Progress" />
            <div className="flex flex-col gap-4">
              <Row label="values">
                <div className="flex flex-col gap-3 w-64">
                  <Progress value={progress} />
                  <Progress value={100} />
                  <Progress value={0} />
                </div>
              </Row>
              <Row label="control">
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" onClick={() => setProgress(p => Math.max(0, p - 10))}>−10</Button>
                  <span className="text-sm text-muted-foreground w-8 text-center">{progress}%</span>
                  <Button size="sm" variant="outline" onClick={() => setProgress(p => Math.min(100, p + 10))}>+10</Button>
                </div>
              </Row>
            </div>
          </section>

          <Divider />

          {/* ── 38 Radio Group ───────────────────────────────────────────── */}
          <section>
            <Section num="38" title="Radio group" />
            <Row label="options">
              <RadioGroup value={radio} onValueChange={setRadio} className="flex flex-col gap-2">
                {[["option-1", "Gross lease"], ["option-2", "Net lease"], ["option-3", "Modified gross"]].map(([v, l]) => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={v} />
                    <Label htmlFor={v}>{l}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Row>
          </section>

          <Divider />

          {/* ── 39 Resizable ─────────────────────────────────────────────── */}
          <section>
            <Section num="39" title="Resizable" />
            <Row label="panels">
              <ResizablePanelGroup direction="horizontal" className="w-96 h-32 rounded-lg border">
                <ResizablePanel defaultSize={40}>
                  <div className="h-full p-3 flex items-center justify-center text-sm text-muted-foreground">Nav</div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <div className="h-full p-3 flex items-center justify-center text-sm text-muted-foreground">Content</div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </Row>
          </section>

          <Divider />

          {/* ── 40 Scroll Area ───────────────────────────────────────────── */}
          <section>
            <Section num="40" title="Scroll area" />
            <Row label="vertical">
              <ScrollArea className="h-40 w-72 rounded-lg border p-3">
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="rounded-lg border bg-card px-3 py-2 text-sm">
                      Lease #{1000 + i} · Suite {(i + 1) * 100}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Row>
          </section>

          <Divider />

          {/* ── 41 Select ────────────────────────────────────────────────── */}
          <section>
            <Section num="41" title="Select" />
            <Row label="default">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sf">San Francisco</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="chi">Chicago</SelectItem>
                  <SelectItem value="la">Los Angeles</SelectItem>
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Disabled" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">Option</SelectItem>
                </SelectContent>
              </Select>
            </Row>
          </section>

          <Divider />

          {/* ── 42 Separator ─────────────────────────────────────────────── */}
          <section>
            <Section num="42" title="Separator" />
            <Row label="horizontal">
              <div className="w-64 flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">Above</p>
                <Separator />
                <p className="text-sm text-muted-foreground">Below</p>
              </div>
            </Row>
            <Row label="vertical">
              <div className="flex items-center gap-3 h-8">
                <span className="text-sm text-muted-foreground">Left</span>
                <Separator orientation="vertical" />
                <span className="text-sm text-muted-foreground">Right</span>
              </div>
            </Row>
          </section>

          <Divider />

          {/* ── 43 Sheet ─────────────────────────────────────────────────── */}
          <section>
            <Section num="43" title="Sheet" />
            <Row label="sides">
              {(["right", "bottom"] as const).map(side => (
                <Sheet key={side}>
                  <SheetTrigger render={<Button variant="outline" />}>
                    Open {side}
                  </SheetTrigger>
                  <SheetContent side={side}>
                    <SheetHeader>
                      <SheetTitle>Lease details</SheetTitle>
                      <SheetDescription>Review and edit the lease information below.</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-3 mt-4">
                      <Input placeholder="Tenant name" defaultValue="Acme Corp" />
                      <Input placeholder="Space" defaultValue="Suite 400" />
                    </div>
                    <SheetFooter className="mt-4">
                      <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
                      <Button>Save changes</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              ))}
            </Row>
          </section>

          <Divider />

          {/* ── 44 Skeleton ──────────────────────────────────────────────── */}
          <section>
            <Section num="44" title="Skeleton" />
            <Row label="loading">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            </Row>
            <Row label="card">
              <div className="flex flex-col gap-2 w-64">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Row>
          </section>

          <Divider />

          {/* ── 45 Slider ────────────────────────────────────────────────── */}
          <section>
            <Section num="45" title="Slider" />
            <div className="flex flex-col gap-5">
              <Row label="default">
                <Slider
                  value={sliderVal}
                  onValueChange={setSliderVal}
                  className="w-64"
                />
                <span className="text-sm text-muted-foreground pt-1">{sliderVal[0]}</span>
              </Row>
              <Row label="range">
                <Slider defaultValue={[20, 80]} className="w-64" />
              </Row>
              <Row label="disabled">
                <Slider defaultValue={[50]} className="w-64" disabled />
              </Row>
            </div>
          </section>

          <Divider />

          {/* ── 46 Spinner ───────────────────────────────────────────────── */}
          <section>
            <Section num="46" title="Spinner" />
            <Row label="sizes">
              <Spinner className="size-4" />
              <Spinner className="size-6" />
              <Spinner className="size-8" />
              <Spinner className="size-4 text-primary" />
              <Spinner className="size-4 text-muted-foreground" />
            </Row>
          </section>

          <Divider />

          {/* ── 47 Switch ────────────────────────────────────────────────── */}
          <section>
            <Section num="47" title="Switch" />
            <Row label="states">
              <div className="flex items-center gap-2">
                <Switch checked={switchOn} onCheckedChange={setSwitchOn} id="sw1" />
                <Label htmlFor="sw1">Email notifications</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked id="sw2" />
                <Label htmlFor="sw2">Push notifications</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch disabled id="sw3" />
                <Label htmlFor="sw3">Disabled</Label>
              </div>
            </Row>
            <Row label="small">
              <Switch size="sm" />
              <Switch size="sm" defaultChecked />
            </Row>
          </section>

          <Divider />

          {/* ── 48 Table ─────────────────────────────────────────────────── */}
          <section>
            <Section num="48" title="Table" />
            <Row label="default">
              <Table className="w-[480px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Suite</TableHead>
                    <TableHead className="text-right">Sq ft</TableHead>
                    <TableHead className="text-right">Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["Acme Corp", "400", "12,000", "Dec 2029"],
                    ["Globex", "1200", "8,400", "Jun 2027"],
                    ["Initech", "200", "5,600", "Mar 2026"],
                  ].map(([t, s, sf, exp]) => (
                    <TableRow key={t}>
                      <TableCell className="font-medium">{t}</TableCell>
                      <TableCell>{s}</TableCell>
                      <TableCell className="text-right">{sf}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{exp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Row>
          </section>

          <Divider />

          {/* ── 49 Tabs ──────────────────────────────────────────────────── */}
          <section>
            <Section num="49" title="Tabs" />
            <Row label="default">
              <Tabs defaultValue="overview" className="w-80">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="leases">Leases</TabsTrigger>
                  <TabsTrigger value="deals">Deals</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">Portfolio overview content</div>
                </TabsContent>
                <TabsContent value="leases">
                  <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">142 active leases</div>
                </TabsContent>
                <TabsContent value="deals">
                  <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">18 deals in pipeline</div>
                </TabsContent>
              </Tabs>
            </Row>
          </section>

          <Divider />

          {/* ── 50 Textarea ──────────────────────────────────────────────── */}
          <section>
            <Section num="50" title="Textarea" />
            <Row label="default">
              <Textarea placeholder="Add notes about this lease…" className="w-64" />
              <Textarea placeholder="Disabled" className="w-40" disabled />
            </Row>
          </section>

          <Divider />

          {/* ── 51 Toast ─────────────────────────────────────────────────── */}
          <section>
            <Section num="51" title="Toast (Sonner)" />
            <Row label="variants">
              <Button variant="outline" size="sm" onClick={() => toast("Lease saved successfully")}>Default</Button>
              <Button variant="outline" size="sm" onClick={() => toast.success("Lease executed")}>Success</Button>
              <Button variant="outline" size="sm" onClick={() => toast.error("Failed to save")}>Error</Button>
              <Button variant="outline" size="sm" onClick={() => toast.warning("Critical date approaching")}>Warning</Button>
              <Button variant="outline" size="sm" onClick={() => toast.info("New proposal received")}>Info</Button>
              <Button variant="outline" size="sm" onClick={() => toast.loading("Saving…")}>Loading</Button>
            </Row>
          </section>

          <Divider />

          {/* ── 52 Toggle ────────────────────────────────────────────────── */}
          <section>
            <Section num="52" title="Toggle" />
            <Row label="variants">
              <Toggle aria-label="Bookmark"><Star className="size-4" />Watchlist</Toggle>
              <Toggle variant="outline" aria-label="Bookmark"><Bell className="size-4" /></Toggle>
              <Toggle aria-label="Disabled" disabled><Star className="size-4" /></Toggle>
            </Row>
          </section>

          <Divider />

          {/* ── 53 Toggle Group ──────────────────────────────────────────── */}
          <section>
            <Section num="53" title="Toggle group" />
            <Row label="single">
              <ToggleGroup type="single" defaultValue="list">
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Layers className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <Menu className="size-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </Row>
            <Row label="multiple">
              <ToggleGroup type="multiple">
                <ToggleGroupItem value="bold" aria-label="Bold"><span className="font-bold text-sm">B</span></ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Italic"><span className="italic text-sm">I</span></ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Underline"><span className="underline text-sm">U</span></ToggleGroupItem>
              </ToggleGroup>
            </Row>
          </section>

          <Divider />

          {/* ── 54 Tooltip ───────────────────────────────────────────────── */}
          <section>
            <Section num="54" title="Tooltip" />
            <Row label="default">
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="icon" />}>
                  <Info className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Lease commencement date</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="icon" />}>
                  <Settings className="size-4" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Settings</p>
                  <p className="text-muted-foreground text-xs">Configure notifications</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
                  <Kbd>⌘K</Kbd>
                </TooltipTrigger>
                <TooltipContent>
                  Open command palette
                  <KbdGroup className="ml-2"><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
                </TooltipContent>
              </Tooltip>
            </Row>
          </section>

        </div>
      </div>
    </TooltipProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
