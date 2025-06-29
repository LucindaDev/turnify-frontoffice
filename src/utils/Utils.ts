import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export const formatDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    return format(localDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
}