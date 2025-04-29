const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // pegando o id do usuário logado
    const {
      cpf,
      address,
      birthDate,
      interests,
      eventsAttended,
      purchases
    } = req.body;

    const updateFields = {
      cpf,
      address,
      birthDate,
      interests,
      eventsAttended,
      purchases
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({ message: 'Perfil atualizado com sucesso', user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error });
  }
};
