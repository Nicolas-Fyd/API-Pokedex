const Joi = require('joi');

const nameFormat = /^[À-ÿA-Za-z -]+$/;
const emailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// 8 characters minimum : 1 digit, 1 special character, 1 uppercase letter and 1 lowercase letter minimum
const passwordFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const userSchema = Joi.object({
    pseudo: Joi.string().pattern(nameFormat).required().messages({
        'string.pattern.base': `Caractère(s) non autorisé(s) dans le champ 'Pseudo'.`,
        'string.empty': `Le champ 'Pseudo' ne peut pas être vide.`,
        'any.required': `Le champ 'Pseudo' est manquant.`
      }),
    email: Joi.string().pattern(emailFormat).required().messages({
        'string.pattern.base': `Caractère(s) non autorisé(s) dans le champ 'Email' ou format non valide.`,
        'string.empty': `Le champ 'Email' ne peut pas être vide.`,
        'any.required': `Le champ 'Email' est manquant.`
      }),
    password: Joi.string().pattern(passwordFormat).required().messages({
        'string.pattern.base': `Format du mot de passe incorrect : 8 caractères minimum comprenant au minimum 1 chiffre, 1 lettre miniscule, 1 lettre majuscule et 1 caractère spécial.'.`,
        'string.empty': `Le champ 'Mot de passe' ne peut pas être vide.`,
        'any.required': `Le champ 'Mot de passe' est manquant.`
      }),
    confirmpassword: Joi.string().required().valid(Joi.ref('password')).messages({'any.only': `Les deux mots de passe doivent être identiques.`})
});

module.exports = {
  userSchema,
};