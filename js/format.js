const STATUS_RU = { pending:'Ожидает подтверждения', approved:'Подтверждена', rejected:'Отклонена' };

function stampClass(fmt){ return fmt==='Групповая' ? 'group' : fmt==='Индивидуальная' ? 'solo' : 'self'; }