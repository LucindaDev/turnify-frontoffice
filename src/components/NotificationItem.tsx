import React from 'react';
import { es } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import {
  Calendar,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone
} from 'lucide-react';

interface NotificationItemProps {
    onClick: (notification: any) => void;
    notification: any
}

const NotificationItem: React.FC<NotificationItemProps> = ({onClick, notification}) => {

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'reservation':
                return <Calendar className="h-4 w-4 text-blue-600" />;
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
            case 'error':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'call-to-action':
                return <Phone className="h-4 w-4 text-orange-600" />;
            default:
                return <Info className="h-4 w-4 text-blue-600" />;
        }
    };

    return (
        <div
            key={notification.id}
            className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50' : ''
                } ${notification.type === 'call-to-action' ? 'border-l-4 border-orange-500' : ''}`}
            onClick={() => onClick(notification)}
        >
            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                            {notification.title}
                        </h4>
                        {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: es
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NotificationItem;