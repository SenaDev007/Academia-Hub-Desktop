import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle, Signal, Zap } from 'lucide-react';
import { useOffline } from './OfflineProvider';

const OfflineIndicator: React.FC = () => {
  const { 
    isOnline, 
    isSyncing, 
    syncProgress, 
    pendingChanges, 
    lastSyncTime,
    conflicts,
    forceSync,
    toggleOfflineMode 
  } = useOffline();

  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusConfig = () => {
    if (conflicts.length > 0) {
      return {
        color: 'from-red-500 to-red-600',
        bgColor: 'from-red-50 to-rose-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        icon: AlertTriangle,
        text: `${conflicts.length} conflit${conflicts.length > 1 ? 's' : ''}`,
        pulse: true
      };
    }
    
    if (!isOnline) {
      return {
        color: 'from-orange-500 to-orange-600',
        bgColor: 'from-orange-50 to-amber-50',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200',
        icon: WifiOff,
        text: 'Mode offline',
        pulse: false
      };
    }
    
    if (isSyncing) {
      return {
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-indigo-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        icon: RefreshCw,
        text: 'Synchronisation...',
        pulse: false
      };
    }
    
    if (pendingChanges > 0) {
      return {
        color: 'from-amber-500 to-amber-600',
        bgColor: 'from-amber-50 to-yellow-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        icon: Signal,
        text: `${pendingChanges} en attente`,
        pulse: true
      };
    }
    
    return {
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-teal-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      icon: CheckCircle,
      text: 'Synchronisé',
      pulse: false
    };
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Jamais synchronisé';
    
    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Synchronisé à l\'instant';
    if (minutes < 60) return `Synchronisé il y a ${minutes}min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Synchronisé il y a ${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `Synchronisé il y a ${days}j`;
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <div className="relative">
      {/* Indicateur principal moderne */}
      <div 
        className={`flex items-center space-x-3 px-4 py-3 bg-gradient-to-r ${status.bgColor} border ${status.borderColor} rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer micro-lift`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={`relative ${status.pulse ? 'animate-pulse' : ''}`}>
          <StatusIcon className={`w-5 h-5 ${status.textColor} ${isSyncing ? 'animate-spin' : ''}`} />
          {status.pulse && (
            <div className={`absolute inset-0 w-5 h-5 bg-gradient-to-r ${status.color} rounded-full animate-ping opacity-20`}></div>
          )}
        </div>
        
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${status.textColor}`}>
            {status.text}
          </span>
          {isSyncing && (
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
              <span className="text-xs text-blue-600 font-medium">
                {Math.round(syncProgress)}%
              </span>
            </div>
          )}
        </div>

        {/* Indicateur de qualité réseau */}
        <div className="flex flex-col items-center space-y-1">
          <div className="flex space-x-1">
            {[1, 2, 3].map((bar) => (
              <div
                key={bar}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isOnline 
                    ? `h-${bar + 1} bg-gradient-to-t from-emerald-400 to-emerald-500` 
                    : `h-${bar + 1} bg-slate-300`
                }`}
              />
            ))}
          </div>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'status-online' : 'bg-slate-300'}`}></div>
        </div>
      </div>

      {/* Tooltip détaillé moderne */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-3 w-80 glass-effect rounded-2xl shadow-2xl border border-white/20 p-6 z-50 slide-in-right">
          <div className="space-y-4">
            {/* En-tête */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">État de synchronisation</h3>
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'status-online' : 'bg-orange-500'}`}></div>
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <div className="text-xl font-bold text-slate-900">{pendingChanges}</div>
                <div className="text-xs text-slate-600">En attente</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <div className="text-xl font-bold text-slate-900">{conflicts.length}</div>
                <div className="text-xs text-slate-600">Conflits</div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Statut réseau:</span>
                <div className="flex items-center space-x-2">
                  {isOnline ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">En ligne</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600 font-medium">Hors ligne</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Dernière sync:</span>
                <span className="text-slate-900 font-medium">{formatLastSync()}</span>
              </div>

              {isSyncing && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Progression:</span>
                  <span className="text-blue-600 font-medium">{Math.round(syncProgress)}%</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              {isOnline && pendingChanges > 0 && (
                <button
                  onClick={forceSync}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 micro-bounce"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser maintenant'}</span>
                </button>
              )}

              <button
                onClick={toggleOfflineMode}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-xl font-medium hover:from-slate-200 hover:to-slate-300 transition-all duration-200 micro-bounce"
              >
                {isOnline ? (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>Forcer mode offline</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>Reconnecter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;