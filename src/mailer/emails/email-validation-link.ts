export function generateValidationEmail(
  name: string | null,
  code: string,
  validationUrl: string,
) {
  const emailBody = {
    body: {
      name: name || 'Usuário',
      intro: 'Bem-vindo à Finko! Estamos muito felizes em ter você conosco.',
      action: {
        instructions:
          'Para validar sua conta e começar a usar nossos serviços, por favor clique no botão abaixo:',
        button: {
          color: '#4F46E5',
          text: 'Validar minha conta',
          link: validationUrl,
        },
      },
      dictionary: {
        'Seu código de verificação': code,
      },
      outro: [
        'Se você não solicitou esta conta, pode ignorar este email com segurança.',
        'Este link é válido por 30 minutos.',
      ],
      signature: 'Atenciosamente',
    },
  };

  return emailBody;
}
