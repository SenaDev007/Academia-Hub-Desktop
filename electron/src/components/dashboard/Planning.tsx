import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  BookOpen,
  Settings,
  Eye,
  Edit,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  MapPin,
  User,
  Building,
  FileText
} from 'lucide-react';
import { 
  ClassModal, 
  RoomModal, 
  SubjectModal, 
  BreakModal, 
  RoomReservationModal, 
  TeacherAssignmentModal, 
  ScheduleEntryModal, 
  TeacherAvailabilityModal, 
  WorkHoursModal
} from '../modals';
import CahierJournalDashboard from '../../modules/planning/components/CahierJournal/CahierJournalDashboard';
import FichesPedagogiquesDashboard from '../../modules/planning/components/FichesPedagogiques/FichesPedagogiquesDashboard';
import CahierTexteApp from '../../modules/planning/components/CahierTextes/CahierTexteApp';
import EmploiDuTempsModern from './EmploiDuTempsModern';

const Planning: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedClass, setSelectedClass] = useState('all');
  
  // Modal states
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isRoomReservationModalOpen, setIsRoomReservationModalOpen] = useState(false);
  const [isTeacherAssignmentModalOpen, setIsTeacherAssignmentModalOpen] = useState(false);
  const [isScheduleEntryModalOpen, setIsScheduleEntryModalOpen] = useState(false);
  const [isTeacherAvailabilityModalOpen, setIsTeacherAvailabilityModalOpen] = useState(false);
  const [isWorkHoursModalOpen, setIsWorkHoursModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Add missing state variables
  const [breaks, setBreaks] = useState([
    {
      name: 'Récréation matin',
      type: 'recreation',
      startTime: '10:00',
      endTime: '10:15',
      duration: 15,
      levels: ['Maternelle', 'Primaire']
    },
    {
      name: 'Pause déjeuner',
      type: 'break',
      startTime: '12:00',
      endTime: '13:00',
      duration: 60,
      levels: ['Tous niveaux']
    },
    {
      name: 'Récréation après-midi',
      type: 'recreation',
      startTime: '15:00',
      endTime: '15:15',
      duration: 15,
      levels: ['Maternelle', 'Primaire']
    }
  ]);

  const [workHours, setWorkHours] = useState({
    startTime: '08:00',
    endTime: '17:00',
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    courseDuration: 60,
    breakBetweenCourses: 5,
    workDays: [1, 2, 3, 4, 5, 6]
  });

  const planningStats = [
    {
      title: 'Classes actives',
      value: '24',
      change: '+2',
      icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Enseignants',
      value: '45',
      change: '+3',
      icon: User,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Salles disponibles',
      value: '18',
      change: '+1',
      icon: Building,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Taux d\'occupation',
      value: '87%',
      change: '+5%',
      icon: BarChart3,
      color: 'from-orange-600 to-orange-700'
    }
  ];

  const classes = [
    { id: 'CLS-001', name: '6ème A', level: 'Collège', students: 28, mainTeacher: 'M. Dubois', room: 'Salle 101' },
    { id: 'CLS-002', name: '5ème B', level: 'Collège', students: 25, mainTeacher: 'Mme Martin', room: 'Salle 102' },
    { id: 'CLS-003', name: '4ème A', level: 'Collège', students: 30, mainTeacher: 'M. Laurent', room: 'Salle 103' },
    { id: 'CLS-004', name: '3ème A', level: 'Collège', students: 27, mainTeacher: 'Mme Dubois', room: 'Salle 104' },
    { id: 'CLS-005', name: '2nde B', level: 'Lycée', students: 32, mainTeacher: 'M. Martin', room: 'Salle 201' },
    { id: 'CLS-006', name: '1ère C', level: 'Lycée', students: 29, mainTeacher: 'Mme Laurent', room: 'Salle 202' },
    { id: 'CLS-007', name: 'Terminale S', level: 'Lycée', students: 26, mainTeacher: 'M. Dubois', room: 'Salle 203' }
  ];

  const rooms = [
    { id: 'ROOM-001', name: 'Salle 101', type: 'Salle de classe', capacity: 30, equipment: ['Tableau', 'Projecteur'], status: 'available' },
    { id: 'ROOM-002', name: 'Salle 102', type: 'Salle de classe', capacity: 30, equipment: ['Tableau', 'Ordinateur'], status: 'occupied' },
    { id: 'LAB-001', name: 'Laboratoire SVT', type: 'Laboratoire', capacity: 24, equipment: ['Microscopes', 'Paillasses'], status: 'available' },
    { id: 'LAB-002', name: 'Laboratoire Physique', type: 'Laboratoire', capacity: 24, equipment: ['Matériel expérimental'], status: 'maintenance' },
    { id: 'ROOM-003', name: 'Salle informatique', type: 'Salle spécialisée', capacity: 20, equipment: ['Ordinateurs', 'Projecteur'], status: 'available' }
  ];

  const subjects = [
    { id: 'SUB-001', name: 'Mathématiques', code: 'MATH', level: 'Secondaire', coefficient: 7 },
    { id: 'SUB-002', name: 'Français', code: 'FR', level: 'Secondaire', coefficient: 3 },
    { id: 'SUB-003', name: 'Histoire-Géographie', code: 'HIST-GEO', level: 'Secondaire', coefficient: 2 },
    { id: 'SUB-004', name: 'Sciences Physiques', code: 'PHYS', level: 'Secondaire', coefficient: 6 },
    { id: 'SUB-005', name: 'SVT', code: 'SVT', level: 'Secondaire', coefficient: 3 }
  ];

  const teachers = [
    { id: 'TCH-001', name: 'M. Dubois', subject: 'Mathématiques', classes: ['6ème A', 'Terminale S'], hoursPerWeek: 18 },
    { id: 'TCH-002', name: 'Mme Martin', subject: 'Français', classes: ['5ème B', '2nde B'], hoursPerWeek: 15 },
    { id: 'TCH-003', name: 'M. Laurent', subject: 'Histoire-Géographie', classes: ['4ème A', '1ère C'], hoursPerWeek: 12 }
  ];

  const schedule = [
    { id: 1, day: 'Lundi', time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. Dubois', class: '6ème A', room: 'Salle 101', duration: '1h' },
    { id: 2, day: 'Lundi', time: '09:00-10:00', subject: 'Français', teacher: 'Mme Martin', class: '5ème B', room: 'Salle 102', duration: '1h' },
    { id: 3, day: 'Lundi', time: '10:15-11:15', subject: 'Histoire-Géo', teacher: 'M. Laurent', class: '4ème A', room: 'Salle 103', duration: '1h' },
    { id: 4, day: 'Mardi', time: '08:00-09:00', subject: 'Sciences Physiques', teacher: 'M. Dubois', class: 'Terminale S', room: 'Lab Physique', duration: '1h' },
    { id: 5, day: 'Mardi', time: '09:00-09:30', subject: 'SVT', teacher: 'Mme Martin', class: '1ère C', room: 'Lab SVT', duration: '30min' },
    { id: 6, day: 'Mardi', time: '10:15-12:15', subject: 'Mathématiques', teacher: 'M. Dubois', class: 'Terminale S', room: 'Salle 101', duration: '2h' },
    { id: 7, day: 'Mercredi', time: '08:00-08:45', subject: 'Français', teacher: 'Mme Martin', class: '6ème A', room: 'Salle 102', duration: '45min' },
    { id: 8, day: 'Mercredi', time: '09:00-10:30', subject: 'Anglais', teacher: 'M. Smith', class: '5ème B', room: 'Salle 103', duration: '1h30min' },
    { id: 9, day: 'Jeudi', time: '14:00-14:15', subject: 'EPS', teacher: 'M. Durand', class: '6ème A', room: 'Gymnase', duration: '15min' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'occupied': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'reserved': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Modal handlers
  const handleNewClass = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsClassModalOpen(true);
  };

  const handleNewRoom = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsRoomModalOpen(true);
  };

  const handleNewSubject = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsSubjectModalOpen(true);
  };

  const handleConfigureBreaks = () => {
    setIsBreakModalOpen(true);
  };

  const handleConfigureWorkHours = () => {
    setIsWorkHoursModalOpen(true);
  };

  const handleNewScheduleEntry = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsScheduleEntryModalOpen(true);
  };

  const handleNewReservation = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsRoomReservationModalOpen(true);
  };

  const handleNewAssignment = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsTeacherAssignmentModalOpen(true);
  };

  const handleTeacherAvailability = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setIsTeacherAvailabilityModalOpen(true);
  };

  const handleSaveClass = (classData: any) => {
    console.log('Saving class:', classData);
  };

  const handleSaveRoom = (roomData: any) => {
    console.log('Saving room:', roomData);
  };

  const handleSaveSubject = (subjectData: any) => {
    console.log('Saving subject:', subjectData);
  };

  const handleSaveBreaks = (breaksData: any) => {
    setBreaks(breaksData);
    console.log('Saving breaks:', breaksData);
  };

  const handleSaveWorkHours = (workHoursData: any) => {
    setWorkHours(workHoursData);
    console.log('Saving work hours:', workHoursData);
  };

  const handleSaveReservation = (reservationData: any) => {
    console.log('Saving reservation:', reservationData);
  };

  const handleSaveAssignment = (assignmentData: any) => {
    console.log('Saving assignment:', assignmentData);
  };

  const handleSaveScheduleEntry = (scheduleData: any) => {
    console.log('Saving schedule entry:', scheduleData);
  };

  const handleSaveAvailability = (availabilityData: any) => {
    console.log('Saving availability:', availabilityData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Études & Planification</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion intelligente des emplois du temps et ressources</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={handleConfigureWorkHours}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </button>
          <button 
            onClick={handleNewScheduleEntry}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau cours
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planningStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'rooms', label: 'Salles', icon: Building },
              { id: 'classes', label: 'Classes', icon: Users },
              { id: 'reservations', label: 'Réservations', icon: MapPin },
              { id: 'subjects', label: 'Matières', icon: BookOpen },
              { id: 'teachers', label: 'Enseignants', icon: User },
              { id: 'availability', label: 'Disponibilités', icon: Clock },
              { id: 'work-hours', label: 'Heures de cours', icon: BarChart3 },
              { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
              { id: 'journal', label: 'Cahier Journal', icon: BookOpen },
              { id: 'fiches-pedagogiques', label: 'Fiches Pédagogiques', icon: FileText },
              { id: 'cahier-textes', label: 'Cahier de Textes', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'schedule' && (
            <EmploiDuTempsModern
              schedules={schedule}
              classes={classes}
              teachers={teachers}
              subjects={subjects}
              rooms={rooms}
            />
          )}

          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des classes</h3>
                <button 
                  onClick={handleNewClass}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle classe
                </button>
              </div>

              <div className="grid gap-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{cls.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cls.level} • {cls.students} élèves</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Prof principal: {cls.mainTeacher}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Salle: {cls.room}</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50">
                            Emploi du temps
                          </button>
                          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des salles</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleNewReservation}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Réserver
                  </button>
                  <button 
                    onClick={handleNewRoom}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle salle
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{room.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{room.type} • {room.capacity} places</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Équipements: {room.equipment.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                          {room.status === 'available' ? 'Disponible' : 
                           room.status === 'occupied' ? 'Occupée' : 
                           room.status === 'maintenance' ? 'Maintenance' : 'Réservée'}
                        </span>
                        <div className="flex space-x-2 mt-2">
                          <button className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50">
                            Planning
                          </button>
                          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des matières</h3>
                <button 
                  onClick={handleNewSubject}
                  className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle matière
                </button>
              </div>

              <div className="grid gap-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{subject.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Code: {subject.code} • Niveau: {subject.level}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Coefficient: {subject.coefficient}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50">
                          Enseignants
                        </button>
                        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                          Modifier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Affectations des enseignants</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleTeacherAvailability}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Disponibilités
                  </button>
                  <button 
                    onClick={handleNewAssignment}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle affectation
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{teacher.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.subject}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Classes: {teacher.classes.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Charge: {teacher.hoursPerWeek}h/semaine</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50">
                            Planning
                          </button>
                          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Réservations de salles</h3>
                <button 
                  onClick={handleNewReservation}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle réservation
                </button>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/30">
                <h4 className="text-lg font-medium text-indigo-900 dark:text-indigo-300 mb-4">Réservations du jour</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Salle informatique</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">14:00 - 16:00 • M. Dubois • 1ère S</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                      Confirmée
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Laboratoire SVT</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">10:00 - 12:00 • Mme Martin • 2nde A</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs">
                      En attente
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des disponibilités</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleTeacherAvailability}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Nouvelle disponibilité
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Disponibilités des enseignants</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enseignant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matière</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lundi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mardi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mercredi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jeudi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendredi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {teachers.map((teacher) => (
                            <tr key={teacher.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{teacher.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{teacher.subject}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">08:00-12:00</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">14:00-18:00</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">08:00-16:00</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">Indisponible</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">08:00-12:00</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-medium mb-2">Statistiques</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Enseignants actifs</span>
                        <span className="font-bold">{teachers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heures disponibles</span>
                        <span className="font-bold">156h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taux d'occupation</span>
                        <span className="font-bold">78%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Légende</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-400">Disponible</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-400">Indisponible</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-400">Partiel</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'work-hours' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des heures de cours</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleConfigureWorkHours}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-800"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurer horaires
                  </button>
                  <button 
                    onClick={handleNewScheduleEntry}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle séance
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Répartition des heures par classe</h4>
                    <div className="space-y-4">
                      {classes.map((cls) => (
                        <div key={cls.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100">{cls.name}</h5>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{cls.students} élèves</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Heures planifiées</span>
                              <span className="font-medium">{Math.floor(Math.random() * 10 + 20)}h/semaine</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4"
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-medium mb-2">Résumé hebdomadaire</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total heures</span>
                        <span className="font-bold">890h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Classes actives</span>
                        <span className="font-bold">{classes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Moyenne/classe</span>
                        <span className="font-bold">32h</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Configuration actuelle</h5>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>Début journée: {workHours.startTime}</div>
                      <div>Fin journée: {workHours.endTime}</div>
                      <div>Pause déjeuner: {workHours.lunchBreakStart}-{workHours.lunchBreakEnd}</div>
                      <div>Durée cours: {workHours.courseDuration}min</div>
                      <div>Pause entre cours: {workHours.breakBetweenCourses}min</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}



          {activeTab === 'journal' && (
            <CahierJournalDashboard />
          )}

          {activeTab === 'fiches-pedagogiques' && (
            <FichesPedagogiquesDashboard />
          )}
          {activeTab === 'cahier-textes' && (
            <CahierTexteApp />
          )}
        </div>
      </div>

      {/* Modals */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
        classData={selectedItem}
        isEdit={isEditMode}
      />

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSave={handleSaveRoom}
        roomData={selectedItem}
        isEdit={isEditMode}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleSaveSubject}
        subjectData={selectedItem}
        isEdit={isEditMode}
      />

      <BreakModal
        isOpen={isBreakModalOpen}
        onClose={() => setIsBreakModalOpen(false)}
        onSave={handleSaveBreaks}
        currentBreaks={breaks}
      />

      <WorkHoursModal
        isOpen={isWorkHoursModalOpen}
        onClose={() => setIsWorkHoursModalOpen(false)}
        onSave={handleSaveWorkHours}
        currentWorkHours={workHours}
      />

      <RoomReservationModal
        isOpen={isRoomReservationModalOpen}
        onClose={() => setIsRoomReservationModalOpen(false)}
        onSave={handleSaveReservation}
        reservationData={selectedItem}
        isEdit={isEditMode}
        rooms={rooms}
        teachers={teachers}
        subjects={subjects}
        classes={classes}
      />

      <TeacherAssignmentModal
        isOpen={isTeacherAssignmentModalOpen}
        onClose={() => setIsTeacherAssignmentModalOpen(false)}
        onSave={handleSaveAssignment}
        assignmentData={selectedItem}
        isEdit={isEditMode}
        teachers={teachers}
        subjects={subjects}
        classes={classes}
      />

      <ScheduleEntryModal
        isOpen={isScheduleEntryModalOpen}
        onClose={() => setIsScheduleEntryModalOpen(false)}
        onSave={handleSaveScheduleEntry}
        scheduleData={selectedItem}
        isEdit={isEditMode}
        teachers={teachers}
        subjects={subjects}
        classes={classes}
        rooms={rooms}
      />

      <TeacherAvailabilityModal
        isOpen={isTeacherAvailabilityModalOpen}
        onClose={() => setIsTeacherAvailabilityModalOpen(false)}
        onSave={handleSaveAvailability}
        teacherId={selectedItem?.id}
        teacherName={selectedItem?.name}
      />


    </div>
  );
};

export default Planning;