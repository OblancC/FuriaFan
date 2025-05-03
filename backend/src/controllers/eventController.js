const UserEvent = require('../models/UserEvent');

const eventController = {
  // Criar novo evento
  createEvent: async (req, res) => {
    try {
      const { eventName, eventDate, eventType, description } = req.body;
      const userId = req.user._id;

      const newEvent = new UserEvent({
        userId,
        eventName,
        eventDate,
        eventType,
        description
      });

      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar evento', error: error.message });
    }
  },

  // Listar eventos do usuário
  getUserEvents: async (req, res) => {
    try {
      const userId = req.user._id;
      const events = await UserEvent.find({ userId }).sort({ eventDate: -1 });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar eventos', error: error.message });
    }
  },

  // Deletar evento
  deleteEvent: async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user._id;

      const event = await UserEvent.findOneAndDelete({ _id: eventId, userId });
      if (!event) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }

      res.json({ message: 'Evento deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar evento', error: error.message });
    }
  }
};

module.exports = eventController; 