import { useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Play,
  Settings,
  Users,
  FileText,
  Mail,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { AutomationHeader } from "@/components/automation/AutomationHeader";

// Types
interface NodeData {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Custom Node Components
const TriggerNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="bg-white border-2 border-blue-300 rounded-lg p-4 shadow-md min-w-[200px]">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-blue-100">{data.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="default" className="bg-blue-500">
              Trigger
            </Badge>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {data.title}
          </h4>
          <p className="text-xs text-gray-500">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

const ActionNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="bg-white border-2 border-green-300 rounded-lg p-4 shadow-md min-w-[200px]">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-green-100">{data.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="secondary" className="bg-green-500 text-white">
              Action
            </Badge>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {data.title}
          </h4>
          <p className="text-xs text-gray-500">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

const initialNodes: Node[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 100, y: 100 },
    data: {
      title: "New Audience",
      description: "Fires when a new person is added to the audience list",
      icon: <Users className="w-5 h-5 text-blue-600" />,
    },
  },
  {
    id: "action-1",
    type: "action",
    position: { x: 400, y: 100 },
    data: {
      title: "Send Welcome Email",
      description: "Send a welcome email to the new audience member",
      icon: <Mail className="w-5 h-5 text-green-600" />,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "trigger-1",
    target: "action-1",
    type: "smoothstep",
  },
];

export function WorkflowEditorPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [workflowName, setWorkflowName] = useState(
    location.state?.workflowName ||
      slug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "Welcome Flow"
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = () => {
    console.log("Saving workflow:", workflowName, { nodes, edges });
    // TODO: Implement save functionality
  };

  const handleStartCampaign = () => {
    console.log("Starting campaign");
    // TODO: Implement start campaign functionality
  };

  const addTriggerNode = (type: string) => {
    const newNode: Node = {
      id: `trigger-${Date.now()}`,
      type: "trigger",
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: getTriggerData(type),
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addActionNode = (type: string) => {
    const newNode: Node = {
      id: `action-${Date.now()}`,
      type: "action",
      position: { x: Math.random() * 300 + 200, y: Math.random() * 300 },
      data: getActionData(type),
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const getTriggerData = (type: string) => {
    const triggers = {
      "new-audience": {
        title: "New Audience",
        description: "Fires when a new person is added to the audience list",
        icon: <Users className="w-5 h-5 text-blue-600" />,
      },
      "form-submission": {
        title: "Form Submission",
        description: "A person submits a form",
        icon: <FileText className="w-5 h-5 text-blue-600" />,
      },
      "time-based": {
        title: "Time-based Trigger",
        description: "Triggers at a specific time or interval",
        icon: <Clock className="w-5 h-5 text-blue-600" />,
      },
    };
    return triggers[type as keyof typeof triggers] || triggers["new-audience"];
  };

  const getActionData = (type: string) => {
    const actions = {
      "send-email": {
        title: "Send Email",
        description: "Send an email to the person",
        icon: <Mail className="w-5 h-5 text-green-600" />,
      },
      "update-properties": {
        title: "Update Properties",
        description: "Update person properties",
        icon: <Settings className="w-5 h-5 text-green-600" />,
      },
    };
    return actions[type as keyof typeof actions] || actions["send-email"];
  };

  return (
    <div className="flex-1 overflow-hidden border m-1 rounded-xl">
      <AutomationHeader />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/automation")}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-500">Automation</span>
            <span className="text-sm text-gray-400">/</span>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-sm font-semibold bg-transparent border-none outline-none focus:ring-0 text-gray-900  border-b border-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button onClick={handleStartCampaign}>
            <Play className="w-4 h-4" />
            Start Campaign
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex h-[calc(100vh-139px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Triggers
              </h3>
              <div className="space-y-2">
                <div
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => addTriggerNode("new-audience")}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">New Audience</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Fires when a new person is added to the audience list
                  </p>
                </div>
                <div
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => addTriggerNode("form-submission")}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Form Submission</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    A person submits a form
                  </p>
                </div>
                <div
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => addTriggerNode("time-based")}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Time-based</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Triggers at a specific time or interval
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Actions
              </h3>
              <div className="space-y-2">
                <div
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => addActionNode("send-email")}
                >
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Send Email</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Send an email to the person
                  </p>
                </div>
                <div
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => addActionNode("update-properties")}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">
                      Update Properties
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Update person properties
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView={false}
            fitViewOptions={{
              padding: 0.2,
            }}
            className="bg-gray-50"
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Cross} gap={10} size={2} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
