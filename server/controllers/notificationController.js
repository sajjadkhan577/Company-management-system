const { Notification } = require('../models');

const getNotifications = async (req, res) => {
  try {
    const { limit } = req.query;
    const where = req.user ? { recipientId: req.user._id } : {};
    
    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: Number(limit) || 50,
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (notification) {
      notification.isRead = true;
      await notification.save();
    }
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    const where = { isRead: false };
    if (req.user) where.recipientId = req.user._id;

    await Notification.update(
      { isRead: true },
      { where }
    );

    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllRead };
