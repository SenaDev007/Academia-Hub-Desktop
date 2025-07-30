import React from 'react';
import { 
  BookOpen, 
  Users, 
  FileText, 
  BarChart3, 
  Award, 
  ClipboardList,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const stats = [
    { label: 'Total Élèves', value: '1,247', icon: Users, color: 'text-blue-600' },
    { label: 'Notes Saisies', value: '8,432', icon: BookOpen, color: 'text-green-600' },
    { label: 'Bulletins Générés', value: '312', icon: FileText, color: 'text-purple-600' },
    { label: 'Moyenne Générale', value: '12.5/20', icon: BarChart3, color: 'text-orange-600' }
  ];

  const quickActions = [
    { label: 'Saisie des Notes', icon: BookOpen, action: () => onViewChange('saisie'), color: 'bg-blue-500' },
    { label: 'Générer Bulletins', icon: FileText, action: () => onViewChange('bulletins'), color: 'bg-green-500' },
    { label: 'Bordereaux', icon: ClipboardList, action: () => onViewChange('bordereau'), color: 'bg-purple-500' },
    { label: 'Statistiques', icon: BarChart3, action: () => onViewChange('statistiques'), color: 'bg-orange-500' },
    { label: 'Conseils de Classe', icon: Users, action: () => onViewChange('conseils'), color: 'bg-red-500' },
    { label: 'Tableaux d\'Honneur', icon: Award, action: () => onViewChange('tableaux'), color: 'bg-yellow-500' }
  ];

  const recentActivities = [
    { action: 'Notes saisies pour CM2-A - Mathématiques', time: 'Il y a 5 minutes', icon: CheckCircle, color: 'text-green-500' },
    { action: 'Bulletins générés pour 6ème', time: 'Il y a 1 heure', icon: FileText, color: 'text-blue-500' },
    { action: 'Conseil de classe programmé - 5ème A', time: 'Il y a 2 heures', icon: Calendar, color: 'text-purple-500' },
    { action: 'Mise à jour des statistiques trimestrielles', time: 'Il y a 3 heures', icon: TrendingUp, color: 'text-orange-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de bord Examens
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les notes, bulletins et évaluations de votre établissement
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white rounded-lg p-4 hover:opacity-90 transition-opacity flex items-center space-x-3`}
            >
              <action.icon className="h-5 w-5" />
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Activités Récentes
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
