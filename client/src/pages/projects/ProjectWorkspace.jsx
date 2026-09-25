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
  Home,
  Palette,
  Eye,
  Camera,
  Zap,
  Award,
  AlertTriangle,
  ShieldCheck,
  ClipboardCheck,
  Trash2,
  ArrowRight,
  Download,
  UserCheck,
  MessageSquare,
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
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';
import RoomDesignerModal from '../../components/common/RoomDesignerModal';
import RoomApprovalModal from '../../components/common/RoomApprovalModal';
import ContractorExecutionModal from '../../components/common/ContractorExecutionModal';


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

  // House Room Modals State
  const [selectedRoomForDesign, setSelectedRoomForDesign] = useState(null);
  const [selectedRoomForApproval, setSelectedRoomForApproval] = useState(null);
  const [selectedRoomForExecution, setSelectedRoomForExecution] = useState(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomForm, setNewRoomForm] = useState({
    name: '',
    dimensions: '16 x 14 ft',
    area: 224,
    budget: 150000,
    style: 'Modern',
  });

  // AI Design Studio State
  const [selectedRoomForAI, setSelectedRoomForAI] = useState('');
  const [aiStyle, setAiStyle] = useState('Modern');
  const [aiBudget, setAiBudget] = useState(500000);
  const [aiRequirements, setAiRequirements] = useState('');
  const [aiProposalData, setAiProposalData] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Quotation State
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    title: 'Complete Fit-out & Design Estimate',
    items: [
      { category: 'Civil & Architectural', description: 'Wall preparation, skim plastering and drywall false ceiling grid', quantity: 1, unit: 'Lump Sum', unitPrice: 120000, discount: 0, taxPercent: 18 },
      { category: 'Flooring & Tiling', description: 'Italian vitrified slab supply and precision laser layment', quantity: 1, unit: 'Lump Sum', unitPrice: 95000, discount: 0, taxPercent: 18 },
      { category: 'Modular Joinery & Furniture', description: 'Bespoke marine-ply modular cabinetry and wardrobes', quantity: 1, unit: 'Lump Sum', unitPrice: 240000, discount: 5000, taxPercent: 18 },
    ],
  });

  // Issue & Snag State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState({ title: '', description: '', room: 'General', priority: 'Medium' });
  const [showSnagModal, setShowSnagModal] = useState(false);
  const [snagForm, setSnagForm] = useState({ description: '', room: 'General', priority: 'Medium' });

  // Site Visit & Survey State
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
  const [siteVisitForm, setSiteVisitForm] = useState({
    measurements: 'Laser survey verified perimeter dimensions',
    existingCondition: 'Bare shell with primed masonry',
    electricalCondition: 'Conduit conduits laid; switchboard boxes placed',
    plumbingCondition: 'PPR supply lines pressure tested',
    notes: 'Access road clear for materials delivery',
  });

  // Procurement State
  const [showProcurementModal, setShowProcurementModal] = useState(false);
  const [procurementForm, setProcurementForm] = useState({
    itemName: '',
    category: 'Materials',
    room: 'General',
    supplier: '',
    quantityRequired: '1',
    unitCost: '',
  });

  // Handover State
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [handoverForm, setHandoverForm] = useState({
    inspectionNotes: 'All architectural specifications, light fittings, and cabinet alignments thoroughly inspected and verified.',
    clientSignoffNotes: 'All milestone items verified and completed to satisfaction.',
  });

  // Form Submissions State
  const [modalLoading, setModalLoading] = useState(false);

  // Room Action Handlers
  const handleSaveRoomDesign = async (roomId, roomData) => {
    try {
      await projectsAPI.updateRoom(id, roomId, roomData);
      showToast('Room specifications updated!', 'success');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to update room specifications', 'error');
    }
  };

  const handleSubmitRoomForReview = async (roomId) => {
    try {
      await projectsAPI.updateRoom(id, roomId, { designStatus: 'Submitted' });
      showToast('Room design submitted for client review!', 'success');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to submit room design', 'error');
    }
  };

  const handleApproveRoom = async (roomId, comments) => {
    try {
      await projectsAPI.reviewRoomDesign(id, roomId, { action: 'APPROVE', comments });
      await projectsAPI.recordApproval(id, {
        type: 'Design',
        entityId: roomId,
        entityTitle: `Room Design: ${project.rooms.find((r) => r._id === roomId)?.name || 'Space'}`,
        status: 'Approved',
        comment: comments || 'Client approved room design concept.',
      });
      showToast('🎉 Room design approved and logged to Audit Center!', 'success');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to approve room design', 'error');
    }
  };

  const handleRequestRoomChanges = async (roomId, comments) => {
    try {
      await projectsAPI.reviewRoomDesign(id, roomId, { action: 'REQUEST_CHANGES', comments });
      await projectsAPI.recordApproval(id, {
        type: 'Design',
        entityId: roomId,
        entityTitle: `Room Design: ${project.rooms.find((r) => r._id === roomId)?.name || 'Space'}`,
        status: 'Changes Requested',
        comment: comments || 'Client requested design revision.',
      });
      showToast('Revision request sent to designer.', 'info');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to request changes', 'error');
    }
  };

  const handleSaveRoomExecution = async (roomId, executionData) => {
    try {
      await projectsAPI.updateRoom(id, roomId, executionData);
      showToast('Room execution progress updated!', 'success');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to update execution progress', 'error');
    }
  };

  const handleAddCustomRoom = async (e) => {
    e.preventDefault();
    if (!newRoomForm.name) return;
    try {
      setModalLoading(true);
      await projectsAPI.addRoom(id, newRoomForm);
      showToast('New room space added to house project!', 'success');
      setShowAddRoomModal(false);
      setNewRoomForm({ name: '', dimensions: '16 x 14 ft', area: 224, budget: 150000, style: 'Modern' });
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to add custom room', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // AI Studio Handlers
  const handleGenerateAIProposalWorkspace = async () => {
    const targetRoomId = selectedRoomForAI || project?.rooms?.[0]?._id;
    if (!targetRoomId) {
      showToast('Please select a room space for AI generation.', 'warning');
      return;
    }
    try {
      setIsGeneratingAI(true);
      const res = await projectsAPI.generateAIProposal(id, targetRoomId, {
        style: aiStyle,
        budgetAmount: Number(aiBudget),
        requirements: aiRequirements,
      });
      if (res.data?.data) {
        setAiProposalData(res.data.data);
        showToast('✨ AI Architectural Design Proposal synthesized!', 'success');
        fetchProjectDetails();
      }
    } catch (err) {
      showToast('Failed to generate AI proposal', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleConvertAIRecommendations = async (roomId) => {
    try {
      setModalLoading(true);
      await projectsAPI.convertAIToProjectData(id, roomId);
      showToast('🎉 Converted AI recommendations into project Materials, Furniture & Execution Tasks!', 'success');
      fetchProjectDetails();
      fetchTabData('tasks');
      fetchTabData('materials');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to convert AI specs', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Quotation Handlers
  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await projectsAPI.createQuotation(id, quoteForm);
      showToast('Formal Fit-out Quotation generated & submitted!', 'success');
      setShowCreateQuoteModal(false);
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to create quotation', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleReviewQuotation = async (quoteId, status, clientNotes) => {
    try {
      await projectsAPI.reviewQuotation(id, quoteId, { status, clientNotes });
      await projectsAPI.recordApproval(id, {
        type: 'Quotation',
        entityId: quoteId,
        entityTitle: `Quotation ${quoteId}`,
        status,
        comment: clientNotes || `Quotation ${status}`,
      });
      showToast(`Quotation ${status}!`, 'success');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to review quotation', 'error');
    }
  };

  // Issues & Snags Handlers
  const handleAddProjectIssue = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await projectsAPI.addIssue(id, issueForm);
      showToast('Issue ticket logged!', 'success');
      setShowIssueModal(false);
      setIssueForm({ title: '', description: '', room: 'General', priority: 'Medium' });
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to log issue', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateIssueStatus = async (issueId, status, resolution) => {
    try {
      await projectsAPI.updateIssue(id, issueId, { status, resolution });
      showToast(`Issue status updated to ${status}`, 'success');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to update issue', 'error');
    }
  };

  const handleAddProjectSnag = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await projectsAPI.addSnag(id, snagForm);
      showToast('Punch list snag logged!', 'success');
      setShowSnagModal(false);
      setSnagForm({ description: '', room: 'General', priority: 'Medium' });
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to log snag', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateSnagStatus = async (snagId, status) => {
    try {
      await projectsAPI.updateSnag(id, snagId, { status });
      showToast(`Snag item marked as ${status}`, 'success');
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to update snag', 'error');
    }
  };

  // Site Visit & Procurement Handlers
  const handleAddSiteVisit = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await projectsAPI.addSiteVisit(id, siteVisitForm);
      showToast('Site survey record logged!', 'success');
      setShowSiteVisitModal(false);
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to log site survey', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddProcurementItem = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await projectsAPI.addProcurement(id, procurementForm);
      showToast('Procurement line item added!', 'success');
      setShowProcurementModal(false);
      setProcurementForm({ itemName: '', category: 'Materials', room: 'General', supplier: '', quantityRequired: '1', unitCost: '' });
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to add procurement item', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCompleteHandover = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await projectsAPI.completeHandover(id, handoverForm);
      await projectsAPI.recordApproval(id, {
        type: 'Final Handover',
        entityId: id,
        entityTitle: `Project Handover: ${project.title}`,
        status: 'Approved',
        comment: handoverForm.clientSignoffNotes || 'Official client handover completed.',
      });
      showToast('🏆 Project Handover officially completed & closed!', 'success');
      setShowHandoverModal(false);
      fetchProjectDetails();
    } catch (err) {
      showToast('Failed to finalize handover', 'error');
    } finally {
      setModalLoading(false);
    }
  };


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
    { id: 'rooms', label: `House Spaces (${project.rooms?.length || 0})`, icon: Home },
    { id: 'brief', label: 'Design Brief & Lifestyle', icon: Palette },
    { id: 'designs', label: 'Designs & Renders', icon: Sparkles },
    { id: 'proposals', label: 'Proposals & Revisions', icon: FileText, count: proposals.length },
    { id: 'quotations', label: `Quotations (${project.quotations?.length || 0})`, icon: DollarSign },
    { id: 'approvals', label: `Approval Center (${project.approvals?.length || 0})`, icon: ShieldCheck },
    { id: 'quality_snags', label: `Quality & Snags (${(project.snags?.length || 0) + (project.issues?.length || 0)})`, icon: ClipboardCheck },
    { id: 'procurement', label: `Procurement (${project.procurement?.length || 0})`, icon: Layers },
    { id: 'site_surveys', label: `Site Surveys (${project.siteVisits?.length || 0})`, icon: Camera },
    { id: 'tasks', label: 'Tasks Board', icon: ListTodo, count: tasks.length },
    { id: 'materials', label: 'Materials & Specs', icon: Layers, count: materials.length },
    { id: 'budget', label: 'Budget & Expenses', icon: DollarSign },
    { id: 'timeline', label: 'Timeline & Milestones', icon: Calendar, count: milestones.length },
    { id: 'handover', label: project.handoverDetails?.completed ? '🏆 Handover (Completed)' : 'Handover & Signoff', icon: Award },
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
              <span className="text-xs font-semibold text-sky-500 dark:text-sky-400 uppercase tracking-widest">
                {project.projectType} • {project.propertyType}
              </span>
              <StatusBadge status={project.status} />
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                {project.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300 pt-1">
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
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-4 rounded-xl glass-panel border border-sky-400/20 shrink-0">
            <div className="flex flex-col lg:items-end">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Committed Budget / Spent
              </span>
              <div className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                <span className="text-sky-600 dark:text-sky-400">${(project.spentAmount || 0).toLocaleString()}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm"> / ${(project.totalBudget || 0).toLocaleString()}</span>
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

      {/* 10 Workspace Tabs */}
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

            {/* Before / After Transformation Slider */}
            <GlassCard>
              <BeforeAfterSlider
                beforeImage={
                  project.housePhotos?.find((p) => p.tag === 'before')?.url ||
                  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
                }
                afterImage={
                  project.images?.[0] ||
                  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
                }
                title={`${project.title} — Transformation Showcase`}
              />
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

      {/* 2. HOUSE SPACES & ROOMS TAB */}
      {activeTab === 'rooms' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                House Spaces & Room Blueprint ({project.rooms?.length || 0})
              </h3>
              <p className="text-xs text-slate-400">
                Manage spatial concepts, color palettes, custom carpentry, loose furniture, and site build progress per space
              </p>
            </div>
            {canEditProject && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddRoomModal(true)}
                icon={Plus}
              >
                Add Space
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(project.rooms || []).map((room) => (
              <GlassCard
                key={room._id}
                className="p-5 border-sky-400/20 hover:border-sky-400/50 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-serif font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                        {room.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {room.dimensions || `${room.area || 180} sq.ft`} • {room.category || 'General'}
                      </span>
                    </div>
                    <StatusBadge status={room.designStatus || 'Draft'} />
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Execution</span>
                      <span className="font-bold text-sky-400">{room.progress || 0}%</span>
                    </div>
                    <ProgressBar progress={room.progress || 0} size="sm" variant={room.progress === 100 ? 'emerald' : 'sky'} />
                  </div>

                  {/* Budget & Style */}
                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-charcoal-900/50 border border-sky-400/10 mb-3">
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Allocated Budget</span>
                      <span className="font-semibold text-slate-200">${(room.budget || 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Style</span>
                      <span className="font-semibold text-sky-300 truncate block">{room.style || 'Modern'}</span>
                    </div>
                  </div>

                  {/* Color Palette Swatches */}
                  {room.colorPalette && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-[10px] text-slate-400 uppercase">Colors:</span>
                      {[room.colorPalette.primary, room.colorPalette.secondary, room.colorPalette.accent, room.colorPalette.flooring].map((c, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3">
                    <span>{room.furniture?.length || 0} Furniture</span>
                    <span>•</span>
                    <span>{room.materials?.length || 0} Materials</span>
                    <span>•</span>
                    <span>{room.sitePhotos?.length || 0} Photos</span>
                  </div>
                </div>

                {/* Role-tailored Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-sky-400/15">
                  {(isDesigner || isAdmin) && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setSelectedRoomForDesign(room)}
                      icon={Palette}
                    >
                      Design Space
                    </Button>
                  )}

                  {(isClient || isAdmin) && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setSelectedRoomForApproval(room)}
                      icon={Eye}
                    >
                      Review & Approve
                    </Button>
                  )}

                  {(isContractor || isAdmin) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setSelectedRoomForExecution(room)}
                      icon={Hammer}
                    >
                      Site Execution
                    </Button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* 3. DESIGNS TAB */}
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

      {/* 10. DESIGN BRIEF & LIFESTYLE TAB */}
      {activeTab === 'brief' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Spatial Brief, Family Lifestyle & Client Aspirations
              </h3>
              <p className="text-xs text-slate-400">
                Foundational design inputs, daily family routines, and functional priorities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 flex flex-col gap-5 border-sky-400/20">
              <h4 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
                Lifestyle & Household Parameters
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/10">
                  <span className="text-[10px] text-slate-400 uppercase block">Family Structure</span>
                  <span className="font-semibold text-slate-100 mt-1 block">
                    {project.designBrief?.lifestyle?.familySize || 'Family (4 Members)'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/10">
                  <span className="text-[10px] text-slate-400 uppercase block">Kids / Elderly</span>
                  <span className="font-semibold text-slate-100 mt-1 block">
                    {project.designBrief?.lifestyle?.children ? 'Children Friendly' : 'Adult Living'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/10">
                  <span className="text-[10px] text-slate-400 uppercase block">Work From Home</span>
                  <span className="font-semibold text-sky-300 mt-1 block">
                    {project.designBrief?.lifestyle?.workFromHome ? 'Dedicated Office Area' : 'Standard'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/10">
                  <span className="text-[10px] text-slate-400 uppercase block">Pets</span>
                  <span className="font-semibold text-slate-100 mt-1 block">
                    {project.designBrief?.lifestyle?.pets ? 'Pet-friendly Finishes' : 'None'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/10">
                  <span className="text-[10px] text-slate-400 uppercase block">Entertainment</span>
                  <span className="font-semibold text-slate-100 mt-1 block">
                    {project.designBrief?.lifestyle?.entertainmentNeeds || 'Frequent Hosting'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/10">
                  <span className="text-[10px] text-slate-400 uppercase block">Storage Scale</span>
                  <span className="font-semibold text-sky-300 mt-1 block">
                    {project.designBrief?.lifestyle?.storageNeeds || 'High Capacity Built-ins'}
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-4 border-t border-sky-400/15">
                <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
                  Functional Architectural Requirements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(project.designBrief?.functionalRequirements?.length > 0
                    ? project.designBrief.functionalRequirements
                    : ['Large Island Kitchen', 'Walk-in Wardrobe', 'Fluted Accent TV Wall', 'Prayer Room / Pooja Unit', 'Smart Lighting Automation']
                  ).map((req, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-400/25 text-xs font-medium"
                    >
                      ✓ {req}
                    </span>
                  ))}
                </div>
              </div>

              {project.designBrief?.freeTextNotes && (
                <div className="mt-2 p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/10 text-xs text-slate-300">
                  <strong className="text-sky-400">Special Notes: </strong>
                  {project.designBrief.freeTextNotes}
                </div>
              )}
            </GlassCard>

            <GlassCard className="flex flex-col gap-4 border-sky-400/20">
              <h4 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
                Aesthetic Vision & Style
              </h4>
              <div className="p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/15 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase">Primary Style</span>
                <span className="text-base font-serif font-bold text-slate-100 mt-0.5 block">
                  {project.designBrief?.stylePreference || project.preferredStyle || 'Modern Contemporary'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/15 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase">Color Theme</span>
                <span className="text-sm font-semibold text-sky-300 mt-0.5 block">
                  {project.designBrief?.colorPalettePreference || 'Warm Neutral & Walnut Earthy'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-charcoal-900/60 border border-sky-400/15 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase">Property Dimensions</span>
                <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                  {project.builtUpArea || project.propertyDetails?.builtUpArea || 2850} sq.ft Built-up • {project.floors || project.propertyDetails?.floors || 2} Floors
                </span>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* 11. QUOTATIONS & PRICING TAB */}
      {activeTab === 'quotations' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Official Fit-out & Turnkey Quotations ({project.quotations?.length || 0})
              </h3>
              <p className="text-xs text-slate-400">
                Itemized trade costs, material schedules, civil scope, and tax breakdown.
              </p>
            </div>
            {(isDesigner || isAdmin) && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCreateQuoteModal(true)}
                icon={Plus}
              >
                Generate Quotation
              </Button>
            )}
          </div>

          {(project.quotations?.length || 0) === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No quotations generated yet"
              description="Lead designers can prepare itemized contractor fit-out quotations with tax and discounts."
              actionText={(isDesigner || isAdmin) ? 'Create Fit-out Quotation' : undefined}
              onAction={() => setShowCreateQuoteModal(true)}
            />
          ) : (
            <div className="flex flex-col gap-6">
              {project.quotations.map((quote) => (
                <GlassCard key={quote._id} className="p-6 sm:p-8 border-sky-400/25">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-400/15">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg sm:text-xl font-serif font-bold text-slate-100">
                          {quote.title || 'Official Turnkey Interior Estimate'}
                        </h4>
                        <StatusBadge status={quote.status} />
                      </div>
                      <span className="text-xs text-slate-400">
                        Version {quote.version || 1} • Prepared: {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 uppercase font-semibold">Grand Total (Incl. Tax)</span>
                      <div className="text-2xl font-serif font-bold text-sky-400">
                        ${(quote.grandTotal || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Quotation Table */}
                  <div className="py-4 overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-sky-400/15 text-[11px] uppercase text-sky-400">
                          <th className="pb-3 font-semibold">Trade / Category</th>
                          <th className="pb-3 font-semibold">Description</th>
                          <th className="pb-3 font-semibold text-right">Qty</th>
                          <th className="pb-3 font-semibold text-right">Unit Price</th>
                          <th className="pb-3 font-semibold text-right">Discount</th>
                          <th className="pb-3 font-semibold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {(quote.items || []).map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="py-3 font-medium text-slate-100">{item.category}</td>
                            <td className="py-3 text-slate-300">{item.description}</td>
                            <td className="py-3 text-right">{item.quantity} {item.unit}</td>
                            <td className="py-3 text-right">${item.unitPrice?.toLocaleString()}</td>
                            <td className="py-3 text-right text-emerald-400">${item.discount || 0}</td>
                            <td className="py-3 text-right font-semibold text-slate-100">${item.total?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pricing Summary Breakdown */}
                  <div className="pt-4 border-t border-sky-400/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div className="flex flex-col gap-1 text-slate-400">
                      <div>Subtotal: <strong className="text-slate-200">${(quote.subtotal || 0).toLocaleString()}</strong></div>
                      <div>Discount Applied: <strong className="text-emerald-400">-${(quote.discount || 0).toLocaleString()}</strong></div>
                      <div>GST / Tax: <strong className="text-slate-200">${(quote.tax || 0).toLocaleString()}</strong></div>
                    </div>

                    {/* Client Approval Controls */}
                    {(isClient || isAdmin) && quote.status === 'Sent' && (
                      <div className="flex items-center gap-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleReviewQuotation(quote._id, 'Changes Requested', 'Please adjust modular cabinetry unit sizes')}
                          icon={RotateCcw}
                        >
                          Request Revisions
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleReviewQuotation(quote._id, 'Approved', 'Client approved entire interior fit-out quotation')}
                          icon={CheckCircle2}
                        >
                          Approve Quotation
                        </Button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 12. APPROVAL CENTER TAB */}
      {activeTab === 'approvals' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Central Client & Designer Approval Center ({project.approvals?.length || 0})
              </h3>
              <p className="text-xs text-slate-400">
                Official audit trail of design concepts, material selections, and budget approvals.
              </p>
            </div>
          </div>

          {(project.approvals?.length || 0) === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No formal approval decisions recorded"
              description="Design concepts, revisions, quotations, and room spaces approved by the client will be permanently logged here."
            />
          ) : (
            <div className="divide-y divide-white/5 glass-card overflow-hidden border-sky-400/20">
              {project.approvals.map((app) => (
                <div key={app._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-sm text-slate-100">{app.entityTitle || app.type}</span>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-slate-300">{app.comment || 'Verified and approved for execution phase.'}</p>
                      <span className="text-[11px] text-slate-400">
                        Decision by: <strong>{app.approvedBy?.name || 'Authorized User'}</strong> ({app.role || 'CLIENT'}) • {new Date(app.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 13. QUALITY, ISSUES & SNAGS TAB */}
      {activeTab === 'quality_snags' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Site Quality Assurance, Punch List & Snags
              </h3>
              <p className="text-xs text-slate-400">
                Track pre-handover touch-ups, alignment issues, and site rectification items.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowIssueModal(true)}
                icon={AlertTriangle}
              >
                Log Site Issue
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowSnagModal(true)}
                icon={Plus}
              >
                Add Snag Item
              </Button>
            </div>
          </div>

          {/* Snag List Section */}
          <GlassCard className="p-6 border-sky-400/20">
            <h4 className="text-base font-serif font-bold text-slate-100 mb-4 flex items-center justify-between">
              <span>Punch List Snags ({(project.snags?.length || 0)})</span>
              <span className="text-xs font-normal text-slate-400">
                {project.snags?.filter(s => s.status === 'Resolved' || s.status === 'Closed').length || 0} / {project.snags?.length || 0} Rectified
              </span>
            </h4>

            {(project.snags?.length || 0) === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No punch list items open. Site is defect-free.</p>
            ) : (
              <div className="divide-y divide-white/5 text-xs">
                {project.snags.map((snag) => (
                  <div key={snag._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={snag.status === 'Resolved' || snag.status === 'Closed'}
                        onChange={(e) => handleUpdateSnagStatus(snag._id, e.target.checked ? 'Resolved' : 'Open')}
                        className="w-4 h-4 rounded accent-sky-400 cursor-pointer"
                      />
                      <div>
                        <span className={`font-medium ${snag.status === 'Resolved' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {snag.description}
                        </span>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Room: {snag.room || 'General'}</span>
                          <span>•</span>
                          <span className="text-sky-300">Priority: {snag.priority}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={snag.status} />
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Issues Section */}
          <GlassCard className="p-6 border-sky-400/20">
            <h4 className="text-base font-serif font-bold text-slate-100 mb-4">
              Active Site Issues & Technical Blockers ({(project.issues?.length || 0)})
            </h4>

            {(project.issues?.length || 0) === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No open site issues reported.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.issues.map((issue) => (
                  <div key={issue._id} className="p-4 rounded-xl bg-charcoal-900/60 border border-sky-400/15 flex flex-col justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-rose-400">{issue.priority} Priority</span>
                        <StatusBadge status={issue.status} />
                      </div>
                      <h5 className="font-semibold text-slate-100 text-sm">{issue.title}</h5>
                      <p className="text-slate-300 mt-1">{issue.description}</p>
                      <span className="text-[11px] text-slate-400 block mt-2">Space: {issue.room || 'General'}</span>
                    </div>

                    {issue.status !== 'Resolved' && (
                      <div className="pt-3 border-t border-sky-400/15 flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateIssueStatus(issue._id, 'Resolved', 'Rectified on site')}
                          icon={CheckCircle2}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* 14. PROCUREMENT LIFECYCLE TAB */}
      {activeTab === 'procurement' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Material & Furniture Procurement Lifecycle ({project.procurement?.length || 0})
              </h3>
              <p className="text-xs text-slate-400">
                Track ordering status: Required → Quoted → Approved → Ordered → Delivered → Installed.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowProcurementModal(true)}
              icon={Plus}
            >
              Add Item
            </Button>
          </div>

          {(project.procurement?.length || 0) === 0 ? (
            <EmptyState
              icon={Layers}
              title="No procurement items logged"
              description="Add materials, hardware, and furniture to track procurement pipelines from supplier to site installation."
              actionText="Log First Item"
              onAction={() => setShowProcurementModal(true)}
            />
          ) : (
            <div className="divide-y divide-white/5 glass-card overflow-hidden border-sky-400/20">
              {project.procurement.map((p) => (
                <div key={p._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-sm text-slate-100">{p.itemName}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <span className="text-slate-400">
                      Category: {p.category} • Supplier: {p.supplier || 'To be selected'} • Room: {p.room || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-slate-300 font-medium">Qty: {p.quantityRequired}</span>
                    <span className="font-semibold text-sky-400">${(p.totalCost || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 15. SITE SURVEYS TAB */}
      {activeTab === 'site_surveys' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Site Survey Visits & Condition Reports ({project.siteVisits?.length || 0})
              </h3>
              <p className="text-xs text-slate-400">
                Record laser measurements, MEP condition, wall plastering, and site constraints.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSiteVisitModal(true)}
              icon={Camera}
            >
              Log Site Survey
            </Button>
          </div>

          {(project.siteVisits?.length || 0) === 0 ? (
            <EmptyState
              icon={Camera}
              title="No site surveys recorded"
              description="Log initial site measurements, laser audits, and structural inspections before beginning fit-outs."
              actionText="Log Site Survey"
              onAction={() => setShowSiteVisitModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.siteVisits.map((visit) => (
                <GlassCard key={visit._id} className="p-6 border-sky-400/20 flex flex-col gap-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-sky-400/15">
                    <span className="font-semibold text-sm text-slate-100">
                      Visit Date: {new Date(visit.date).toLocaleDateString()}
                    </span>
                    <span className="text-[11px] text-sky-400 font-medium">Verified Survey</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <strong className="text-sky-300 block text-[10px] uppercase">Laser Measurements & Layout:</strong>
                      <span className="text-slate-300">{visit.measurements}</span>
                    </div>
                    <div>
                      <strong className="text-sky-300 block text-[10px] uppercase">Existing Architectural Shell:</strong>
                      <span className="text-slate-300">{visit.existingCondition}</span>
                    </div>
                    <div>
                      <strong className="text-sky-300 block text-[10px] uppercase">Electrical & Plumbing Grid:</strong>
                      <span className="text-slate-300">{visit.electricalCondition || visit.plumbingCondition || 'Standard rough-in ready'}</span>
                    </div>
                    {visit.notes && (
                      <div className="pt-2 text-slate-400 italic">
                        Notes: {visit.notes}
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 16. FINAL HANDOVER & SIGNOFF TAB */}
      {activeTab === 'handover' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-100">
                Official Project Handover & Client Signoff Certificate
              </h3>
              <p className="text-xs text-slate-400">
                Formal closure, snag list zero-defect verification, and lifetime guarantee signoff.
              </p>
            </div>
            {!project.handoverDetails?.completed && (isClient || isAdmin) && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowHandoverModal(true)}
                icon={Award}
              >
                Signoff Handover
              </Button>
            )}
          </div>

          <GlassCard className="p-8 border-sky-400/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto py-6">
              <div className="p-4 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
                <Award className="w-12 h-12" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
                {project.handoverDetails?.completed
                  ? 'Official Certificate of Completion & Handover'
                  : 'Project Handover In Progress'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.handoverDetails?.completed
                  ? `This certifies that ${project.title} has undergone full architectural execution, site snag list clearance, and has been officially accepted by ${project.client?.name || 'the Client'}.`
                  : 'Complete all site tasks, resolve punch list snags, and execute final client signoff to close this project.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-6 text-xs text-left">
                <div className="p-3.5 rounded-xl bg-charcoal-900/80 border border-sky-400/15">
                  <span className="text-[10px] text-slate-400 uppercase block">Total Spaces</span>
                  <span className="text-base font-bold text-slate-100 mt-0.5 block">{project.rooms?.length || 0} Spaces</span>
                </div>
                <div className="p-3.5 rounded-xl bg-charcoal-900/80 border border-sky-400/15">
                  <span className="text-[10px] text-slate-400 uppercase block">Total Budget</span>
                  <span className="text-base font-bold text-sky-400 mt-0.5 block">${(project.totalBudget || 0).toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-charcoal-900/80 border border-sky-400/15">
                  <span className="text-[10px] text-slate-400 uppercase block">Actual Spent</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5 block">${(project.spentAmount || 0).toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-charcoal-900/80 border border-sky-400/15">
                  <span className="text-[10px] text-slate-400 uppercase block">Handover Date</span>
                  <span className="text-base font-bold text-slate-100 mt-0.5 block">
                    {project.handoverDetails?.handoverDate
                      ? new Date(project.handoverDetails.handoverDate).toLocaleDateString()
                      : 'Pending'}
                  </span>
                </div>
              </div>

              {project.handoverDetails?.inspectionNotes && (
                <div className="mt-4 p-4 rounded-xl bg-charcoal-900/60 border border-sky-400/15 text-xs text-slate-300 text-left w-full">
                  <strong className="text-sky-400 block mb-1">Architectural Inspection Summary:</strong>
                  {project.handoverDetails.inspectionNotes}
                </div>
              )}
            </div>
          </GlassCard>
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

      {/* Add Custom Space Modal */}
      <Modal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        title="Add House Space / Room"
        subtitle="Initialize a new architectural room or landscape zone for this property."
      >
        <form onSubmit={handleAddCustomRoom} className="flex flex-col gap-4">
          <Input
            label="Room Name"
            placeholder="e.g. Master Bedroom, Home Theater, Terrace Garden"
            value={newRoomForm.name}
            onChange={(e) => setNewRoomForm({ ...newRoomForm, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Dimensions"
              placeholder="e.g. 18 x 14 ft"
              value={newRoomForm.dimensions}
              onChange={(e) => setNewRoomForm({ ...newRoomForm, dimensions: e.target.value })}
            />
            <Input
              label="Area (Sq.Ft)"
              type="number"
              value={newRoomForm.area}
              onChange={(e) => setNewRoomForm({ ...newRoomForm, area: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Allocated Budget ($)"
              type="number"
              value={newRoomForm.budget}
              onChange={(e) => setNewRoomForm({ ...newRoomForm, budget: Number(e.target.value) })}
            />
            <Select
              label="Design Style"
              value={newRoomForm.style}
              onChange={(e) => setNewRoomForm({ ...newRoomForm, style: e.target.value })}
              options={[
                'Modern',
                'Minimalist',
                'Contemporary',
                'Luxury',
                'Scandinavian',
                'Industrial',
                'Rustic',
                'Traditional',
                'Japandi',
                'Indian Contemporary',
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowAddRoomModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Plus}>
              Add Room Space
            </Button>
          </div>
        </form>
      </Modal>

      {/* Designer Studio Room Modal */}
      <RoomDesignerModal
        isOpen={!!selectedRoomForDesign}
        onClose={() => setSelectedRoomForDesign(null)}
        room={selectedRoomForDesign}
        projectId={id}
        onSaveRoom={handleSaveRoomDesign}
        onSubmitForReview={handleSubmitRoomForReview}
      />

      {/* Client Design Approval Modal */}
      <RoomApprovalModal
        isOpen={!!selectedRoomForApproval}
        onClose={() => setSelectedRoomForApproval(null)}
        room={selectedRoomForApproval}
        onApprove={handleApproveRoom}
        onRequestChanges={handleRequestRoomChanges}
      />

      {/* Create Turnkey Quotation Modal */}
      <Modal
        isOpen={showCreateQuoteModal}
        onClose={() => setShowCreateQuoteModal(false)}
        title="Generate Fit-out & Turnkey Quotation"
        subtitle="Itemize civil, joinery, materials, and trade labor costs for formal client signoff."
      >
        <form onSubmit={handleCreateQuotation} className="flex flex-col gap-4">
          <Input
            label="Quotation Reference Title"
            value={quoteForm.title}
            onChange={(e) => setQuoteForm({ ...quoteForm, title: e.target.value })}
            required
          />

          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Itemized Trade Scope</label>
            {quoteForm.items.map((item, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-charcoal-900/80 border border-sky-400/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <Input
                  label="Category / Trade"
                  value={item.category}
                  onChange={(e) => {
                    const newItems = [...quoteForm.items];
                    newItems[index].category = e.target.value;
                    setQuoteForm({ ...quoteForm, items: newItems });
                  }}
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Description of Work / Specs"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...quoteForm.items];
                      newItems[index].description = e.target.value;
                      setQuoteForm({ ...quoteForm, items: newItems });
                    }}
                    required
                  />
                </div>
                <Input
                  label="Quantity & Unit"
                  value={item.unit}
                  onChange={(e) => {
                    const newItems = [...quoteForm.items];
                    newItems[index].unit = e.target.value;
                    setQuoteForm({ ...quoteForm, items: newItems });
                  }}
                />
                <Input
                  label="Unit Price ($)"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => {
                    const newItems = [...quoteForm.items];
                    newItems[index].unitPrice = Number(e.target.value);
                    setQuoteForm({ ...quoteForm, items: newItems });
                  }}
                  required
                />
                <Input
                  label="Discount ($)"
                  type="number"
                  value={item.discount}
                  onChange={(e) => {
                    const newItems = [...quoteForm.items];
                    newItems[index].discount = Number(e.target.value);
                    setQuoteForm({ ...quoteForm, items: newItems });
                  }}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setQuoteForm({
                  ...quoteForm,
                  items: [
                    ...quoteForm.items,
                    { category: 'Lighting & Fixtures', description: 'Architectural recessed downlights and cove tracks', quantity: 1, unit: 'Lump Sum', unitPrice: 35000, discount: 0, taxPercent: 18 },
                  ],
                })
              }
              icon={Plus}
            >
              Add Line Item
            </Button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowCreateQuoteModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Send}>
              Submit Quotation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Log Site Issue Modal */}
      <Modal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        title="Log Site Issue / Blocker"
        subtitle="Report a construction or design discrepancy requiring resolution."
      >
        <form onSubmit={handleAddProjectIssue} className="flex flex-col gap-4">
          <Input
            label="Issue Title"
            placeholder="e.g. Plumbing conduit alignment clash with master vanity"
            value={issueForm.title}
            onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Space / Room"
              value={issueForm.room}
              onChange={(e) => setIssueForm({ ...issueForm, room: e.target.value })}
            >
              <option value="General">Entire Site / General</option>
              {(project.rooms || []).map((r) => (
                <option key={r._id} value={r.name}>{r.name}</option>
              ))}
            </Select>
            <Select
              label="Priority Level"
              value={issueForm.priority}
              onChange={(e) => setIssueForm({ ...issueForm, priority: e.target.value })}
              options={['Low', 'Medium', 'High', 'Critical']}
            />
          </div>

          <Textarea
            label="Detailed Description"
            rows={3}
            placeholder="Describe the issue observed and recommended resolution..."
            value={issueForm.description}
            onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowIssueModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={AlertTriangle}>
              Log Site Issue
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Snag Modal */}
      <Modal
        isOpen={showSnagModal}
        onClose={() => setShowSnagModal(false)}
        title="Add Punch List Snag"
        subtitle="Record pre-handover aesthetic adjustments or hardware touch-ups."
      >
        <form onSubmit={handleAddProjectSnag} className="flex flex-col gap-4">
          <Input
            label="Snag / Touch-up Description"
            placeholder="e.g. Minor paint scuff near dining switchboard plate"
            value={snagForm.description}
            onChange={(e) => setSnagForm({ ...snagForm, description: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Space / Room"
              value={snagForm.room}
              onChange={(e) => setSnagForm({ ...snagForm, room: e.target.value })}
            >
              <option value="General">Entire Site / General</option>
              {(project.rooms || []).map((r) => (
                <option key={r._id} value={r.name}>{r.name}</option>
              ))}
            </Select>
            <Select
              label="Priority Level"
              value={snagForm.priority}
              onChange={(e) => setSnagForm({ ...snagForm, priority: e.target.value })}
              options={['Low', 'Medium', 'High']}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowSnagModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Plus}>
              Log Snag Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Log Site Survey Modal */}
      <Modal
        isOpen={showSiteVisitModal}
        onClose={() => setShowSiteVisitModal(false)}
        title="Record Site Survey & Laser Audit"
        subtitle="Capture structural conditions and site measurements."
      >
        <form onSubmit={handleAddSiteVisit} className="flex flex-col gap-4">
          <Input
            label="Laser Measurements & Dimensions Audit"
            value={siteVisitForm.measurements}
            onChange={(e) => setSiteVisitForm({ ...siteVisitForm, measurements: e.target.value })}
            required
          />

          <Input
            label="Existing Structural Shell Condition"
            value={siteVisitForm.existingCondition}
            onChange={(e) => setSiteVisitForm({ ...siteVisitForm, existingCondition: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Electrical Grid Condition"
              value={siteVisitForm.electricalCondition}
              onChange={(e) => setSiteVisitForm({ ...siteVisitForm, electricalCondition: e.target.value })}
            />
            <Input
              label="Plumbing & Wet Lines"
              value={siteVisitForm.plumbingCondition}
              onChange={(e) => setSiteVisitForm({ ...siteVisitForm, plumbingCondition: e.target.value })}
            />
          </div>

          <Textarea
            label="Surveyor Notes & Site Access Constraints"
            rows={2}
            value={siteVisitForm.notes}
            onChange={(e) => setSiteVisitForm({ ...siteVisitForm, notes: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowSiteVisitModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Camera}>
              Save Survey Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Procurement Modal */}
      <Modal
        isOpen={showProcurementModal}
        onClose={() => setShowProcurementModal(false)}
        title="Add Procurement Line Item"
        subtitle="Track material purchasing, supplier commitments, and site delivery."
      >
        <form onSubmit={handleAddProcurementItem} className="flex flex-col gap-4">
          <Input
            label="Item / Material Name"
            placeholder="e.g. Solid Brass Cabinet Handles or Quartz Slab"
            value={procurementForm.itemName}
            onChange={(e) => setProcurementForm({ ...procurementForm, itemName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={procurementForm.category}
              onChange={(e) => setProcurementForm({ ...procurementForm, category: e.target.value })}
              options={['Materials', 'Furniture', 'Lighting', 'Appliances', 'Fixtures', 'Hardware', 'Decor']}
            />
            <Input
              label="Supplier / Vendor"
              placeholder="e.g. Hafele, Kohler, Saint Gobain"
              value={procurementForm.supplier}
              onChange={(e) => setProcurementForm({ ...procurementForm, supplier: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Quantity Required"
              value={procurementForm.quantityRequired}
              onChange={(e) => setProcurementForm({ ...procurementForm, quantityRequired: e.target.value })}
              required
            />
            <Input
              label="Unit Cost ($)"
              type="number"
              placeholder="e.g. 450"
              value={procurementForm.unitCost}
              onChange={(e) => setProcurementForm({ ...procurementForm, unitCost: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowProcurementModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Plus}>
              Save Procurement Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Handover Modal */}
      <Modal
        isOpen={showHandoverModal}
        onClose={() => setShowHandoverModal(false)}
        title="Execute Project Final Handover"
        subtitle="Sign off completion certificate and lock project execution."
      >
        <form onSubmit={handleCompleteHandover} className="flex flex-col gap-4">
          <Textarea
            label="Architectural Final Inspection Report"
            rows={3}
            value={handoverForm.inspectionNotes}
            onChange={(e) => setHandoverForm({ ...handoverForm, inspectionNotes: e.target.value })}
            required
          />

          <Textarea
            label="Client Signoff & Acceptance Statement"
            rows={3}
            value={handoverForm.clientSignoffNotes}
            onChange={(e) => setHandoverForm({ ...handoverForm, clientSignoffNotes: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => setShowHandoverModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={modalLoading} icon={Award}>
              Confirm Handover & Signoff
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contractor Execution Desk Modal */}
      <ContractorExecutionModal
        isOpen={!!selectedRoomForExecution}
        onClose={() => setSelectedRoomForExecution(null)}
        room={selectedRoomForExecution}
        onSaveExecution={handleSaveRoomExecution}
      />
    </div>
  );
};

export default ProjectWorkspace;

