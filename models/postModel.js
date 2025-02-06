const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  category: {
    type: String,

  },
  subCategory: {
    type: String,

  },
 
title: {
  type: String,

},

  description: {
    type: String,

  },
  price: {
    type: String,

  },
  unidaddeprecio: {
    type: String,

  },
  oferta: {
    type: String,

  },
  change: {
    type: String,

  },
  wilaya: {
    type: String,

  },
  commune: {
    type: String,

  },

  quartier: {
    type: String,

  },
  email: {
    type: String,

  },
  telefono: {
    type: String,

  },
  contadordevisitas: {
    type: String,

  },
  informacion: {
    type: String,

  },
  comentarios: {
    type: String,

  },

  attributes: {
    type: Object, // Cambiar Map por Object
    default: {}   // Establecer un valor predeterminado
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente',
  },

  images: {
    type: Array,
    required: true
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  user: { type: mongoose.Types.ObjectId, ref: 'user' }
}, {
  timestamps: true
})

module.exports = mongoose.model('post', postSchema)