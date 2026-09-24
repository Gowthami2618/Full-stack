import User from '../models/User.js';
import Project from '../models/Project.js';
import Proposal from '../models/Proposal.js';
import Task from '../models/Task.js';
import Expense from '../models/Expense.js';
import Milestone from '../models/Milestone.js';
import { sendSuccess } from '../utils/apiResponse.js';

// @desc    Get Admin dashboard analytics
// @route   GET /api/analytics/admin
// @access  Private (ADMIN)
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const clientsCount = await User.countDocuments({ role: 'CLIENT' });
    const designersCount = await User.countDocuments({ role: 'DESIGNER' });
    const contractorsCount = await User.countDocuments({ role: 'CONTRACTOR' });
    const pendingVerifications = await User.countDocuments({
      role: { $in: ['DESIGNER', 'CONTRACTOR'] },
      isVerified: false,
    });

    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({
      status: { $in: ['DESIGNING', 'PROPOSAL_SENT', 'APPROVED', 'IN_PROGRESS'] },
    });
    const completedProjects = await Project.countDocuments({ status: 'COMPLETED' });
    const requestedProjects = await Project.countDocuments({ status: 'REQUESTED' });

    // Users by Role distribution
    const usersByRole = [
      { name: 'Clients', value: clientsCount, color: '#D8B244' },
      { name: 'Designers', value: designersCount, color: '#D98272' },
      { name: 'Contractors', value: contractorsCount, color: '#757C8E' },
    ];

    // Projects by Status
    const projectsByStatusData = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const projectsByStatus = projectsByStatusData.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    // Category Expense distribution
    const expenseDistribution = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    // Financial totals
    const budgetAgg = await Project.aggregate([
      { $group: { _id: null, totalBudget: { $sum: '$totalBudget' }, totalSpent: { $sum: '$spentAmount' } } },
    ]);

    const totalBudget = budgetAgg.length > 0 ? budgetAgg[0].totalBudget : 0;
    const totalSpent = budgetAgg.length > 0 ? budgetAgg[0].totalSpent : 0;

    return sendSuccess(res, 200, 'Admin analytics retrieved', {
      summary: {
        totalUsers,
        clientsCount,
        designersCount,
        contractorsCount,
        pendingVerifications,
        totalProjects,
        activeProjects,
        completedProjects,
        requestedProjects,
        totalBudget,
        totalSpent,
      },
      charts: {
        usersByRole,
        projectsByStatus,
        expenseDistribution: expenseDistribution.map((e) => ({
          category: e._id,
          total: e.total,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Client dashboard analytics
// @route   GET /api/analytics/client
// @access  Private (CLIENT)
export const getClientAnalytics = async (req, res, next) => {
  try {
    const clientId = req.user._id;

    const totalProjects = await Project.countDocuments({ client: clientId });
    const activeProjects = await Project.countDocuments({
      client: clientId,
      status: { $in: ['DESIGNING', 'PROPOSAL_SENT', 'APPROVED', 'IN_PROGRESS'] },
    });
    const completedProjects = await Project.countDocuments({
      client: clientId,
      status: 'COMPLETED',
    });

    const userProjects = await Project.find({ client: clientId }).select('_id totalBudget spentAmount');
    const projectIds = userProjects.map((p) => p._id);

    const pendingProposals = await Proposal.countDocuments({
      project: { $in: projectIds },
      status: 'SENT',
    });

    const totalBudget = userProjects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
    const totalSpent = userProjects.reduce((sum, p) => sum + (p.spentAmount || 0), 0);

    const upcomingMilestones = await Milestone.find({
      project: { $in: projectIds },
      status: { $in: ['UPCOMING', 'IN_PROGRESS'] },
    })
      .populate('project', 'title')
      .sort({ dueDate: 1 })
      .limit(5);

    return sendSuccess(res, 200, 'Client analytics retrieved', {
      totalProjects,
      activeProjects,
      completedProjects,
      pendingProposals,
      totalBudget,
      totalSpent,
      upcomingMilestones,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Designer dashboard analytics
// @route   GET /api/analytics/designer
// @access  Private (DESIGNER)
export const getDesignerAnalytics = async (req, res, next) => {
  try {
    const designerId = req.user._id;

    const assignedProjects = await Project.countDocuments({ designer: designerId });
    const activeProjects = await Project.countDocuments({
      designer: designerId,
      status: { $in: ['DESIGNING', 'PROPOSAL_SENT', 'APPROVED', 'IN_PROGRESS'] },
    });
    const completedProjects = await Project.countDocuments({
      designer: designerId,
      status: 'COMPLETED',
    });

    const pendingProposals = await Proposal.countDocuments({
      designer: designerId,
      status: { $in: ['DRAFT', 'SENT', 'REVISION_REQUESTED'] },
    });
    const approvedProposals = await Proposal.countDocuments({
      designer: designerId,
      status: 'APPROVED',
    });

    const proposals = await Proposal.find({ designer: designerId, status: 'APPROVED' });
    const totalEstimatedValue = proposals.reduce((acc, curr) => acc + curr.estimatedCost, 0);

    const pendingTasks = await Task.find({
      assignedTo: designerId,
      status: { $in: ['TODO', 'IN_PROGRESS'] },
    })
      .populate('project', 'title')
      .sort({ dueDate: 1 })
      .limit(5);

    return sendSuccess(res, 200, 'Designer analytics retrieved', {
      assignedProjects,
      activeProjects,
      completedProjects,
      pendingProposals,
      approvedProposals,
      totalEstimatedValue,
      pendingTasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Contractor dashboard analytics
// @route   GET /api/analytics/contractor
// @access  Private (CONTRACTOR)
export const getContractorAnalytics = async (req, res, next) => {
  try {
    const contractorId = req.user._id;

    const assignedProjects = await Project.countDocuments({ contractor: contractorId });
    const inProgressProjects = await Project.countDocuments({
      contractor: contractorId,
      status: 'IN_PROGRESS',
    });
    const completedProjects = await Project.countDocuments({
      contractor: contractorId,
      status: 'COMPLETED',
    });

    const totalTasks = await Task.countDocuments({ assignedTo: contractorId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: contractorId,
      status: { $in: ['TODO', 'IN_PROGRESS', 'BLOCKED'] },
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: contractorId,
      status: 'COMPLETED',
    });

    const upcomingTasks = await Task.find({
      assignedTo: contractorId,
      status: { $in: ['TODO', 'IN_PROGRESS'] },
    })
      .populate('project', 'title')
      .sort({ dueDate: 1 })
      .limit(6);

    return sendSuccess(res, 200, 'Contractor analytics retrieved', {
      assignedProjects,
      inProgressProjects,
      completedProjects,
      totalTasks,
      pendingTasks,
      completedTasks,
      upcomingTasks,
    });
  } catch (error) {
    next(error);
  }
};
