import { EventEmitter } from 'events';

// Criação da classe estendida para clareza
class SystemEventBus extends EventEmitter {}

// Singleton — a mesma instância exportada para toda a aplicação
const EventBus = new SystemEventBus();

// Aumentar o limite para evitar memory leak warnings em produção,
// já que teremos vários listeners escutando os eventos do sistema
EventBus.setMaxListeners(20);

export default EventBus;