export const usersConflictsErrors = {
  status: 409,
  description: 'Conflitos possíveis ao criar usuário.',
  content: {
    'application/json': {
      examples: {
        EmailNotValidated: {
          summary: 'Email não validado',
          value: {
            statusCode: 409,
            message:
              'Email already registered. Please check your email to validate your account.',
            error: 'Conflict',
          },
        },
        EmailAlreadyActive: {
          summary: 'Email já ativo',
          value: {
            statusCode: 409,
            message:
              'Email already registered. Please login or use password recovery if needed.',
            error: 'Conflict',
          },
        },
      },
    },
  },
};
