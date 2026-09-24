import Expense from '../models/Expense.js';
import Project from '../models/Project.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get expenses and budget breakdown for a project
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res, next) => {
  try {
    const { projectId, category } = req.query;
    if (!projectId) {
      return sendError(res, 400, 'Project ID is required.');
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const query = { project: projectId };
    if (category && category !== 'ALL') query.category = category;

    const expenses = await Expense.find(query)
      .populate('addedBy', 'name email role')
      .sort({ date: -1 });

    // Calculate aggregated category breakdown
    const allProjectExpenses = await Expense.find({ project: projectId });
    const totalSpent = allProjectExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    const categoryBreakdown = {};
    allProjectExpenses.forEach((exp) => {
      categoryBreakdown[exp.category] =
        (categoryBreakdown[exp.category] || 0) + exp.amount;
    });

    const budgetSummary = {
      totalBudget: project.totalBudget,
      spentAmount: totalSpent,
      remainingBudget: Math.max(0, project.totalBudget - totalSpent),
      percentageUsed: project.totalBudget > 0
        ? Math.min(100, Math.round((totalSpent / project.totalBudget) * 100))
        : 0,
      isOverBudget: totalSpent > project.totalBudget,
      categoryBreakdown,
    };

    return sendSuccess(res, 200, 'Expenses retrieved successfully', {
      expenses,
      budgetSummary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new expense and update project spent amount
// @route   POST /api/expenses
// @access  Private
export const addExpense = async (req, res, next) => {
  try {
    const { projectId, category, description, amount, date, receipt } = req.body;

    if (!projectId || !category || !description || !amount) {
      return sendError(res, 400, 'Project ID, category, description and amount are required.');
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const expense = await Expense.create({
      project: projectId,
      category,
      description,
      amount: Number(amount),
      date: date || Date.now(),
      addedBy: req.user._id,
      receipt: receipt || '',
    });

    // Update project spentAmount
    const totalExpenses = await Expense.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: '$project', total: { $sum: '$amount' } } },
    ]);

    const newSpent = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    project.spentAmount = newSpent;
    await project.save();

    await logActivity({
      user: req.user,
      action: 'EXPENSE_ADDED',
      entityType: 'EXPENSE',
      entityId: expense._id,
      description: `Expense of $${amount} added for "${description}" (${category})`,
    });

    const populatedExpense = await Expense.findById(expense._id).populate(
      'addedBy',
      'name email role'
    );

    return sendSuccess(res, 201, 'Expense recorded successfully', populatedExpense);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return sendError(res, 404, 'Expense not found');
    }

    const projectId = expense.project;
    await Expense.findByIdAndDelete(req.params.id);

    // Recalculate project spent amount
    const totalExpenses = await Expense.aggregate([
      { $match: { project: projectId } },
      { $group: { _id: '$project', total: { $sum: '$amount' } } },
    ]);

    const newSpent = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    await Project.findByIdAndUpdate(projectId, { spentAmount: newSpent });

    await logActivity({
      user: req.user,
      action: 'EXPENSE_DELETED',
      entityType: 'EXPENSE',
      entityId: req.params.id,
      description: `Expense deleted by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Expense deleted successfully');
  } catch (error) {
    next(error);
  }
};
