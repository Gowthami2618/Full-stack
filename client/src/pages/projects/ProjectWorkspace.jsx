import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Sparkles,
  ListTodo,
  Layers,
  DollarSign,
  Calendar,
  FileText,
  History,
  MapPin,
  Clock,
  Plus,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Upload,
  Paperclip,
  ExternalLink,
  Hammer,
} from 'lucide-react';
import {
  projectsAPI,
  proposalsAPI,
  revisionsAPI,
  tasksAPI,
  materialsAPI,
  expensesAPI,
  milestonesAPI,
  filesAPI,
  usersAPI,
  auditLogsAPI,
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Modal from '../../components/common/Modal';
import Tabs from '../../components/common/Tabs';
import Avatar from '../../components/common/Avatar';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export const ProjectWorkspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab Data States
  const [proposals, setProposals] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [expensesData, setExpensesData] = useState({ expenses: [], budgetSummary: null });
  const [milestones, setMilestones] = useState([]);
  const [files, setFiles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [contractorsList, setContractorsList] = useState([]);

  // Modals States
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [selectedProposalForRevision, setSelectedProposalForRevision] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showAssignContractorModal, setShowAssignContractorModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Form Submissions State
  const [modalLoading, setModalLoading] = useState(false);

  // Proposal Form
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    designStyle: 'Modern',
    estimatedCost: '',
    estimatedDuration: '6 Weeks',
    notes: '',
  });

  // Revision Form
  const [revisionForm, setRevisionForm] = useState({
    message: '',
    requestedChanges: '',
  });

  // Task Form
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assignedTo: '',
    dueDate: '',
  });

  // Task Comment Text
  const [commentText, setCommentText] = useState({});

  // Material Form
  const [materialForm, setMaterialForm] = useState({
    name: '',
    category: 'Flooring',
    supplier: '',
    quantity: 1,
    unit: 'units',
    estimatedCost: '',
    actualCost: '',
    status: 'PLANNED',
  });

  // Expense Form
  const [expenseForm, setExpenseForm] = useState({
    category: 'Materials',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Milestone Form
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    completionPercentage: 0,
    status: 'UPCOMING',
  });

  // File Upload Form
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('Document');
  const [fileName, setFileName] = useState('');

  // Selected Contractor for Assignment
  const [selectedContractorId, setSelectedContractorId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProgress, setSelectedProgress] = useState(0);

  // Fetch Project Deep Details
  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getProjectById(id);
      if (res.data?.data) {
        const p = res.data.data;
        setProject(p);
        setSelectedStatus(p.status);
        setSelectedProgress(p.progress || 0);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load project details.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  // Fetch specific tab data on demand
  const fetchTabData = useCallback(async (tab) => {
    if (!id) return;
    try {
      if (tab === 'proposals') {
        const [pRes, rRes] = await Promise.all([
          proposalsAPI.getProposals({ projectId: id }),
          revisionsAPI.getRevisions({ projectId: id }),
        ]);
        setProposals(pRes.data?.data || []);
        setRevisions(rRes.data?.data || []);
      } else if (tab === 'tasks') {
        const res = await tasksAPI.getTasks({ projectId: id });
        setTasks(res.data?.data || []);
      } else if (tab === 'materials') {
        const res = await materialsAPI.getMaterials({ projectId: id });
        setMaterials(res.data?.data || []);
      } else if (tab === 'budget') {
        const res = await expensesAPI.getExpenses({ projectId: id });
        setExpensesData(res.data?.data || { expenses: [], budgetSummary: null });
      } else if (tab === 'timeline') {
        const res = await milestonesAPI.getMilestones({ projectId: id });
        setMilestones(res.data?.data || []);
      } else if (tab === 'files' || tab === 'designs') {
        const res = await filesAPI.getFiles({ projectId: id });
        setFiles(res.data?.data || []);
      } else if (tab === 'activity') {
        const res = await auditLogsAPI.getAuditLogs({ search: id });
        setAuditLogs(res.data?.data || []);
      }
    } catch (err) {
      console.error(`Failed to load ${tab} data:`, err);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  // Load contractors list when assign modal opens
  const openAssignContractorModal = async () => {
    try {
      const res = await usersAPI.getProfessionals({ role: 'CONTRACTOR' });
      setContractorsList(res.data?.data || []);
      setShowAssignContractorModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for Proposal Actions
  const handleCreateProposal = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await proposalsAPI.createProposal({
        ...proposalForm,
        projectId: id,
        estimatedCost: Number(proposalForm.estimatedCost),
        sendImmediately: true,
      });
      showToast('Proposal submitted to client successfully!', 'success');
      setShowProposalModal(false);
      fetchTabData('proposals');
      fetchProjectDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit proposal', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleApproveProposal = async (proposalId) => {
    try {
      await proposalsAPI.approveProposal(proposalId);
      showToast('Proposal approved! Project unlocked for contractor execution.', 'success');
      fetchTabData('proposals');
      fetchProjectDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve proposal', 'error');
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await proposalsAPI.rejectProposal(proposalId, { reason: 'Requirements not met' });
      showToast('Proposal rejected.', 'info');
      fetchTabData('proposals');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to reject proposal', 'error');
    }
  };

  const handleRequestRevision = async (e) => {
    e.preventDefault();
    if (!selectedProposalForRevision) return;
    try {
      setModalLoading(true);
      await proposalsAPI.requestRevision(selectedProposalForRevision._id, {
        message: revisionForm.message,
        requestedChanges: revisionForm.requestedChanges
          ? revisionForm.requestedChanges.split('\n')
          : [],
      });
      showToast('Revision request sent to designer.', 'success');
      setShowRevisionModal(false);
      fetchTabData('proposals');
      fetchProjectDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to request revision', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Handlers for Task Creation & Comments
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await tasksAPI.createTask({
        ...taskForm,
        projectId: id,
        assignedTo: taskForm.assignedTo || null,
      });
      showToast('Task added successfully!', 'success');
      setShowTaskModal(false);
      fetchTabData('tasks');
    } catch (err) {
      showToast('Failed to add task', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddComment = async (taskId) => {
    const text = commentText[taskId];
    if (!text || text.trim() === '') return;
    try {
      await tasksAPI.addComment(taskId, { text });
      setCommentText({ ...commentText, [taskId]: '' });
      fetchTabData('tasks');
    } catch (err) {
      showToast('Failed to post comment', 'error');
    }
  };

  const handleTaskStatusToggle = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateTask(taskId, { status: newStatus });
      fetchTabData('tasks');
    } catch (err) {
      showToast('Failed to update task', 'error');
    }
  };

  // Handlers for Materials
  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await materialsAPI.createMaterial({
        ...materialForm,
        projectId: id,
        quantity: Number(materialForm.quantity),
        estimatedCost: Number(materialForm.estimatedCost) || 0,
        actualCost: Number(materialForm.actualCost) || 0,
      });
      showToast('Material specification added!', 'success');
      setShowMaterialModal(false);
      fetchTabData('materials');
    } catch (err) {
      showToast('Failed to add material', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Handlers for Expenses
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await expensesAPI.addExpense({
        ...expenseForm,
        projectId: id,
        amount: Number(expenseForm.amount),
      });
      showToast('Expense recorded and budget updated!', 'success');
      setShowExpenseModal(false);
      fetchTabData('budget');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to log expense', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Handlers for Milestones
  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await milestonesAPI.createMilestone({
        ...milestoneForm,
        projectId: id,
        completionPercentage: Number(milestoneForm.completionPercentage),
      });
      showToast('Milestone created!', 'success');
      setShowMilestoneModal(false);
      fetchTabData('timeline');
    } catch (err) {
      showToast('Failed to create milestone', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Handlers for File Upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select a file to upload.', 'error');
      return;
    }
    try {
      setModalLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('projectId', id);
      formData.append('name', fileName || selectedFile.name);
      formData.append('fileType', fileType);

      await filesAPI.uploadFile(formData);
      showToast('File uploaded successfully!', 'success');
      setShowFileUploadModal(false);
      setSelectedFile(null);
      fetchTabData(activeTab);
      fetchProjectDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload file', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Handlers for Assigning Contractor
  const handleAssignContractor = async (e) => {
    e.preventDefault();
    if (!selectedContractorId) return;
    try {
      setModalLoading(true);
      await projectsAPI.assignProfessional(id, { contractorId: selectedContractorId });
      showToast('Contractor assigned to project!', 'success');
      setShowAssignContractorModal(false);
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to assign contractor', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Handlers for Updating Overall Status
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await projectsAPI.updateStatus(id, {
        status: selectedStatus,
        progress: Number(selectedProgress),
      });
      showToast('Project status updated!', 'success');
      setShowStatusModal(false);
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to update status', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading || !project) {
    return <LoadingSpinner text="Opening Project Workspace..." />;
  }

  // Permissions helper
  const isClient = project.client?._id === user?._id;
  const isDesigner = project.designer?._id === user?._id;
  const isContractor = project.contractor?._id === user?._id;
  const isAdmin = user?.role === 'ADMIN';

  const canEditProject = isClient || isAdmin;
  const canSubmitProposal = (user?.role === 'DESIGNER' || isAdmin) && project.status !== 'COMPLETED';

  const workspaceTabs = [
    { id: 'overview', label: 'Overview', icon: FolderKanban },
    { id: 'designs', label: 'Designs & Renders', icon: Sparkles },
    { id: 'proposals', label: 'Proposals & Revisions', icon: FileText, count: proposals.length },
    { id: 'tasks', label: 'Tasks Board', icon: ListTodo, count: tasks.length },
    { id: 'materials', label: 'Materials & Specs', icon: Layers, count: materials.length },
    { id: 'budget', label: 'Budget & Expenses', icon: DollarSign },
    { id: 'timeline', label: 'Timeline & Milestones', icon: Calendar, count: milestones.length },
    { id: 'files', label: 'Files & Blueprints', icon: Paperclip, count: files.length },
    { id: 'activity', label: 'Activity Logs', icon: History },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Workspace Header Banner */}
      <GlassCard className="p-6 sm:p-8 border-sky-400/25 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                {project.projectType} • {project.propertyType}
              </span>
              <StatusBadge status={project.status} />
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {project.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <Avatar src={project.client?.profileImage} name={project.client?.name} size="sm" />
                <span>Client: <strong>{project.client?.name}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar src={project.designer?.profileImage} name={project.designer?.name || 'Open'} size="sm" />
                <span>Designer: <strong>{project.designer?.name || 'Unassigned'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar src={project.contractor?.profileImage} name={project.contractor?.name || 'Open'} size="sm" />
                <span>Contractor: <strong>{project.contractor?.name || 'Unassigned'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions Widget */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-4 rounded-xl bg-charcoal-900/80 border border-sky-400/15 shrink-0">
            <div className="flex flex-col lg:items-end">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Committed Budget / Spent
              </span>
              <div className="text-lg font-serif font-bold text-slate-100 mt-0.5">
                <span className="text-sky-400">${(project.spentAmount || 0).toLocaleString()}</span>
                <span className="text-slate-400 text-sm"> / ${(project.totalBudget || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {canSubmitProposal && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowProposalModal(true)}
                  icon={Sparkles}
                >
                  Draft Proposal
                </Button>
              )}
              {canEditProject && !project.contractor && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openAssignContractorModal}
                  icon={Hammer}
                >
                  Assign Contractor
                </Button>
              )}
              {(isClient || isDesigner || isContractor || isAdmin) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStatusModal(true)}
                >
                  Update Progress
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-sky-400/15">
          <ProgressBar progress={project.progress || 0} size="sm" />
        </div>
      </GlassCard>

      {/* 9 Workspace Tabs */}
      <Tabs tabs={workspaceTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB CONTENT AREAS */}
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <GlassCard>
              <h3 className="text-base font-serif font-bold text-slate-100 mb-3">
                Spatial Brief & Vision
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>

              {project.requirements && (
                <div className="mt-6 pt-6 border-t border-sky-400/15">
                  <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
                    Architectural & Material Requirements
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-charcoal-900/60 p-4 rounded-xl border border-sky-400/15">
                    {project.requirements}
                  </p>
                </div>
              )}
            </GlassCard>

            {/* Gallery Preview */}
            {project.images?.length > 0 && (
              <GlassCard>
                <h3 className="text-base font-serif font-bold text-slate-100 mb-3">
                  Site & Inspiration Photos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Project ${idx}`}
                      className="w-full h-48 object-cover rounded-xl border border-sky-400/20 hover:opacity-90 transition-opacity"
                    />
                  ))}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Sidebar Info Cards */}
          <div className="flex flex-col gap-6">
            <GlassCard>
              <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-4">
                Project Parameters
              </h3>
              <div className="divide-y divide-white/5 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Preferred Style</span>
                  <span className="font-semibold text-slate-100">{project.preferredStyle}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Space Type</span>
                  <span className="font-semibold text-slate-100">{project.projectType}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Property Type</span>
                  <span className="font-semibold text-slate-100">{project.propertyType}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Start Date</span>
                  <span className="font-semibold text-slate-100">
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
                {project.expectedEndDate && (
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-400">Target Handover</span>
                    <span className="font-semibold text-slate-100">
                      {new Date(project.expectedEndDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-4">
                Stakeholders Directory
              </h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 rounded-xl bg-charcoal-900/60 border border-sky-400/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={project.client?.profileImage} name={project.client?.name} size="sm" />
                    <div>
                      <div className="font-semibold text-slate-100">{project.client?.name}</div>
                      <div className="text-[11px] text-slate-400">Client / Owner</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-charcoal-900/60 border border-sky-400/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={project.designer?.profileImage} name={project.designer?.name || 'Designer'} size="sm" />
                    <div>
                      <div className="font-semibold text-slate-100">{project.designer?.name || 'Awaiting Assignment'}</div>
                      <div className="text-[11px] text-sky-400">Lead Interior Designer</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-charcoal-900/60 border border-sky-400/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={project.contractor?.profileImage} name={project.contractor?.name || 'Contractor'} size="sm" />
                    <div>
                      <div className="font-semibold text-slate-100">{project.contractor?.name || 'Awaiting Assignment'}</div>
                      <div className="text-[11px] text-sky-300">Master Contractor</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* 2. DESIGNS TAB */}
      {activeTab === 'designs' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Design Concepts & 3D Visualizations
              </h3>
              <p className="text-xs text-slate-400">
                Architectural renderings, material palettes, and floor plan schemes.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setFileType('Design Image');
                setShowFileUploadModal(true);
              }}
              icon={Upload}
            >
              Upload Design Asset
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {files
              .filter((f) => ['Design Image', 'Room Image', 'Floor Plan'].includes(f.fileType))
              .map((file) => (
                <GlassCard key={file._id} className="p-0 overflow-hidden group border-sky-400/20">
                  <div className="h-56 bg-charcoal-800 relative">
                    <img
                      src={file.filePath}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-charcoal-950/85 backdrop-blur-md text-sky-300 border border-sky-400/20 font-medium">
                        {file.fileType}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-100 truncate">{file.name}</span>
                    <a
                      href={file.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </GlassCard>
              ))}
          </div>

          {files.filter((f) => ['Design Image', 'Room Image', 'Floor Plan'].includes(f.fileType)).length === 0 && (
            <EmptyState
              icon={Sparkles}
              title="No design assets uploaded yet"
              description="Upload 3D spatial renders, color scheme mood boards, or CAD layouts."
              actionText="Upload First Design"
              onAction={() => {
                setFileType('Design Image');
                setShowFileUploadModal(true);
              }}
            />
          )}
        </div>
      )}

      {/* 3. PROPOSALS & REVISIONS TAB */}
      {activeTab === 'proposals' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Design Proposals & Revision Tracking
              </h3>
              <p className="text-xs text-slate-400">
                Review estimated costs, materials, and request iterative design revisions.
              </p>
            </div>
            {canSubmitProposal && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowProposalModal(true)}
                icon={Plus}
              >
                Create Proposal
              </Button>
            )}
          </div>

          {proposals.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No design proposals created yet"
              description="Interior designers can draft formal concepts with itemized estimates here."
              actionText={canSubmitProposal ? 'Draft Proposal' : undefined}
              onAction={() => setShowProposalModal(true)}
            />
          ) : (
            <div className="flex flex-col gap-6">
              {proposals.map((prop) => (
                <GlassCard key={prop._id} className="p-6 sm:p-8 border-sky-400/25">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-400/15">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg sm:text-xl font-serif font-bold text-slate-100">
                          {prop.title}
                        </h4>
                        <StatusBadge status={prop.status} />
                      </div>
                      <span className="text-xs text-slate-400">
                        Submitted by: <strong>{prop.designer?.name}</strong> • Style: {prop.designStyle} • Est. Duration: {prop.estimatedDuration}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 uppercase font-semibold">
                        Estimated Concept Cost
                      </span>
                      <div className="text-2xl font-serif font-bold text-sky-400">
                        ${prop.estimatedCost?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Proposal Concept Details */}
                  <div className="py-6 flex flex-col gap-4">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {prop.description}
                    </p>

                    {prop.notes && (
                      <div className="text-xs text-slate-400 bg-charcoal-900/60 p-3.5 rounded-xl border border-sky-400/15">
                        <strong className="text-sky-400">Designer Notes:</strong> {prop.notes}
                      </div>
                    )}
                  </div>

                  {/* Client Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-sky-400/15">
                    <span className="text-xs text-slate-400">
                      Created: {new Date(prop.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-3">
                      {(isClient || isAdmin) && prop.status === 'SENT' && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedProposalForRevision(prop);
                              setShowRevisionModal(true);
                            }}
                            icon={RotateCcw}
                          >
                            Request Revision
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRejectProposal(prop._id)}
                            icon={XCircle}
                          >
                            Decline
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApproveProposal(prop._id)}
                            icon={CheckCircle2}
                          >
                            Approve Proposal
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Revisions History Sub-section */}
          {revisions.length > 0 && (
            <div className="mt-8">
              <h4 className="text-base font-serif font-bold text-slate-100 mb-4">
                Revision Feedback History ({revisions.length})
              </h4>
              <div className="flex flex-col gap-3">
                {revisions.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-4 rounded-xl glass-panel border-sky-400/20 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-sky-300">
                        Requested by: {rev.requestedBy?.name}
                      </span>
                      <StatusBadge status={rev.status} />
                    </div>
                    <p className="text-xs text-slate-300">{rev.message}</p>
                    {rev.requestedChanges?.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                        {rev.requestedChanges.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Site & Architectural Tasks
              </h3>
              <p className="text-xs text-slate-400">
                Collaborative action items for designers and site contracting teams.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowTaskModal(true)}
              icon={Plus}
            >
              Add Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="No tasks assigned yet"
              description="Create installation tasks, framing milestones, or design checkups."
              actionText="Create First Task"
              onAction={() => setShowTaskModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <GlassCard key={task._id} className="p-5 flex flex-col justify-between gap-4 border-sky-400/20">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <StatusBadge status={task.priority} />
                      <div className="flex items-center gap-1.5">
                        <select
                          value={task.status}
                          onChange={(e) => handleTaskStatusToggle(task._id, e.target.value)}
                          className="glass-input text-xs py-1 px-2.5 rounded-lg bg-charcoal-900 border-sky-400/20 text-slate-200 cursor-pointer"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="BLOCKED">Blocked</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-100">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                    )}
                  </div>

                  {/* Task Meta & Comments */}
                  <div className="pt-3 border-t border-sky-400/15 flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Assigned to: <strong>{task.assignedTo?.name || 'Unassigned'}</strong></span>
                      {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>

                    {/* Comments Thread */}
                    {task.comments?.length > 0 && (
                      <div className="bg-charcoal-900/60 p-2.5 rounded-lg border border-sky-400/15 flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                        {task.comments.map((c, i) => (
                          <div key={i} className="text-[11px] text-slate-300">
                            <strong className="text-sky-400">{c.user?.name || 'User'}:</strong> {c.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add quick comment..."
                        value={commentText[task._id] || ''}
                        onChange={(e) =>
                          setCommentText({ ...commentText, [task._id]: e.target.value })
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(task._id)}
                        className="glass-input text-xs py-1.5 px-3 rounded-lg flex-1 border-sky-400/20"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddComment(task._id)}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. MATERIALS TAB */}
      {activeTab === 'materials' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Material Specifications & Procurement
              </h3>
              <p className="text-xs text-slate-400">
                Track flooring, lighting fixtures, custom millwork, and stone finishes.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowMaterialModal(true)}
              icon={Plus}
            >
              Add Material
            </Button>
          </div>

          {materials.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No materials logged"
              description="Add materials, fixtures, and finishes to monitor procurement and arrival on site."
              actionText="Specify Material"
              onAction={() => setShowMaterialModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((mat) => (
                <GlassCard key={mat._id} className="p-5 flex flex-col justify-between gap-3 border-sky-400/20">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-sky-400">{mat.category}</span>
                      <StatusBadge status={mat.status} />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100">{mat.name}</h4>
                    {mat.supplier && (
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Supplier: {mat.supplier}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-sky-400/15 flex items-center justify-between text-xs text-slate-300">
                    <span>
                      Qty: <strong>{mat.quantity} {mat.unit}</strong>
                    </span>
                    <span>
                      Est: <strong className="text-sky-400">${mat.estimatedCost?.toLocaleString()}</strong>
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. BUDGET & EXPENSES TAB */}
      {activeTab === 'budget' && (
        <div className="flex flex-col gap-6">
          {/* Budget Summary Card */}
          {expensesData.budgetSummary && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <GlassCard className="border-sky-400/25">
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Total Project Budget
                </span>
                <div className="text-2xl font-serif font-bold text-slate-100 mt-1">
                  ${expensesData.budgetSummary.totalBudget?.toLocaleString()}
                </div>
              </GlassCard>
              <GlassCard className="border-emerald-500/20">
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Total Spent to Date
                </span>
                <div className="text-2xl font-serif font-bold text-emerald-400 mt-1">
                  ${expensesData.budgetSummary.spentAmount?.toLocaleString()}
                </div>
              </GlassCard>
              <GlassCard className="border-sky-500/25">
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Remaining Capital
                </span>
                <div className="text-2xl font-serif font-bold text-sky-400 mt-1">
                  ${expensesData.budgetSummary.remainingBudget?.toLocaleString()}
                </div>
              </GlassCard>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Verified Site Expenses & Invoices
              </h3>
              <p className="text-xs text-slate-400">
                Itemized expense receipts and labor payouts.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowExpenseModal(true)}
              icon={Plus}
            >
              Record Expense
            </Button>
          </div>

          {expensesData.expenses?.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No expenses logged yet"
              description="Record site receipts, contractor payments, and procurement invoices."
              actionText="Record First Expense"
              onAction={() => setShowExpenseModal(true)}
            />
          ) : (
            <div className="divide-y divide-white/5 glass-card overflow-hidden border-sky-400/20">
              {expensesData.expenses.map((exp) => (
                <div key={exp._id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-100">{exp.description}</span>
                    <span className="text-[11px] text-slate-400">
                      Category: {exp.category} • Logged by: {exp.addedBy?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-slate-400">
                      {new Date(exp.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-semibold text-sky-400">
                      ${exp.amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. TIMELINE & MILESTONES TAB */}
      {activeTab === 'timeline' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Project Roadmap & Milestones
              </h3>
              <p className="text-xs text-slate-400">
                Key handover phases and completion schedules.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowMilestoneModal(true)}
              icon={Plus}
            >
              Add Milestone
            </Button>
          </div>

          {milestones.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No milestones configured"
              description="Define structural, design approval, and installation phases."
              actionText="Add Milestone"
              onAction={() => setShowMilestoneModal(true)}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {milestones.map((m, index) => (
                <GlassCard key={m._id} className="p-5 flex flex-col gap-3 border-sky-400/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-sky-400">Phase 0{index + 1}</span>
                      <h4 className="text-sm font-semibold text-slate-100">{m.title}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        Due: {new Date(m.dueDate).toLocaleDateString()}
                      </span>
                      <StatusBadge status={m.status} />
                    </div>
                  </div>

                  {m.description && <p className="text-xs text-slate-400">{m.description}</p>}

                  <ProgressBar progress={m.completionPercentage || 0} size="sm" />
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. FILES & BLUEPRINTS TAB */}
      {activeTab === 'files' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Blueprints, Quotations & Documents
              </h3>
              <p className="text-xs text-slate-400">
                Centralized architectural file repository with secure storage.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowFileUploadModal(true)}
              icon={Upload}
            >
              Upload Document
            </Button>
          </div>

          {files.length === 0 ? (
            <EmptyState
              icon={Paperclip}
              title="No documents uploaded"
              description="Upload architectural blueprints, municipal permits, contractor agreements, and invoices."
              actionText="Upload Document"
              onAction={() => setShowFileUploadModal(true)}
            />
          ) : (
            <div className="divide-y divide-white/5 glass-card overflow-hidden border-sky-400/20">
              {files.map((file) => (
                <div key={file._id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-400/20">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-100">{file.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {file.fileType} • {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  </div>

                  <a
                    href={file.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1.5 font-medium"
                  >
                    Download <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 9. ACTIVITY LOGS TAB */}
      {activeTab === 'activity' && (
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-serif font-bold text-slate-100">
            Project Audit & Verification Timeline
          </h3>

          <div className="divide-y divide-white/5 glass-card overflow-hidden border-sky-400/20">
            {auditLogs.map((log) => (
              <div key={log._id} className="p-4 flex items-start gap-3 text-xs">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-400/20 shrink-0 mt-0.5">
                  <History className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">{log.action}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300">{log.description}</p>
                </div>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No activity logs recorded for this project yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* Create Proposal Modal */}
      <Modal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        title="Draft Design Proposal"
        subtitle="Craft a concept proposal with cost and duration estimates for the client."
      >
        <form onSubmit={handleCreateProposal} className="flex flex-col gap-4">
          <Input
            label="Proposal Concept Title"
            placeholder="e.g. Modernist Organic Sanctuary Scheme"
            value={proposalForm.title}
            onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Cost ($ USD)"
              type="number"
              placeholder="e.g. 85000"
              value={proposalForm.estimatedCost}
              onChange={(e) => setProposalForm({ ...proposalForm, estimatedCost: e.target.value })}
              icon={DollarSign}
              required
            />
            <Input
              label="Estimated Timeline Duration"
              placeholder="e.g. 8 Weeks"
              value={proposalForm.estimatedDuration}
              onChange={(e) => setProposalForm({ ...proposalForm, estimatedDuration: e.target.value })}
              icon={Clock}
              required
            />
          </div>

          <Textarea
            label="Concept Description & Mood"
            rows={3}
            placeholder="Describe the architectural direction, lighting nuances, and material harmonies..."
            value={proposalForm.description}
            onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
            required
          />

          <Textarea
            label="Notes / Deliverables"
            rows={2}
            placeholder="e.g. Includes full 3D renders, CAD lighting schedules, and physical sample board..."
            value={proposalForm.notes}
            onChange={(e) => setProposalForm({ ...proposalForm, notes: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowProposalModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Send}>
              Submit Proposal to Client
            </Button>
          </div>
        </form>
      </Modal>

      {/* Request Revision Modal */}
      <Modal
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        title="Request Design Revision"
        subtitle="Provide specific feedback and requested alterations to the designer."
      >
        <form onSubmit={handleRequestRevision} className="flex flex-col gap-4">
          <Textarea
            label="Feedback & Change Instructions"
            rows={3}
            placeholder="Describe what elements you'd like altered (e.g. lighter wood stain, reposition fireplace mantle)..."
            value={revisionForm.message}
            onChange={(e) => setRevisionForm({ ...revisionForm, message: e.target.value })}
            required
          />

          <Textarea
            label="List of Changes (1 per line)"
            rows={3}
            placeholder="1. Change kitchen island to white quartz&#10;2. Add cove lighting in bedroom"
            value={revisionForm.requestedChanges}
            onChange={(e) => setRevisionForm({ ...revisionForm, requestedChanges: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowRevisionModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={RotateCcw}>
              Send Revision Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Create Site Task"
        subtitle="Assign an installation or design task."
      >
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <Input
            label="Task Title"
            placeholder="e.g. Install French White Oak Herringbone Flooring"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              options={['LOW', 'MEDIUM', 'HIGH', 'URGENT']}
            />
            <Input
              label="Due Date"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            />
          </div>

          <Textarea
            label="Task Description"
            rows={2}
            placeholder="Provide technical specifics or contractor notes..."
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowTaskModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Plus}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Material Modal */}
      <Modal
        isOpen={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        title="Specify Material / Fixture"
        subtitle="Log itemized finishes and procurement estimates."
      >
        <form onSubmit={handleCreateMaterial} className="flex flex-col gap-4">
          <Input
            label="Material Name"
            placeholder="e.g. Calacatta Vagli Marble Slab"
            value={materialForm.name}
            onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={materialForm.category}
              onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })}
              options={[
                'Flooring',
                'Furniture',
                'Lighting',
                'Paint',
                'Kitchen',
                'Bathroom',
                'Electrical',
                'Decor',
                'Other',
              ]}
            />
            <Input
              label="Supplier"
              placeholder="e.g. Havwoods or Stone Source"
              value={materialForm.supplier}
              onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Quantity"
              type="number"
              value={materialForm.quantity}
              onChange={(e) => setMaterialForm({ ...materialForm, quantity: e.target.value })}
              required
            />
            <Input
              label="Unit"
              placeholder="sq.ft, units, pcs"
              value={materialForm.unit}
              onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })}
            />
            <Input
              label="Estimated Cost ($)"
              type="number"
              placeholder="e.g. 15000"
              value={materialForm.estimatedCost}
              onChange={(e) => setMaterialForm({ ...materialForm, estimatedCost: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowMaterialModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Plus}>
              Save Material
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Record Site Expense"
        subtitle="Add paid invoices or labor receipts to update the project budget."
      >
        <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
          <Input
            label="Expense Description"
            placeholder="e.g. Phase 1 Electrical rough-in payout"
            value={expenseForm.description}
            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
              options={[
                'Materials',
                'Furniture',
                'Labor',
                'Design',
                'Electrical',
                'Plumbing',
                'Other',
              ]}
            />
            <Input
              label="Amount ($ USD)"
              type="number"
              placeholder="e.g. 12000"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              required
            />
            <Input
              label="Date"
              type="date"
              value={expenseForm.date}
              onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowExpenseModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={DollarSign}>
              Record Expense
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        title="Add Project Milestone"
        subtitle="Define scheduled progress checkpoints."
      >
        <form onSubmit={handleCreateMilestone} className="flex flex-col gap-4">
          <Input
            label="Milestone Phase Title"
            placeholder="e.g. Phase 2: Millwork & Marble Installation"
            value={milestoneForm.title}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Due Date"
              type="date"
              value={milestoneForm.dueDate}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
              required
            />
            <Select
              label="Initial Status"
              value={milestoneForm.status}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
              options={['UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED']}
            />
          </div>

          <Textarea
            label="Phase Description"
            rows={2}
            placeholder="Detail the deliverable checkpoints for this phase..."
            value={milestoneForm.description}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowMilestoneModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Plus}>
              Save Milestone
            </Button>
          </div>
        </form>
      </Modal>

      {/* File Upload Modal */}
      <Modal
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
        title="Upload Document or Design"
        subtitle="Select architectural files, blueprints, or renders (up to 10MB)."
      >
        <form onSubmit={handleFileUpload} className="flex flex-col gap-4">
          <Select
            label="File Classification"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            options={[
              'Room Image',
              'Design Image',
              'Floor Plan',
              'Quotation',
              'Document',
              'Progress Photo',
              'Other',
            ]}
          />

          <Input
            label="Display Label"
            placeholder="e.g. Master Bedroom Moodboard Render"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Choose File</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="glass-input text-xs p-2 rounded-xl border-sky-400/20 w-full"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowFileUploadModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Upload}>
              Upload File
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Contractor Modal */}
      <Modal
        isOpen={showAssignContractorModal}
        onClose={() => setShowAssignContractorModal(false)}
        title="Assign Master Contractor"
        subtitle="Select a verified contractor to lead physical construction and fit-out."
      >
        <form onSubmit={handleAssignContractor} className="flex flex-col gap-4">
          <Select
            label="Select Verified Contractor"
            value={selectedContractorId}
            onChange={(e) => setSelectedContractorId(e.target.value)}
            required
          >
            <option value="" disabled>Select contractor firm...</option>
            {contractorsList.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.location || 'Contractor'})
              </option>
            ))}
          </Select>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowAssignContractorModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Hammer}>
              Confirm Contractor
            </Button>
          </div>
        </form>
      </Modal>

      {/* Update Progress & Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Overall Project Progress"
        subtitle="Reflect site completion percentages and status transitions."
      >
        <form onSubmit={handleUpdateStatus} className="flex flex-col gap-4">
          <Select
            label="Project Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              'REQUESTED',
              'DESIGNING',
              'PROPOSAL_SENT',
              'APPROVED',
              'IN_PROGRESS',
              'ON_HOLD',
              'COMPLETED',
            ]}
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-300">
              Completion Progress: {selectedProgress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedProgress}
              onChange={(e) => setSelectedProgress(e.target.value)}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading}>
              Save Status
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectWorkspace;
