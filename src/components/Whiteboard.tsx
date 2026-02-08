import { useRef, useEffect, useState, useCallback, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { 
  Trash2, Users, Pencil, Square, Circle, Minus, ArrowRight, 
  Type, Undo2, Redo2, Download, MousePointer, Hand, Highlighter,
  Image as ImageIcon, StickyNote, Pointer, Paintbrush, Eraser, Triangle,
  Star, Heart, PenTool, X, Sun, Moon, Grid3X3, ChevronLeft, ChevronRight,
  ChevronDown, Hexagon, Diamond, Octagon, Pentagon, Database, Cloud,
  MessageSquare, FileText, Workflow, GitBranch, Box, Layers, Zap,
  Shield, Flag, Bookmark, Bell, Camera, Lock, Unlock, Settings,
  ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft,
  CornerUpRight, CornerDownRight, CornerUpLeft, CornerDownLeft,
  MoveRight, MoveLeft, MoveUp, MoveDown, Maximize2, Minimize2,
  Save, Upload, FolderOpen, Shapes, Sparkles, LayoutGrid,
  // New imports for extended shapes
  Server, HardDrive, Wifi, Globe, Cpu, Monitor, Smartphone, Tablet,
  Watch, Tv, Speaker, Headphones, Printer,
  User, UserPlus, UserCheck, UserX, UsersRound, Building, Building2,
  CheckCircle, XCircle, AlertCircle, AlertTriangle, Info, HelpCircle,
  File, FileCode, FileJson, Folder, FolderArchive, Code, Terminal,
  Mail, Send, Inbox, MessageCircle, Phone, PhoneCall, Share2,
  Key, KeyRound, ShieldCheck, ShieldAlert, Eye, EyeOff, Fingerprint,
  Plus, Check, RefreshCw, RotateCw, Search,
  Lightbulb, Target, Crosshair, Tag, Award, Trophy, Flame, Puzzle, Compass,
  TrendingUp, TrendingDown, Activity, BarChart3, PieChart, LineChart,
  Play, Pause, StopCircle, SkipForward, SkipBack,
  Table, List, ListOrdered, TreePine, Network, Binary, Braces, Hash,
  Package, Component, Boxes, Link2, Unlink, ArrowLeftRight, Merge, Split,
  GitCommit, GitMerge, GitPullRequest, Bug, CheckCheck, XOctagon,
  CircleDot, SquareDot, Dot, Grip, Move,
  // Cloud & DevOps icons
  CloudCog, Container, CloudOff, CloudUpload, CloudDownload,
  CloudLightning, Cog, Wrench, Hammer, Factory, Gauge, Radio, 
  Router, Cable, PlugZap, Power, Battery, BatteryCharging,
  Scale, Webhook, Blocks
} from 'lucide-react';
import { getUserId, getUsername, getUserColor } from '../lib/userSession';
import { getSocket } from '../lib/socket';
import { api } from '../lib/api';
import { techLogoCategories, searchTechLogos, getTechLogoByLabel, techLogoMap } from './TechLogos';

type Tool = 'select' | 'pan' | 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text' | 'highlighter' | 'laser' | 'stickynote' | 'image' | 'triangle' | 'star' | 'heart' | 'diamond' | 'hexagon' | 'parallelogram' | 'cylinder' | 'cloud' | 'callout' | 'document' | 'database' | 'process' | 'decision' | 'connector' | 'pentagon' | 'octagon' | 'icon' | 
// System Design shapes
'server' | 'storage' | 'firewall' | 'processor' | 'client' | 'mobile' | 'loadbalancer' | 'cache' | 'messagequeue' | 'internet' | 'layers' |
// Coding/Tech shapes  
'terminal' | 'codeblock' | 'jsonobject' | 'binaryarray' | 'function' | 'gitcommit' | 'gitbranch' | 'gitmerge' | 'gitpr' | 'sourcefile' | 'bug' | 'success' | 'error' | 'warning' |
// Files & Folders
'file' | 'codefile' | 'textfile' | 'folder' | 'archive' |
// Communication
'email' | 'send' | 'inbox' | 'chat' | 'discussion' | 'phone' | 'phonecall' | 'share' |
// Devices
'desktop' | 'tablet' | 'watch' | 'tv' | 'speaker' | 'headphones' | 'camera' | 'printer' |
// Security
'lock' | 'unlock' | 'key' | 'apikey' | 'shield' | 'secured' | 'vulnerable' | 'biometric' | 'visible' | 'hidden' |
// People
'user' | 'usersgroup' | 'adduser' | 'verifieduser' | 'removeuser' | 'organization' | 'company' |
// Status
'successcircle' | 'errorcircle' | 'alertcircle' | 'info' | 'help' | 'notification' | 'flag' |
// Actions
'add' | 'remove' | 'check' | 'close' | 'refresh' | 'rotate' | 'download' | 'upload' | 'search' | 'settings' |
// Charts
'barchart' | 'piechart' | 'linechart' | 'trendup' | 'trenddown' | 'activity' |
// Misc
'idea' | 'target' | 'focus' | 'bookmark' | 'tag' | 'award' | 'trophy' | 'lightning' | 'fire' | 'puzzle' | 'compass' |
// Data Structures
'array' | 'stack' | 'queue' | 'node' | 'pointer' | 'treenode' | 'hashtable' | 'graphnode' | 'heap' | 'linkedlist' |
// Arrows
'arrowup' | 'arrowdown' | 'arrowleft' | 'diagonalur' | 'diagonaldr' | 'diagonalul' | 'diagonaldl' | 'cornerur' | 'cornerdr' | 'bidirectional' |
// UML
'class' | 'interface' | 'package' | 'object' | 'composition' | 'actor' | 'lifeline' | 'activation' | 'message' | 'loop' | 'altfragment' |
// ER
'entity' | 'relationship' | 'attribute' | 'primarykey' | 'foreignkey' | 'table' |
// Cloud & DevOps
'aws' | 'azure' | 'gcp' | 'docker' | 'kubernetes' | 'terraform' | 'jenkins' | 'cicd' | 'ansible' | 'prometheus' | 'grafana' | 'nginx' | 'redis' | 'mongodb' | 'postgresql' | 'mysql' | 'elasticsearch' | 'kafka' | 'rabbitmq' | 'vault' | 'consul' | 'istio' | 'helm' | 'argocd' |
// AWS Services
'lambda' | 's3bucket' | 'ec2' | 'rds' | 'vpc' | 'apigateway' | 'cloudwatch' | 'sns' | 'sqs' | 'elasticache' | 'cloudfront' | 'route53' | 'ecs' | 'eks' | 'fargate' | 'dynamodb' | 'redshift' | 'kinesis' | 'stepfunction' | 'cognitouser' | 'iam' | 'secretsmanager' | 'eventbridge' | 'amplify' | 'athena' | 'glue' | 'emr' | 'sagemaker' | 'codepipeline' | 'codebuild' | 'codecommit' | 'codedeploy' | 'elasticbeanstalk' | 'lightsail' | 'apprunner' | 'batch' |
// Azure Services
'azurevm' | 'azureblobstorage' | 'azurefunctions' | 'azuresql' | 'cosmosdb' | 'azurevnet' | 'azureapim' | 'azuremonitor' | 'azureservicebus' | 'azureeventhubs' | 'azurecdn' | 'azuredns' | 'aks' | 'azurecontainerinstances' | 'azuresynapse' | 'azuredatafactory' | 'azuread' | 'azurekeyvault' | 'azurelogicapps' | 'azuredevops' | 'azureappservice' | 'azurefrontdoor' | 'azureml' | 'azurecognitiveservices' | 'azureiot' | 'azurenotificationhubs' | 'azuresignalr' | 'azuremediaservices' |
// Google Cloud
'computeengine' | 'cloudstorage' | 'cloudfunctions' | 'cloudsql' | 'bigquery' | 'gcpvpc' | 'apigee' | 'cloudmonitoring' | 'pubsub' | 'cloudcdn' | 'clouddns' | 'gke' | 'cloudrun' | 'dataflow' | 'dataproc' | 'gcpiam' | 'secretmanager' | 'cloudscheduler' | 'cloudbuild' | 'cloudsourcerepos' | 'appengine' | 'firestore' | 'firebase' | 'vertexai' | 'gcpiot' | 'memorystore' | 'spanner' | 'bigtable' |
// Networking
'router' | 'switch' | 'gateway' | 'dns' | 'cdn' | 'vpn' | 'proxy' | 'nat' | 'waf' | 'ddos' |
// Databases
'sqldb' | 'nosqldb' | 'graphdb' | 'timeseries' | 'cachedb' | 'datawarehouse' | 'datalake' | 'replication' | 'sharding' | 'backup';

interface WhiteboardProps {
  boardId: string;
}

interface RemoteUser {
  odId: string;
  username: string;
  color: string;
  isDrawing?: boolean;
  tool?: string;
}

interface RemoteCursor {
  odId: string;
  username: string;
  color: string;
  x: number;
  y: number;
  isDrawing: boolean;
  lastUpdate: number;
  tool?: string;
}

interface LaserPoint {
  odId: string;
  username: string;
  color: string;
  x: number;
  y: number;
  timestamp: number;
}

interface StickyNoteData {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  width: number;
  height: number;
}

interface PlacedImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ShapeData {
  type: Tool;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  lineWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  opacity: number;
  fill?: boolean;
  fillColor?: string;
  techLogoId?: string;  // ID for tech logos from Simple Icons
}

interface TextData {
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
}

export default function Whiteboard({ boardId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const boardFileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const backgroundColorRef = useRef('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(3);
  const [strokeStyle, setStrokeStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [opacity, setOpacity] = useState(100);
  const [fill, setFill] = useState(false);
  const [activeUsers, setActiveUsers] = useState<RemoteUser[]>([]);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [laserPoints, setLaserPoints] = useState<LaserPoint[]>([]);
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>([]);
  const [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [draggingImage, setDraggingImage] = useState<string | null>(null);
  const [imageDragOffset, setImageDragOffset] = useState({ x: 0, y: 0 });
  const [editingStickyNote, setEditingStickyNote] = useState<string | null>(null);
  const [draggingStickyNote, setDraggingStickyNote] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [textInput, setTextInput] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [textValue, setTextValue] = useState('');
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const cursorThrottleRef = useRef<number>(0);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const [darkMode, setDarkMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showShapesSidebar, setShowShapesSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'shapes' | 'logos'>('shapes');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['General']);
  const [expandedLogoCategories, setExpandedLogoCategories] = useState<string[]>(['AWS Services']);
  const [shapeSearch, setShapeSearch] = useState('');
  const [logoSearch, setLogoSearch] = useState('');
  const [selectedShapeIcon, setSelectedShapeIcon] = useState<{ icon: any; label: string; id?: string; color?: string } | null>(null);
  
  // Cache for rendered icon images
  const iconImageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  
  // Store background colors for light/dark mode switching
  const lightModeBgRef = useRef('#FFFFFF');
  const darkModeBgRef = useRef('#1a1a2e');

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 200));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLogoCategory = (category: string) => {
    setExpandedLogoCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Shape categories like diagrams.net
  const shapeCategories = [
    {
      name: 'General',
      shapes: [
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'triangle', icon: Triangle, label: 'Triangle' },
        { id: 'diamond', icon: Diamond, label: 'Diamond' },
        { id: 'hexagon', icon: Hexagon, label: 'Hexagon' },
        { id: 'star', icon: Star, label: 'Star' },
        { id: 'heart', icon: Heart, label: 'Heart' },
        { id: 'cloud', icon: Cloud, label: 'Cloud' },
        { id: 'pentagon', icon: Pentagon, label: 'Pentagon' },
        { id: 'octagon', icon: Octagon, label: 'Octagon' },
      ]
    },
    {
      name: 'Basic',
      shapes: [
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
        { id: 'bidirectional', icon: ArrowLeftRight, label: 'Bidirectional' },
        { id: 'connector', icon: GitBranch, label: 'Connector' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'stickynote', icon: StickyNote, label: 'Sticky Note' },
        { id: 'image', icon: ImageIcon, label: 'Image' },
      ]
    },
    {
      name: 'Arrows',
      shapes: [
        { id: 'arrow', icon: ArrowRight, label: 'Right' },
        { id: 'arrowup', icon: ArrowUp, label: 'Up' },
        { id: 'arrowdown', icon: ArrowDown, label: 'Down' },
        { id: 'arrowleft', icon: MoveLeft, label: 'Left' },
        { id: 'diagonalur', icon: ArrowUpRight, label: 'Diagonal ↗' },
        { id: 'diagonaldr', icon: ArrowDownRight, label: 'Diagonal ↘' },
        { id: 'diagonalul', icon: ArrowUpLeft, label: 'Diagonal ↖' },
        { id: 'diagonaldl', icon: ArrowDownLeft, label: 'Diagonal ↙' },
        { id: 'cornerur', icon: CornerUpRight, label: 'Corner ↱' },
        { id: 'cornerdr', icon: CornerDownRight, label: 'Corner ↳' },
        { id: 'bidirectional', icon: ArrowLeftRight, label: 'Bidirectional' },
      ]
    },
    {
      name: 'Flowchart',
      shapes: [
        { id: 'rectangle', icon: Square, label: 'Process' },
        { id: 'diamond', icon: Diamond, label: 'Decision' },
        { id: 'circle', icon: Circle, label: 'Start/End' },
        { id: 'layers', icon: Layers, label: 'Input/Output' },
        { id: 'cylinder', icon: Database, label: 'Database' },
        { id: 'document', icon: FileText, label: 'Document' },
        { id: 'callout', icon: MessageSquare, label: 'Callout' },
        { id: 'hexagon', icon: Hexagon, label: 'Preparation' },
      ]
    },
    {
      name: 'Data Structures',
      shapes: [
        { id: 'array', icon: Table, label: 'Array' },
        { id: 'stack', icon: List, label: 'Stack' },
        { id: 'queue', icon: ListOrdered, label: 'Queue' },
        { id: 'node', icon: CircleDot, label: 'Node' },
        { id: 'pointer', icon: ArrowRight, label: 'Pointer' },
        { id: 'treenode', icon: TreePine, label: 'Tree Node' },
        { id: 'hashtable', icon: Hash, label: 'Hash Table' },
        { id: 'graphnode', icon: Network, label: 'Graph Node' },
        { id: 'linkedlist', icon: Link2, label: 'Linked List' },
      ]
    },
    {
      name: 'UML',
      shapes: [
        { id: 'class', icon: Box, label: 'Class' },
        { id: 'interface', icon: Component, label: 'Interface' },
        { id: 'package', icon: Package, label: 'Package' },
        { id: 'actor', icon: User, label: 'Actor' },
        { id: 'lifeline', icon: Minus, label: 'Lifeline' },
        { id: 'activation', icon: Square, label: 'Activation' },
      ]
    },
    {
      name: 'ER Diagram',
      shapes: [
        { id: 'entity', icon: Square, label: 'Entity' },
        { id: 'relationship', icon: Diamond, label: 'Relationship' },
        { id: 'attribute', icon: Circle, label: 'Attribute' },
        { id: 'primarykey', icon: Key, label: 'Primary Key' },
        { id: 'foreignkey', icon: KeyRound, label: 'Foreign Key' },
        { id: 'table', icon: Table, label: 'Table' },
      ]
    },
    {
      name: 'System Design',
      shapes: [
        { id: 'server', icon: Server, label: 'Server' },
        { id: 'database', icon: Database, label: 'Database' },
        { id: 'storage', icon: HardDrive, label: 'Storage' },
        { id: 'internet', icon: Globe, label: 'Internet' },
        { id: 'cloud', icon: Cloud, label: 'Cloud' },
        { id: 'firewall', icon: Shield, label: 'Firewall' },
        { id: 'processor', icon: Cpu, label: 'Processor' },
        { id: 'client', icon: Monitor, label: 'Client' },
        { id: 'mobile', icon: Smartphone, label: 'Mobile' },
        { id: 'loadbalancer', icon: Workflow, label: 'Load Balancer' },
        { id: 'messagequeue', icon: MessageSquare, label: 'Message Queue' },
      ]
    },
    {
      name: 'Coding/Tech',
      shapes: [
        { id: 'terminal', icon: Terminal, label: 'Terminal' },
        { id: 'codeblock', icon: Code, label: 'Code Block' },
        { id: 'jsonobject', icon: Braces, label: 'JSON/Object' },
        { id: 'function', icon: Box, label: 'Function' },
        { id: 'gitcommit', icon: GitCommit, label: 'Git Commit' },
        { id: 'gitbranch', icon: GitBranch, label: 'Git Branch' },
        { id: 'gitmerge', icon: GitMerge, label: 'Git Merge' },
        { id: 'gitpr', icon: GitPullRequest, label: 'Git PR' },
        { id: 'sourcefile', icon: FileCode, label: 'Source File' },
        { id: 'bug', icon: Bug, label: 'Bug' },
        { id: 'error', icon: XOctagon, label: 'Error' },
        { id: 'warning', icon: AlertTriangle, label: 'Warning' },
      ]
    },
    {
      name: 'Charts',
      shapes: [
        { id: 'barchart', icon: BarChart3, label: 'Bar Chart' },
        { id: 'piechart', icon: PieChart, label: 'Pie Chart' },
        { id: 'linechart', icon: LineChart, label: 'Line Chart' },
        { id: 'trendup', icon: TrendingUp, label: 'Trending Up' },
        { id: 'trenddown', icon: TrendingDown, label: 'Trending Down' },
        { id: 'activity', icon: Activity, label: 'Activity' },
      ]
    },
    {
      name: 'People & Users',
      shapes: [
        { id: 'user', icon: User, label: 'User' },
        { id: 'usersgroup', icon: UsersRound, label: 'Users Group' },
        { id: 'adduser', icon: UserPlus, label: 'Add User' },
        { id: 'verifieduser', icon: UserCheck, label: 'Verified User' },
        { id: 'removeuser', icon: UserX, label: 'Remove User' },
        { id: 'organization', icon: Building, label: 'Organization' },
        { id: 'company', icon: Building2, label: 'Company' },
      ]
    },
    {
      name: 'Status & Alerts',
      shapes: [
        { id: 'successcircle', icon: CheckCircle, label: 'Success' },
        { id: 'errorcircle', icon: XCircle, label: 'Error' },
        { id: 'alertcircle', icon: AlertCircle, label: 'Alert' },
        { id: 'warning', icon: AlertTriangle, label: 'Warning' },
        { id: 'info', icon: Info, label: 'Info' },
        { id: 'help', icon: HelpCircle, label: 'Help' },
        { id: 'notification', icon: Bell, label: 'Notification' },
        { id: 'flag', icon: Flag, label: 'Flag' },
      ]
    },
    {
      name: 'Files & Folders',
      shapes: [
        { id: 'file', icon: File, label: 'File' },
        { id: 'codefile', icon: FileCode, label: 'Code File' },
        { id: 'textfile', icon: FileText, label: 'Text File' },
        { id: 'folder', icon: Folder, label: 'Folder' },
        { id: 'archive', icon: FolderArchive, label: 'Archive' },
      ]
    },
    {
      name: 'Communication',
      shapes: [
        { id: 'email', icon: Mail, label: 'Email' },
        { id: 'send', icon: Send, label: 'Send' },
        { id: 'inbox', icon: Inbox, label: 'Inbox' },
        { id: 'chat', icon: MessageCircle, label: 'Chat' },
        { id: 'discussion', icon: MessageSquare, label: 'Discussion' },
        { id: 'phone', icon: Phone, label: 'Phone' },
        { id: 'share', icon: Share2, label: 'Share' },
      ]
    },
    {
      name: 'Devices',
      shapes: [
        { id: 'desktop', icon: Monitor, label: 'Desktop' },
        { id: 'mobile', icon: Smartphone, label: 'Mobile' },
        { id: 'tablet', icon: Tablet, label: 'Tablet' },
        { id: 'watch', icon: Watch, label: 'Watch' },
        { id: 'tv', icon: Tv, label: 'TV' },
        { id: 'speaker', icon: Speaker, label: 'Speaker' },
        { id: 'headphones', icon: Headphones, label: 'Headphones' },
        { id: 'camera', icon: Camera, label: 'Camera' },
        { id: 'printer', icon: Printer, label: 'Printer' },
      ]
    },
    {
      name: 'Security',
      shapes: [
        { id: 'lock', icon: Lock, label: 'Lock' },
        { id: 'unlock', icon: Unlock, label: 'Unlock' },
        { id: 'key', icon: Key, label: 'Key' },
        { id: 'apikey', icon: KeyRound, label: 'API Key' },
        { id: 'shield', icon: Shield, label: 'Shield' },
        { id: 'secured', icon: ShieldCheck, label: 'Secured' },
        { id: 'vulnerable', icon: ShieldAlert, label: 'Vulnerable' },
        { id: 'biometric', icon: Fingerprint, label: 'Biometric' },
        { id: 'visible', icon: Eye, label: 'Visible' },
        { id: 'hidden', icon: EyeOff, label: 'Hidden' },
      ]
    },
    {
      name: 'Actions',
      shapes: [
        { id: 'add', icon: Plus, label: 'Add' },
        { id: 'remove', icon: Minus, label: 'Remove' },
        { id: 'check', icon: Check, label: 'Check' },
        { id: 'close', icon: X, label: 'Close' },
        { id: 'refresh', icon: RefreshCw, label: 'Refresh' },
        { id: 'rotate', icon: RotateCw, label: 'Rotate' },
        { id: 'download', icon: Download, label: 'Download' },
        { id: 'upload', icon: Upload, label: 'Upload' },
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ]
    },
    {
      name: 'Misc',
      shapes: [
        { id: 'idea', icon: Lightbulb, label: 'Idea' },
        { id: 'target', icon: Target, label: 'Target' },
        { id: 'focus', icon: Crosshair, label: 'Focus' },
        { id: 'bookmark', icon: Bookmark, label: 'Bookmark' },
        { id: 'tag', icon: Tag, label: 'Tag' },
        { id: 'award', icon: Award, label: 'Award' },
        { id: 'trophy', icon: Trophy, label: 'Trophy' },
        { id: 'lightning', icon: Zap, label: 'Lightning' },
        { id: 'fire', icon: Flame, label: 'Fire' },
        { id: 'puzzle', icon: Puzzle, label: 'Puzzle' },
        { id: 'compass', icon: Compass, label: 'Compass' },
      ]
    },
    {
      name: 'Cloud & DevOps',
      shapes: [
        { id: 'aws', icon: Cloud, label: 'AWS' },
        { id: 'azure', icon: CloudCog, label: 'Azure' },
        { id: 'gcp', icon: CloudLightning, label: 'GCP' },
        { id: 'docker', icon: Container, label: 'Docker' },
        { id: 'kubernetes', icon: Boxes, label: 'Kubernetes' },
        { id: 'terraform', icon: Blocks, label: 'Terraform' },
        { id: 'jenkins', icon: Cog, label: 'Jenkins' },
        { id: 'cicd', icon: Workflow, label: 'CI/CD' },
        { id: 'ansible', icon: Settings, label: 'Ansible' },
        { id: 'prometheus', icon: Activity, label: 'Prometheus' },
        { id: 'grafana', icon: BarChart3, label: 'Grafana' },
        { id: 'nginx', icon: Server, label: 'Nginx' },
        { id: 'redis', icon: Database, label: 'Redis' },
        { id: 'mongodb', icon: Database, label: 'MongoDB' },
        { id: 'postgresql', icon: Database, label: 'PostgreSQL' },
        { id: 'mysql', icon: Database, label: 'MySQL' },
        { id: 'elasticsearch', icon: Search, label: 'Elasticsearch' },
        { id: 'kafka', icon: Activity, label: 'Kafka' },
        { id: 'rabbitmq', icon: MessageSquare, label: 'RabbitMQ' },
        { id: 'vault', icon: Lock, label: 'Vault' },
        { id: 'consul', icon: Network, label: 'Consul' },
        { id: 'istio', icon: Workflow, label: 'Istio' },
        { id: 'helm', icon: Package, label: 'Helm' },
        { id: 'argocd', icon: RefreshCw, label: 'ArgoCD' },
      ]
    },
    {
      name: 'AWS Services',
      shapes: [
        { id: 'ec2', icon: Server, label: 'EC2' },
        { id: 's3bucket', icon: Package, label: 'S3' },
        { id: 'lambda', icon: Zap, label: 'Lambda' },
        { id: 'rds', icon: Database, label: 'RDS' },
        { id: 'dynamodb', icon: Table, label: 'DynamoDB' },
        { id: 'vpc', icon: Shield, label: 'VPC' },
        { id: 'apigateway', icon: Webhook, label: 'API Gateway' },
        { id: 'cloudwatch', icon: Gauge, label: 'CloudWatch' },
        { id: 'sns', icon: Bell, label: 'SNS' },
        { id: 'sqs', icon: MessageSquare, label: 'SQS' },
        { id: 'elasticache', icon: HardDrive, label: 'ElastiCache' },
        { id: 'cloudfront', icon: Globe, label: 'CloudFront' },
        { id: 'route53', icon: Router, label: 'Route 53' },
        { id: 'ecs', icon: Container, label: 'ECS' },
        { id: 'eks', icon: Boxes, label: 'EKS' },
        { id: 'fargate', icon: CloudLightning, label: 'Fargate' },
        { id: 'redshift', icon: Database, label: 'Redshift' },
        { id: 'kinesis', icon: Activity, label: 'Kinesis' },
        { id: 'stepfunction', icon: Workflow, label: 'Step Functions' },
        { id: 'cognitouser', icon: User, label: 'Cognito' },
        { id: 'iam', icon: Key, label: 'IAM' },
        { id: 'secretsmanager', icon: Lock, label: 'Secrets Manager' },
        { id: 'eventbridge', icon: Zap, label: 'EventBridge' },
        { id: 'amplify', icon: Smartphone, label: 'Amplify' },
        { id: 'athena', icon: Search, label: 'Athena' },
        { id: 'glue', icon: Workflow, label: 'Glue' },
        { id: 'emr', icon: Cpu, label: 'EMR' },
        { id: 'sagemaker', icon: Lightbulb, label: 'SageMaker' },
        { id: 'codepipeline', icon: Workflow, label: 'CodePipeline' },
        { id: 'codebuild', icon: Hammer, label: 'CodeBuild' },
        { id: 'codecommit', icon: GitCommit, label: 'CodeCommit' },
        { id: 'codedeploy', icon: Upload, label: 'CodeDeploy' },
        { id: 'elasticbeanstalk', icon: Layers, label: 'Elastic Beanstalk' },
        { id: 'lightsail', icon: Lightbulb, label: 'Lightsail' },
        { id: 'apprunner', icon: Play, label: 'App Runner' },
        { id: 'batch', icon: ListOrdered, label: 'Batch' },
      ]
    },
    {
      name: 'Azure Services',
      shapes: [
        { id: 'azurevm', icon: Server, label: 'Virtual Machine' },
        { id: 'azureblobstorage', icon: Package, label: 'Blob Storage' },
        { id: 'azurefunctions', icon: Zap, label: 'Functions' },
        { id: 'azuresql', icon: Database, label: 'SQL Database' },
        { id: 'cosmosdb', icon: Globe, label: 'Cosmos DB' },
        { id: 'azurevnet', icon: Shield, label: 'Virtual Network' },
        { id: 'azureapim', icon: Webhook, label: 'API Management' },
        { id: 'azuremonitor', icon: Gauge, label: 'Monitor' },
        { id: 'azureservicebus', icon: MessageSquare, label: 'Service Bus' },
        { id: 'azureeventhubs', icon: Activity, label: 'Event Hubs' },
        { id: 'azurecdn', icon: Globe, label: 'CDN' },
        { id: 'azuredns', icon: Router, label: 'DNS' },
        { id: 'aks', icon: Boxes, label: 'AKS' },
        { id: 'azurecontainerinstances', icon: Container, label: 'Container Instances' },
        { id: 'azuresynapse', icon: Database, label: 'Synapse' },
        { id: 'azuredatafactory', icon: Workflow, label: 'Data Factory' },
        { id: 'azuread', icon: User, label: 'Active Directory' },
        { id: 'azurekeyvault', icon: Key, label: 'Key Vault' },
        { id: 'azurelogicapps', icon: Workflow, label: 'Logic Apps' },
        { id: 'azuredevops', icon: GitBranch, label: 'DevOps' },
        { id: 'azureappservice', icon: Globe, label: 'App Service' },
        { id: 'azurefrontdoor', icon: Shield, label: 'Front Door' },
        { id: 'azureml', icon: Lightbulb, label: 'Machine Learning' },
        { id: 'azurecognitiveservices', icon: Cpu, label: 'Cognitive Services' },
        { id: 'azureiot', icon: Wifi, label: 'IoT Hub' },
        { id: 'azurenotificationhubs', icon: Bell, label: 'Notification Hubs' },
        { id: 'azuresignalr', icon: Radio, label: 'SignalR' },
        { id: 'azuremediaservices', icon: Play, label: 'Media Services' },
      ]
    },
    {
      name: 'Google Cloud',
      shapes: [
        { id: 'computeengine', icon: Server, label: 'Compute Engine' },
        { id: 'cloudstorage', icon: Package, label: 'Cloud Storage' },
        { id: 'cloudfunctions', icon: Zap, label: 'Cloud Functions' },
        { id: 'cloudsql', icon: Database, label: 'Cloud SQL' },
        { id: 'bigquery', icon: Table, label: 'BigQuery' },
        { id: 'gcpvpc', icon: Shield, label: 'VPC' },
        { id: 'apigee', icon: Webhook, label: 'Apigee' },
        { id: 'cloudmonitoring', icon: Gauge, label: 'Cloud Monitoring' },
        { id: 'pubsub', icon: MessageSquare, label: 'Pub/Sub' },
        { id: 'cloudcdn', icon: Globe, label: 'Cloud CDN' },
        { id: 'clouddns', icon: Router, label: 'Cloud DNS' },
        { id: 'gke', icon: Boxes, label: 'GKE' },
        { id: 'cloudrun', icon: Play, label: 'Cloud Run' },
        { id: 'dataflow', icon: Workflow, label: 'Dataflow' },
        { id: 'dataproc', icon: Cpu, label: 'Dataproc' },
        { id: 'gcpiam', icon: Key, label: 'IAM' },
        { id: 'secretmanager', icon: Lock, label: 'Secret Manager' },
        { id: 'cloudscheduler', icon: RefreshCw, label: 'Cloud Scheduler' },
        { id: 'cloudbuild', icon: Hammer, label: 'Cloud Build' },
        { id: 'cloudsourcerepos', icon: GitCommit, label: 'Source Repositories' },
        { id: 'appengine', icon: Globe, label: 'App Engine' },
        { id: 'firestore', icon: Database, label: 'Firestore' },
        { id: 'firebase', icon: Flame, label: 'Firebase' },
        { id: 'vertexai', icon: Lightbulb, label: 'Vertex AI' },
        { id: 'gcpiot', icon: Wifi, label: 'IoT Core' },
        { id: 'memorystore', icon: HardDrive, label: 'Memorystore' },
        { id: 'spanner', icon: Database, label: 'Spanner' },
        { id: 'bigtable', icon: Table, label: 'Bigtable' },
      ]
    },
    {
      name: 'Networking',
      shapes: [
        { id: 'loadbalancer', icon: Scale, label: 'Load Balancer' },
        { id: 'firewall', icon: Shield, label: 'Firewall' },
        { id: 'router', icon: Router, label: 'Router' },
        { id: 'switch', icon: Network, label: 'Switch' },
        { id: 'gateway', icon: Webhook, label: 'Gateway' },
        { id: 'dns', icon: Globe, label: 'DNS' },
        { id: 'cdn', icon: Globe, label: 'CDN' },
        { id: 'vpn', icon: Lock, label: 'VPN' },
        { id: 'proxy', icon: Shield, label: 'Proxy' },
        { id: 'nat', icon: ArrowLeftRight, label: 'NAT' },
        { id: 'waf', icon: Shield, label: 'WAF' },
        { id: 'ddos', icon: ShieldAlert, label: 'DDoS Protection' },
      ]
    },
    {
      name: 'Databases',
      shapes: [
        { id: 'sqldb', icon: Database, label: 'SQL Database' },
        { id: 'nosqldb', icon: Database, label: 'NoSQL Database' },
        { id: 'graphdb', icon: Network, label: 'Graph Database' },
        { id: 'timeseries', icon: LineChart, label: 'Time Series DB' },
        { id: 'cachedb', icon: HardDrive, label: 'Cache' },
        { id: 'datawarehouse', icon: Database, label: 'Data Warehouse' },
        { id: 'datalake', icon: Package, label: 'Data Lake' },
        { id: 'replication', icon: RefreshCw, label: 'Replication' },
        { id: 'sharding', icon: Boxes, label: 'Sharding' },
        { id: 'backup', icon: Save, label: 'Backup' },
      ]
    },
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0066FF', '#FFA500',
    '#FF69B4', '#00CED1', '#9400D3', '#FFD700', '#FFFFFF'
  ];

  const backgroundColors = [
    '#FFFFFF', '#FFE4E1', '#E8F5E9', '#E3F2FD', '#FFF9C4', '#F3E5F5', '#E0E0E0',
    '#1a1a2e', '#16213e', '#0f0f23'
  ];

  const darkBackgrounds = ['#1a1a2e', '#16213e', '#0f0f23'];

  const strokeWidths = [
    { label: 'S', value: 2 },
    { label: 'M', value: 5 },
    { label: 'L', value: 10 },
  ];

  // Save current canvas state for undo
  const saveToUndoStack = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-20), imageData]);
    setRedoStack([]);
  }, []);

  // Undo function
  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || undoStack.length === 0) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack(prev => [...prev, currentState]);

    const previousState = undoStack[undoStack.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setUndoStack(prev => prev.slice(0, -1));
  }, [undoStack]);

  // Redo function
  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || redoStack.length === 0) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, currentState]);

    const nextState = redoStack[redoStack.length - 1];
    ctx.putImageData(nextState, 0, 0);
    setRedoStack(prev => prev.slice(0, -1));
  }, [redoStack]);

  // Delete selected image
  const deleteSelectedImage = useCallback(() => {
    if (selectedImage) {
      setPlacedImages(prev => prev.filter(img => img.id !== selectedImage));
      setSelectedImage(null);
    }
  }, [selectedImage]);

  // Set stroke style on context
  const setContextStrokeStyle = useCallback((ctx: CanvasRenderingContext2D, style: 'solid' | 'dashed' | 'dotted') => {
    switch (style) {
      case 'dashed':
        ctx.setLineDash([10, 5]);
        break;
      case 'dotted':
        ctx.setLineDash([2, 4]);
        break;
      default:
        ctx.setLineDash([]);
    }
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, prevX: number, prevY: number, drawColor: string, drawWidth: number, drawOpacity: number = 100) => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = drawOpacity / 100;
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, []);

  // Map tool IDs to Lucide icon components for exact icon rendering
  const toolIconMap: Record<string, any> = {
    // Arrows
    'arrow': ArrowRight,
    'arrowup': ArrowUp,
    'arrowdown': ArrowDown,
    'arrowleft': MoveLeft,
    'diagonalur': ArrowUpRight,
    'diagonaldr': ArrowDownRight,
    'diagonalul': ArrowUpLeft,
    'diagonaldl': ArrowDownLeft,
    'cornerur': CornerUpRight,
    'cornerdr': CornerDownRight,
    'bidirectional': ArrowLeftRight,
    // System Design
    'server': Server,
    'storage': HardDrive,
    'firewall': Shield,
    'processor': Cpu,
    'client': Monitor,
    'desktop': Monitor,
    'mobile': Smartphone,
    'loadbalancer': Workflow,
    'messagequeue': MessageSquare,
    'internet': Globe,
    'layers': Layers,
    // Coding/Tech
    'terminal': Terminal,
    'codeblock': Code,
    'jsonobject': Braces,
    'function': Box,
    'gitcommit': GitCommit,
    'gitbranch': GitBranch,
    'gitmerge': GitMerge,
    'gitpr': GitPullRequest,
    'sourcefile': FileCode,
    'codefile': FileCode,
    'bug': Bug,
    'error': XOctagon,
    'warning': AlertTriangle,
    // Files & Folders
    'file': File,
    'textfile': FileText,
    'folder': Folder,
    'archive': FolderArchive,
    // Communication
    'email': Mail,
    'send': Send,
    'inbox': Inbox,
    'chat': MessageCircle,
    'discussion': MessageSquare,
    'phone': Phone,
    'share': Share2,
    // Devices
    'tablet': Tablet,
    'watch': Watch,
    'tv': Tv,
    'speaker': Speaker,
    'headphones': Headphones,
    'camera': Camera,
    'printer': Printer,
    // Security
    'lock': Lock,
    'unlock': Unlock,
    'key': Key,
    'apikey': KeyRound,
    'shield': Shield,
    'secured': ShieldCheck,
    'vulnerable': ShieldAlert,
    'biometric': Fingerprint,
    'visible': Eye,
    'hidden': EyeOff,
    // People
    'user': User,
    'actor': User,
    'usersgroup': UsersRound,
    'adduser': UserPlus,
    'verifieduser': UserCheck,
    'removeuser': UserX,
    'organization': Building,
    'company': Building2,
    // Status
    'successcircle': CheckCircle,
    'errorcircle': XCircle,
    'alertcircle': AlertCircle,
    'info': Info,
    'help': HelpCircle,
    'notification': Bell,
    'flag': Flag,
    // Actions
    'add': Plus,
    'remove': Minus,
    'check': Check,
    'close': X,
    'refresh': RefreshCw,
    'rotate': RotateCw,
    'download': Download,
    'upload': Upload,
    'search': Search,
    'settings': Settings,
    // Charts
    'barchart': BarChart3,
    'piechart': PieChart,
    'linechart': LineChart,
    'trendup': TrendingUp,
    'trenddown': TrendingDown,
    'activity': Activity,
    // Misc
    'idea': Lightbulb,
    'target': Target,
    'focus': Crosshair,
    'bookmark': Bookmark,
    'tag': Tag,
    'award': Award,
    'trophy': Trophy,
    'lightning': Zap,
    'fire': Flame,
    'puzzle': Puzzle,
    'compass': Compass,
    // Data Structures
    'array': Table,
    'stack': List,
    'queue': ListOrdered,
    'node': CircleDot,
    'pointer': ArrowRight,
    'treenode': TreePine,
    'hashtable': Hash,
    'graphnode': Network,
    'linkedlist': Link2,
    // UML
    'class': Box,
    'interface': Component,
    'package': Package,
    'lifeline': Minus,
    'activation': Square,
    // ER
    'entity': Square,
    'relationship': Diamond,
    'attribute': Circle,
    'primarykey': Key,
    'foreignkey': KeyRound,
    'table': Table,
    // Flowchart
    'callout': MessageSquare,
    'document': FileText,
    'database': Database,
    'cylinder': Database,
    'cloud': Cloud,
    // General
    'rectangle': Square,
    'circle': Circle,
    'triangle': Triangle,
    'diamond': Diamond,
    'hexagon': Hexagon,
    'star': Star,
    'heart': Heart,
    'pentagon': Pentagon,
    'octagon': Octagon,
    // Cloud & DevOps
    'aws': Cloud,
    'azure': CloudCog,
    'gcp': CloudLightning,
    'docker': Container,
    'kubernetes': Boxes,
    'terraform': Blocks,
    'jenkins': Cog,
    'cicd': Workflow,
    'lambda': Zap,
    's3bucket': Package,
    'ec2': Server,
    'rds': Database,
    'vpc': Shield,
    'apigateway': Webhook,
    'cloudwatch': Gauge,
    'sns': Bell,
    'sqs': MessageSquare,
    'elasticache': HardDrive,
    'cloudfront': Globe,
    'route53': Router,
    'ecs': Container,
    'eks': Boxes,
    'fargate': CloudLightning,
    'dynamodb': Table,
    'redshift': Database,
    'kinesis': Activity,
    'stepfunction': Workflow,
    'cognitouser': User,
    'iam': Key,
    // Extended Cloud & DevOps
    'ansible': Settings,
    'prometheus': Activity,
    'grafana': BarChart3,
    'nginx': Server,
    'redis': Database,
    'mongodb': Database,
    'postgresql': Database,
    'mysql': Database,
    'elasticsearch': Search,
    'kafka': Activity,
    'rabbitmq': MessageSquare,
    'vault': Lock,
    'consul': Network,
    'istio': Workflow,
    'helm': Package,
    'argocd': RefreshCw,
    // Extended AWS
    'secretsmanager': Lock,
    'eventbridge': Zap,
    'amplify': Smartphone,
    'athena': Search,
    'glue': Workflow,
    'emr': Cpu,
    'sagemaker': Lightbulb,
    'codepipeline': Workflow,
    'codebuild': Hammer,
    'codecommit': GitCommit,
    'codedeploy': Upload,
    'elasticbeanstalk': Layers,
    'lightsail': Lightbulb,
    'apprunner': Play,
    'batch': ListOrdered,
    // Azure Services
    'azurevm': Server,
    'azureblobstorage': Package,
    'azurefunctions': Zap,
    'azuresql': Database,
    'cosmosdb': Globe,
    'azurevnet': Shield,
    'azureapim': Webhook,
    'azuremonitor': Gauge,
    'azureservicebus': MessageSquare,
    'azureeventhubs': Activity,
    'azurecdn': Globe,
    'azuredns': Router,
    'aks': Boxes,
    'azurecontainerinstances': Container,
    'azuresynapse': Database,
    'azuredatafactory': Workflow,
    'azuread': User,
    'azurekeyvault': Key,
    'azurelogicapps': Workflow,
    'azuredevops': GitBranch,
    'azureappservice': Globe,
    'azurefrontdoor': Shield,
    'azureml': Lightbulb,
    'azurecognitiveservices': Cpu,
    'azureiot': Wifi,
    'azurenotificationhubs': Bell,
    'azuresignalr': Radio,
    'azuremediaservices': Play,
    // Google Cloud
    'computeengine': Server,
    'cloudstorage': Package,
    'cloudfunctions': Zap,
    'cloudsql': Database,
    'bigquery': Table,
    'gcpvpc': Shield,
    'apigee': Webhook,
    'cloudmonitoring': Gauge,
    'pubsub': MessageSquare,
    'cloudcdn': Globe,
    'clouddns': Router,
    'gke': Boxes,
    'cloudrun': Play,
    'dataflow': Workflow,
    'dataproc': Cpu,
    'gcpiam': Key,
    'secretmanager': Lock,
    'cloudscheduler': RefreshCw,
    'cloudbuild': Hammer,
    'cloudsourcerepos': GitCommit,
    'appengine': Globe,
    'firestore': Database,
    'firebase': Flame,
    'vertexai': Lightbulb,
    'gcpiot': Wifi,
    'memorystore': HardDrive,
    'spanner': Database,
    'bigtable': Table,
    // Networking
    'switch': Network,
    'gateway': Webhook,
    'dns': Globe,
    'cdn': Globe,
    'vpn': Lock,
    'proxy': Shield,
    'nat': ArrowLeftRight,
    'waf': Shield,
    'ddos': ShieldAlert,
    // Databases
    'sqldb': Database,
    'nosqldb': Database,
    'graphdb': Network,
    'timeseries': LineChart,
    'cachedb': HardDrive,
    'datawarehouse': Database,
    'datalake': Package,
    'replication': RefreshCw,
    'sharding': Boxes,
    'backup': Save,
  };

  // Render Lucide icon to canvas - exact copy of sidebar icon
  const renderIconToCanvas = useCallback((
    ctx: CanvasRenderingContext2D,
    IconComponent: any,
    x: number,
    y: number,
    width: number,
    height: number,
    strokeColor: string,
    fillColor: string | null,
    strokeWidth: number,
    opacity: number
  ) => {
    return new Promise<void>((resolve) => {
      const size = Math.min(Math.abs(width), Math.abs(height));
      const actualX = width < 0 ? x + width : x;
      const actualY = height < 0 ? y + height : y;
      
      // Create SVG string from Lucide icon
      const svgString = renderToStaticMarkup(
        createElement(IconComponent, {
          size: size,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          fill: fillColor || 'none',
        })
      );
      
      // Create a blob URL from the SVG
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const img = new Image();
      img.onload = () => {
        ctx.globalAlpha = opacity / 100;
        ctx.drawImage(img, actualX, actualY, Math.abs(width), Math.abs(height));
        ctx.globalAlpha = 1;
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      img.src = url;
    });
  }, []);

  // Synchronous version for preview - draws placeholder then updates
  const renderIconToCanvasSync = useCallback((
    ctx: CanvasRenderingContext2D,
    toolType: string,
    x: number,
    y: number,
    width: number,
    height: number,
    strokeColor: string,
    fillColor: string | null,
    strokeWidth: number,
    opacity: number
  ) => {
    const IconComponent = toolIconMap[toolType];
    if (!IconComponent) return;
    
    const size = Math.min(Math.abs(width), Math.abs(height));
    const actualX = width < 0 ? x + width : x;
    const actualY = height < 0 ? y + height : y;
    const cacheKey = `${toolType}-${strokeColor}-${fillColor}-${strokeWidth}`;
    
    // Check cache first
    const cachedImg = iconImageCache.current.get(cacheKey);
    if (cachedImg && cachedImg.complete) {
      ctx.globalAlpha = opacity / 100;
      ctx.drawImage(cachedImg, actualX, actualY, Math.abs(width), Math.abs(height));
      ctx.globalAlpha = 1;
      return;
    }
    
    // Create and cache the image
    const svgString = renderToStaticMarkup(
      createElement(IconComponent, {
        size: 48,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        fill: fillColor || 'none',
      })
    );
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = () => {
      iconImageCache.current.set(cacheKey, img);
      ctx.globalAlpha = opacity / 100;
      ctx.drawImage(img, actualX, actualY, Math.abs(width), Math.abs(height));
      ctx.globalAlpha = 1;
      URL.revokeObjectURL(url);
    };
    img.src = url;
    
    // Draw temporary bounding box while loading
    ctx.globalAlpha = opacity / 100;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(actualX, actualY, Math.abs(width), Math.abs(height));
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }, []);

  // Draw shape on canvas
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: ShapeData) => {
    const { type, startX, startY, endX, endY, color: shapeColor, lineWidth: shapeWidth, strokeStyle: shapeStroke, opacity: shapeOpacity, fill: shapeFill, fillColor, techLogoId } = shape;

    const width = endX - startX;
    const height = endY - startY;
    const centerX = startX + width / 2;
    const centerY = startY + height / 2;

    ctx.globalAlpha = shapeOpacity / 100;

    // Handle tech logos from Simple Icons
    if (techLogoId && techLogoMap[techLogoId]) {
      const techLogo = techLogoMap[techLogoId];
      const IconComponent = techLogo.icon;
      const logoColor = techLogo.color;
      
      const size = Math.min(Math.abs(width), Math.abs(height));
      const actualX = width < 0 ? startX + width : startX;
      const actualY = height < 0 ? startY + height : startY;
      const cacheKey = `techlogo-${techLogoId}-${logoColor}-${size}`;
      
      // Check cache first
      const cachedImg = iconImageCache.current.get(cacheKey);
      if (cachedImg && cachedImg.complete) {
        ctx.globalAlpha = shapeOpacity / 100;
        ctx.drawImage(cachedImg, actualX, actualY, Math.abs(width), Math.abs(height));
        ctx.globalAlpha = 1;
        return;
      }
      
      // Create SVG string from Simple Icon - Simple Icons use 'fill' not 'stroke'
      const svgString = renderToStaticMarkup(
        createElement(IconComponent, {
          size: size,
          color: logoColor,
        })
      );
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const img = new Image();
      img.onload = () => {
        iconImageCache.current.set(cacheKey, img);
        ctx.globalAlpha = shapeOpacity / 100;
        ctx.drawImage(img, actualX, actualY, Math.abs(width), Math.abs(height));
        ctx.globalAlpha = 1;
        URL.revokeObjectURL(url);
      };
      img.src = url;
      
      // Draw temporary placeholder while loading
      ctx.globalAlpha = shapeOpacity / 100;
      ctx.strokeStyle = logoColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(actualX, actualY, Math.abs(width), Math.abs(height));
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      return;
    }

    // Basic geometric shapes that should use precise canvas drawing instead of icons
    const basicGeometricShapes = [
      'rectangle', 'circle', 'triangle', 'diamond', 'hexagon', 'pentagon', 
      'star', 'line', 'arrow', 'parallelogram', 'rounded-rectangle'
    ];

    // Use exact Lucide icon rendering for icon-based shapes (excluding basic geometry)
    if (toolIconMap[type] && !basicGeometricShapes.includes(type)) {
      renderIconToCanvasSync(
        ctx, 
        type, 
        startX, 
        startY, 
        Math.abs(width), 
        Math.abs(height), 
        shapeColor, 
        shapeFill ? (fillColor || shapeColor) : null, 
        shapeWidth, 
        shapeOpacity
      );
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
      return;
    }

    // Fallback to manual drawing for basic geometric shapes
    ctx.beginPath();
    ctx.strokeStyle = shapeColor;
    ctx.lineWidth = shapeWidth;
    setContextStrokeStyle(ctx, shapeStroke);

    switch (type) {
      case 'rectangle':
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, height);
        }
        ctx.strokeRect(startX, startY, width, height);
        break;
      case 'circle': {
        const radiusX = Math.abs(width) / 2;
        const radiusY = Math.abs(height) / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'triangle': {
        ctx.moveTo(centerX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX, endY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'star': {
        const outerRadius = Math.min(Math.abs(width), Math.abs(height)) / 2;
        const innerRadius = outerRadius * 0.4;
        const spikes = 5;
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        
        ctx.moveTo(centerX, centerY - outerRadius);
        for (let i = 0; i < spikes; i++) {
          ctx.lineTo(centerX + Math.cos(rot) * outerRadius, centerY + Math.sin(rot) * outerRadius);
          rot += step;
          ctx.lineTo(centerX + Math.cos(rot) * innerRadius, centerY + Math.sin(rot) * innerRadius);
          rot += step;
        }
        ctx.lineTo(centerX, centerY - outerRadius);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'heart': {
        const size = Math.min(Math.abs(width), Math.abs(height)) / 2;
        ctx.moveTo(centerX, centerY + size * 0.5);
        ctx.bezierCurveTo(centerX - size, centerY - size * 0.5, centerX - size * 1.5, centerY + size * 0.5, centerX, centerY + size);
        ctx.bezierCurveTo(centerX + size * 1.5, centerY + size * 0.5, centerX + size, centerY - size * 0.5, centerX, centerY + size * 0.5);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'line':
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
      case 'arrow': {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = 15;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      }
      case 'diamond': {
        ctx.moveTo(centerX, startY);
        ctx.lineTo(endX, centerY);
        ctx.lineTo(centerX, endY);
        ctx.lineTo(startX, centerY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'hexagon': {
        const size = Math.min(Math.abs(width), Math.abs(height)) / 2;
        for (let i = 0; i < 6; i++) {
          const angleDeg = 60 * i - 30;
          const angleRad = (Math.PI / 180) * angleDeg;
          const px = centerX + size * Math.cos(angleRad);
          const py = centerY + size * Math.sin(angleRad);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'parallelogram': {
        const offset = width * 0.2;
        ctx.moveTo(startX + offset, startY);
        ctx.lineTo(endX, startY);
        ctx.lineTo(endX - offset, endY);
        ctx.lineTo(startX, endY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'cylinder': {
        const ellipseHeight = Math.abs(height) * 0.15;
        // Top ellipse
        ctx.ellipse(centerX, startY + ellipseHeight, Math.abs(width) / 2, ellipseHeight, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Body
        ctx.beginPath();
        ctx.moveTo(startX, startY + ellipseHeight);
        ctx.lineTo(startX, endY - ellipseHeight);
        ctx.ellipse(centerX, endY - ellipseHeight, Math.abs(width) / 2, ellipseHeight, 0, Math.PI, 0, true);
        ctx.lineTo(endX, startY + ellipseHeight);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'cloud': {
        const w = Math.abs(width);
        const h = Math.abs(height);
        ctx.moveTo(startX + w * 0.25, startY + h * 0.5);
        ctx.bezierCurveTo(startX, startY + h * 0.5, startX, startY, startX + w * 0.35, startY + h * 0.15);
        ctx.bezierCurveTo(startX + w * 0.35, startY - h * 0.1, startX + w * 0.65, startY - h * 0.1, startX + w * 0.65, startY + h * 0.15);
        ctx.bezierCurveTo(startX + w, startY, startX + w, startY + h * 0.5, startX + w * 0.75, startY + h * 0.5);
        ctx.bezierCurveTo(startX + w, startY + h * 0.7, startX + w * 0.8, startY + h, startX + w * 0.5, startY + h * 0.85);
        ctx.bezierCurveTo(startX + w * 0.2, startY + h, startX, startY + h * 0.7, startX + w * 0.25, startY + h * 0.5);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'pentagon': {
        const size = Math.min(Math.abs(width), Math.abs(height)) / 2;
        for (let i = 0; i < 5; i++) {
          const angleDeg = 72 * i - 90;
          const angleRad = (Math.PI / 180) * angleDeg;
          const px = centerX + size * Math.cos(angleRad);
          const py = centerY + size * Math.sin(angleRad);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'octagon': {
        const size = Math.min(Math.abs(width), Math.abs(height)) / 2;
        for (let i = 0; i < 8; i++) {
          const angleDeg = 45 * i - 22.5;
          const angleRad = (Math.PI / 180) * angleDeg;
          const px = centerX + size * Math.cos(angleRad);
          const py = centerY + size * Math.sin(angleRad);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'callout': {
        // Speech bubble callout shape
        const tailSize = height * 0.2;
        ctx.moveTo(startX + 10, startY);
        ctx.lineTo(endX - 10, startY);
        ctx.quadraticCurveTo(endX, startY, endX, startY + 10);
        ctx.lineTo(endX, endY - tailSize - 10);
        ctx.quadraticCurveTo(endX, endY - tailSize, endX - 10, endY - tailSize);
        ctx.lineTo(startX + width * 0.3, endY - tailSize);
        ctx.lineTo(startX + width * 0.2, endY);
        ctx.lineTo(startX + width * 0.15, endY - tailSize);
        ctx.lineTo(startX + 10, endY - tailSize);
        ctx.quadraticCurveTo(startX, endY - tailSize, startX, endY - tailSize - 10);
        ctx.lineTo(startX, startY + 10);
        ctx.quadraticCurveTo(startX, startY, startX + 10, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'document': {
        // Document with wavy bottom
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, startY);
        ctx.lineTo(endX, endY - height * 0.1);
        // Wavy bottom
        ctx.bezierCurveTo(
          endX - width * 0.25, endY - height * 0.2,
          startX + width * 0.25, endY + height * 0.1,
          startX, endY - height * 0.1
        );
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'database':
      case 'process':
      case 'decision': {
        // Same as cylinder for database-like shapes
        const ellipseH = Math.abs(height) * 0.15;
        ctx.ellipse(centerX, startY + ellipseH, Math.abs(width) / 2, ellipseH, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(startX, startY + ellipseH);
        ctx.lineTo(startX, endY - ellipseH);
        ctx.ellipse(centerX, endY - ellipseH, Math.abs(width) / 2, ellipseH, 0, Math.PI, 0, true);
        ctx.lineTo(endX, startY + ellipseH);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'connector': {
        // Elbow connector - horizontal then vertical or vertical then horizontal
        const midX = startX + width / 2;
        const midY = startY + height / 2;
        
        // Determine best path based on direction
        if (Math.abs(width) > Math.abs(height)) {
          // Go horizontal first, then vertical
          ctx.moveTo(startX, startY);
          ctx.lineTo(midX, startY);
          ctx.lineTo(midX, endY);
          ctx.lineTo(endX, endY);
        } else {
          // Go vertical first, then horizontal
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX, midY);
          ctx.lineTo(endX, midY);
          ctx.lineTo(endX, endY);
        }
        ctx.stroke();
        
        // Add small circles at endpoints
        ctx.beginPath();
        ctx.arc(startX, startY, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(endX, endY, 4, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      // ===== ARROW SHAPES =====
      case 'bidirectional': {
        const headLen = 15;
        const angle1 = Math.atan2(endY - startY, endX - startX);
        const angle2 = Math.atan2(startY - endY, startX - endX);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        // Arrow head at end
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen * Math.cos(angle1 - Math.PI / 6), endY - headLen * Math.sin(angle1 - Math.PI / 6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen * Math.cos(angle1 + Math.PI / 6), endY - headLen * Math.sin(angle1 + Math.PI / 6));
        ctx.stroke();
        // Arrow head at start
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX - headLen * Math.cos(angle2 - Math.PI / 6), startY - headLen * Math.sin(angle2 - Math.PI / 6));
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX - headLen * Math.cos(angle2 + Math.PI / 6), startY - headLen * Math.sin(angle2 + Math.PI / 6));
        ctx.stroke();
        break;
      }
      case 'arrowup': {
        const headLen = 15;
        ctx.moveTo(centerX, endY);
        ctx.lineTo(centerX, startY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX, startY);
        ctx.lineTo(centerX - headLen, startY + headLen);
        ctx.moveTo(centerX, startY);
        ctx.lineTo(centerX + headLen, startY + headLen);
        ctx.stroke();
        break;
      }
      case 'arrowdown': {
        const headLen = 15;
        ctx.moveTo(centerX, startY);
        ctx.lineTo(centerX, endY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX, endY);
        ctx.lineTo(centerX - headLen, endY - headLen);
        ctx.moveTo(centerX, endY);
        ctx.lineTo(centerX + headLen, endY - headLen);
        ctx.stroke();
        break;
      }
      case 'arrowleft': {
        const headLen = 15;
        ctx.moveTo(endX, centerY);
        ctx.lineTo(startX, centerY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(startX, centerY);
        ctx.lineTo(startX + headLen, centerY - headLen);
        ctx.moveTo(startX, centerY);
        ctx.lineTo(startX + headLen, centerY + headLen);
        ctx.stroke();
        break;
      }
      case 'diagonalur': {
        const headLen = 15;
        ctx.moveTo(startX, endY);
        ctx.lineTo(endX, startY);
        ctx.stroke();
        const angle = Math.atan2(startY - endY, endX - startX);
        ctx.beginPath();
        ctx.moveTo(endX, startY);
        ctx.lineTo(endX - headLen * Math.cos(angle - Math.PI / 6), startY + headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endX, startY);
        ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), startY + headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      }
      case 'diagonaldr': {
        const headLen = 15;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        const angle = Math.atan2(endY - startY, endX - startX);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      }
      case 'diagonalul': {
        const headLen = 15;
        ctx.moveTo(endX, endY);
        ctx.lineTo(startX, startY);
        ctx.stroke();
        const angle = Math.atan2(startY - endY, startX - endX);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX - headLen * Math.cos(angle - Math.PI / 6), startY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX - headLen * Math.cos(angle + Math.PI / 6), startY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      }
      case 'diagonaldl': {
        const headLen = 15;
        ctx.moveTo(endX, startY);
        ctx.lineTo(startX, endY);
        ctx.stroke();
        const angle = Math.atan2(endY - startY, startX - endX);
        ctx.beginPath();
        ctx.moveTo(startX, endY);
        ctx.lineTo(startX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(startX, endY);
        ctx.lineTo(startX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      }
      case 'cornerur': {
        const headLen = 12;
        ctx.moveTo(startX, endY);
        ctx.lineTo(startX, startY);
        ctx.lineTo(endX, startY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(endX, startY);
        ctx.lineTo(endX - headLen, startY - headLen / 2);
        ctx.moveTo(endX, startY);
        ctx.lineTo(endX - headLen, startY + headLen / 2);
        ctx.stroke();
        break;
      }
      case 'cornerdr': {
        const headLen = 12;
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, endY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen, endY - headLen / 2);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen, endY + headLen / 2);
        ctx.stroke();
        break;
      }
      // ===== SERVER & SYSTEM DESIGN =====
      case 'server': {
        // Server rack shape
        const slotHeight = height / 4;
        // Main body
        ctx.strokeRect(startX, startY, width, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, height);
        }
        // Horizontal slots
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(startX, startY + slotHeight * i);
          ctx.lineTo(endX, startY + slotHeight * i);
          ctx.stroke();
        }
        // LED indicators
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(endX - 10, startY + slotHeight * i + slotHeight / 2, 3, 0, 2 * Math.PI);
          ctx.fillStyle = '#00ff00';
          ctx.fill();
        }
        break;
      }
      case 'storage': {
        // Hard drive shape
        const cornerR = 8;
        ctx.beginPath();
        ctx.moveTo(startX + cornerR, startY);
        ctx.lineTo(endX - cornerR, startY);
        ctx.quadraticCurveTo(endX, startY, endX, startY + cornerR);
        ctx.lineTo(endX, endY - cornerR);
        ctx.quadraticCurveTo(endX, endY, endX - cornerR, endY);
        ctx.lineTo(startX + cornerR, endY);
        ctx.quadraticCurveTo(startX, endY, startX, endY - cornerR);
        ctx.lineTo(startX, startY + cornerR);
        ctx.quadraticCurveTo(startX, startY, startX + cornerR, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Disk circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(width, height) * 0.3, 0, 2 * Math.PI);
        ctx.stroke();
        // Center hole
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(width, height) * 0.1, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'firewall': {
        // Shield with lines
        const shieldH = height * 0.9;
        ctx.moveTo(centerX, startY);
        ctx.quadraticCurveTo(endX, startY, endX, startY + shieldH * 0.3);
        ctx.quadraticCurveTo(endX, startY + shieldH * 0.8, centerX, endY);
        ctx.quadraticCurveTo(startX, startY + shieldH * 0.8, startX, startY + shieldH * 0.3);
        ctx.quadraticCurveTo(startX, startY, centerX, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Brick pattern
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.2, startY + height * 0.3);
        ctx.lineTo(endX - width * 0.2, startY + height * 0.3);
        ctx.moveTo(startX + width * 0.2, startY + height * 0.5);
        ctx.lineTo(endX - width * 0.2, startY + height * 0.5);
        ctx.stroke();
        break;
      }
      case 'processor': {
        // CPU chip shape
        const padding = Math.min(width, height) * 0.15;
        ctx.strokeRect(startX + padding, startY + padding, width - padding * 2, height - padding * 2);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX + padding, startY + padding, width - padding * 2, height - padding * 2);
        }
        // Pins
        const pinCount = 4;
        const pinLen = padding * 0.8;
        for (let i = 0; i < pinCount; i++) {
          const pos = (i + 0.5) * (width - padding * 2) / pinCount + startX + padding;
          // Top pins
          ctx.beginPath();
          ctx.moveTo(pos, startY + padding);
          ctx.lineTo(pos, startY + padding - pinLen);
          ctx.stroke();
          // Bottom pins
          ctx.beginPath();
          ctx.moveTo(pos, endY - padding);
          ctx.lineTo(pos, endY - padding + pinLen);
          ctx.stroke();
        }
        for (let i = 0; i < pinCount; i++) {
          const pos = (i + 0.5) * (height - padding * 2) / pinCount + startY + padding;
          // Left pins
          ctx.beginPath();
          ctx.moveTo(startX + padding, pos);
          ctx.lineTo(startX + padding - pinLen, pos);
          ctx.stroke();
          // Right pins
          ctx.beginPath();
          ctx.moveTo(endX - padding, pos);
          ctx.lineTo(endX - padding + pinLen, pos);
          ctx.stroke();
        }
        break;
      }
      case 'client':
      case 'desktop': {
        // Monitor shape
        const screenH = height * 0.7;
        const standH = height * 0.15;
        const baseH = height * 0.15;
        // Screen
        ctx.strokeRect(startX, startY, width, screenH);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, screenH);
        }
        // Stand
        ctx.beginPath();
        ctx.moveTo(centerX - width * 0.1, startY + screenH);
        ctx.lineTo(centerX - width * 0.1, startY + screenH + standH);
        ctx.lineTo(centerX + width * 0.1, startY + screenH + standH);
        ctx.lineTo(centerX + width * 0.1, startY + screenH);
        ctx.stroke();
        // Base
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.2, endY - baseH);
        ctx.lineTo(endX - width * 0.2, endY - baseH);
        ctx.lineTo(endX - width * 0.15, endY);
        ctx.lineTo(startX + width * 0.15, endY);
        ctx.closePath();
        ctx.stroke();
        break;
      }
      case 'mobile': {
        // Smartphone shape
        const cornerR = Math.min(width, height) * 0.1;
        ctx.beginPath();
        ctx.moveTo(startX + cornerR, startY);
        ctx.lineTo(endX - cornerR, startY);
        ctx.quadraticCurveTo(endX, startY, endX, startY + cornerR);
        ctx.lineTo(endX, endY - cornerR);
        ctx.quadraticCurveTo(endX, endY, endX - cornerR, endY);
        ctx.lineTo(startX + cornerR, endY);
        ctx.quadraticCurveTo(startX, endY, startX, endY - cornerR);
        ctx.lineTo(startX, startY + cornerR);
        ctx.quadraticCurveTo(startX, startY, startX + cornerR, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Screen
        ctx.strokeRect(startX + width * 0.1, startY + height * 0.1, width * 0.8, height * 0.75);
        // Home button
        ctx.beginPath();
        ctx.arc(centerX, endY - height * 0.07, Math.min(width, height) * 0.05, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'loadbalancer': {
        // Load balancer - box with arrows
        ctx.strokeRect(startX, startY, width, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, height);
        }
        // Incoming arrow
        ctx.beginPath();
        ctx.moveTo(startX - 10, centerY);
        ctx.lineTo(startX + width * 0.2, centerY);
        ctx.stroke();
        // Outgoing arrows
        ctx.beginPath();
        ctx.moveTo(endX - width * 0.2, startY + height * 0.25);
        ctx.lineTo(endX + 10, startY + height * 0.25);
        ctx.moveTo(endX - width * 0.2, centerY);
        ctx.lineTo(endX + 10, centerY);
        ctx.moveTo(endX - width * 0.2, endY - height * 0.25);
        ctx.lineTo(endX + 10, endY - height * 0.25);
        ctx.stroke();
        break;
      }
      case 'messagequeue': {
        // Queue shape - stacked rectangles
        const boxH = height / 3;
        for (let i = 0; i < 3; i++) {
          ctx.strokeRect(startX + i * 3, startY + boxH * i + i * 2, width - i * 6, boxH - 4);
          if (shapeFill) {
            ctx.fillStyle = fillColor || shapeColor;
            ctx.fillRect(startX + i * 3, startY + boxH * i + i * 2, width - i * 6, boxH - 4);
          }
        }
        break;
      }
      // ===== CODING/TECH SHAPES =====
      case 'terminal': {
        // Terminal window
        const titleH = height * 0.15;
        ctx.strokeRect(startX, startY, width, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, height);
        }
        // Title bar
        ctx.beginPath();
        ctx.moveTo(startX, startY + titleH);
        ctx.lineTo(endX, startY + titleH);
        ctx.stroke();
        // Prompt >_
        ctx.font = `${Math.min(width, height) * 0.25}px monospace`;
        ctx.fillStyle = shapeColor;
        ctx.fillText('>_', startX + width * 0.1, startY + titleH + height * 0.4);
        break;
      }
      case 'codeblock': {
        // Code block with brackets
        ctx.strokeRect(startX, startY, width, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, height);
        }
        // Code lines
        const lineH = height * 0.15;
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.1, startY + lineH);
        ctx.lineTo(startX + width * 0.6, startY + lineH);
        ctx.moveTo(startX + width * 0.15, startY + lineH * 2);
        ctx.lineTo(startX + width * 0.7, startY + lineH * 2);
        ctx.moveTo(startX + width * 0.15, startY + lineH * 3);
        ctx.lineTo(startX + width * 0.5, startY + lineH * 3);
        ctx.moveTo(startX + width * 0.1, startY + lineH * 4);
        ctx.lineTo(startX + width * 0.8, startY + lineH * 4);
        ctx.stroke();
        break;
      }
      case 'jsonobject': {
        // JSON braces shape
        const braceW = width * 0.2;
        // Left brace {
        ctx.beginPath();
        ctx.moveTo(startX + braceW, startY);
        ctx.quadraticCurveTo(startX, startY, startX, startY + height * 0.25);
        ctx.lineTo(startX, centerY - height * 0.1);
        ctx.quadraticCurveTo(startX - braceW * 0.3, centerY, startX, centerY + height * 0.1);
        ctx.lineTo(startX, endY - height * 0.25);
        ctx.quadraticCurveTo(startX, endY, startX + braceW, endY);
        ctx.stroke();
        // Right brace }
        ctx.beginPath();
        ctx.moveTo(endX - braceW, startY);
        ctx.quadraticCurveTo(endX, startY, endX, startY + height * 0.25);
        ctx.lineTo(endX, centerY - height * 0.1);
        ctx.quadraticCurveTo(endX + braceW * 0.3, centerY, endX, centerY + height * 0.1);
        ctx.lineTo(endX, endY - height * 0.25);
        ctx.quadraticCurveTo(endX, endY, endX - braceW, endY);
        ctx.stroke();
        break;
      }
      case 'function': {
        // Function box with f(x)
        const cornerR = 8;
        ctx.beginPath();
        ctx.moveTo(startX + cornerR, startY);
        ctx.lineTo(endX - cornerR, startY);
        ctx.quadraticCurveTo(endX, startY, endX, startY + cornerR);
        ctx.lineTo(endX, endY - cornerR);
        ctx.quadraticCurveTo(endX, endY, endX - cornerR, endY);
        ctx.lineTo(startX + cornerR, endY);
        ctx.quadraticCurveTo(startX, endY, startX, endY - cornerR);
        ctx.lineTo(startX, startY + cornerR);
        ctx.quadraticCurveTo(startX, startY, startX + cornerR, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // f(x) text
        ctx.font = `${Math.min(width, height) * 0.3}px serif`;
        ctx.fillStyle = shapeColor;
        ctx.textAlign = 'center';
        ctx.fillText('f(x)', centerX, centerY + height * 0.1);
        ctx.textAlign = 'left';
        break;
      }
      case 'gitcommit': {
        // Git commit - circle with dot
        const radius = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
        ctx.fillStyle = shapeColor;
        ctx.fill();
        break;
      }
      case 'gitbranch': {
        // Git branch - line with branches
        ctx.beginPath();
        ctx.moveTo(centerX, endY);
        ctx.lineTo(centerX, startY + height * 0.3);
        ctx.stroke();
        // Main branch dot
        ctx.beginPath();
        ctx.arc(centerX, endY - height * 0.1, 5, 0, 2 * Math.PI);
        ctx.fill();
        // Branch line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.quadraticCurveTo(centerX + width * 0.3, centerY - height * 0.1, endX - width * 0.2, startY + height * 0.3);
        ctx.stroke();
        // Branch dot
        ctx.beginPath();
        ctx.arc(endX - width * 0.2, startY + height * 0.3, 5, 0, 2 * Math.PI);
        ctx.fill();
        // Top dot
        ctx.beginPath();
        ctx.arc(centerX, startY + height * 0.2, 5, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      case 'gitmerge': {
        // Git merge - converging lines
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.2, startY);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(centerX, endY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(endX - width * 0.2, startY);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
        // Dots
        ctx.beginPath();
        ctx.arc(startX + width * 0.2, startY + 5, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(endX - width * 0.2, startY + 5, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX, endY - 5, 5, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      case 'gitpr': {
        // Git PR - two branches with arrow
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.3, startY);
        ctx.lineTo(startX + width * 0.3, endY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(endX - width * 0.3, startY);
        ctx.lineTo(endX - width * 0.3, endY);
        ctx.stroke();
        // Curved arrow
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.3, centerY);
        ctx.quadraticCurveTo(centerX, centerY - height * 0.2, endX - width * 0.3, centerY);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(endX - width * 0.3, centerY);
        ctx.lineTo(endX - width * 0.4, centerY - 8);
        ctx.moveTo(endX - width * 0.3, centerY);
        ctx.lineTo(endX - width * 0.4, centerY + 8);
        ctx.stroke();
        break;
      }
      case 'sourcefile':
      case 'codefile': {
        // Source file with folded corner
        const fold = Math.min(width, height) * 0.2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX - fold, startY);
        ctx.lineTo(endX, startY + fold);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX, endY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Fold
        ctx.beginPath();
        ctx.moveTo(endX - fold, startY);
        ctx.lineTo(endX - fold, startY + fold);
        ctx.lineTo(endX, startY + fold);
        ctx.stroke();
        // Code brackets
        ctx.font = `${Math.min(width, height) * 0.25}px monospace`;
        ctx.fillStyle = shapeColor;
        ctx.textAlign = 'center';
        ctx.fillText('</>', centerX, centerY + height * 0.15);
        ctx.textAlign = 'left';
        break;
      }
      case 'bug': {
        // Bug icon - oval with legs
        const bugW = width * 0.6;
        const bugH = height * 0.5;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, bugW / 2, bugH / 2, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Legs
        ctx.beginPath();
        // Left legs
        ctx.moveTo(centerX - bugW / 2, centerY - bugH * 0.2);
        ctx.lineTo(startX, startY + height * 0.2);
        ctx.moveTo(centerX - bugW / 2, centerY);
        ctx.lineTo(startX, centerY);
        ctx.moveTo(centerX - bugW / 2, centerY + bugH * 0.2);
        ctx.lineTo(startX, endY - height * 0.2);
        // Right legs
        ctx.moveTo(centerX + bugW / 2, centerY - bugH * 0.2);
        ctx.lineTo(endX, startY + height * 0.2);
        ctx.moveTo(centerX + bugW / 2, centerY);
        ctx.lineTo(endX, centerY);
        ctx.moveTo(centerX + bugW / 2, centerY + bugH * 0.2);
        ctx.lineTo(endX, endY - height * 0.2);
        ctx.stroke();
        // Antennae
        ctx.beginPath();
        ctx.moveTo(centerX - bugW * 0.2, centerY - bugH / 2);
        ctx.lineTo(centerX - bugW * 0.3, startY);
        ctx.moveTo(centerX + bugW * 0.2, centerY - bugH / 2);
        ctx.lineTo(centerX + bugW * 0.3, startY);
        ctx.stroke();
        break;
      }
      case 'error': {
        // Octagon stop sign
        const sz = Math.min(width, height) * 0.45;
        for (let i = 0; i < 8; i++) {
          const angleDeg = 45 * i - 22.5;
          const angleRad = (Math.PI / 180) * angleDeg;
          const px = centerX + sz * Math.cos(angleRad);
          const py = centerY + sz * Math.sin(angleRad);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#ff4444';
          ctx.fill();
        }
        ctx.stroke();
        // X in center
        ctx.beginPath();
        ctx.moveTo(centerX - sz * 0.4, centerY - sz * 0.4);
        ctx.lineTo(centerX + sz * 0.4, centerY + sz * 0.4);
        ctx.moveTo(centerX + sz * 0.4, centerY - sz * 0.4);
        ctx.lineTo(centerX - sz * 0.4, centerY + sz * 0.4);
        ctx.stroke();
        break;
      }
      case 'warning': {
        // Warning triangle
        ctx.moveTo(centerX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX, endY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#ffaa00';
          ctx.fill();
        }
        ctx.stroke();
        // Exclamation mark
        ctx.beginPath();
        ctx.moveTo(centerX, startY + height * 0.35);
        ctx.lineTo(centerX, startY + height * 0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, startY + height * 0.75, 3, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      // ===== FILES & FOLDERS =====
      case 'file':
      case 'textfile': {
        // File with folded corner
        const foldSize = Math.min(width, height) * 0.2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX - foldSize, startY);
        ctx.lineTo(endX, startY + foldSize);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX, endY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Fold
        ctx.beginPath();
        ctx.moveTo(endX - foldSize, startY);
        ctx.lineTo(endX - foldSize, startY + foldSize);
        ctx.lineTo(endX, startY + foldSize);
        ctx.stroke();
        // Lines
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.15, centerY - height * 0.1);
        ctx.lineTo(endX - width * 0.15, centerY - height * 0.1);
        ctx.moveTo(startX + width * 0.15, centerY + height * 0.1);
        ctx.lineTo(endX - width * 0.15, centerY + height * 0.1);
        ctx.stroke();
        break;
      }
      case 'folder': {
        // Folder shape
        const tabH = height * 0.2;
        const tabW = width * 0.35;
        ctx.beginPath();
        ctx.moveTo(startX, startY + tabH);
        ctx.lineTo(startX, endY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(endX, startY + tabH);
        ctx.lineTo(startX + tabW + tabH, startY + tabH);
        ctx.lineTo(startX + tabW, startY);
        ctx.lineTo(startX, startY);
        ctx.lineTo(startX, startY + tabH);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'archive': {
        // Archive folder with zipper
        const tabH = height * 0.2;
        const tabW = width * 0.35;
        ctx.beginPath();
        ctx.moveTo(startX, startY + tabH);
        ctx.lineTo(startX, endY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(endX, startY + tabH);
        ctx.lineTo(startX + tabW + tabH, startY + tabH);
        ctx.lineTo(startX + tabW, startY);
        ctx.lineTo(startX, startY);
        ctx.lineTo(startX, startY + tabH);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Zipper pattern
        for (let i = 0; i < 4; i++) {
          ctx.strokeRect(centerX - 4, startY + tabH + 8 + i * 12, 8, 8);
        }
        break;
      }
      // ===== COMMUNICATION =====
      case 'email': {
        // Envelope shape
        ctx.strokeRect(startX, startY, width, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, height);
        }
        // Flap
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(endX, startY);
        ctx.stroke();
        break;
      }
      case 'send': {
        // Paper airplane
        ctx.beginPath();
        ctx.moveTo(startX, centerY);
        ctx.lineTo(endX, startY);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Fold line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(startX + width * 0.35, centerY + height * 0.15);
        ctx.stroke();
        break;
      }
      case 'inbox': {
        // Inbox tray
        ctx.beginPath();
        ctx.moveTo(startX, startY + height * 0.3);
        ctx.lineTo(startX + width * 0.2, startY + height * 0.3);
        ctx.lineTo(startX + width * 0.25, centerY);
        ctx.lineTo(endX - width * 0.25, centerY);
        ctx.lineTo(endX - width * 0.2, startY + height * 0.3);
        ctx.lineTo(endX, startY + height * 0.3);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX, endY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'chat': {
        // Chat bubble
        const bubbleR = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY - height * 0.1, bubbleR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Tail
        ctx.beginPath();
        ctx.moveTo(centerX - bubbleR * 0.3, centerY + bubbleR * 0.7);
        ctx.lineTo(centerX - bubbleR * 0.8, endY);
        ctx.lineTo(centerX, centerY + bubbleR * 0.5);
        ctx.closePath();
        if (shapeFill) {
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'discussion': {
        // Multiple chat bubbles
        ctx.strokeRect(startX, startY, width * 0.75, height * 0.6);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width * 0.75, height * 0.6);
        }
        ctx.strokeRect(startX + width * 0.25, startY + height * 0.4, width * 0.75, height * 0.6);
        if (shapeFill) {
          ctx.fillRect(startX + width * 0.25, startY + height * 0.4, width * 0.75, height * 0.6);
        }
        break;
      }
      case 'phone': {
        // Phone circle
        const phoneR = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, phoneR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Phone handset
        ctx.beginPath();
        ctx.moveTo(centerX - phoneR * 0.5, centerY - phoneR * 0.3);
        ctx.quadraticCurveTo(centerX - phoneR * 0.6, centerY, centerX - phoneR * 0.5, centerY + phoneR * 0.3);
        ctx.quadraticCurveTo(centerX, centerY + phoneR * 0.1, centerX + phoneR * 0.5, centerY + phoneR * 0.3);
        ctx.quadraticCurveTo(centerX + phoneR * 0.6, centerY, centerX + phoneR * 0.5, centerY - phoneR * 0.3);
        ctx.stroke();
        break;
      }
      case 'share': {
        // Share - nodes with connections
        const nodeR = Math.min(width, height) * 0.12;
        // Center node
        ctx.beginPath();
        ctx.arc(startX + width * 0.25, centerY, nodeR, 0, 2 * Math.PI);
        ctx.fill();
        // Top right node
        ctx.beginPath();
        ctx.arc(endX - width * 0.25, startY + height * 0.25, nodeR, 0, 2 * Math.PI);
        ctx.fill();
        // Bottom right node
        ctx.beginPath();
        ctx.arc(endX - width * 0.25, endY - height * 0.25, nodeR, 0, 2 * Math.PI);
        ctx.fill();
        // Lines
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.25 + nodeR, centerY - nodeR / 2);
        ctx.lineTo(endX - width * 0.25 - nodeR, startY + height * 0.25 + nodeR / 2);
        ctx.moveTo(startX + width * 0.25 + nodeR, centerY + nodeR / 2);
        ctx.lineTo(endX - width * 0.25 - nodeR, endY - height * 0.25 - nodeR / 2);
        ctx.stroke();
        break;
      }
      // ===== DEVICES =====
      case 'tablet': {
        const cornerR = Math.min(width, height) * 0.08;
        ctx.beginPath();
        ctx.moveTo(startX + cornerR, startY);
        ctx.lineTo(endX - cornerR, startY);
        ctx.quadraticCurveTo(endX, startY, endX, startY + cornerR);
        ctx.lineTo(endX, endY - cornerR);
        ctx.quadraticCurveTo(endX, endY, endX - cornerR, endY);
        ctx.lineTo(startX + cornerR, endY);
        ctx.quadraticCurveTo(startX, endY, startX, endY - cornerR);
        ctx.lineTo(startX, startY + cornerR);
        ctx.quadraticCurveTo(startX, startY, startX + cornerR, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Screen
        ctx.strokeRect(startX + width * 0.08, startY + height * 0.06, width * 0.84, height * 0.82);
        // Home button
        ctx.beginPath();
        ctx.arc(centerX, endY - height * 0.04, 4, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'watch': {
        // Watch with band
        const watchR = Math.min(width, height) * 0.35;
        // Top band
        ctx.strokeRect(centerX - watchR * 0.6, startY, watchR * 1.2, height * 0.15);
        // Bottom band
        ctx.strokeRect(centerX - watchR * 0.6, endY - height * 0.15, watchR * 1.2, height * 0.15);
        // Watch face
        ctx.beginPath();
        ctx.arc(centerX, centerY, watchR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'tv': {
        // TV with stand
        const screenH = height * 0.75;
        ctx.strokeRect(startX, startY, width, screenH);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, screenH);
        }
        // Stand
        ctx.beginPath();
        ctx.moveTo(centerX, startY + screenH);
        ctx.lineTo(centerX, endY - height * 0.08);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.3, endY);
        ctx.lineTo(endX - width * 0.3, endY);
        ctx.stroke();
        break;
      }
      case 'speaker': {
        // Speaker circle with cone
        const spkR = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, spkR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Inner circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, spkR * 0.5, 0, 2 * Math.PI);
        ctx.stroke();
        // Center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, spkR * 0.15, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      case 'headphones': {
        // Headphones shape
        const hpR = Math.min(width, height) * 0.35;
        // Headband arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, hpR, Math.PI, 0);
        ctx.stroke();
        // Left ear
        ctx.beginPath();
        ctx.ellipse(centerX - hpR, centerY + hpR * 0.3, hpR * 0.25, hpR * 0.4, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Right ear
        ctx.beginPath();
        ctx.ellipse(centerX + hpR, centerY + hpR * 0.3, hpR * 0.25, hpR * 0.4, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'camera': {
        // Camera shape
        const camR = Math.min(width, height) * 0.35;
        ctx.beginPath();
        ctx.arc(centerX, centerY, camR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Inner circle (lens)
        ctx.beginPath();
        ctx.arc(centerX, centerY, camR * 0.6, 0, 2 * Math.PI);
        ctx.stroke();
        // Flash
        ctx.beginPath();
        ctx.arc(centerX + camR * 0.8, centerY - camR * 0.8, camR * 0.15, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'printer': {
        // Printer shape
        const paperH = height * 0.25;
        const bodyH = height * 0.4;
        // Paper input
        ctx.strokeRect(startX + width * 0.2, startY, width * 0.6, paperH);
        // Main body
        ctx.strokeRect(startX, startY + paperH, width, bodyH);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY + paperH, width, bodyH);
        }
        // Paper output
        ctx.strokeRect(startX + width * 0.15, startY + paperH + bodyH, width * 0.7, height * 0.2);
        break;
      }
      // ===== SECURITY =====
      case 'lock': {
        // Padlock shape
        const bodyTop = startY + height * 0.4;
        const shackleW = width * 0.5;
        // Shackle
        ctx.beginPath();
        ctx.arc(centerX, bodyTop, shackleW / 2, Math.PI, 0);
        ctx.stroke();
        // Body
        ctx.strokeRect(startX + width * 0.15, bodyTop, width * 0.7, height * 0.55);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX + width * 0.15, bodyTop, width * 0.7, height * 0.55);
        }
        // Keyhole
        ctx.beginPath();
        ctx.arc(centerX, bodyTop + height * 0.2, 6, 0, 2 * Math.PI);
        ctx.moveTo(centerX, bodyTop + height * 0.25);
        ctx.lineTo(centerX, bodyTop + height * 0.4);
        ctx.stroke();
        break;
      }
      case 'unlock': {
        // Open padlock
        const bodyTop = startY + height * 0.4;
        const shackleW = width * 0.5;
        // Open shackle
        ctx.beginPath();
        ctx.arc(centerX, bodyTop - height * 0.1, shackleW / 2, Math.PI, -0.2);
        ctx.stroke();
        // Body
        ctx.strokeRect(startX + width * 0.15, bodyTop, width * 0.7, height * 0.55);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX + width * 0.15, bodyTop, width * 0.7, height * 0.55);
        }
        break;
      }
      case 'key':
      case 'apikey': {
        // Key shape
        const keyHeadR = Math.min(width, height) * 0.25;
        // Key head (circle)
        ctx.beginPath();
        ctx.arc(startX + keyHeadR + 5, centerY, keyHeadR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Key hole in head
        ctx.beginPath();
        ctx.arc(startX + keyHeadR + 5, centerY, keyHeadR * 0.4, 0, 2 * Math.PI);
        ctx.stroke();
        // Key shaft
        ctx.beginPath();
        ctx.moveTo(startX + keyHeadR * 2 + 5, centerY);
        ctx.lineTo(endX - 5, centerY);
        ctx.stroke();
        // Key teeth
        ctx.beginPath();
        ctx.moveTo(endX - width * 0.2, centerY);
        ctx.lineTo(endX - width * 0.2, centerY + height * 0.15);
        ctx.moveTo(endX - width * 0.1, centerY);
        ctx.lineTo(endX - width * 0.1, centerY + height * 0.1);
        ctx.stroke();
        break;
      }
      case 'shield':
      case 'secured':
      case 'vulnerable': {
        // Shield shape
        ctx.moveTo(centerX, startY);
        ctx.quadraticCurveTo(endX, startY, endX, startY + height * 0.3);
        ctx.quadraticCurveTo(endX, startY + height * 0.8, centerX, endY);
        ctx.quadraticCurveTo(startX, startY + height * 0.8, startX, startY + height * 0.3);
        ctx.quadraticCurveTo(startX, startY, centerX, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Check or X based on type
        if (type === 'secured') {
          ctx.beginPath();
          ctx.moveTo(centerX - width * 0.2, centerY);
          ctx.lineTo(centerX - width * 0.05, centerY + height * 0.15);
          ctx.lineTo(centerX + width * 0.2, centerY - height * 0.1);
          ctx.stroke();
        } else if (type === 'vulnerable') {
          ctx.beginPath();
          ctx.moveTo(centerX - width * 0.15, centerY - height * 0.1);
          ctx.lineTo(centerX + width * 0.15, centerY + height * 0.1);
          ctx.moveTo(centerX + width * 0.15, centerY - height * 0.1);
          ctx.lineTo(centerX - width * 0.15, centerY + height * 0.1);
          ctx.stroke();
        }
        break;
      }
      case 'biometric': {
        // Fingerprint
        const fpR = Math.min(width, height) * 0.35;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(centerX, centerY + fpR * 0.3, fpR * (0.3 + i * 0.2), Math.PI * 1.2, Math.PI * 1.8);
          ctx.stroke();
        }
        break;
      }
      case 'visible': {
        // Eye open
        const eyeW = width * 0.8;
        const eyeH = height * 0.4;
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.1, centerY);
        ctx.quadraticCurveTo(centerX, centerY - eyeH, endX - width * 0.1, centerY);
        ctx.quadraticCurveTo(centerX, centerY + eyeH, startX + width * 0.1, centerY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Iris
        ctx.beginPath();
        ctx.arc(centerX, centerY, eyeH * 0.6, 0, 2 * Math.PI);
        ctx.stroke();
        // Pupil
        ctx.beginPath();
        ctx.arc(centerX, centerY, eyeH * 0.3, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      case 'hidden': {
        // Eye with line through
        const eyeW = width * 0.8;
        const eyeH = height * 0.4;
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.1, centerY);
        ctx.quadraticCurveTo(centerX, centerY - eyeH, endX - width * 0.1, centerY);
        ctx.quadraticCurveTo(centerX, centerY + eyeH, startX + width * 0.1, centerY);
        ctx.closePath();
        ctx.stroke();
        // Diagonal line
        ctx.beginPath();
        ctx.moveTo(startX, endY);
        ctx.lineTo(endX, startY);
        ctx.stroke();
        break;
      }
      // ===== PEOPLE =====
      case 'user':
      case 'actor': {
        // Person icon
        const headR = Math.min(width, height) * 0.2;
        // Head
        ctx.beginPath();
        ctx.arc(centerX, startY + headR + 5, headR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Body
        ctx.beginPath();
        ctx.arc(centerX, endY + headR, width * 0.4, Math.PI, 0, true);
        ctx.stroke();
        break;
      }
      case 'usersgroup': {
        // Multiple people
        const headR = Math.min(width, height) * 0.12;
        // Back person
        ctx.beginPath();
        ctx.arc(centerX + headR, startY + headR + 5, headR, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + headR, endY + headR * 0.5, width * 0.25, Math.PI, 0, true);
        ctx.stroke();
        // Front person
        ctx.beginPath();
        ctx.arc(centerX - headR, startY + headR * 1.5 + 5, headR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX - headR, endY + headR, width * 0.25, Math.PI, 0, true);
        ctx.stroke();
        break;
      }
      case 'adduser': {
        // Person with plus
        const headR = Math.min(width, height) * 0.15;
        ctx.beginPath();
        ctx.arc(centerX - width * 0.1, startY + headR + 5, headR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX - width * 0.1, endY + headR, width * 0.3, Math.PI, 0, true);
        ctx.stroke();
        // Plus sign
        ctx.beginPath();
        ctx.moveTo(endX - width * 0.2, centerY);
        ctx.lineTo(endX - width * 0.05, centerY);
        ctx.moveTo(endX - width * 0.125, centerY - height * 0.1);
        ctx.lineTo(endX - width * 0.125, centerY + height * 0.1);
        ctx.stroke();
        break;
      }
      case 'verifieduser': {
        // Person with check
        const headR = Math.min(width, height) * 0.15;
        ctx.beginPath();
        ctx.arc(centerX - width * 0.1, startY + headR + 5, headR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX - width * 0.1, endY + headR, width * 0.3, Math.PI, 0, true);
        ctx.stroke();
        // Check
        ctx.beginPath();
        ctx.moveTo(endX - width * 0.25, centerY);
        ctx.lineTo(endX - width * 0.15, centerY + height * 0.1);
        ctx.lineTo(endX - width * 0.05, centerY - height * 0.1);
        ctx.stroke();
        break;
      }
      case 'removeuser': {
        // Person with X
        const headR = Math.min(width, height) * 0.15;
        ctx.beginPath();
        ctx.arc(centerX - width * 0.1, startY + headR + 5, headR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX - width * 0.1, endY + headR, width * 0.3, Math.PI, 0, true);
        ctx.stroke();
        // X
        ctx.beginPath();
        ctx.moveTo(endX - width * 0.22, centerY - height * 0.08);
        ctx.lineTo(endX - width * 0.08, centerY + height * 0.08);
        ctx.moveTo(endX - width * 0.08, centerY - height * 0.08);
        ctx.lineTo(endX - width * 0.22, centerY + height * 0.08);
        ctx.stroke();
        break;
      }
      case 'organization':
      case 'company': {
        // Building shape
        ctx.strokeRect(startX, startY, width, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, height);
        }
        // Windows
        const winW = width * 0.2;
        const winH = height * 0.15;
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 2; col++) {
            ctx.strokeRect(
              startX + width * 0.15 + col * (winW + width * 0.3),
              startY + height * 0.1 + row * (winH + height * 0.1),
              winW, winH
            );
          }
        }
        // Door
        ctx.strokeRect(centerX - winW / 2, endY - height * 0.25, winW, height * 0.25);
        break;
      }
      // ===== STATUS =====
      case 'successcircle': {
        const r = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#22c55e';
          ctx.fill();
        }
        ctx.stroke();
        // Checkmark
        ctx.beginPath();
        ctx.moveTo(centerX - r * 0.4, centerY);
        ctx.lineTo(centerX - r * 0.1, centerY + r * 0.3);
        ctx.lineTo(centerX + r * 0.4, centerY - r * 0.3);
        ctx.stroke();
        break;
      }
      case 'errorcircle': {
        const r = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#ef4444';
          ctx.fill();
        }
        ctx.stroke();
        // X
        ctx.beginPath();
        ctx.moveTo(centerX - r * 0.3, centerY - r * 0.3);
        ctx.lineTo(centerX + r * 0.3, centerY + r * 0.3);
        ctx.moveTo(centerX + r * 0.3, centerY - r * 0.3);
        ctx.lineTo(centerX - r * 0.3, centerY + r * 0.3);
        ctx.stroke();
        break;
      }
      case 'alertcircle': {
        const r = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#f59e0b';
          ctx.fill();
        }
        ctx.stroke();
        // Exclamation
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - r * 0.4);
        ctx.lineTo(centerX, centerY + r * 0.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY + r * 0.35, 3, 0, 2 * Math.PI);
        ctx.fill();
        break;
      }
      case 'info': {
        const r = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#3b82f6';
          ctx.fill();
        }
        ctx.stroke();
        // i
        ctx.beginPath();
        ctx.arc(centerX, centerY - r * 0.35, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - r * 0.1);
        ctx.lineTo(centerX, centerY + r * 0.4);
        ctx.stroke();
        break;
      }
      case 'help': {
        const r = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // ?
        ctx.font = `bold ${r}px Arial`;
        ctx.fillStyle = shapeFill ? (darkMode ? '#fff' : '#000') : shapeColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', centerX, centerY + 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        break;
      }
      case 'notification': {
        // Bell shape
        const bellW = width * 0.7;
        const bellH = height * 0.6;
        ctx.beginPath();
        ctx.moveTo(centerX, startY);
        ctx.quadraticCurveTo(centerX, startY + bellH * 0.1, centerX - bellW / 2, startY + bellH * 0.7);
        ctx.lineTo(centerX - bellW / 2, startY + bellH);
        ctx.lineTo(centerX + bellW / 2, startY + bellH);
        ctx.lineTo(centerX + bellW / 2, startY + bellH * 0.7);
        ctx.quadraticCurveTo(centerX, startY + bellH * 0.1, centerX, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Clapper
        ctx.beginPath();
        ctx.arc(centerX, startY + bellH + 8, 5, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'flag': {
        // Flag on pole
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.2, startY);
        ctx.lineTo(startX + width * 0.2, endY);
        ctx.stroke();
        // Flag
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.2, startY);
        ctx.lineTo(endX, startY + height * 0.2);
        ctx.lineTo(startX + width * 0.2, startY + height * 0.4);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      // ===== ACTIONS =====
      case 'add': {
        const r = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Plus
        ctx.beginPath();
        ctx.moveTo(centerX - r * 0.5, centerY);
        ctx.lineTo(centerX + r * 0.5, centerY);
        ctx.moveTo(centerX, centerY - r * 0.5);
        ctx.lineTo(centerX, centerY + r * 0.5);
        ctx.stroke();
        break;
      }
      case 'remove': {
        const r = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Minus
        ctx.beginPath();
        ctx.moveTo(centerX - r * 0.5, centerY);
        ctx.lineTo(centerX + r * 0.5, centerY);
        ctx.stroke();
        break;
      }
      case 'check': {
        const r = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#22c55e';
          ctx.fill();
        }
        ctx.stroke();
        // Check
        ctx.beginPath();
        ctx.moveTo(centerX - r * 0.4, centerY);
        ctx.lineTo(centerX - r * 0.1, centerY + r * 0.3);
        ctx.lineTo(centerX + r * 0.4, centerY - r * 0.25);
        ctx.stroke();
        break;
      }
      case 'close': {
        const r = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // X
        ctx.beginPath();
        ctx.moveTo(centerX - r * 0.35, centerY - r * 0.35);
        ctx.lineTo(centerX + r * 0.35, centerY + r * 0.35);
        ctx.moveTo(centerX + r * 0.35, centerY - r * 0.35);
        ctx.lineTo(centerX - r * 0.35, centerY + r * 0.35);
        ctx.stroke();
        break;
      }
      case 'refresh': {
        const r = Math.min(width, height) * 0.35;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0.3, Math.PI * 1.7);
        ctx.stroke();
        // Arrows
        const arrowLen = 8;
        ctx.beginPath();
        ctx.moveTo(centerX + r * Math.cos(0.3), centerY + r * Math.sin(0.3));
        ctx.lineTo(centerX + r * Math.cos(0.3) + arrowLen, centerY + r * Math.sin(0.3) - arrowLen);
        ctx.moveTo(centerX + r * Math.cos(0.3), centerY + r * Math.sin(0.3));
        ctx.lineTo(centerX + r * Math.cos(0.3) + arrowLen, centerY + r * Math.sin(0.3) + arrowLen);
        ctx.stroke();
        break;
      }
      case 'rotate': {
        const r = Math.min(width, height) * 0.35;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, -0.5, Math.PI * 1.5);
        ctx.stroke();
        // Arrow
        ctx.beginPath();
        ctx.moveTo(centerX + r * Math.cos(-0.5), centerY + r * Math.sin(-0.5));
        ctx.lineTo(centerX + r * Math.cos(-0.5) - 8, centerY + r * Math.sin(-0.5) - 5);
        ctx.moveTo(centerX + r * Math.cos(-0.5), centerY + r * Math.sin(-0.5));
        ctx.lineTo(centerX + r * Math.cos(-0.5) + 5, centerY + r * Math.sin(-0.5) - 8);
        ctx.stroke();
        break;
      }
      case 'download': {
        const arrowW = width * 0.3;
        ctx.beginPath();
        ctx.moveTo(centerX, startY);
        ctx.lineTo(centerX, centerY + height * 0.2);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + height * 0.2);
        ctx.lineTo(centerX - arrowW / 2, centerY - height * 0.05);
        ctx.moveTo(centerX, centerY + height * 0.2);
        ctx.lineTo(centerX + arrowW / 2, centerY - height * 0.05);
        ctx.stroke();
        // Tray
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.1, endY - height * 0.2);
        ctx.lineTo(startX + width * 0.1, endY);
        ctx.lineTo(endX - width * 0.1, endY);
        ctx.lineTo(endX - width * 0.1, endY - height * 0.2);
        ctx.stroke();
        break;
      }
      case 'upload': {
        const arrowW = width * 0.3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + height * 0.1);
        ctx.lineTo(centerX, startY + height * 0.15);
        ctx.stroke();
        // Arrow head up
        ctx.beginPath();
        ctx.moveTo(centerX, startY + height * 0.15);
        ctx.lineTo(centerX - arrowW / 2, startY + height * 0.35);
        ctx.moveTo(centerX, startY + height * 0.15);
        ctx.lineTo(centerX + arrowW / 2, startY + height * 0.35);
        ctx.stroke();
        // Tray
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.1, endY - height * 0.2);
        ctx.lineTo(startX + width * 0.1, endY);
        ctx.lineTo(endX - width * 0.1, endY);
        ctx.lineTo(endX - width * 0.1, endY - height * 0.2);
        ctx.stroke();
        break;
      }
      case 'search': {
        const glassR = Math.min(width, height) * 0.3;
        ctx.beginPath();
        ctx.arc(centerX - width * 0.1, centerY - height * 0.1, glassR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Handle
        ctx.beginPath();
        ctx.moveTo(centerX + glassR * 0.4, centerY + glassR * 0.4);
        ctx.lineTo(endX - width * 0.1, endY - height * 0.1);
        ctx.stroke();
        break;
      }
      case 'settings': {
        const gearR = Math.min(width, height) * 0.35;
        const teeth = 8;
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
          const angle = (i / teeth) * Math.PI * 2;
          const outerX = centerX + Math.cos(angle) * gearR;
          const outerY = centerY + Math.sin(angle) * gearR;
          const innerAngle = angle + Math.PI / teeth;
          const innerX = centerX + Math.cos(innerAngle) * gearR * 0.7;
          const innerY = centerY + Math.sin(innerAngle) * gearR * 0.7;
          if (i === 0) ctx.moveTo(outerX, outerY);
          else ctx.lineTo(outerX, outerY);
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Center hole
        ctx.beginPath();
        ctx.arc(centerX, centerY, gearR * 0.25, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      // ===== CHARTS =====
      case 'barchart': {
        ctx.strokeRect(startX, startY, width, height);
        // Bars
        const barW = width * 0.15;
        const bars = [0.5, 0.8, 0.4, 0.9, 0.6];
        bars.forEach((h, i) => {
          const barH = height * 0.8 * h;
          const x = startX + width * 0.1 + i * (barW + width * 0.05);
          ctx.fillStyle = shapeColor;
          ctx.fillRect(x, endY - height * 0.1 - barH, barW, barH);
          ctx.strokeRect(x, endY - height * 0.1 - barH, barW, barH);
        });
        break;
      }
      case 'piechart': {
        const pieR = Math.min(width, height) * 0.4;
        // Slices
        const slices = [0.3, 0.25, 0.25, 0.2];
        let startAngle = 0;
        slices.forEach((slice, i) => {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, pieR, startAngle, startAngle + slice * Math.PI * 2);
          ctx.closePath();
          ctx.stroke();
          if (shapeFill && i === 0) {
            ctx.fillStyle = fillColor || shapeColor;
            ctx.fill();
          }
          startAngle += slice * Math.PI * 2;
        });
        break;
      }
      case 'linechart': {
        ctx.strokeRect(startX, startY, width, height);
        // Line
        ctx.beginPath();
        const points = [0.7, 0.4, 0.6, 0.2, 0.5];
        points.forEach((p, i) => {
          const x = startX + width * 0.1 + i * width * 0.2;
          const y = startY + height * 0.1 + height * 0.8 * (1 - p);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        // Dots
        points.forEach((p, i) => {
          const x = startX + width * 0.1 + i * width * 0.2;
          const y = startY + height * 0.1 + height * 0.8 * (1 - p);
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        });
        break;
      }
      case 'trendup': {
        ctx.beginPath();
        ctx.moveTo(startX, endY);
        ctx.lineTo(endX, startY);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(endX, startY);
        ctx.lineTo(endX - 12, startY + 4);
        ctx.moveTo(endX, startY);
        ctx.lineTo(endX - 4, startY + 12);
        ctx.stroke();
        break;
      }
      case 'trenddown': {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - 12, endY - 4);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - 4, endY - 12);
        ctx.stroke();
        break;
      }
      case 'activity': {
        // ECG-like line
        ctx.beginPath();
        ctx.moveTo(startX, centerY);
        ctx.lineTo(startX + width * 0.2, centerY);
        ctx.lineTo(startX + width * 0.3, centerY - height * 0.3);
        ctx.lineTo(startX + width * 0.4, centerY + height * 0.3);
        ctx.lineTo(startX + width * 0.5, centerY - height * 0.4);
        ctx.lineTo(startX + width * 0.6, centerY);
        ctx.lineTo(endX, centerY);
        ctx.stroke();
        break;
      }
      // ===== MISC =====
      case 'idea': {
        // Lightbulb
        const bulbR = Math.min(width, height) * 0.3;
        ctx.beginPath();
        ctx.arc(centerX, centerY - height * 0.1, bulbR, Math.PI * 0.2, Math.PI * 0.8, true);
        ctx.quadraticCurveTo(centerX - bulbR * 0.6, centerY + bulbR * 0.5, centerX - bulbR * 0.4, endY - height * 0.15);
        ctx.lineTo(centerX + bulbR * 0.4, endY - height * 0.15);
        ctx.quadraticCurveTo(centerX + bulbR * 0.6, centerY + bulbR * 0.5, centerX + bulbR * Math.cos(Math.PI * 0.2), centerY - height * 0.1 + bulbR * Math.sin(Math.PI * 0.2));
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#fbbf24';
          ctx.fill();
        }
        ctx.stroke();
        // Base lines
        ctx.beginPath();
        ctx.moveTo(centerX - bulbR * 0.3, endY - height * 0.1);
        ctx.lineTo(centerX + bulbR * 0.3, endY - height * 0.1);
        ctx.moveTo(centerX - bulbR * 0.25, endY - height * 0.05);
        ctx.lineTo(centerX + bulbR * 0.25, endY - height * 0.05);
        ctx.stroke();
        break;
      }
      case 'target': {
        // Concentric circles
        const targetR = Math.min(width, height) * 0.4;
        for (let i = 3; i > 0; i--) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, targetR * (i / 3), 0, 2 * Math.PI);
          if (shapeFill && i === 3) {
            ctx.fillStyle = fillColor || shapeColor;
            ctx.fill();
          }
          ctx.stroke();
        }
        break;
      }
      case 'focus': {
        // Crosshair
        const crossR = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, crossR, 0, 2 * Math.PI);
        ctx.stroke();
        // Cross
        ctx.beginPath();
        ctx.moveTo(centerX - crossR - 8, centerY);
        ctx.lineTo(centerX - crossR + 8, centerY);
        ctx.moveTo(centerX + crossR - 8, centerY);
        ctx.lineTo(centerX + crossR + 8, centerY);
        ctx.moveTo(centerX, centerY - crossR - 8);
        ctx.lineTo(centerX, centerY - crossR + 8);
        ctx.moveTo(centerX, centerY + crossR - 8);
        ctx.lineTo(centerX, centerY + crossR + 8);
        ctx.stroke();
        break;
      }
      case 'bookmark': {
        // Bookmark ribbon
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.2, startY);
        ctx.lineTo(startX + width * 0.2, endY - height * 0.1);
        ctx.lineTo(centerX, endY - height * 0.25);
        ctx.lineTo(endX - width * 0.2, endY - height * 0.1);
        ctx.lineTo(endX - width * 0.2, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'tag': {
        // Tag shape
        ctx.beginPath();
        ctx.moveTo(startX, startY + height * 0.15);
        ctx.lineTo(startX + width * 0.3, startY);
        ctx.lineTo(endX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX + width * 0.3, endY);
        ctx.lineTo(startX, endY - height * 0.15);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Hole
        ctx.beginPath();
        ctx.arc(startX + width * 0.25, centerY, 4, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'award':
      case 'trophy': {
        // Trophy cup
        const cupW = width * 0.6;
        const cupH = height * 0.5;
        ctx.beginPath();
        ctx.moveTo(centerX - cupW / 2, startY);
        ctx.quadraticCurveTo(centerX - cupW / 2, startY + cupH, centerX, startY + cupH);
        ctx.quadraticCurveTo(centerX + cupW / 2, startY + cupH, centerX + cupW / 2, startY);
        ctx.lineTo(centerX - cupW / 2, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#fbbf24';
          ctx.fill();
        }
        ctx.stroke();
        // Handles
        ctx.beginPath();
        ctx.arc(centerX - cupW / 2 - 8, startY + cupH * 0.3, 10, Math.PI * 0.5, Math.PI * 1.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + cupW / 2 + 8, startY + cupH * 0.3, 10, Math.PI * 1.5, Math.PI * 0.5);
        ctx.stroke();
        // Stem
        ctx.strokeRect(centerX - 5, startY + cupH, 10, height * 0.2);
        // Base
        ctx.strokeRect(centerX - cupW * 0.4, endY - height * 0.15, cupW * 0.8, height * 0.1);
        break;
      }
      case 'lightning': {
        // Lightning bolt
        ctx.beginPath();
        ctx.moveTo(centerX + width * 0.1, startY);
        ctx.lineTo(startX + width * 0.15, centerY);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(centerX - width * 0.1, endY);
        ctx.lineTo(endX - width * 0.15, centerY);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#fbbf24';
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'fire': {
        // Flame shape
        ctx.beginPath();
        ctx.moveTo(centerX, endY);
        ctx.quadraticCurveTo(startX, endY - height * 0.3, startX + width * 0.2, centerY);
        ctx.quadraticCurveTo(startX + width * 0.1, startY + height * 0.3, centerX, startY);
        ctx.quadraticCurveTo(endX - width * 0.1, startY + height * 0.3, endX - width * 0.2, centerY);
        ctx.quadraticCurveTo(endX, endY - height * 0.3, centerX, endY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || '#f97316';
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'puzzle': {
        // Puzzle piece
        const pw = width * 0.8;
        const ph = height * 0.8;
        const knobR = Math.min(pw, ph) * 0.12;
        ctx.beginPath();
        ctx.moveTo(startX + width * 0.1, startY + height * 0.1);
        // Top edge with knob
        ctx.lineTo(startX + width * 0.35, startY + height * 0.1);
        ctx.arc(centerX, startY + height * 0.1, knobR, Math.PI, 0, true);
        ctx.lineTo(endX - width * 0.1, startY + height * 0.1);
        // Right edge with indent
        ctx.lineTo(endX - width * 0.1, startY + height * 0.35);
        ctx.arc(endX - width * 0.1, centerY, knobR, -Math.PI / 2, Math.PI / 2, true);
        ctx.lineTo(endX - width * 0.1, endY - height * 0.1);
        // Bottom
        ctx.lineTo(startX + width * 0.1, endY - height * 0.1);
        // Left edge
        ctx.lineTo(startX + width * 0.1, startY + height * 0.1);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'compass': {
        // Compass
        const compR = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, compR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Needle
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - compR * 0.7);
        ctx.lineTo(centerX - compR * 0.15, centerY);
        ctx.lineTo(centerX, centerY + compR * 0.7);
        ctx.lineTo(centerX + compR * 0.15, centerY);
        ctx.closePath();
        ctx.stroke();
        // N indicator
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - compR * 0.7);
        ctx.lineTo(centerX - compR * 0.15, centerY);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fill();
        break;
      }
      // ===== DATA STRUCTURES =====
      case 'array': {
        // Array with cells
        const cellCount = 5;
        const cellW = width / cellCount;
        for (let i = 0; i < cellCount; i++) {
          ctx.strokeRect(startX + i * cellW, startY, cellW, height);
          ctx.font = `${Math.min(cellW, height) * 0.4}px monospace`;
          ctx.fillStyle = shapeColor;
          ctx.textAlign = 'center';
          ctx.fillText(String(i), startX + i * cellW + cellW / 2, centerY + height * 0.15);
        }
        ctx.textAlign = 'left';
        break;
      }
      case 'stack': {
        // Stack - vertical boxes
        const boxCount = 4;
        const boxH = height / boxCount;
        for (let i = 0; i < boxCount; i++) {
          ctx.strokeRect(startX, startY + i * boxH, width, boxH);
          if (shapeFill && i === 0) {
            ctx.fillStyle = fillColor || shapeColor;
            ctx.fillRect(startX, startY + i * boxH, width, boxH);
          }
        }
        // Arrow
        ctx.beginPath();
        ctx.moveTo(startX - 15, startY + boxH / 2);
        ctx.lineTo(startX - 5, startY + boxH / 2);
        ctx.moveTo(startX - 5, startY + boxH / 2);
        ctx.lineTo(startX - 10, startY + boxH / 2 - 5);
        ctx.moveTo(startX - 5, startY + boxH / 2);
        ctx.lineTo(startX - 10, startY + boxH / 2 + 5);
        ctx.stroke();
        break;
      }
      case 'queue': {
        // Queue - horizontal boxes
        const boxCount = 4;
        const boxW = width / boxCount;
        for (let i = 0; i < boxCount; i++) {
          ctx.strokeRect(startX + i * boxW, startY, boxW, height);
        }
        // In arrow
        ctx.beginPath();
        ctx.moveTo(startX - 15, centerY);
        ctx.lineTo(startX - 5, centerY);
        ctx.lineTo(startX - 10, centerY - 5);
        ctx.moveTo(startX - 5, centerY);
        ctx.lineTo(startX - 10, centerY + 5);
        ctx.stroke();
        // Out arrow
        ctx.beginPath();
        ctx.moveTo(endX + 5, centerY);
        ctx.lineTo(endX + 15, centerY);
        ctx.lineTo(endX + 10, centerY - 5);
        ctx.moveTo(endX + 15, centerY);
        ctx.lineTo(endX + 10, centerY + 5);
        ctx.stroke();
        break;
      }
      case 'node': {
        // Node circle with dot
        const nodeR = Math.min(width, height) * 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, nodeR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, nodeR * 0.3, 0, 2 * Math.PI);
        ctx.fillStyle = shapeColor;
        ctx.fill();
        break;
      }
      case 'pointer': {
        // Pointer arrow
        ctx.beginPath();
        ctx.moveTo(startX, centerY);
        ctx.lineTo(endX - 10, centerY);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(endX, centerY);
        ctx.lineTo(endX - 15, centerY - 8);
        ctx.lineTo(endX - 15, centerY + 8);
        ctx.closePath();
        ctx.fillStyle = shapeColor;
        ctx.fill();
        break;
      }
      case 'treenode': {
        // Tree node - circle with children
        const tnR = Math.min(width, height) * 0.2;
        // Parent
        ctx.beginPath();
        ctx.arc(centerX, startY + tnR, tnR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Lines to children
        ctx.beginPath();
        ctx.moveTo(centerX, startY + tnR * 2);
        ctx.lineTo(startX + width * 0.25, endY - tnR);
        ctx.moveTo(centerX, startY + tnR * 2);
        ctx.lineTo(endX - width * 0.25, endY - tnR);
        ctx.stroke();
        // Children
        ctx.beginPath();
        ctx.arc(startX + width * 0.25, endY - tnR, tnR * 0.7, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(endX - width * 0.25, endY - tnR, tnR * 0.7, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'hashtable': {
        // Hash table - box with hash lines
        ctx.strokeRect(startX, startY, width, height);
        // Hash symbol
        ctx.beginPath();
        ctx.moveTo(centerX - width * 0.2, startY + height * 0.3);
        ctx.lineTo(centerX + width * 0.2, startY + height * 0.3);
        ctx.moveTo(centerX - width * 0.2, endY - height * 0.3);
        ctx.lineTo(centerX + width * 0.2, endY - height * 0.3);
        ctx.moveTo(centerX - width * 0.1, startY + height * 0.15);
        ctx.lineTo(centerX - width * 0.1, endY - height * 0.15);
        ctx.moveTo(centerX + width * 0.1, startY + height * 0.15);
        ctx.lineTo(centerX + width * 0.1, endY - height * 0.15);
        ctx.stroke();
        break;
      }
      case 'graphnode': {
        // Graph - connected nodes
        const gnR = Math.min(width, height) * 0.15;
        // Center node
        ctx.beginPath();
        ctx.arc(centerX, centerY, gnR, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Surrounding nodes
        const nodeCount = 4;
        for (let i = 0; i < nodeCount; i++) {
          const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
          const nx = centerX + Math.cos(angle) * width * 0.35;
          const ny = centerY + Math.sin(angle) * height * 0.35;
          // Line to center
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(nx, ny);
          ctx.stroke();
          // Node
          ctx.beginPath();
          ctx.arc(nx, ny, gnR * 0.7, 0, 2 * Math.PI);
          ctx.stroke();
        }
        break;
      }
      case 'linkedlist': {
        // Linked list - boxes with arrows
        const boxCount = 3;
        const boxW = width / (boxCount * 1.5);
        const gap = boxW * 0.5;
        for (let i = 0; i < boxCount; i++) {
          const x = startX + i * (boxW + gap);
          ctx.strokeRect(x, startY, boxW, height);
          // Arrow to next
          if (i < boxCount - 1) {
            ctx.beginPath();
            ctx.moveTo(x + boxW, centerY);
            ctx.lineTo(x + boxW + gap, centerY);
            ctx.lineTo(x + boxW + gap - 5, centerY - 5);
            ctx.moveTo(x + boxW + gap, centerY);
            ctx.lineTo(x + boxW + gap - 5, centerY + 5);
            ctx.stroke();
          }
        }
        break;
      }
      // ===== UML =====
      case 'class': {
        // UML class box with sections
        const sectionH = height / 3;
        ctx.strokeRect(startX, startY, width, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, sectionH);
        }
        // Dividers
        ctx.beginPath();
        ctx.moveTo(startX, startY + sectionH);
        ctx.lineTo(endX, startY + sectionH);
        ctx.moveTo(startX, startY + sectionH * 2);
        ctx.lineTo(endX, startY + sectionH * 2);
        ctx.stroke();
        break;
      }
      case 'interface': {
        // Interface - class with <<interface>>
        const sectionH = height / 3;
        ctx.strokeRect(startX, startY, width, height);
        // Dividers
        ctx.beginPath();
        ctx.moveTo(startX, startY + sectionH);
        ctx.lineTo(endX, startY + sectionH);
        ctx.moveTo(startX, startY + sectionH * 2);
        ctx.lineTo(endX, startY + sectionH * 2);
        ctx.stroke();
        // Label
        ctx.font = `${Math.min(width * 0.15, sectionH * 0.4)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = shapeColor;
        ctx.fillText('«interface»', centerX, startY + sectionH * 0.6);
        ctx.textAlign = 'left';
        break;
      }
      case 'package': {
        // UML package
        const tabH = height * 0.15;
        const tabW = width * 0.4;
        // Tab
        ctx.strokeRect(startX, startY, tabW, tabH);
        // Body
        ctx.strokeRect(startX, startY + tabH, width, height - tabH);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, tabW, tabH);
        }
        break;
      }
      case 'lifeline': {
        // UML lifeline - box with dashed line
        const boxH = height * 0.25;
        ctx.strokeRect(startX, startY, width, boxH);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, boxH);
        }
        // Dashed line
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, startY + boxH);
        ctx.lineTo(centerX, endY);
        ctx.stroke();
        ctx.setLineDash([]);
        break;
      }
      case 'activation': {
        // UML activation box
        ctx.strokeRect(startX + width * 0.35, startY, width * 0.3, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX + width * 0.35, startY, width * 0.3, height);
        }
        break;
      }
      // ===== ER Diagram =====
      case 'entity': {
        // ER entity - rectangle with name
        ctx.strokeRect(startX, startY, width, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, height);
        }
        break;
      }
      case 'relationship': {
        // ER relationship - diamond
        ctx.moveTo(centerX, startY);
        ctx.lineTo(endX, centerY);
        ctx.lineTo(centerX, endY);
        ctx.lineTo(startX, centerY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'attribute': {
        // ER attribute - ellipse
        const attrRX = width / 2;
        const attrRY = height / 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, attrRX, attrRY, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'primarykey': {
        // Primary key - ellipse with underline
        const pkRX = width / 2;
        const pkRY = height / 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, pkRX, pkRY, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        // Underline
        ctx.beginPath();
        ctx.moveTo(centerX - pkRX * 0.5, centerY + 5);
        ctx.lineTo(centerX + pkRX * 0.5, centerY + 5);
        ctx.stroke();
        break;
      }
      case 'foreignkey': {
        // Foreign key - ellipse dashed
        const fkRX = width / 2;
        const fkRY = height / 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, fkRX, fkRY, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        ctx.setLineDash([]);
        break;
      }
      case 'table': {
        // Table with header
        const headerH = height * 0.25;
        ctx.strokeRect(startX, startY, width, height);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, headerH);
        }
        // Header divider
        ctx.beginPath();
        ctx.moveTo(startX, startY + headerH);
        ctx.lineTo(endX, startY + headerH);
        ctx.stroke();
        // Column divider
        ctx.beginPath();
        ctx.moveTo(centerX, startY);
        ctx.lineTo(centerX, endY);
        ctx.stroke();
        break;
      }
      default:
        // Fallback to rounded rectangle for unknown types
        const cornerR = 8;
        ctx.beginPath();
        ctx.moveTo(startX + cornerR, startY);
        ctx.lineTo(endX - cornerR, startY);
        ctx.quadraticCurveTo(endX, startY, endX, startY + cornerR);
        ctx.lineTo(endX, endY - cornerR);
        ctx.quadraticCurveTo(endX, endY, endX - cornerR, endY);
        ctx.lineTo(startX + cornerR, endY);
        ctx.quadraticCurveTo(startX, endY, startX, endY - cornerR);
        ctx.lineTo(startX, startY + cornerR);
        ctx.quadraticCurveTo(startX, startY, startX + cornerR, startY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  }, [setContextStrokeStyle]);

  // Draw icon shape on canvas using SVG
  const drawIconShape = useCallback((ctx: CanvasRenderingContext2D, IconComponent: any, x: number, y: number, w: number, h: number, shapeColor: string, shapeFill: boolean = false) => {
    // Create a temporary container to render the icon
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    // Render the icon to get its SVG
    const iconSize = Math.min(Math.abs(w), Math.abs(h));
    const iconX = x + (w - iconSize) / 2;
    const iconY = y + (h - iconSize) / 2;

    // Create SVG manually based on icon
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', String(iconSize));
    svg.setAttribute('height', String(iconSize));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', shapeFill ? shapeColor : 'none');
    svg.setAttribute('stroke', shapeColor);
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    // Get the path data from the icon
    const iconElement = document.createElement('div');
    // We'll use a simpler approach - draw a rounded rectangle with the icon label
    document.body.removeChild(tempDiv);

    // Draw a rounded rectangle container
    const radius = 8;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (shapeFill) {
      ctx.fillStyle = shapeColor + '20';
      ctx.fill();
    }
    ctx.strokeStyle = shapeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, []);

  // Draw text on canvas
  const drawText = useCallback((ctx: CanvasRenderingContext2D, textData: TextData) => {
    ctx.font = `${textData.fontSize}px Arial`;
    ctx.fillStyle = textData.color;
    ctx.fillText(textData.text, textData.x, textData.y);
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    backgroundColorRef.current = backgroundColor;
  }, [backgroundColor]);

  const loadDrawingHistory = useCallback(async () => {
    try {
      const response = await fetch(api.getBoardHistory(boardId));
      const { drawingEvents } = await response.json();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColorRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let lastBgColor = backgroundColorRef.current;
      drawingEvents?.forEach((event: { eventType: string; data: ShapeData | TextData | { x: number; y: number; prevX: number; prevY: number; color: string; lineWidth: number; opacity?: number; backgroundColor?: string } }) => {
        if (event.eventType === 'clear') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const clearData = event.data as { backgroundColor?: string };
          const bgColor = clearData?.backgroundColor || lastBgColor;
          lastBgColor = bgColor;
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Update state if history has a different background
          if (clearData?.backgroundColor) {
            setBackgroundColor(clearData.backgroundColor);
            backgroundColorRef.current = clearData.backgroundColor;
          }
        } else if (event.eventType === 'shape') {
          drawShape(ctx, event.data as ShapeData);
        } else if (event.eventType === 'text') {
          drawText(ctx, event.data as TextData);
        } else {
          const data = event.data as { x: number; y: number; prevX: number; prevY: number; color: string; lineWidth: number; opacity?: number };
          const { x, y, prevX, prevY, color: eventColor, lineWidth: eventWidth, opacity: eventOpacity } = data;
          if (x !== undefined && y !== undefined && prevX !== undefined && prevY !== undefined) {
            draw(ctx, x, y, prevX, prevY, eventColor || '#000000', eventWidth || 2, eventOpacity || 100);
          }
        }
      });
    } catch (error) {
      console.error('Error loading drawing history:', error);
    }
  }, [boardId, draw, drawShape, drawText]);

  // Export canvas as image
  const exportAsImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `drawflow-board-${boardId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [boardId]);

  // Save board state as JSON
  const saveBoardState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const boardState = {
      version: '1.0',
      boardId,
      timestamp: new Date().toISOString(),
      canvasData: canvas.toDataURL('image/png'),
      backgroundColor,
      stickyNotes,
      placedImages,
      darkMode,
      showGrid
    };

    const blob = new Blob([JSON.stringify(boardState, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `drawflow-board-${boardId}-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [boardId, backgroundColor, stickyNotes, placedImages, darkMode, showGrid]);

  // Load board state from JSON file
  const loadBoardState = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const boardState = JSON.parse(e.target?.result as string);
        
        // Validate the file
        if (!boardState.version || !boardState.canvasData) {
          alert('Invalid board state file!');
          return;
        }

        // Load canvas data
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          // Restore other state
          if (boardState.backgroundColor) {
            setBackgroundColor(boardState.backgroundColor);
            backgroundColorRef.current = boardState.backgroundColor;
          }
          if (boardState.stickyNotes) {
            setStickyNotes(boardState.stickyNotes);
          }
          if (boardState.placedImages) {
            setPlacedImages(boardState.placedImages);
          }
          if (boardState.darkMode !== undefined) {
            setDarkMode(boardState.darkMode);
          }
          if (boardState.showGrid !== undefined) {
            setShowGrid(boardState.showGrid);
          }

          // Save to undo stack
          saveToUndoStack();
        };
        img.src = boardState.canvasData;

      } catch (error) {
        console.error('Error loading board state:', error);
        alert('Error loading board state file!');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  }, [saveToUndoStack]);

  // Canvas resize handler with debouncing to prevent clearing
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !overlayCanvas || !container) return;

    const resizeCanvas = (forceReload = false) => {
      if (container) {
        const rect = container.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        
        // Only resize and reload if dimensions actually changed or first load
        if (!hasInitializedRef.current || forceReload) {
          canvas.width = rect.width;
          canvas.height = rect.height;
          overlayCanvas.width = rect.width;
          overlayCanvas.height = rect.height;
          if (ctx) {
            ctx.fillStyle = backgroundColorRef.current;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          loadDrawingHistory();
          hasInitializedRef.current = true;
        } else {
          // For subsequent resizes, preserve content by saving and restoring
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          const oldWidth = canvas.width;
          const oldHeight = canvas.height;
          
          canvas.width = rect.width;
          canvas.height = rect.height;
          overlayCanvas.width = rect.width;
          overlayCanvas.height = rect.height;
          
          if (ctx) {
            ctx.fillStyle = backgroundColorRef.current;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Restore previous content if we had any
            if (imageData && oldWidth > 0 && oldHeight > 0) {
              ctx.putImageData(imageData, 0, 0);
            }
          }
        }
      }
    };

    // Debounced resize handler
    const debouncedResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        resizeCanvas(false);
      }, 100);
    };

    // Use ResizeObserver to detect container size changes (sidebar toggle)
    const resizeObserver = new ResizeObserver(() => {
      debouncedResize();
    });
    
    resizeObserver.observe(container);
    resizeCanvas(true); // Force reload on first mount
    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [loadDrawingHistory]);

  // Background color change effect - uses a ref to track if this is the initial load
  const isInitialLoadRef = useRef(true);
  const previousBgColorRef = useRef(backgroundColor);
  
  useEffect(() => {
    // Always keep the ref in sync
    backgroundColorRef.current = backgroundColor;
    
    // Skip effect on initial mount
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      previousBgColorRef.current = backgroundColor;
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    // Get current canvas content
    const currentContent = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = currentContent.data;
    
    // Convert previous and new background colors to RGB
    const prevColor = previousBgColorRef.current;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // Get previous background RGB
    tempCtx.fillStyle = prevColor;
    tempCtx.fillRect(0, 0, 1, 1);
    const prevRGB = tempCtx.getImageData(0, 0, 1, 1).data;
    
    // Get new background RGB
    tempCtx.fillStyle = backgroundColor;
    tempCtx.fillRect(0, 0, 1, 1);
    const newRGB = tempCtx.getImageData(0, 0, 1, 1).data;
    
    // Replace old background color with new background color
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === prevRGB[0] && data[i + 1] === prevRGB[1] && data[i + 2] === prevRGB[2]) {
        data[i] = newRGB[0];
        data[i + 1] = newRGB[1];
        data[i + 2] = newRGB[2];
      }
    }
    
    ctx.putImageData(currentContent, 0, 0);
    previousBgColorRef.current = backgroundColor;
  }, [backgroundColor]);

  // Image dragging effect
  useEffect(() => {
    if (!draggingImage) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - imageDragOffset.x;
      const y = e.clientY - rect.top - imageDragOffset.y;

      setPlacedImages(prev => prev.map(img => 
        img.id === draggingImage 
          ? { ...img, x: Math.max(0, x), y: Math.max(0, y) }
          : img
      ));
    };

    const handleMouseUp = () => {
      setDraggingImage(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingImage, imageDragOffset]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip keyboard shortcuts if user is typing in an input or textarea
      const activeElement = document.activeElement;
      const isTyping = activeElement instanceof HTMLInputElement || 
                       activeElement instanceof HTMLTextAreaElement ||
                       activeElement?.getAttribute('contenteditable') === 'true';
      
      if (isTyping) return;
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
      
      // Delete selected image
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedImage && !textInput.visible) {
        e.preventDefault();
        deleteSelectedImage();
      }
      
      if (!e.ctrlKey && !e.metaKey && !textInput.visible) {
        switch (e.key.toLowerCase()) {
          case 'v': setTool('select'); break;
          case 'h': setTool('pan'); break;
          case 'p': setTool('pen'); break;
          case 'e': setTool('eraser'); break;
          case 'r': setTool('rectangle'); break;
          case 'o': setTool('circle'); break;
          case 'l': setTool('line'); break;
          case 'a': setTool('arrow'); break;
          case 't': setTool('text'); break;
          case 'g': setTool('highlighter'); break;
          case 'k': setTool('laser'); break;
          case 's': setTool('stickynote'); break;
          case 'i': setTool('triangle'); break;
          case 'x': setTool('star'); break;
          case 'c': setTool('heart'); break;
          case 'escape': 
            setTool('select'); 
            setSelectedImage(null);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, textInput.visible, selectedImage, deleteSelectedImage]);

  // Sticky note dragging
  useEffect(() => {
    if (!draggingStickyNote) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;

      setStickyNotes(prev => prev.map(note => 
        note.id === draggingStickyNote 
          ? { ...note, x: Math.max(0, x), y: Math.max(0, y) }
          : note
      ));
    };

    const handleMouseUp = () => {
      const note = stickyNotes.find(n => n.id === draggingStickyNote);
      if (note && socketRef.current) {
        socketRef.current.emit('stickynote-update', { boardId, ...note });
      }
      setDraggingStickyNote(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingStickyNote, dragOffset, stickyNotes, boardId]);

  // Socket connection and event handlers
  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;
    const myUserId = getUserId();

    socket.emit('join-board', {
      userId: myUserId,
      boardId,
      username: getUsername(),
      color: getUserColor(),
    });

    socket.on('draw', (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      const { x, y, prevX, prevY, color: eventColor, lineWidth: eventWidth, opacity: eventOpacity } = data;
      if (x !== undefined && y !== undefined && prevX !== undefined && prevY !== undefined) {
        draw(ctx, x, y, prevX, prevY, eventColor || '#000000', eventWidth || 2, eventOpacity || 100);
      }
    });

    socket.on('shape', (data: ShapeData) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      drawShape(ctx, data);
    });

    socket.on('text', (data: TextData) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      drawText(ctx, data);
    });

    socket.on('clear-board', (data: { backgroundColor?: string }) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bgColor = data?.backgroundColor || backgroundColorRef.current;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (data?.backgroundColor) {
        setBackgroundColor(data.backgroundColor);
        backgroundColorRef.current = data.backgroundColor;
      }
    });

    socket.on('cursor-update', (data: { odId: string; username: string; color: string; x: number; y: number; isDrawing: boolean; tool?: string }) => {
      if (data.odId === myUserId) return;
      
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.odId, {
          ...data,
          lastUpdate: Date.now(),
        });
        return newMap;
      });

      setActiveUsers((prev) => 
        prev.map((user) => 
          user.odId === data.odId ? { ...user, isDrawing: data.isDrawing, tool: data.tool } : user
        )
      );
    });

    // Laser pointer from other users
    socket.on('laser', (data: { odId: string; username: string; color: string; x: number; y: number }) => {
      if (data.odId === myUserId) return;
      
      setLaserPoints(prev => [...prev.filter(p => Date.now() - p.timestamp < 800), {
        ...data,
        timestamp: Date.now(),
      }]);
    });

    // Sticky note from other users
    socket.on('stickynote', (data: StickyNoteData) => {
      setStickyNotes(prev => [...prev.filter(n => n.id !== data.id), data]);
    });

    // Sticky note update
    socket.on('stickynote-update', (data: StickyNoteData) => {
      setStickyNotes(prev => prev.map(n => n.id === data.id ? data : n));
    });

    // Sticky note delete
    socket.on('stickynote-delete', (data: { id: string }) => {
      setStickyNotes(prev => prev.filter(n => n.id !== data.id));
    });

    // Highlight from other users
    socket.on('highlight', (data: { x: number; y: number; prevX: number; prevY: number; color: string }) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(data.prevX, data.prevY);
      ctx.lineTo(data.x, data.y);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    socket.on('cursor-remove', (data: { odId: string }) => {
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.odId);
        return newMap;
      });
    });

    socket.on('user-joined', (data) => {
      if (data.allUsers) {
        setActiveUsers(data.allUsers.map((u: { odId: string; username: string; color: string }) => ({
          odId: u.odId,
          username: u.username,
          color: u.color,
          isDrawing: false,
        })));
      } else {
        const newUser: RemoteUser = {
          odId: data.odId,
          username: data.username,
          color: data.color,
          isDrawing: false,
        };
        setActiveUsers((prev) => {
          const filtered = prev.filter((u) => u.odId !== data.odId);
          return [...filtered, newUser];
        });
      }
      setActiveUserCount(data.activeUsersCount);
    });

    socket.on('user-left', (data) => {
      setActiveUsers((prev) => prev.filter((u) => u.odId !== data.odId));
      setActiveUserCount(data.activeUsersCount);
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.odId);
        return newMap;
      });
    });

    const cursorCleanup = setInterval(() => {
      const now = Date.now();
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        prev.forEach((cursor, odId) => {
          if (now - cursor.lastUpdate > 5000) {
            newMap.delete(odId);
          }
        });
        return newMap;
      });
    }, 3000);

    return () => {
      socket.off('draw');
      socket.off('shape');
      socket.off('text');
      socket.off('clear-board');
      socket.off('cursor-update');
      socket.off('cursor-remove');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('laser');
      socket.off('stickynote');
      socket.off('stickynote-update');
      socket.off('stickynote-delete');
      socket.off('highlight');
      clearInterval(cursorCleanup);
    };
  }, [boardId, draw, drawShape, drawText]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      // Use changedTouches for touchend, touches for touchstart/touchmove
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return { x: 0, y: 0 };
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const emitCursorPosition = useCallback((x: number, y: number, drawing: boolean) => {
    const now = Date.now();
    if (now - cursorThrottleRef.current < 30) return;
    cursorThrottleRef.current = now;

    if (socketRef.current) {
      socketRef.current.emit('cursor-move', {
        boardId,
        x,
        y,
        isDrawing: drawing,
      });
    }
  }, [boardId]);

  // Throttle ref for laser pointer
  const laserThrottleRef = useRef<number>(0);
    
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e);
    emitCursorPosition(x, y, isDrawing);
    
    // Laser pointer - broadcast position (throttled)
    if (tool === 'laser') {
      const now = Date.now();
      if (socketRef.current && now - laserThrottleRef.current > 30) {
        laserThrottleRef.current = now;
        socketRef.current.emit('laser', {
          boardId,
          x,
          y,
          color: getUserColor(),
          username: getUsername(),
        });
      }
      setLaserPoints(prev => [...prev.filter(p => Date.now() - p.timestamp < 800), {
        odId: getUserId(),
        username: getUsername(),
        color: getUserColor(),
        x,
        y,
        timestamp: Date.now(),
      }]);
    }
    
    if (isDrawing) {
      if (tool === 'pan' && panStartRef.current) {
        setPanOffset({
          x: panOffset.x + (x - panStartRef.current.x),
          y: panOffset.y + (y - panStartRef.current.y),
        });
        panStartRef.current = { x, y };
      } else if (!['select', 'pan', 'pen', 'eraser', 'text', 'highlighter', 'laser', 'stickynote', 'image'].includes(tool) && shapeStartRef.current) {
        const overlayCanvas = overlayCanvasRef.current;
        const ctx = overlayCanvas?.getContext('2d');
        if (ctx && overlayCanvas) {
          ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          drawShape(ctx, {
            type: tool as ShapeData['type'],
            startX: shapeStartRef.current.x,
            startY: shapeStartRef.current.y,
            endX: x,
            endY: y,
            color: (tool === 'icon' && selectedShapeIcon?.color) ? selectedShapeIcon.color : color,
            lineWidth,
            strokeStyle,
            opacity,
            fill,
            fillColor: color,
            techLogoId: (tool === 'icon' && selectedShapeIcon?.id) ? selectedShapeIcon.id : undefined,
          });
        }
      } else if (tool === 'highlighter') {
        // Highlighter - semi-transparent wide stroke
        continueHighlighting(e);
      } else {
        continueDrawing(e);
      }
    }
  };

  // Throttle ref for highlight events
  const highlightThrottleRef = useRef<number>(0);
  
  const continueHighlighting = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!lastPosRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Throttle socket emit to reduce network load (every 16ms ~ 60fps)
    const now = Date.now();
    if (socketRef.current && now - highlightThrottleRef.current > 16) {
      highlightThrottleRef.current = now;
      socketRef.current.emit('highlight', {
        boardId,
        x,
        y,
        prevX: lastPosRef.current.x,
        prevY: lastPosRef.current.y,
        color,
      });
    }

    lastPosRef.current = { x, y };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    emitCursorPosition(x, y, isDrawing);
    
    // Store last position for shape tools
    lastPosRef.current = { x, y };
    
    if (isDrawing) {
      continueDrawing(e);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);

    if (tool === 'text') {
      setTextInput({ x, y, visible: true });
      setTextValue('');
      return;
    }

    if (tool === 'stickynote') {
      handleStickyNoteClick(x, y);
      return;
    }

    if (tool === 'laser') {
      return; // Laser is handled in mousemove
    }

    if (tool === 'select') return;

    saveToUndoStack();

    setIsDrawing(true);
    lastPosRef.current = { x, y };
    
    if (['select', 'pan', 'pen', 'eraser', 'text', 'highlighter', 'laser', 'stickynote', 'image'].includes(tool) === false) {
      shapeStartRef.current = { x, y };
    }
    
    if (tool === 'pan') {
      panStartRef.current = { x, y };
    }
    
    emitCursorPosition(x, y, true);
  };

  // Throttle ref for draw events
  const drawThrottleRef = useRef<number>(0);
  
  const continueDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPosRef.current) return;
    // Skip for shape tools (everything except these drawing tools)
    const drawingTools = ['pen', 'eraser', 'highlighter'];
    if (!drawingTools.includes(tool)) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    const currentColor = tool === 'eraser' ? backgroundColor : color;
    const currentWidth = tool === 'eraser' ? 20 : tool === 'highlighter' ? 20 : lineWidth;
    const currentOpacity = tool === 'highlighter' ? 30 : opacity;

    if (tool === 'highlighter') {
      ctx.globalAlpha = 0.3;
    }
    
    draw(ctx, x, y, lastPosRef.current.x, lastPosRef.current.y, currentColor, currentWidth, currentOpacity);
    
    ctx.globalAlpha = 1;

    // Throttle socket emit to reduce network load (every 16ms ~ 60fps)
    const now = Date.now();
    if (socketRef.current && now - drawThrottleRef.current > 16) {
      drawThrottleRef.current = now;
      socketRef.current.emit('draw', {
        boardId,
        x,
        y,
        prevX: lastPosRef.current.x,
        prevY: lastPosRef.current.y,
        color: currentColor,
        lineWidth: currentWidth,
        opacity: currentOpacity,
        tool,
      });
    }

    lastPosRef.current = { x, y };
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const nonShapeTools = ['select', 'pan', 'pen', 'eraser', 'text', 'highlighter', 'laser', 'stickynote', 'image'];
    const isShapeTool = !nonShapeTools.includes(tool);
    if (isDrawing && isShapeTool && shapeStartRef.current) {
      // Get coordinates from event or use last known position
      let endX: number, endY: number;
      if (e) {
        const coords = getCoordinates(e);
        endX = coords.x;
        endY = coords.y;
      } else if (lastPosRef.current) {
        endX = lastPosRef.current.x;
        endY = lastPosRef.current.y;
      } else {
        endX = shapeStartRef.current.x;
        endY = shapeStartRef.current.y;
      }
      
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (ctx) {
        const shapeData: ShapeData = {
          type: tool as ShapeData['type'],
          startX: shapeStartRef.current.x,
          startY: shapeStartRef.current.y,
          endX,
          endY,
          color: (tool === 'icon' && selectedShapeIcon?.color) ? selectedShapeIcon.color : color,
          lineWidth,
          strokeStyle,
          opacity,
          fill,
          fillColor: color,
          techLogoId: (tool === 'icon' && selectedShapeIcon?.id) ? selectedShapeIcon.id : undefined,
        };
        
        drawShape(ctx, shapeData);

        if (socketRef.current) {
          socketRef.current.emit('shape', {
            boardId,
            ...shapeData,
          });
        }
      }

      const overlayCanvas = overlayCanvasRef.current;
      const overlayCtx = overlayCanvas?.getContext('2d');
      if (overlayCtx && overlayCanvas) {
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      }
    }

    setIsDrawing(false);
    lastPosRef.current = null;
    shapeStartRef.current = null;
    panStartRef.current = null;
    
    if (socketRef.current) {
      socketRef.current.emit('cursor-move', {
        boardId,
        x: -1,
        y: -1,
        isDrawing: false,
      });
    }
  };

  const handleTextSubmit = () => {
    if (!textValue.trim()) {
      setTextInput({ ...textInput, visible: false });
      return;
    }

    saveToUndoStack();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const textData: TextData = {
      x: textInput.x,
      y: textInput.y,
      text: textValue,
      color,
      fontSize: lineWidth * 6 + 12,
    };

    drawText(ctx, textData);

    if (socketRef.current) {
      socketRef.current.emit('text', {
        boardId,
        ...textData,
      });
    }

    setTextInput({ ...textInput, visible: false });
    setTextValue('');
  };

  const clearCanvas = () => {
    saveToUndoStack();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (socketRef.current) {
      socketRef.current.emit('clear-board', { boardId, backgroundColor });
    }
  };

  // Custom cursor SVGs
  const cursorIcons = {
    pen: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/%3E%3Cpath d='m15 5 4 4'/%3E%3C/svg%3E") 2 22, crosshair`,
    eraser: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23fff' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='8' width='16' height='12' rx='2'/%3E%3Cpath d='M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/%3E%3C/svg%3E") 12 20, crosshair`,
    highlighter: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FFFF00' fill-opacity='0.5' stroke='%23333' stroke-width='1.5'%3E%3Cpath d='m9 11-6 6v3h9l3-3'/%3E%3Cpath d='m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4'/%3E%3C/svg%3E") 2 22, crosshair`,
    laser: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FF0000' stroke='%23FF0000' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Ccircle cx='12' cy='12' r='8' fill='none' opacity='0.3'/%3E%3C/svg%3E") 12 12, crosshair`,
    rectangle: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Cline x1='3' y1='3' x2='21' y2='21' stroke='%23999' stroke-dasharray='2'/%3E%3C/svg%3E") 0 0, crosshair`,
    circle: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cline x1='3' y1='3' x2='21' y2='21' stroke='%23999' stroke-dasharray='2'/%3E%3C/svg%3E") 0 0, crosshair`,
    triangle: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M12 2 L22 20 L2 20 Z'/%3E%3C/svg%3E") 0 0, crosshair`,
    star: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FFD700' stroke='%23333' stroke-width='1'%3E%3Cpolygon points='12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9'/%3E%3C/svg%3E") 12 12, crosshair`,
    heart: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FF69B4' stroke='%23333' stroke-width='1'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E") 12 12, crosshair`,
    stickynote: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FFEB3B' stroke='%23333' stroke-width='1.5'%3E%3Cpath d='M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z'/%3E%3Cpath d='M15 3v6h6'/%3E%3C/svg%3E") 0 0, crosshair`,
    image: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E") 0 0, crosshair`,
    line: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cline x1='5' y1='12' x2='19' y2='12'/%3E%3Ccircle cx='3' cy='12' r='2' fill='%23666'/%3E%3C/svg%3E") 0 12, crosshair`,
    arrow: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cline x1='5' y1='12' x2='19' y2='12'/%3E%3Cpath d='m12 5 7 7-7 7'/%3E%3C/svg%3E") 0 12, crosshair`,
  };

  const getCursor = () => {
    switch (tool) {
      case 'select': return 'default';
      case 'pan': return isDrawing ? 'grabbing' : 'grab';
      case 'text': return 'text';
      case 'pen': return cursorIcons.pen;
      case 'eraser': return cursorIcons.eraser;
      case 'highlighter': return cursorIcons.highlighter;
      case 'laser': return cursorIcons.laser;
      case 'rectangle': return cursorIcons.rectangle;
      case 'circle': return cursorIcons.circle;
      case 'triangle': return cursorIcons.triangle;
      case 'star': return cursorIcons.star;
      case 'heart': return cursorIcons.heart;
      case 'stickynote': return cursorIcons.stickynote;
      case 'image': return cursorIcons.image;
      case 'line': return cursorIcons.line;
      case 'arrow': return cursorIcons.arrow;
      default: return 'crosshair';
    }
  };

  // Handle laser pointer movement
  useEffect(() => {
    if (tool !== 'laser') return;
    
    const cleanup = setInterval(() => {
      setLaserPoints(prev => prev.filter(p => Date.now() - p.timestamp < 1000));
    }, 100);

    return () => clearInterval(cleanup);
  }, [tool]);

  // Handle sticky note creation
  const handleStickyNoteClick = (x: number, y: number) => {
    const newNote: StickyNoteData = {
      id: `note-${Date.now()}`,
      x,
      y,
      text: '',
      color: '#FFEB3B',
      width: 200,
      height: 150,
    };
    setStickyNotes(prev => [...prev, newNote]);
    setEditingStickyNote(newNote.id);
    
    if (socketRef.current) {
      socketRef.current.emit('stickynote', { boardId, ...newNote });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const container = containerRef.current;
        if (!container) return;

        // Calculate size - max 400x400
        const maxSize = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }
        
        // Place image in center of visible area
        const x = (container.clientWidth - width) / 2;
        const y = (container.clientHeight - height) / 2;
        
        const newImage: PlacedImage = {
          id: `img-${Date.now()}`,
          src: event.target?.result as string,
          x,
          y,
          width,
          height,
        };
        
        setPlacedImages(prev => [...prev, newImage]);
        setSelectedImage(newImage.id);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setTool('select');
  };

  const drawingUsers = activeUsers.filter(u => u.isDrawing);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select (V)', group: 'basic' },
    { id: 'pan', icon: Hand, label: 'Pan (H)', group: 'basic' },
    { id: 'pen', icon: PenTool, label: 'Pen (P)', group: 'draw' },
    { id: 'highlighter', icon: Highlighter, label: 'Highlighter (G)', group: 'draw' },
    { id: 'laser', icon: Pointer, label: 'Laser Pointer (K)', group: 'draw' },
    { id: 'rectangle', icon: Square, label: 'Rectangle (R)', group: 'shape' },
    { id: 'circle', icon: Circle, label: 'Circle (O)', group: 'shape' },
    { id: 'triangle', icon: Triangle, label: 'Triangle (I)', group: 'shape' },
    { id: 'star', icon: Star, label: 'Star (X)', group: 'shape' },
    { id: 'heart', icon: Heart, label: 'Heart (C)', group: 'shape' },
    { id: 'line', icon: Minus, label: 'Line (L)', group: 'shape' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow (A)', group: 'shape' },
    { id: 'text', icon: Type, label: 'Text (T)', group: 'insert' },
    { id: 'stickynote', icon: StickyNote, label: 'Sticky Note (S)', group: 'insert' },
    { id: 'image', icon: ImageIcon, label: 'Insert Image', group: 'insert' },
  ];

  const stickyNoteColors = ['#FFEB3B', '#FF9800', '#4CAF50', '#03A9F4', '#E91E63', '#9C27B0'];

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Hidden file input for board state load */}
      <input
        ref={boardFileInputRef}
        type="file"
        accept=".json"
        onChange={loadBoardState}
        className="hidden"
      />

      {/* Top Toolbar - Reorganized with stroke, background, width */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 p-1 md:p-2 flex items-center justify-between gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* Toggle Shapes Sidebar - Fancy Pill Toggle */}
          <button
            onClick={() => setShowShapesSidebar(!showShapesSidebar)}
            className={`group relative flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full transition-all duration-500 overflow-hidden ${
              showShapesSidebar
                ? 'bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 shadow-lg shadow-purple-500/30'
                : 'bg-slate-700/80 hover:bg-slate-600/80 border border-slate-500/50'
            }`}
            title={showShapesSidebar ? 'Hide Shapes Panel' : 'Show Shapes Panel'}
          >
            {/* Animated background glow */}
            <div className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 blur-xl transition-opacity duration-500 ${
              showShapesSidebar ? 'group-hover:opacity-50' : ''
            }`} />
            
            {/* Icon with rotation animation */}
            <div className={`relative z-10 transition-transform duration-300 ${showShapesSidebar ? 'rotate-0' : 'rotate-180'}`}>
              <Shapes size={16} className="text-white" />
            </div>
            
            {/* Text label */}
            <span className={`relative z-10 text-[10px] md:text-xs font-semibold text-white transition-all duration-300 ${
              showShapesSidebar ? 'opacity-100 max-w-20' : 'opacity-0 max-w-0 overflow-hidden'
            }`}>
              Shapes
            </span>
            
            {/* Toggle indicator dot */}
            <div className={`relative z-10 w-2 h-2 rounded-full transition-all duration-300 ${
              showShapesSidebar 
                ? 'bg-green-400 shadow-lg shadow-green-400/50 animate-pulse' 
                : 'bg-slate-400'
            }`} />
            
            {/* Sparkle effect when active */}
            {showShapesSidebar && (
              <Sparkles size={12} className="absolute right-1 top-0.5 text-yellow-300 animate-pulse" />
            )}
          </button>

          {/* Basic Tools */}
          <div className="flex items-center gap-0.5 md:gap-1 bg-slate-700/50 p-0.5 md:p-1 rounded-lg md:rounded-xl">
            {tools.filter(t => t.group === 'basic').map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id as Tool)}
                className={`p-1 md:p-2 rounded-md md:rounded-lg transition-all ${
                  tool === t.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-600/50'
                }`}
                title={t.label}
              >
                <t.icon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
              </button>
            ))}
          </div>

          {/* Drawing Tools */}
          <div className="flex items-center gap-0.5 md:gap-1 bg-slate-700/50 p-0.5 md:p-1 rounded-lg md:rounded-xl">
            {tools.filter(t => t.group === 'draw').map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id as Tool)}
                className={`p-1 md:p-2 rounded-md md:rounded-lg transition-all ${
                  tool === t.id
                    ? t.id === 'laser' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
                      : t.id === 'highlighter'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-500/30'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-600/50'
                }`}
                title={t.label}
              >
                <t.icon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
              </button>
            ))}
            <button
              onClick={() => setTool('eraser')}
              className={`p-1 md:p-2 rounded-md md:rounded-lg transition-all ${
                tool === 'eraser'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-600/50'
              }`}
              title="Eraser (E)"
            >
              <Eraser className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>

        {/* Center - Colors and Stroke */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* Stroke Color */}
          <div className="flex items-center gap-0.5 md:gap-1 bg-slate-700/50 p-0.5 md:p-1 rounded-lg md:rounded-xl">
            <span className="text-[8px] md:text-xs text-slate-400 px-0.5 md:px-1">Stroke</span>
            {colors.slice(0, 8).map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-4 h-4 md:w-6 md:h-6 rounded-md transition-all hover:scale-110 ${
                  color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-700' : ''
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Background Color */}
          <div className="flex items-center gap-0.5 md:gap-1 bg-slate-700/50 p-0.5 md:p-1 rounded-lg md:rounded-xl">
            <span className="text-[8px] md:text-xs text-slate-400 px-0.5 md:px-1">BG</span>
            {backgroundColors.slice(0, 7).map((c, i) => (
              <button
                key={i}
                onClick={() => setBackgroundColor(c)}
                className={`w-4 h-4 md:w-6 md:h-6 rounded-md border transition-all hover:scale-110 ${
                  backgroundColor === c 
                    ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-700 border-cyan-400' 
                    : 'border-slate-600'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-0.5 md:gap-1 bg-slate-700/50 p-0.5 md:p-1 rounded-lg md:rounded-xl">
            {strokeWidths.map((sw) => (
              <button
                key={sw.value}
                onClick={() => setLineWidth(sw.value)}
                className={`w-5 h-5 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center transition-all ${
                  lineWidth === sw.value
                    ? 'bg-cyan-500 text-white'
                    : 'text-slate-300 hover:bg-slate-600/50'
                }`}
                title={`${sw.label} - ${sw.value}px`}
              >
                <div 
                  className="bg-current rounded-full"
                  style={{ width: sw.value + 2, height: sw.value + 2 }}
                />
              </button>
            ))}
          </div>

          {/* Fill toggle for shapes */}
          {['rectangle', 'circle', 'triangle', 'star', 'heart', 'diamond', 'hexagon'].includes(tool) && (
            <button
              onClick={() => setFill(!fill)}
              className={`px-1.5 md:px-3 py-1 md:py-2 rounded-md md:rounded-lg text-[8px] md:text-xs font-medium transition-all ${
                fill
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {fill ? 'Filled' : 'Outline'}
            </button>
          )}
        </div>

        {/* Right Side - Toggles and Actions */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => {
              if (!darkMode) {
                // Switching to dark mode - save current light mode bg
                lightModeBgRef.current = backgroundColor;
                setBackgroundColor(darkModeBgRef.current);
                setColor('#FFFFFF');
              } else {
                // Switching to light mode - save current dark mode bg
                darkModeBgRef.current = backgroundColor;
                setBackgroundColor(lightModeBgRef.current);
                setColor('#000000');
              }
              setDarkMode(!darkMode);
            }}
            className={`p-1 md:p-2 rounded-md md:rounded-lg transition-all ${
              darkMode
                ? 'bg-slate-700 text-yellow-400'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" /> : <Moon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />}
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1 md:p-2 rounded-md md:rounded-lg transition-all ${
              showGrid
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
            title="Toggle Grid"
          >
            <Grid3X3 className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
          </button>

          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5 md:gap-1 bg-slate-700/50 p-0.5 md:p-1 rounded-lg md:rounded-xl">
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className={`p-1 md:p-2 rounded-md md:rounded-lg transition-all ${
                undoStack.length > 0
                  ? 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className={`p-1 md:p-2 rounded-md md:rounded-lg transition-all ${
                redoStack.length > 0
                  ? 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Shapes Panel (Like diagrams.net) */}
        <div 
          className={`flex-shrink-0 transition-all duration-300 bg-slate-800/50 border-r border-slate-700/50 overflow-hidden ${showShapesSidebar ? 'w-36 md:w-64' : 'w-0'}`}
        >
          <div className="w-36 md:w-64 h-full flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-700/50 p-1 gap-1 flex-shrink-0">
              <button
                onClick={() => setSidebarTab('shapes')}
                className={`flex-1 px-2 py-1.5 md:py-2 text-[10px] md:text-xs font-medium rounded-md transition-all ${
                  sidebarTab === 'shapes' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Shapes className="w-3 h-3 md:w-4 md:h-4 mx-auto mb-0.5" />
                Shapes
              </button>
              <button
                onClick={() => setSidebarTab('logos')}
                className={`flex-1 px-2 py-1.5 md:py-2 text-[10px] md:text-xs font-medium rounded-md transition-all ${
                  sidebarTab === 'logos' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Cloud className="w-3 h-3 md:w-4 md:h-4 mx-auto mb-0.5" />
                Tech Logos
              </button>
            </div>

            {/* Shapes Tab Content */}
            {sidebarTab === 'shapes' && (
            <div className="flex-1 overflow-y-auto p-1 md:p-2">
            {/* Search */}
            <div className="mb-1.5 md:mb-3 relative">
              <input
                type="text"
                value={shapeSearch}
                onChange={(e) => setShapeSearch(e.target.value)}
                placeholder="🔍 Search shapes..."
                className="w-full px-1.5 md:px-3 py-1 md:py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-[10px] md:text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
              />
              {shapeSearch && (
                <button
                  onClick={() => setShapeSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Results */}
            {shapeSearch && (
              <div className="mb-2 md:mb-3">
                <div className="text-[10px] md:text-xs text-slate-400 px-1 md:px-2 mb-1 md:mb-2">Search Results</div>
                <div className="grid grid-cols-4 gap-0.5 md:gap-1 p-1 md:p-2 bg-slate-700/30 rounded-md md:rounded-lg">
                  {shapeCategories
                    .flatMap(cat => cat.shapes)
                    .filter((shape, index, self) => 
                      self.findIndex(s => s.id === shape.id) === index &&
                      shape.label.toLowerCase().includes(shapeSearch.toLowerCase())
                    )
                    .map((shape, idx) => (
                      <button
                        key={`search-${shape.id}-${idx}`}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          if (shape.id === 'image') {
                            fileInputRef.current?.click();
                          } else {
                            setTool(shape.id as Tool);
                            setSelectedShapeIcon({ icon: shape.icon, label: shape.label });
                          }
                          setShapeSearch('');
                        }}
                        className={`p-1.5 md:p-2 rounded-md md:rounded-lg border transition-all hover:bg-slate-700/50 touch-manipulation active:scale-95 ${
                          tool === shape.id || (selectedShapeIcon?.label === shape.label)
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                            : 'border-slate-600/50 text-slate-400 hover:text-white'
                        }`}
                        title={shape.label}
                      >
                        <shape.icon className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    ))
                  }
                  {shapeCategories
                    .flatMap(cat => cat.shapes)
                    .filter(shape => shape.label.toLowerCase().includes(shapeSearch.toLowerCase())).length === 0 && (
                    <div className="col-span-4 text-center text-slate-500 text-xs py-2">
                      No shapes found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Shape Categories - Show when not searching */}
            {!shapeSearch && shapeCategories.map((category) => (
              <div key={category.name} className="mb-1 md:mb-2">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between px-1 md:px-2 py-1 md:py-1.5 text-[10px] md:text-sm font-medium text-slate-300 hover:bg-slate-700/50 rounded-md md:rounded-lg transition-all"
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <ChevronDown 
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform ${expandedCategories.includes(category.name) ? '' : '-rotate-90'}`}
                    />
                    {category.name}
                  </div>
                </button>
                
                {expandedCategories.includes(category.name) && (
                  <div className="grid grid-cols-4 gap-0.5 md:gap-1 p-1 md:p-2">
                    {category.shapes.map((shape, idx) => (
                      <button
                        key={`${shape.id}-${idx}`}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          if (shape.id === 'image') {
                            fileInputRef.current?.click();
                          } else {
                            setTool(shape.id as Tool);
                            setSelectedShapeIcon({ icon: shape.icon, label: shape.label });
                          }
                        }}
                        onClick={() => {
                          if (shape.id === 'image') {
                            fileInputRef.current?.click();
                          } else {
                            setTool(shape.id as Tool);
                            setSelectedShapeIcon({ icon: shape.icon, label: shape.label });
                          }
                        }}
                        className={`p-1.5 md:p-2 rounded-md md:rounded-lg border transition-all hover:bg-slate-700/50 touch-manipulation active:scale-95 ${
                          tool === shape.id || (selectedShapeIcon?.label === shape.label)
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                            : 'border-slate-600/50 text-slate-400 hover:text-white'
                        }`}
                        title={shape.label}
                      >
                        <shape.icon className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
            )}

            {/* Tech Logos Tab Content */}
            {sidebarTab === 'logos' && (
            <div className="flex-1 overflow-y-auto p-1 md:p-2">
            {/* Search */}
            <div className="mb-1.5 md:mb-3 relative">
              <input
                type="text"
                value={logoSearch}
                onChange={(e) => setLogoSearch(e.target.value)}
                placeholder="🔍 Search AWS, Azure, GCP..."
                className="w-full px-1.5 md:px-3 py-1 md:py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-[10px] md:text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
              />
              {logoSearch && (
                <button
                  onClick={() => setLogoSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Results for Logos */}
            {logoSearch && (
              <div className="mb-2 md:mb-3">
                <div className="text-[10px] md:text-xs text-slate-400 px-1 md:px-2 mb-1 md:mb-2">Search Results</div>
                <div className="grid grid-cols-4 gap-0.5 md:gap-1 p-1 md:p-2 bg-slate-700/30 rounded-md md:rounded-lg">
                  {searchTechLogos(logoSearch).slice(0, 24).map((logo, idx) => {
                    const LogoIcon = logo.icon;
                    return (
                      <button
                        key={`logo-search-${logo.id}-${idx}`}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          setTool('icon' as Tool);
                          setSelectedShapeIcon({ icon: logo.icon, label: logo.label, id: logo.id, color: logo.color });
                          setLogoSearch('');
                        }}
                        className={`p-1.5 md:p-2 rounded-md md:rounded-lg border transition-all hover:bg-slate-700/50 touch-manipulation active:scale-95 ${
                          selectedShapeIcon?.label === logo.label
                            ? 'bg-cyan-500/20 border-cyan-500'
                            : 'border-slate-600/50 hover:border-slate-500'
                        }`}
                        title={`${logo.label} (${logo.category})`}
                      >
                        <LogoIcon className="w-4 h-4 md:w-5 md:h-5" color={logo.color} />
                      </button>
                    );
                  })}
                  {searchTechLogos(logoSearch).length === 0 && (
                    <div className="col-span-4 text-center text-slate-500 text-xs py-2">
                      No logos found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Logo Categories - Show when not searching */}
            {!logoSearch && techLogoCategories.map((category) => (
              <div key={category.name} className="mb-1 md:mb-2">
                <button
                  onClick={() => toggleLogoCategory(category.name)}
                  className="w-full flex items-center justify-between px-1 md:px-2 py-1 md:py-1.5 text-[10px] md:text-sm font-medium text-slate-300 hover:bg-slate-700/50 rounded-md md:rounded-lg transition-all"
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <ChevronDown 
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform ${expandedLogoCategories.includes(category.name) ? '' : '-rotate-90'}`}
                    />
                    <span className="truncate">{category.name}</span>
                  </div>
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: category.color }}
                  />
                </button>
                
                {expandedLogoCategories.includes(category.name) && (
                  <div className="grid grid-cols-4 gap-0.5 md:gap-1 p-1 md:p-2">
                    {category.logos.map((logo, idx) => {
                      const LogoIcon = logo.icon;
                      return (
                        <button
                          key={`${logo.id}-${idx}`}
                          onPointerDown={(e) => {
                            e.preventDefault();
                            setTool('icon' as Tool);
                            setSelectedShapeIcon({ icon: logo.icon, label: logo.label, id: logo.id, color: logo.color });
                          }}
                          onClick={() => {
                            setTool('icon' as Tool);
                            setSelectedShapeIcon({ icon: logo.icon, label: logo.label, id: logo.id, color: logo.color });
                          }}
                          className={`p-1.5 md:p-2 rounded-md md:rounded-lg border transition-all hover:bg-slate-700/50 touch-manipulation active:scale-95 ${
                            selectedShapeIcon?.label === logo.label
                              ? 'bg-cyan-500/20 border-cyan-500'
                              : 'border-slate-600/50 hover:border-slate-500'
                          }`}
                          title={logo.label}
                        >
                          <LogoIcon className="w-4 h-4 md:w-5 md:h-5" color={logo.color} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Drawing Status */}
          {drawingUsers.length > 0 && (
            <div className="bg-amber-500/20 border-b border-amber-500/30 px-3 py-2 flex items-center gap-2 animate-pulse">
              <Pencil size={14} className="text-amber-400" />
              <span className="text-amber-300 text-xs">
                {drawingUsers.map(u => u.username).join(', ')} {drawingUsers.length === 1 ? 'is' : 'are'} drawing...
              </span>
            </div>
          )}

          {/* User Panel */}
          {showUserPanel && (
            <div className="bg-slate-800/90 border-b border-slate-700/30 px-3 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-slate-400" />
                <span className="text-slate-300 text-xs font-medium">Active Users</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {activeUsers.map((user) => (
                  <div 
                    key={user.odId} 
                    className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs border ${
                      user.isDrawing 
                        ? 'bg-amber-500/20 border-amber-500/50 animate-pulse' 
                        : 'bg-slate-700/50 border-slate-600/50'
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-slate-300">{user.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canvas Container */}
          <div 
            ref={containerRef} 
            className="flex-1 relative overflow-auto"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              style={{ 
                transform: `scale(${zoom / 100})`, 
                transformOrigin: 'top left',
                width: zoom !== 100 ? `${10000 / zoom}%` : '100%',
                height: zoom !== 100 ? `${10000 / zoom}%` : '100%'
              }}
            >
              {/* Grid Overlay */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(rgba(128,128,128,0.3) 1px, transparent 1px), 
                                      linear-gradient(90deg, rgba(128,128,128,0.3) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    zIndex: 1
                  }}
                />
              )}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDrawing}
                onMouseLeave={() => stopDrawing()}
                onTouchStart={startDrawing}
                onTouchMove={handleTouchMove}
                onTouchEnd={stopDrawing}
                className="absolute inset-0 touch-none"
                style={{ cursor: getCursor(), backgroundColor }}
              />
              <canvas
                ref={overlayCanvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 2 }}
              />
            </div>

            {/* Text Input */}
            {textInput.visible && (
              <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onBlur={handleTextSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTextSubmit();
                  if (e.key === 'Escape') setTextInput({ ...textInput, visible: false });
                }}
                className="absolute bg-transparent border-none outline-none"
                style={{
                  left: textInput.x,
                  top: textInput.y - 10,
                  color: color,
                  fontSize: lineWidth * 6 + 12,
                }}
                autoFocus
              />
            )}
            
            {/* Remote Cursors */}
            {Array.from(remoteCursors.values()).map((cursor) => (
              cursor.x >= 0 && cursor.y >= 0 && (
                <div
                  key={cursor.odId}
                  className="absolute pointer-events-none transition-all duration-75 ease-out z-50"
                  style={{
                    left: cursor.x,
                    top: cursor.y,
                    transform: 'translate(-2px, -2px)',
                  }}
                >
                  <div 
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${cursor.isDrawing ? 'animate-pulse scale-125' : ''}`}
                    style={{ backgroundColor: cursor.color }}
                  />
                  <div 
                    className={`absolute left-5 top-0 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap shadow-lg ${
                      cursor.isDrawing ? 'animate-pulse' : ''
                    }`}
                    style={{ 
                      backgroundColor: cursor.color,
                      color: isLightColor(cursor.color) ? '#000' : '#fff'
                    }}
                  >
                    {cursor.username}
                    {cursor.isDrawing && ' ✏️'}
                  </div>
                </div>
              )
            ))}

            {/* Laser Pointer Effects */}
            {laserPoints.map((point, index) => {
              const age = Date.now() - point.timestamp;
              const fadeOpacity = Math.max(0, 1 - age / 800);
              const scale = 1 + (age / 800) * 0.5;
              
              return (
                <div
                  key={`${point.odId}-${index}`}
                  className="absolute pointer-events-none z-40"
                  style={{
                    left: point.x,
                    top: point.y,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    opacity: fadeOpacity,
                  }}
                >
                  {/* Outer glow */}
                  <div 
                    className="w-8 h-8 rounded-full absolute -inset-2"
                    style={{ 
                      backgroundColor: point.color,
                      filter: 'blur(8px)',
                      opacity: 0.5,
                    }}
                  />
                  {/* Inner dot */}
                  <div 
                    className="w-4 h-4 rounded-full relative shadow-lg"
                    style={{ 
                      backgroundColor: point.color,
                      boxShadow: `0 0 20px ${point.color}, 0 0 40px ${point.color}`,
                    }}
                  />
                  {/* Username */}
                  <div 
                    className="absolute left-6 top-0 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap"
                    style={{ 
                      backgroundColor: point.color,
                      color: isLightColor(point.color) ? '#000' : '#fff'
                    }}
                  >
                    🔴 {point.username}
                  </div>
                </div>
              );
            })}

            {/* Sticky Notes */}
            {stickyNotes.map((note) => (
              <div
                key={note.id}
                className={`absolute shadow-lg rounded select-none ${draggingStickyNote === note.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  left: note.x,
                  top: note.y,
                  width: note.width,
                  minHeight: note.height,
                  backgroundColor: note.color,
                  zIndex: draggingStickyNote === note.id ? 50 : 30,
                  transition: draggingStickyNote === note.id ? 'none' : 'box-shadow 0.2s',
                  boxShadow: draggingStickyNote === note.id ? '0 10px 40px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.15)',
                }}
                onMouseDown={(e) => {
                  if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'BUTTON') return;
                  e.preventDefault();
                  setDraggingStickyNote(note.id);
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
              >
                {/* Drag handle */}
                <div className="h-5 bg-black/10 rounded-t flex items-center justify-center cursor-grab">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-black/30" />
                    <div className="w-1 h-1 rounded-full bg-black/30" />
                    <div className="w-1 h-1 rounded-full bg-black/30" />
                  </div>
                </div>
                <div className="p-2 h-full flex flex-col">
                  {/* Color picker bar */}
                  <div className="flex gap-1 mb-2 pb-2 border-b border-black/10">
                    {stickyNoteColors.map((c) => (
                      <button
                        key={c}
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = { ...note, color: c };
                          setStickyNotes(prev => prev.map(n => n.id === note.id ? updated : n));
                          if (socketRef.current) {
                            socketRef.current.emit('stickynote-update', { boardId, ...updated });
                          }
                        }}
                        className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${note.color === c ? 'ring-2 ring-black/30' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStickyNotes(prev => prev.filter(n => n.id !== note.id));
                        if (socketRef.current) {
                          socketRef.current.emit('stickynote-delete', { boardId, id: note.id });
                        }
                      }}
                      className="ml-auto text-black/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {/* Text content */}
                  {editingStickyNote === note.id ? (
                    <textarea
                      autoFocus
                      value={note.text}
                      onChange={(e) => {
                        const updated = { ...note, text: e.target.value };
                        setStickyNotes(prev => prev.map(n => n.id === note.id ? updated : n));
                      }}
                      onBlur={() => {
                        setEditingStickyNote(null);
                        if (socketRef.current) {
                          socketRef.current.emit('stickynote-update', { boardId, ...note });
                        }
                      }}
                      className="flex-1 bg-transparent resize-none outline-none text-black/80 text-sm placeholder-black/40"
                      placeholder="Type your note..."
                    />
                  ) : (
                    <div
                      onClick={() => setEditingStickyNote(note.id)}
                      className="flex-1 text-black/80 text-sm cursor-text min-h-[60px]"
                    >
                      {note.text || <span className="text-black/40">Click to edit...</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Placed Images */}
            {placedImages.map((img) => (
              <div
                key={img.id}
                className={`absolute ${draggingImage === img.id ? 'cursor-grabbing' : 'cursor-move'} ${selectedImage === img.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''}`}
                style={{
                  left: img.x,
                  top: img.y,
                  width: img.width,
                  height: img.height,
                  zIndex: draggingImage === img.id ? 50 : 25,
                  transition: draggingImage === img.id ? 'none' : 'box-shadow 0.2s',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(img.id);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedImage(img.id);
                  setDraggingImage(img.id);
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setImageDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
              >
                <img
                  src={img.src}
                  alt="Uploaded"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
                {selectedImage === img.id && (
                  <>
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSelectedImage();
                      }}
                      className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                      title="Delete image"
                    >
                      <X size={14} />
                    </button>
                    {/* Move handle indicator */}
                    <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none" />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                      Drag to move • Press Delete to remove
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-slate-800/80 border-t border-slate-700/50 px-1.5 md:px-3 py-1 md:py-2 flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              {/* Zoom controls */}
              <div className="flex items-center gap-0.5 md:gap-1 bg-slate-700/50 rounded-lg px-1 md:px-2 py-0.5 md:py-1 flex-shrink-0">
                <button 
                  onClick={zoomOut}
                  disabled={zoom <= 25}
                  className="text-slate-400 hover:text-white p-0.5 md:p-1 disabled:opacity-30 disabled:cursor-not-allowed text-xs md:text-base"
                  title="Zoom Out"
                >−</button>
                <span className="text-[8px] md:text-xs text-slate-300 w-7 md:w-12 text-center">{zoom}%</span>
                <button 
                  onClick={zoomIn}
                  disabled={zoom >= 200}
                  className="text-slate-400 hover:text-white p-0.5 md:p-1 disabled:opacity-30 disabled:cursor-not-allowed text-xs md:text-base"
                  title="Zoom In"
                >+</button>
              </div>
              
              {/* Undo/Redo */}
              <div className="flex items-center gap-0.5 md:gap-1 bg-slate-700/50 rounded-lg p-0.5 md:p-1">
                <button
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  className="p-0.5 md:p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className="p-0.5 md:p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-0.5 md:gap-2 flex-shrink-0">
              {/* Save Board State */}
              <button
                onClick={saveBoardState}
                className="flex items-center gap-0.5 md:gap-1.5 px-1.5 md:px-3 py-0.5 md:py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-[8px] md:text-xs border border-green-500/30 transition-all"
                title="Save Board State"
              >
                <Save className="w-2.5 h-2.5 md:w-[14px] md:h-[14px]" />
                Save
              </button>

              {/* Load Board State */}
              <button
                onClick={() => boardFileInputRef.current?.click()}
                className="flex items-center gap-0.5 md:gap-1.5 px-1.5 md:px-3 py-0.5 md:py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-[8px] md:text-xs border border-blue-500/30 transition-all"
                title="Load Board State"
              >
                <FolderOpen className="w-2.5 h-2.5 md:w-[14px] md:h-[14px]" />
                Load
              </button>

              {/* Export */}
              <button
                onClick={exportAsImage}
                className="flex items-center gap-0.5 md:gap-1.5 px-1.5 md:px-3 py-0.5 md:py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-[8px] md:text-xs transition-all"
              >
                <Download className="w-2.5 h-2.5 md:w-[14px] md:h-[14px]" />
                Export
              </button>

              {/* Clear */}
              <button
                onClick={clearCanvas}
                className="flex items-center gap-0.5 md:gap-1.5 px-1.5 md:px-3 py-0.5 md:py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-[8px] md:text-xs border border-red-500/30 transition-all"
              >
                <Trash2 className="w-2.5 h-2.5 md:w-[14px] md:h-[14px]" />
                Clear
              </button>

              {/* Users */}
              <button
                onClick={() => setShowUserPanel(!showUserPanel)}
                className="flex items-center gap-0.5 md:gap-1.5 bg-green-500/20 rounded-lg px-1.5 md:px-3 py-0.5 md:py-1.5 border border-green-500/30 hover:bg-green-500/30 transition-all"
              >
                <Users className="w-2.5 h-2.5 md:w-[14px] md:h-[14px] text-green-400" />
                <span className="font-semibold text-green-400 text-[8px] md:text-xs">{activeUserCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 180;
}
