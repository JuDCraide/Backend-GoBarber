# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando seu email;
- O usuário deve receber um email com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Mailtrap para testaR envios em ambiente de dev;
- Utilizar Amazon SES para envios em produção;
- O envio de email deve acontecer em segundo plano (background job);


**RN**

- O link enviado por email para resetar a senha deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetá-la

# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, email e senha

**RN**

- O usuário não pode alterar seu email para um email já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

# Painel do prestador

**RF**

- O prestador deve poder listar seus agendamento de um dia específico;
- O prestador deve receber uma notificação sempre que houver um agendamento;
- O prestador deve poder visualizar as notificações não lidas;


**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.IO

**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores;
- O usuário deve poder listar os dias de um mês com pelo menos 1 horário  disponível de um prestador específico;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1 hora exatamente;
- Os agendamentos devem estar disponíveis entre 8h e 18h (Primeiro às 8h e último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;
